import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Activity, Users, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

export default function Dashboard() {
  const [trades, setTrades] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get('/api/swap/trades', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrades(res.data);
      } catch (error) {
        console.error('Failed to fetch trades', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrades();

    // Socket for real-time updates
    const socket = io();
    socket.on('trade_completed', (trade) => {
      setTrades(prev => prev.map(t => t._id === trade._id ? trade : t));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Updates
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-zinc-400">Total Trades</div>
                <div className="text-2xl font-bold">{trades.length}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-sm text-zinc-400">Completed</div>
                <div className="text-2xl font-bold">{trades.filter(t => t.status === 'completed').length}</div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-sm text-zinc-400">Pending</div>
                <div className="text-2xl font-bold">{trades.filter(t => t.status === 'pending').length}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/40 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Amount In</th>
                  <th className="px-6 py-4 font-medium">Amount Out</th>
                  <th className="px-6 py-4 font-medium">Rate</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">Loading trades...</td>
                  </tr>
                ) : trades.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">No trades found</td>
                  </tr>
                ) : (
                  trades.map((trade) => (
                    <tr key={trade._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 text-xs font-medium capitalize">
                          {trade.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {trade.fromAmount.toLocaleString()} {trade.fromToken}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {trade.toAmount.toLocaleString()} {trade.toToken}
                      </td>
                      <td className="px-6 py-4 text-zinc-400 text-sm">
                        {trade.price.toFixed(6)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium capitalize ${
                          trade.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                          trade.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {trade.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-400 text-sm">
                        {new Date(trade.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
