import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['buy', 'sell', 'swap'], required: true },
  fromToken: { type: String, required: true },
  toToken: { type: String, required: true },
  fromAmount: { type: Number, required: true },
  toAmount: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  reference: { type: String }
}, { timestamps: true });

export const Trade = mongoose.model('Trade', tradeSchema);
