import React, { useState, useEffect, useCallback } from 'react';
import { GameState, LeaderboardEntry, Skin, OnChainTx } from './types';
import { SKINS } from './constants';
import MainMenu from './components/MainMenu';
import GameView from './components/GameView';
import GameOver from './components/GameOver';
import Leaderboard from './components/Leaderboard';
import SkinsStore from './components/SkinsStore';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [lastScore, setLastScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [address, setAddress] = useState<string | null>(null);
  const [txs, setTxs] = useState<OnChainTx[]>([]);
  
  const [coins, setCoins] = useState(0);
  const [ownedSkins, setOwnedSkins] = useState<string[]>(['classic']);
  const [activeSkinId, setActiveSkinId] = useState('classic');

  useEffect(() => {
    const keyPrefix = address ? `base_snake_${address}_` : 'base_snake_guest_';
    const savedCoins = localStorage.getItem(`${keyPrefix}coins`);
    setCoins(savedCoins ? parseInt(savedCoins) : 0);

    const savedSkins = localStorage.getItem(`${keyPrefix}owned_skins`);
    setOwnedSkins(savedSkins ? JSON.parse(savedSkins) : ['classic']);

    const savedActiveSkin = localStorage.getItem(`${keyPrefix}active_skin`);
    setActiveSkinId(savedActiveSkin || 'classic');

    const savedLeaderboard = localStorage.getItem('rat_hunter_leaderboard');
    if (savedLeaderboard) setLeaderboard(JSON.parse(savedLeaderboard));
    
    const savedTxs = localStorage.getItem(`${keyPrefix}txs`);
    if (savedTxs) setTxs(JSON.parse(savedTxs));
  }, [address]);

  const addTx = (type: OnChainTx['type']) => {
    const newTx: OnChainTx = {
      hash: '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      type,
      timestamp: Date.now(),
      status: 'SUCCESS'
    };
    const updated = [newTx, ...txs].slice(0, 5);
    setTxs(updated);
    const keyPrefix = address ? `base_snake_${address}_` : 'base_snake_guest_';
    localStorage.setItem(`${keyPrefix}txs`, JSON.stringify(updated));
    return newTx.hash;
  };

  const handleLogin = async () => {
    if (typeof (window as any).ethereum !== 'undefined') {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) setAddress(accounts[0]);
      } catch (err) {
        console.error("User rejected connection", err);
      }
    } else {
      setAddress('0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6));
    }
  };

  const handleLogout = () => setAddress(null);

  const persistData = (key: string, value: any) => {
    const keyPrefix = address ? `base_snake_${address}_` : 'base_snake_guest_';
    localStorage.setItem(`${keyPrefix}${key}`, typeof value === 'string' ? value : JSON.stringify(value));
  };

  const saveToLeaderboard = useCallback((name: string, score: number) => {
    const hash = addTx('SCORE_SYNC');
    const newEntry: LeaderboardEntry = {
      name,
      address: address || undefined,
      score,
      date: new Date().toLocaleDateString('en-US'),
      txHash: hash
    };
    const updated = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    setLeaderboard(updated);
    localStorage.setItem('rat_hunter_leaderboard', JSON.stringify(updated));
  }, [leaderboard, address, txs]);

  const awardCoins = useCallback((score: number) => {
    const newCoins = coins + score;
    setCoins(newCoins);
    persistData('coins', newCoins.toString());
  }, [coins, address]);

  const purchaseSkin = (skin: Skin) => {
    if (coins >= skin.price && !ownedSkins.includes(skin.id)) {
      addTx('PURCHASE');
      const newOwned = [...ownedSkins, skin.id];
      const newCoins = coins - skin.price;
      setCoins(newCoins);
      setOwnedSkins(newOwned);
      persistData('coins', newCoins.toString());
      persistData('owned_skins', newOwned);
    }
  };

  const selectSkin = (skinId: string) => {
    setActiveSkinId(skinId);
    persistData('active_skin', skinId);
  };

  const activeSkin = SKINS.find(s => s.id === activeSkinId) || SKINS[0];

  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center overflow-hidden touch-none relative p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-[#0052FF] rounded-full blur-[150px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[120px] opacity-10"></div>
      </div>

      <div className="z-10 w-full max-w-md h-full flex flex-col items-center justify-center">
        {gameState === GameState.MENU && (
          <MainMenu 
            onStart={() => setGameState(GameState.PLAYING)} 
            onLeaderboard={() => setGameState(GameState.LEADERBOARD)} 
            onSkins={() => setGameState(GameState.SKINS)}
            onLogin={handleLogin}
            onLogout={handleLogout}
            address={address}
            coins={coins}
            txs={txs}
          />
        )}

        {gameState === GameState.PLAYING && (
          <GameView 
            onGameOver={(score) => {
              setLastScore(score);
              awardCoins(score);
              setGameState(GameState.GAME_OVER);
            }}
            activeSkin={activeSkin}
          />
        )}

        {gameState === GameState.GAME_OVER && (
          <GameOver 
            score={lastScore} 
            onRestart={() => setGameState(GameState.PLAYING)} 
            onMenu={() => setGameState(GameState.MENU)}
            onSaveScore={(name) => {
              saveToLeaderboard(name, lastScore);
              setGameState(GameState.LEADERBOARD);
            }}
          />
        )}

        {gameState === GameState.LEADERBOARD && (
          <Leaderboard 
            entries={leaderboard} 
            onBack={() => setGameState(GameState.MENU)} 
          />
        )}

        {gameState === GameState.SKINS && (
          <SkinsStore 
            coins={coins}
            ownedSkins={ownedSkins}
            activeSkinId={activeSkinId}
            onSelect={selectSkin}
            onPurchase={purchaseSkin}
            onBack={() => setGameState(GameState.MENU)}
          />
        )}
      </div>
    </div>
  );
};

export default App;