
import React from 'react';
import { OnChainTx } from '../types';

interface MainMenuProps {
  onStart: () => void;
  onLeaderboard: () => void;
  onSkins: () => void;
  onLogin: () => void;
  onLogout: () => void;
  address: string | null;
  coins: number;
  txs: OnChainTx[];
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, onLeaderboard, onSkins, onLogin, onLogout, address, coins, txs }) => {
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null;

  return (
    <div className="flex flex-col items-center gap-6 text-center px-6 w-full relative">
      {/* Auth & Wallet Status */}
      <div className="absolute -top-4 right-0 flex items-center gap-3">
        <div className="bg-slate-900/90 px-3 py-1.5 rounded-full border border-slate-800 flex items-center gap-2">
           <span className="text-amber-400 font-bold text-sm">💰 {coins}</span>
        </div>
        
        {address ? (
          <button 
            onClick={onLogout}
            className="group flex items-center gap-2 bg-[#0052FF]/10 hover:bg-[#0052FF]/20 px-3 py-1.5 rounded-full border border-[#0052FF]/30 transition-all shadow-[0_0_15px_rgba(0,82,255,0.1)]"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <span className="text-[#0052FF] font-bold text-xs uppercase tracking-tight">{shortAddress}</span>
          </button>
        ) : (
          <button 
            onClick={onLogin}
            className="bg-[#0052FF] hover:bg-[#0042CC] text-white px-5 py-2 rounded-full font-bold text-[10px] shadow-[0_4px_14px_0_rgba(0,82,255,0.3)] transform transition-all active:scale-95 flex items-center gap-2 border border-blue-400/20 uppercase tracking-widest"
          >
            <div className="w-2 h-2 border-2 border-white rounded-full"></div>
            Connect Wallet
          </button>
        )}
      </div>

      <div className="float-animation flex flex-col items-center mt-12">
         <div className="relative">
            <h1 className="text-6xl font-game text-white drop-shadow-[0_6px_0px_#0052FF] mb-2 base-text-glow">
              RAT HUNTER
            </h1>
            <span className="absolute -right-6 -top-6 text-4xl rotate-12 bg-white rounded-full p-2 shadow-2xl border-4 border-[#0052FF] animate-bounce">🐭</span>
         </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="bg-[#0052FF] text-white text-[9px] px-2 py-1 rounded-md font-black tracking-widest flex items-center gap-2 shadow-lg shadow-blue-500/20">
             <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
             BUILD ON BASE
          </div>
          <p className="text-slate-500 font-bold tracking-[0.3em] text-[10px] uppercase">Snake Evolution</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full mt-2">
        <button 
          onClick={onStart}
          className="bg-[#0052FF] hover:bg-[#0042CC] text-white font-game text-3xl py-5 px-12 rounded-[2rem] transform active:scale-95 transition-all shadow-[0_8px_0px_#002880] active:shadow-none active:translate-y-1 group relative overflow-hidden"
        >
          <span className="relative z-10">PLAY</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onSkins} className="bg-slate-900/80 hover:bg-slate-800 text-white font-game text-xl py-4 rounded-2xl border border-slate-800 shadow-[0_6px_0px_#0f172a] active:shadow-none active:translate-y-1 flex items-center justify-center gap-2">
            <span>SKINS</span> <span className="text-sm">🧥</span>
          </button>
          <button onClick={onLeaderboard} className="bg-slate-900/80 hover:bg-slate-800 text-white font-game text-xl py-4 rounded-2xl border border-slate-800 shadow-[0_6px_0px_#0f172a] active:shadow-none active:translate-y-1 flex items-center justify-center gap-2">
            <span>LEADERBOARD</span> <span className="text-sm">🏆</span>
          </button>
        </div>
      </div>

      {/* On-chain Explorer Panel */}
      {address && (
        <div className="w-full mt-2 text-left bg-slate-900/40 p-4 rounded-3xl border border-slate-800/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Base Activity</p>
            <div className="flex items-center gap-1.5">
               <span className="text-[8px] text-green-500 font-bold uppercase animate-pulse">Syncing</span>
               <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 max-h-24 overflow-y-auto custom-scrollbar pr-2">
            {txs.length === 0 ? (
                <div className="text-[10px] text-slate-600 italic text-center py-2 uppercase font-bold tracking-tighter">No transactions yet. Start playing!</div>
            ) : txs.map(tx => (
              <div key={tx.hash} className="bg-black/20 p-2 rounded-xl border border-slate-800/40 flex items-center justify-between hover:border-[#0052FF]/30 transition-colors cursor-default">
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${tx.type === 'SCORE_SYNC' ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-300 tracking-tight">{tx.type.replace('_', ' ')}</span>
                    <span className="text-[8px] font-mono text-slate-600">0x{tx.hash.slice(2, 10)}...</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[8px] text-slate-600 font-bold">{new Date(tx.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <span className="text-[7px] text-[#0052FF] font-black uppercase tracking-tighter">Confirmed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!address && (
        <div className="mt-2 p-4 bg-[#0052FF]/5 border border-[#0052FF]/20 rounded-2xl backdrop-blur-sm group hover:bg-[#0052FF]/10 transition-colors">
           <p className="text-[#0052FF] text-[10px] font-bold uppercase tracking-tight leading-relaxed">
             Join the Base network to save your scores <br/>
             <span className="underline cursor-pointer font-black" onClick={onLogin}>Connect Wallet</span>
           </p>
        </div>
      )}

      {/* Footer Branding */}
      <div className="mt-2 flex items-center gap-3 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Powered by</span>
          <div className="w-4 h-4 rounded-full bg-[#0052FF] flex items-center justify-center p-0.5">
             <div className="w-full h-full border-2 border-white rounded-full"></div>
          </div>
      </div>
    </div>
  );
};

export default MainMenu;
