import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDownUp, Settings, ChevronDown, Search, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import AuthModal from '../components/AuthModal';
import BankModal from '../components/BankModal';

const TOKENS = [
  { symbol: 'NGN', name: 'Nigerian Naira', color: 'bg-green-700' },
  { symbol: 'BTC', name: 'Bitcoin', color: 'bg-orange-500' },
  { symbol: 'ETH', name: 'Ethereum', color: 'bg-blue-500' },
  { symbol: 'SOL', name: 'Solana', color: 'bg-purple-500' },
  { symbol: 'USDC', name: 'USD Coin', color: 'bg-blue-400' },
  { symbol: 'USDT', name: 'Tether', color: 'bg-green-500' },
  { symbol: 'BNB', name: 'BNB', color: 'bg-yellow-500' },
  { symbol: 'XRP', name: 'Ripple', color: 'bg-zinc-500' },
  { symbol: 'ADA', name: 'Cardano', color: 'bg-blue-600' },
  { symbol: 'AVAX', name: 'Avalanche', color: 'bg-red-500' },
  { symbol: 'LINK', name: 'Chainlink', color: 'bg-blue-700' },
  { symbol: 'DOGE', name: 'Dogecoin', color: 'bg-yellow-600' },
  { symbol: 'SHIB', name: 'Shiba Inu', color: 'bg-orange-600' },
  { symbol: 'DOT', name: 'Polkadot', color: 'bg-pink-600' },
  { symbol: 'MATIC', name: 'Polygon', color: 'bg-purple-600' },
  { symbol: 'UNI', name: 'Uniswap', color: 'bg-pink-500' },
  { symbol: 'LTC', name: 'Litecoin', color: 'bg-zinc-400' },
  { symbol: 'ATOM', name: 'Cosmos', color: 'bg-zinc-600' },
  { symbol: 'NEAR', name: 'NEAR Protocol', color: 'bg-zinc-800' },
  { symbol: 'APT', name: 'Aptos', color: 'bg-zinc-900' },
  { symbol: 'SUI', name: 'Sui', color: 'bg-blue-400' },
  { symbol: 'ARB', name: 'Arbitrum', color: 'bg-blue-500' },
  { symbol: 'OP', name: 'Optimism', color: 'bg-red-500' },
  { symbol: 'PEPE', name: 'Pepe', color: 'bg-green-600' },
  { symbol: 'FET', name: 'Fetch.ai', color: 'bg-blue-800' },
];

export default function CryptoProject() {
  const [fromToken, setFromToken] = useState(TOKENS[0]); // NGN
  const [toToken, setToToken] = useState(TOKENS[2]); // ETH
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isSelectingFor, setIsSelectingFor] = useState<'from' | 'to' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Auth & Modals
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [virtualAccount, setVirtualAccount] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [balances, setBalances] = useState<any>({});

  useEffect(() => {
    // Check if logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user info/balances
      axios.get('/api/swap/balances', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setBalances(res.data)).catch(() => localStorage.removeItem('token'));
      
      // Setup socket
      const socket = io();
      // Need to get userId somehow, assuming we can decode token or fetch profile
      // For now, we'll just listen to general events if possible, or wait for profile
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const fetchQuote = async () => {
      if (!fromAmount || isNaN(Number(fromAmount)) || Number(fromAmount) <= 0) {
        if (isMounted) {
          setToAmount('');
          setExchangeRate(null);
        }
        return;
      }

      if (isMounted) setIsLoadingQuote(true);
      
      try {
        const res = await axios.get(`/api/swap/quote?from=${fromToken.symbol}&to=${toToken.symbol}&amount=${fromAmount}`);
        
        if (isMounted) {
          setExchangeRate(res.data.customRate);
          setToAmount(res.data.toAmount.toFixed(6));
        }
      } catch (error) {
        console.error("Error fetching quote from backend:", error);
        if (isMounted) {
          setExchangeRate(null);
          setToAmount('');
        }
      } finally {
        if (isMounted) setIsLoadingQuote(false);
      }
    };

    const timeoutId = setTimeout(fetchQuote, 500);
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [fromAmount, fromToken, toToken]);

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const handleAction = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }

    if (fromToken.symbol === 'NGN') {
      // Initiate Buy
      setIsProcessing(true);
      try {
        const res = await axios.post('/api/swap/initiate-buy', {
          fromToken: fromToken.symbol,
          toToken: toToken.symbol,
          fromAmount: Number(fromAmount),
          toAmount: Number(toAmount),
          price: exchangeRate
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setVirtualAccount(res.data.virtualAccount);
        setIsBankModalOpen(true);
      } catch (err) {
        console.error('Failed to initiate buy', err);
        alert('Failed to initiate buy. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    } else {
      alert('Only NGN to Crypto buys are currently supported in this demo.');
    }
  };

  const filteredTokens = TOKENS.filter(t => 
    t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-900/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl mx-auto relative z-10"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold mb-4"
          >
            Crypto Project
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-zinc-400"
          >
            Swap any token instantly. (Integration coming soon)
          </motion.p>
        </div>

        {/* Swap Container with Border */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 shadow-2xl relative"
          whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-sm font-medium text-zinc-400">Swap</span>
            <button className="p-2 hover:bg-white/5 rounded-xl transition-colors">
              <Settings className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          {/* From Section */}
          <div className="bg-black/40 border border-white/5 rounded-2xl p-4 mb-2 hover:border-white/10 transition-colors">
            <div className="text-xs text-zinc-500 mb-2 font-medium">You pay</div>
            <div className="flex justify-between items-center gap-4">
              <input 
                type="number" 
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="bg-transparent text-3xl font-bold w-full outline-none placeholder-zinc-700"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSelectingFor('from')}
                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-xl font-medium transition-colors shrink-0"
              >
                <div className={`w-6 h-6 rounded-full ${fromToken.color} flex items-center justify-center text-[10px] font-bold`}>
                  {fromToken.symbol[0]}
                </div>
                {fromToken.symbol}
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              </motion.button>
            </div>
          </div>

          {/* Swap Button */}
          <div className="relative h-2 flex items-center justify-center z-10">
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSwapTokens}
              className="absolute bg-zinc-800 border-4 border-zinc-900 p-2 rounded-xl text-white hover:text-red-400 transition-colors"
            >
              <ArrowDownUp className="w-4 h-4" />
            </motion.button>
          </div>

          {/* To Section */}
          <div className="bg-black/40 border border-white/5 rounded-2xl p-4 mt-2 hover:border-white/10 transition-colors">
            <div className="text-xs text-zinc-500 mb-2 font-medium">You receive</div>
            <div className="flex justify-between items-center gap-4">
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="0.0"
                  value={toAmount}
                  disabled
                  className="bg-transparent text-3xl font-bold w-full outline-none placeholder-zinc-700 text-zinc-300"
                />
                {isLoadingQuote && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-xs text-zinc-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Fetching DEXscan quote...
                  </div>
                )}
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSelectingFor('to')}
                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-xl font-medium transition-colors shrink-0"
              >
                <div className={`w-6 h-6 rounded-full ${toToken.color} flex items-center justify-center text-[10px] font-bold`}>
                  {toToken.symbol[0]}
                </div>
                {toToken.symbol}
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              </motion.button>
            </div>
          </div>

          {exchangeRate && !isLoadingQuote && toAmount && (
            <div className="px-4 py-2 text-xs text-zinc-400 flex justify-between items-center">
              <span>Exchange Rate (DEXscan)</span>
              <span>1 {fromToken.symbol} = {exchangeRate.toFixed(6)} {toToken.symbol}</span>
            </div>
          )}

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAction}
            disabled={isProcessing || !fromAmount || Number(fromAmount) <= 0}
            className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (fromToken.symbol === 'NGN' ? 'Buy' : 'Swap Tokens')}
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={() => setIsAuthModalOpen(false)} 
            onSuccess={(u) => {
              setUser(u);
              setBalances(u.balances);
            }} 
          />
        )}
        {isBankModalOpen && (
          <BankModal 
            isOpen={isBankModalOpen} 
            onClose={() => setIsBankModalOpen(false)} 
            virtualAccount={virtualAccount}
            amount={Number(fromAmount)}
          />
        )}
      </AnimatePresence>

      {/* Token Selector Modal */}
      <AnimatePresence>
        {isSelectingFor && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-bold text-lg">Select a token</h3>
                <button 
                  onClick={() => {
                    setIsSelectingFor(null);
                    setSearchQuery('');
                  }}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Search name or paste address"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>
              <div className="max-h-[400px] overflow-y-auto p-2">
                {filteredTokens.map(token => (
                  <button
                    key={token.symbol}
                    onClick={() => {
                      if (isSelectingFor === 'from') setFromToken(token);
                      else setToToken(token);
                      setIsSelectingFor(null);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors text-left"
                  >
                    <div className={`w-10 h-10 rounded-full ${token.color} flex items-center justify-center font-bold text-sm`}>
                      {token.symbol[0]}
                    </div>
                    <div>
                      <div className="font-bold">{token.symbol}</div>
                      <div className="text-sm text-zinc-500">{token.name}</div>
                    </div>
                  </button>
                ))}
                {filteredTokens.length === 0 && (
                  <div className="p-8 text-center text-zinc-500">
                    No tokens found.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
