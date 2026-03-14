import { User } from '@supabase/supabase-js';
import { Activity, Zap, Target, Flame, Cpu, TrendingUp, BarChart2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function CryptoDashboard({ user }: { user: User | null }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-500/30">
      {/* Background Elements */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-900/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed top-[40%] right-[-10%] w-[30%] h-[40%] bg-red-800/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Main Content (AI Trading Alpha Dashboard) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium uppercase tracking-wider mb-4">
              <Cpu className="w-4 h-4" />
              AI Market Intelligence Active
            </div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">{user?.user_metadata?.full_name || 'Trader'}</span>
            </h1>
            <p className="text-zinc-400">Here are your personalized AI-driven market signals and alpha.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => alert('Market Overview coming soon!')}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
              <BarChart2 className="w-4 h-4" />
              Market Overview
            </button>
            <button 
              onClick={() => alert('Auto-Trade feature is currently in beta. Stay tuned!')}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Auto-Trade
            </button>
          </div>
        </motion.div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* AI Sentiment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <Activity className="w-6 h-6 text-red-400" />
              </div>
              <span className="flex items-center text-red-400 text-sm font-medium bg-red-400/10 px-2.5 py-1 rounded-full border border-red-400/20">
                Bullish
              </span>
            </div>
            <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">Global AI Sentiment</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-bold font-mono tracking-tight">78</h2>
              <span className="text-zinc-500 font-mono text-sm">/100</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-red-700 w-[78%] h-full rounded-full" />
            </div>
          </motion.div>

          {/* Volatility Index */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <Flame className="w-6 h-6 text-red-500" />
              </div>
              <span className="flex items-center text-red-400 text-sm font-medium bg-red-400/10 px-2.5 py-1 rounded-full border border-red-400/20">
                High
              </span>
            </div>
            <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">Market Volatility</p>
            <h2 className="text-4xl font-bold font-mono tracking-tight">6.4%</h2>
            <p className="text-xs text-zinc-500 mt-2">Expected 24h swing based on order book depth.</p>
          </motion.div>

          {/* Active Signals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-800/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <Target className="w-6 h-6 text-red-400" />
              </div>
              <span className="flex items-center text-red-400 text-sm font-medium bg-red-400/10 px-2.5 py-1 rounded-full border border-red-400/20">
                Actionable
              </span>
            </div>
            <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">Active AI Signals</p>
            <h2 className="text-4xl font-bold font-mono tracking-tight">14</h2>
            <p className="text-xs text-zinc-500 mt-2">3 Strong Buy, 9 Hold, 2 Sell recommendations.</p>
          </motion.div>
        </div>

        {/* Alpha Signals Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-400" />
              Trending Alpha Signals
            </h3>
            <button 
              onClick={() => alert('Full signals list coming soon!')}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-zinc-500 bg-black/20">
                  <th className="p-4 font-medium">Asset</th>
                  <th className="p-4 font-medium">AI Confidence</th>
                  <th className="p-4 font-medium">Signal Type</th>
                  <th className="p-4 font-medium">Target Price</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { asset: 'SOL', name: 'Solana', conf: 92, type: 'Breakout', target: '$185.50', action: 'Buy' },
                  { asset: 'INJ', name: 'Injective', conf: 88, type: 'Accumulation', target: '$42.00', action: 'Buy' },
                  { asset: 'RNDR', name: 'Render', conf: 75, type: 'Momentum', target: '$11.20', action: 'Hold' },
                  { asset: 'TIA', name: 'Celestia', conf: 64, type: 'Reversal', target: '$14.80', action: 'Sell' },
                ].map((signal, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">
                          {signal.asset[0]}
                        </div>
                        <div>
                          <div className="font-bold">{signal.asset}</div>
                          <div className="text-xs text-zinc-500">{signal.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${signal.conf > 80 ? 'bg-red-500' : signal.conf > 70 ? 'bg-red-700' : 'bg-red-900'}`} 
                            style={{ width: `${signal.conf}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono">{signal.conf}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-zinc-300">{signal.type}</span>
                    </td>
                    <td className="p-4 font-mono text-sm">{signal.target}</td>
                    <td className="p-4 text-right">
                      <button className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                        signal.action === 'Buy' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' :
                        signal.action === 'Sell' ? 'bg-red-900/40 text-red-600 hover:bg-red-900/60' :
                        'bg-white/10 text-zinc-300 hover:bg-white/20'
                      }`}>
                        {signal.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
