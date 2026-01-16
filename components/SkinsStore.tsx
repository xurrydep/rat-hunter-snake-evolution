
import React from 'react';
import { SKINS } from '../constants';
import { Skin } from '../types';

interface SkinsStoreProps {
  coins: number;
  ownedSkins: string[];
  activeSkinId: string;
  onSelect: (skinId: string) => void;
  onPurchase: (skin: Skin) => void;
  onBack: () => void;
}

const SkinsStore: React.FC<SkinsStoreProps> = ({ coins, ownedSkins, activeSkinId, onSelect, onPurchase, onBack }) => {
  return (
    <div className="flex flex-col items-center gap-6 w-full h-full max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300 py-4">
      <div className="flex justify-between items-center w-full px-4">
        <h2 className="text-4xl font-game text-blue-500 drop-shadow-[0_4px_0px_#1e40af]">SHOP</h2>
        <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-full border border-slate-700">
          <span className="text-amber-400 font-bold">💰 {coins}</span>
        </div>
      </div>

      <div className="w-full bg-slate-800/80 rounded-3xl p-4 border border-slate-700 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
        {SKINS.map((skin) => {
          const isOwned = ownedSkins.includes(skin.id);
          const isActive = activeSkinId === skin.id;
          const canAfford = coins >= skin.price;

          return (
            <div key={skin.id} className={`flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border transition-all ${
              isActive ? 'border-green-500/50 bg-green-900/10' : 'border-slate-700/50'
            }`}>
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-3xl shadow-lg border-2 border-white/10"
                  style={{ backgroundColor: skin.bodyColor }}
                >
                  {skin.emoji}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-lg leading-none">{skin.name}</span>
                    {skin.stats.scoreMod && <span className="bg-green-600/20 text-green-500 text-[8px] px-1 rounded border border-green-500/30">x{skin.stats.scoreMod} POINTS</span>}
                  </div>
                  <span className="text-xs text-slate-400 mt-1 max-w-[150px]">{skin.description}</span>
                  <div className="flex gap-1 mt-1">
                    {skin.stats.speedMod !== undefined && (
                        <span className={`text-[8px] font-bold px-1 rounded ${skin.stats.speedMod > 0 ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            {skin.stats.speedMod > 0 ? 'FAST' : 'SLOW'}
                        </span>
                    )}
                    {skin.stats.poisonResist && <span className="bg-purple-500/20 text-purple-400 text-[8px] font-bold px-1 rounded">RESISTANT</span>}
                    {skin.stats.growthMod && <span className="bg-amber-500/20 text-amber-400 text-[8px] font-bold px-1 rounded">LESS GROWTH</span>}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                {isOwned ? (
                  <button 
                    onClick={() => onSelect(skin.id)}
                    disabled={isActive}
                    className={`font-game px-4 py-2 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-green-600 text-white opacity-50 cursor-default' 
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_4px_0px_#2563eb] active:shadow-none active:translate-y-1'
                    }`}
                  >
                    {isActive ? 'SELECTED' : 'SELECT'}
                  </button>
                ) : (
                  <button 
                    onClick={() => onPurchase(skin)}
                    disabled={!canAfford}
                    className={`flex items-center gap-2 font-game px-4 py-2 rounded-xl transition-all ${
                      canAfford 
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-[0_4px_0px_#92400e] active:shadow-none active:translate-y-1' 
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    💰 {skin.price}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button 
        onClick={onBack}
        className="mt-2 bg-slate-700 hover:bg-slate-600 text-white font-game text-lg py-3 px-12 rounded-2xl transform active:scale-95 transition-all shadow-[0_4px_0px_#334155]"
      >
        BACK TO MENU
      </button>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default SkinsStore;
