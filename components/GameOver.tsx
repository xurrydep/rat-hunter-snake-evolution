
import React, { useState, useEffect } from 'react';
import { getGameCommentary } from '../services/geminiService';

interface GameOverProps {
  score: number;
  onRestart: () => void;
  onMenu: () => void;
  onSaveScore: (name: string) => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, onRestart, onMenu, onSaveScore }) => {
  const [name, setName] = useState('');
  const [commentary, setCommentary] = useState('Game Over!');
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [mintStatus, setMintStatus] = useState<'IDLE' | 'MINTING' | 'SUCCESS'>('IDLE');

  useEffect(() => {
    const fetchCommentary = async () => {
      const msg = await getGameCommentary(score);
      setCommentary(msg);
    };
    fetchCommentary();

    const storedHS = localStorage.getItem('rat_hunter_hs');
    if (storedHS && score >= parseInt(storedHS)) {
      setIsNewRecord(true);
    }
  }, [score]);

  const handleSave = () => {
    setMintStatus('MINTING');
    // Simulated on-chain sequence
    setTimeout(() => {
        setMintStatus('SUCCESS');
        setTimeout(() => {
            onSaveScore(name);
            setMintStatus('IDLE');
        }, 800);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center gap-6 text-center animate-in fade-in zoom-in duration-500 w-full px-4">
      <h2 className="text-5xl font-game text-red-500 drop-shadow-[0_4px_0px_#991b1b] base-text-glow">OUCH!</h2>
      
      <div className="bg-slate-900/90 p-8 rounded-[3rem] w-full max-w-sm flex flex-col items-center gap-6 border border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden">
        {/* Minting Overlay */}
        {mintStatus !== 'IDLE' && (
            <div className={`absolute inset-0 z-30 flex flex-col items-center justify-center animate-in fade-in duration-300 backdrop-blur-md ${mintStatus === 'SUCCESS' ? 'bg-green-600/90' : 'bg-[#0052FF]/95'}`}>
                {mintStatus === 'MINTING' ? (
                  <>
                    <div className="relative mb-6">
                        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                        </div>
                    </div>
                    <span className="font-game text-white text-2xl tracking-[0.2em]">WRITING TO CHAIN</span>
                    <span className="text-white/70 text-[10px] font-black uppercase mt-3 tracking-widest">Base Mainnet Transaction</span>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-300">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <span className="font-game text-white text-3xl">SUCCESS!</span>
                    <span className="text-white/80 text-[10px] font-black uppercase mt-2">Score Hash Verified</span>
                  </>
                )}
            </div>
        )}

        <div className="flex flex-col items-center">
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-1">Final Score</span>
          <span className="text-8xl font-game text-white base-text-glow leading-none">{score}</span>
          {isNewRecord && (
            <div className="flex items-center gap-2 mt-4 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/40 shadow-lg shadow-amber-500/10">
              <span className="text-amber-500 text-[11px] font-black animate-pulse uppercase tracking-wider">🏆 NEW WORLD RECORD</span>
            </div>
          )}
        </div>

        <div className="relative py-2 group">
            <div className="absolute -top-4 -left-2 text-blue-500/20 text-5xl font-serif">"</div>
            <p className="text-slate-300 italic text-sm px-4 leading-relaxed relative z-10 transition-colors group-hover:text-white">
                {commentary}
            </p>
            <div className="absolute -bottom-4 -right-2 text-blue-500/20 text-5xl font-serif">"</div>
        </div>

        <div className="w-full flex flex-col gap-4 mt-2">
          <div className="relative">
              <input 
                type="text" 
                placeholder="YOUR NICKNAME..."
                value={name}
                onChange={(e) => setName(e.target.value.toUpperCase().slice(0, 10))}
                className="w-full bg-black/40 text-white p-5 rounded-[1.5rem] border border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0052FF] text-center font-black tracking-[0.2em] text-xl transition-all placeholder:text-slate-700"
              />
          </div>
          <button 
            disabled={!name || mintStatus !== 'IDLE'}
            onClick={handleSave}
            className="bg-[#0052FF] hover:bg-[#0042CC] disabled:bg-slate-800 disabled:text-slate-600 text-white font-game py-5 rounded-[1.5rem] transform active:scale-95 transition-all shadow-[0_8px_0px_#002880] active:shadow-none active:translate-y-1 text-2xl flex items-center justify-center gap-3 relative overflow-hidden"
          >
            <span>SAVE SCORE</span>
            <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_#fff] animate-pulse"></div>
          </button>
          <div className="flex items-center justify-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
             <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest italic">Encrypted by Base Smart Wallet</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full gap-4 mt-2">
        <button 
          onClick={onRestart}
          className="bg-green-600 hover:bg-green-500 text-white font-game text-2xl py-4 px-12 rounded-[2rem] transform active:scale-95 transition-all shadow-[0_8px_0px_#14532d] active:shadow-none active:translate-y-1"
        >
          PLAY AGAIN
        </button>
        <button 
          onClick={onMenu}
          className="text-slate-600 font-black hover:text-[#0052FF] transition-colors uppercase tracking-[0.3em] text-[10px]"
        >
          Back to Main Menu
        </button>
      </div>
    </div>
  );
};

export default GameOver;
