
import React from 'react';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  onBack: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, onBack }) => {
  return (
    <div className="flex flex-col items-center gap-6 w-full animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-4xl font-game text-white drop-shadow-[0_4px_0px_#0052FF]">BASE LEGENDS</h2>
        <span className="text-[10px] text-[#0052FF] font-black tracking-widest uppercase opacity-80">Verified on Basescan</span>
      </div>

      <div className="w-full bg-slate-800/80 rounded-[2rem] p-4 border border-slate-700/50 flex flex-col gap-2 overflow-y-auto max-h-[50vh] custom-scrollbar shadow-2xl backdrop-blur-xl">
        {entries.length === 0 ? (
          <p className="text-slate-500 py-10 text-center italic font-bold">No heroes yet...</p>
        ) : (
          entries.map((entry, idx) => (
            <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-900/60 rounded-2xl border border-slate-700/30 group hover:border-[#0052FF]/30 transition-all">
              <div className="flex items-center gap-4">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-game text-xl shadow-lg ${
                  idx === 0 ? 'bg-amber-500 text-slate-900 shadow-amber-500/20 scale-110' : 
                  idx === 1 ? 'bg-slate-300 text-slate-900' :
                  idx === 2 ? 'bg-amber-800 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {idx + 1}
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-base tracking-tight">{entry.name}</span>
                    {entry.address && (
                        <div className="bg-[#0052FF] w-2 h-2 rounded-full shadow-[0_0_8px_#0052FF]"></div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {entry.address && (
                      <span className="text-[10px] text-slate-500 font-mono font-bold">{entry.address.slice(0, 6)}...{entry.address.slice(-4)}</span>
                    )}
                    {entry.txHash && (
                      <span className="text-[8px] text-[#0052FF] font-black tracking-tighter hover:underline cursor-pointer">TX: 0x{entry.txHash.slice(2, 6)}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-3xl font-game text-green-500 drop-shadow-[0_2px_4px_rgba(34,197,94,0.3)]">{entry.score}</span>
                <span className="text-[8px] text-slate-600 font-black uppercase">{entry.date}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <button 
        onClick={onBack}
        className="mt-2 bg-slate-700 hover:bg-slate-600 text-white font-game text-lg py-3 px-12 rounded-2xl transform active:scale-95 transition-all shadow-[0_4px_0px_#334155]"
      >
        BACK TO MENU
      </button>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #0052FF; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Leaderboard;
