import { motion } from 'motion/react';
import { ArrowRight, Shield, Zap, BarChart3, Cpu, Newspaper, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const NEWS_ITEMS = [
  {
    id: 1,
    title: "Bitcoin Surges Past $150k as Institutional Adoption Reaches New Highs",
    source: "CryptoInsider",
    time: "2 hours ago",
    category: "Market"
  },
  {
    id: 2,
    title: "Ethereum 3.0 Upgrade Announced: What You Need to Know About the New Rollups",
    source: "DeFi Daily",
    time: "4 hours ago",
    category: "Technology"
  },
  {
    id: 3,
    title: "Zyro Web's AI Predicts Massive Altcoin Breakout in Q3",
    source: "Zyro Alpha",
    time: "5 hours ago",
    category: "Alpha"
  },
  {
    id: 4,
    title: "Global Regulatory Framework for Stablecoins Finalized",
    source: "CoinJournal",
    time: "8 hours ago",
    category: "Regulation"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-500/30">
      {/* Background Elements */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-900/10 blur-[120px] rounded-full pointer-events-none" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium uppercase tracking-wider mb-6">
              <Zap className="w-4 h-4" />
              Next-Gen Crypto Intelligence
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Master the Market with <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Zyro Web</span>
            </h1>
            <p className="text-xl text-zinc-400 mb-10">
              Your ultimate hub for advanced crypto intelligence, AI-driven trading alpha, and seamless portfolio management.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/dashboard"
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white rounded-xl font-bold shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Launch Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/about"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-colors w-full sm:w-auto justify-center flex items-center gap-2"
              >
                <UserCircle className="w-5 h-5" />
                Meet the Founder
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
          >
            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
              <Cpu className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Trading Alpha</h3>
            <p className="text-zinc-400">
              Get real-time, AI-driven market signals and sentiment analysis to stay ahead of the curve.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
          >
            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
              <BarChart3 className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Advanced Analytics</h3>
            <p className="text-zinc-400">
              Deep dive into market volatility, order book depth, and trending assets with precision.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
          >
            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
            <p className="text-zinc-400">
              Enterprise-grade security ensuring your portfolio data and trading strategies remain private.
            </p>
          </motion.div>
        </div>

        {/* Crypto News Feed Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
              <Newspaper className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold">Latest Market Intel</h2>
          </div>

          <div className="space-y-4">
            {NEWS_ITEMS.map((news) => (
              <div 
                key={news.id} 
                className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider border border-red-500/20">
                    {news.category}
                  </span>
                  <span className="text-sm text-zinc-500">{news.time}</span>
                  <span className="text-sm text-zinc-500 flex items-center gap-1 before:content-['•'] before:mr-1">
                    {news.source}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-zinc-200 group-hover:text-red-400 transition-colors">
                  {news.title}
                </h3>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <button className="text-red-400 hover:text-red-300 font-medium text-sm flex items-center gap-1 mx-auto transition-colors">
              View All News <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
