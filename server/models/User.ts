import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  kycStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  balances: {
    ngn: { type: Number, default: 0 },
    eth: { type: Number, default: 0 },
    usdc: { type: Number, default: 0 }
  },
  virtualAccount: {
    accountNumber: String,
    bankName: String,
    accountName: String,
    reference: String
  }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
