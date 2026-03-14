import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

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

router.post('/register', checkDbConnection, async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, user: { email: user.email, balances: user.balances, kycStatus: user.kycStatus } });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed: ' + (error.message || 'Unknown error') });
  }
});

router.post('/login', checkDbConnection, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, user: { email: user.email, balances: user.balances, kycStatus: user.kycStatus, virtualAccount: user.virtualAccount } });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed: ' + (error.message || 'Unknown error') });
  }
});

export default router;
