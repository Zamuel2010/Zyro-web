import React from 'react';
import { motion } from 'motion/react';
import { X, Copy, CheckCircle2 } from 'lucide-react';

interface BankModalProps {
  isOpen: boolean;
  onClose: () => void;
  virtualAccount: any;
  amount: number;
}

export default function BankModal({ isOpen, onClose, virtualAccount, amount }: BankModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !virtualAccount) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(virtualAccount.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-zinc-900 border border-white/10 rounded-3xl p-6 w-full max-w-md relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-2">Transfer Funds</h2>
        <p className="text-zinc-400 mb-6 text-sm">
          Please transfer exactly <span className="text-white font-bold">₦{amount.toLocaleString()}</span> to the account below. Your crypto will be credited automatically once the transfer is confirmed.
        </p>

        <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4 mb-6">
          <div>
            <div className="text-xs text-zinc-500 mb-1 font-medium uppercase tracking-wider">Bank Name</div>
            <div className="text-lg font-semibold text-white">{virtualAccount.bankName}</div>
          </div>
          
          <div>
            <div className="text-xs text-zinc-500 mb-1 font-medium uppercase tracking-wider">Account Number</div>
            <div className="flex items-center justify-between bg-zinc-800/50 p-3 rounded-xl border border-white/5">
              <span className="text-xl font-mono text-white tracking-wider">{virtualAccount.accountNumber}</span>
              <button 
                onClick={handleCopy}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
              >
                {copied ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <div className="text-xs text-zinc-500 mb-1 font-medium uppercase tracking-wider">Account Name</div>
            <div className="text-md font-medium text-white">{virtualAccount.accountName}</div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm text-blue-200">
          <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0 animate-pulse" />
          <p>Waiting for transfer confirmation... This window will close automatically once received.</p>
        </div>
      </motion.div>
    </div>
  );
}
