import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import Auth from './components/Auth';
import Home from './pages/Home';
import CryptoDashboard from './pages/CryptoDashboard';
import { LogOut, Send, Twitter } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-500/30 flex flex-col">
        {/* Navbar */}
        <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.3)] overflow-hidden">
                  <img 
                    src="https://i.postimg.cc/VmNhV9sj/IMG-3527.jpg" 
                    alt="Zyro Logo" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="font-bold text-xl tracking-tight">Zyro Web</span>
              </Link>
              
              <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
                  <Link to="/" className="hover:text-white transition-colors">Home</Link>
                  <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                  <Link to="/about" className="hover:text-white transition-colors">About</Link>
                </div>
                
                <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                  <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    {user.email}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<CryptoDashboard user={user} />} />
            <Route path="/about" element={
              <div className="max-w-4xl mx-auto px-4 py-20">
                <div className="text-center mb-16">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">About Zyro Web</h1>
                  <p className="text-xl text-zinc-400">Next-generation crypto intelligence and portfolio management.</p>
                </div>
                
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center">
                  <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-red-500/20 shrink-0 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                    <img 
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400" 
                      alt="Founder" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
                      Founder & Front-End Developer
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Meet the Visionary</h2>
                    <p className="text-zinc-400 mb-6 leading-relaxed">
                      Zyro Web was founded with a single mission: to build the most intuitive and powerful crypto intelligence interface on the web. As a passionate Front-End Developer with a deep love for sleek UI/UX and modern web technologies, our founder built Zyro to bridge the gap between complex blockchain data and everyday traders. Every pixel and interaction is crafted to give you a seamless, edge-driven trading experience.
                    </p>
                    <div className="flex gap-4">
                      <a href="https://x.com/@zyroonchain" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-colors flex items-center gap-2">
                        <Twitter className="w-4 h-4" />
                        Follow on X
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://i.postimg.cc/VmNhV9sj/IMG-3527.jpg" 
                    alt="Zyro Logo" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="font-bold text-lg tracking-tight">Zyro Web</span>
              </div>
              
              <div className="flex items-center gap-6">
                <a 
                  href="https://t.me/Codex600" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-red-400 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <Send className="w-4 h-4" />
                  Telegram
                </a>
                <a 
                  href="https://x.com/@zyroonchain" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-red-400 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <Twitter className="w-4 h-4" />
                  X (Twitter)
                </a>
              </div>
              
              <div className="text-zinc-500 text-sm">
                &copy; {new Date().getFullYear()} Zyro Web. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
