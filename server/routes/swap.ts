import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Trade } from '../models/Trade.js';
import { logger } from '../../server.js';

const router = express.Router();

// Middleware to check DB connection
const checkDbConnection = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      error: 'Database connection is not active. Please check your MongoDB Atlas IP whitelist or MONGODB_URI environment variable.' 
    });
  }
  next();
};

// Middleware to authenticate
const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get custom quote
router.get('/quote', async (req, res) => {
  try {
    const { from, to, amount } = req.query;
    if (!from || !to || !amount) return res.status(400).json({ error: 'Missing parameters' });

    // Base rates
    let fromPriceUsd = 1;
    let toPriceUsd = 1;

    // Fetch crypto prices from DexScreener
    const getCryptoPrice = async (symbol: string) => {
      if (symbol === 'USDC' || symbol === 'USDT') return 1;
      const response = await axios.get(`https://api.dexscreener.com/latest/dex/search?q=${symbol}`);
      const pair = response.data.pairs?.find((p: any) => 
        p.baseToken.symbol.toUpperCase() === symbol.toUpperCase() || 
        p.quoteToken.symbol.toUpperCase() === symbol.toUpperCase()
      );
      return pair ? parseFloat(pair.priceUsd) : 0;
    };

    // Fetch NGN/USD rate (mocked or real API)
    // Using a fixed rate for demonstration if API fails, but let's try an API
    let ngnRate = 1500; // Fallback 1 USD = 1500 NGN
    try {
      // Free forex API
      const forexRes = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      if (forexRes.data && forexRes.data.rates.NGN) {
        ngnRate = forexRes.data.rates.NGN;
      }
    } catch (e) {
      logger.warn('Failed to fetch forex rate, using fallback');
    }

    if (from === 'NGN') {
      fromPriceUsd = 1 / ngnRate;
    } else {
      fromPriceUsd = await getCryptoPrice(from as string);
    }

    if (to === 'NGN') {
      toPriceUsd = 1 / ngnRate;
    } else {
      toPriceUsd = await getCryptoPrice(to as string);
    }

    if (!fromPriceUsd || !toPriceUsd) return res.status(400).json({ error: 'Invalid token pair' });

    // Calculate base rate
    const baseRate = fromPriceUsd / toPriceUsd;
    
    // Apply spread (e.g., 1% markup)
    const spreadPercent = parseFloat(process.env.SPREAD_PERCENT || '1');
    const spreadMultiplier = from === 'NGN' ? (1 - spreadPercent / 100) : (1 + spreadPercent / 100);
    const customRate = baseRate * spreadMultiplier;

    const toAmount = parseFloat(amount as string) * customRate;

    res.json({
      baseRate,
      customRate,
      toAmount,
      spreadPercent
    });
  } catch (error) {
    logger.error('Quote error:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

// Initiate Buy (Generate Virtual Account)
router.post('/initiate-buy', checkDbConnection, authMiddleware, async (req: any, res: any) => {
  try {
    const { fromToken, toToken, fromAmount, toAmount, price } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (fromToken !== 'NGN') {
      return res.status(400).json({ error: 'Only NGN deposits currently supported for fiat on-ramp' });
    }

    // If user doesn't have a virtual account, generate one via Paystack
    if (!user.virtualAccount || !user.virtualAccount.accountNumber) {
      if (!process.env.PAYSTACK_SECRET) {
        // Mock virtual account for development
        user.virtualAccount = {
          accountNumber: '1234567890',
          bankName: 'Mock Bank',
          accountName: 'Zyro Web User',
          reference: `REF-${Date.now()}`
        };
      } else {
        // Real Paystack integration
        const paystackRes = await axios.post('https://api.paystack.co/dedicated_account', {
          customer: user.email,
          preferred_bank: 'wema-bank'
        }, {
          headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` }
        });
        
        user.virtualAccount = {
          accountNumber: paystackRes.data.data.account_number,
          bankName: paystackRes.data.data.bank.name,
          accountName: paystackRes.data.data.account_name,
          reference: `REF-${Date.now()}`
        };
      }
      await user.save();
    }

    // Create pending trade
    const trade = new Trade({
      userId: user._id,
      type: 'buy',
      fromToken,
      toToken,
      fromAmount,
      toAmount,
      price,
      status: 'pending',
      reference: user.virtualAccount.reference
    });
    await trade.save();

    res.json({
      virtualAccount: user.virtualAccount,
      tradeId: trade._id
    });
  } catch (error) {
    logger.error('Initiate buy error:', error);
    res.status(500).json({ error: 'Failed to initiate buy' });
  }
});

// Webhook for Paystack
router.post('/webhook/paystack', checkDbConnection, async (req, res) => {
  // Verify webhook signature in production
  const event = req.body;
  
  if (event.event === 'charge.success') {
    const { reference, amount, customer } = event.data;
    // amount is in kobo, convert to NGN
    const ngnAmount = amount / 100;

    try {
      const user = await User.findOne({ email: customer.email });
      if (user) {
        // Credit user NGN balance
        user.balances.ngn += ngnAmount;
        await user.save();
        
        // Find pending trades and execute
        const pendingTrade = await Trade.findOne({ userId: user._id, status: 'pending', fromToken: 'NGN' }).sort({ createdAt: -1 });
        if (pendingTrade && user.balances.ngn >= pendingTrade.fromAmount) {
          // Execute trade
          user.balances.ngn -= pendingTrade.fromAmount;
          
          // Add crypto to balance
          const tokenKey = pendingTrade.toToken.toLowerCase() as 'eth' | 'usdc';
          if (user.balances[tokenKey] !== undefined) {
            user.balances[tokenKey] += pendingTrade.toAmount;
          }
          
          pendingTrade.status = 'completed';
          await user.save();
          await pendingTrade.save();
          
          // Emit socket event
          const io = req.app.get('io');
          if (io) {
            io.to(user._id.toString()).emit('balance_updated', user.balances);
            io.to(user._id.toString()).emit('trade_completed', pendingTrade);
          }
        }
      }
    } catch (error) {
      logger.error('Webhook processing error:', error);
    }
  }
  
  res.sendStatus(200);
});

// Get User Balances
router.get('/balances', checkDbConnection, authMiddleware, async (req: any, res: any) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.balances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch balances' });
  }
});

// Get Trades
router.get('/trades', checkDbConnection, authMiddleware, async (req: any, res: any) => {
  try {
    const trades = await Trade.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
});

export default router;
