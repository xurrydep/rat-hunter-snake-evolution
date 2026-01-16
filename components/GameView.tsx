
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Direction, Point, FoodItem, ItemType, Skin } from '../types';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT, SCORES, COLORS, GROWTH } from '../constants';

interface GameViewProps {
  onGameOver: (score: number) => void;
  activeSkin: Skin;
}

const GameView: React.FC<GameViewProps> = ({ onGameOver, activeSkin }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const directionRef = useRef<Direction>(Direction.UP);
  const nextDirectionRef = useRef<Direction>(Direction.UP);
  const foodRef = useRef<FoodItem[]>([]);
  const eatenCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  
  const initialInterval = INITIAL_SPEED - (activeSkin.stats.speedMod || 0);
  const speedRef = useRef<number>(initialInterval);
  
  const gameActiveRef = useRef<boolean>(true);
  const scoreRef = useRef<number>(0);

  useEffect(() => {
    spawnFood(ItemType.MOUSE);
    const storedHS = localStorage.getItem('rat_hunter_hs');
    if (storedHS) setHighScore(parseInt(storedHS));
  }, []);

  const getRandomPos = (): Point => {
    let pos: Point;
    let isOccupied: boolean;
    do {
      pos = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      isOccupied = snakeRef.current.some(segment => segment.x === pos.x && segment.y === pos.y) ||
                   foodRef.current.some(f => f.pos.x === pos.x && f.pos.y === pos.y);
    } while (isOccupied);
    return pos;
  };

  const spawnFood = (type: ItemType) => {
    const newFood: FoodItem = {
      pos: getRandomPos(),
      type
    };
    foodRef.current = [...foodRef.current, newFood];
  };

  const endGame = useCallback(() => {
    if (!gameActiveRef.current) return;
    gameActiveRef.current = false;
    onGameOver(scoreRef.current);
  }, [onGameOver]);

  const moveSnake = useCallback(() => {
    const head = { ...snakeRef.current[0] };
    directionRef.current = nextDirectionRef.current;

    switch (directionRef.current) {
      case Direction.UP: head.y -= 1; break;
      case Direction.DOWN: head.y += 1; break;
      case Direction.LEFT: head.x -= 1; break;
      case Direction.RIGHT: head.x += 1; break;
    }

    head.x = (head.x + GRID_SIZE) % GRID_SIZE;
    head.y = (head.y + GRID_SIZE) % GRID_SIZE;

    if (snakeRef.current.some(segment => segment.x === head.x && segment.y === head.y)) {
      return endGame();
    }

    const newSnake = [head, ...snakeRef.current];
    const foodIndex = foodRef.current.findIndex(f => f.pos.x === head.x && f.pos.y === head.y);
    
    if (foodIndex !== -1) {
      const eaten = foodRef.current[foodIndex];
      foodRef.current = foodRef.current.filter((_, i) => i !== foodIndex);
      
      let scoreDelta = SCORES[eaten.type];
      if (eaten.type !== ItemType.POISON) {
          scoreDelta = Math.ceil(scoreDelta * (activeSkin.stats.scoreMod || 1));
      } else {
          scoreDelta = Math.ceil(scoreDelta * (activeSkin.stats.poisonResist || 1));
      }

      let growthDelta = GROWTH[eaten.type];
      if (growthDelta > 0) {
          growthDelta = Math.max(1, Math.round(growthDelta * (activeSkin.stats.growthMod || 1)));
      } else {
          growthDelta = Math.round(growthDelta * (activeSkin.stats.poisonResist || 1));
      }

      scoreRef.current = Math.max(0, scoreRef.current + scoreDelta);
      setScore(scoreRef.current);

      if (scoreRef.current > highScore) {
        setHighScore(scoreRef.current);
        localStorage.setItem('rat_hunter_hs', scoreRef.current.toString());
      }

      if (growthDelta > 0) {
        for(let i=0; i < growthDelta - 1; i++) {
          newSnake.push({...snakeRef.current[snakeRef.current.length - 1]});
        }
      } else if (growthDelta < 0) {
        const shrinkAmount = Math.abs(growthDelta) + 1;
        for(let i=0; i < shrinkAmount; i++) {
            if (newSnake.length > 2) newSnake.pop();
        }
      }

      if (eaten.type === ItemType.MOUSE || eaten.type === ItemType.BIG_MOUSE) {
        eatenCountRef.current += 1;
        spawnFood(ItemType.MOUSE);

        if (eatenCountRef.current % 10 === 0) {
          spawnFood(ItemType.BIG_MOUSE);
        }

        if (Math.random() < 0.15) {
          spawnFood(ItemType.POISON);
        }

        speedRef.current = Math.max(MIN_SPEED, speedRef.current - SPEED_INCREMENT);
      }
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
  }, [highScore, endGame, activeSkin]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    ctx.fillStyle = COLORS.GRID;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    foodRef.current.forEach(item => {
      ctx.beginPath();
      const centerX = item.pos.x * cellSize + cellSize / 2;
      const centerY = item.pos.y * cellSize + cellSize / 2;
      
      if (item.type === ItemType.MOUSE) {
        ctx.fillStyle = COLORS.MOUSE;
        ctx.arc(centerX, centerY, cellSize / 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.arc(centerX - cellSize/6, centerY - cellSize/6, cellSize/8, 0, Math.PI * 2);
        ctx.fill();
        ctx.arc(centerX + cellSize/6, centerY - cellSize/6, cellSize/8, 0, Math.PI * 2);
        ctx.fill();
      } else if (item.type === ItemType.BIG_MOUSE) {
        ctx.fillStyle = COLORS.BIG_MOUSE;
        ctx.moveTo(centerX, centerY - cellSize/2.5);
        ctx.lineTo(centerX - cellSize/2.5, centerY + cellSize/2.5);
        ctx.lineTo(centerX + cellSize/2.5, centerY + cellSize/2.5);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = COLORS.POISON;
        ctx.fillRect(centerX - cellSize/4, centerY - cellSize/4, cellSize/2, cellSize/2);
        ctx.arc(centerX, centerY - cellSize/6, cellSize/4, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    snakeRef.current.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? activeSkin.headColor : activeSkin.bodyColor;
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;
      
      const radius = cellSize / 4;
      ctx.beginPath();
      ctx.roundRect(x + 1, y + 1, cellSize - 2, cellSize - 2, radius);
      ctx.fill();

      if (index === 0) {
        ctx.fillStyle = 'white';
        let eye1 = {x: 0, y: 0}, eye2 = {x: 0, y: 0};
        const eyeSize = cellSize / 8;
        const offset = cellSize / 4;

        if (directionRef.current === Direction.UP) {
          eye1 = {x: x + offset, y: y + offset};
          eye2 = {x: x + cellSize - offset, y: y + offset};
        } else if (directionRef.current === Direction.DOWN) {
          eye1 = {x: x + offset, y: y + cellSize - offset};
          eye2 = {x: x + cellSize - offset, y: y + cellSize - offset};
        } else if (directionRef.current === Direction.LEFT) {
          eye1 = {x: x + offset, y: y + offset};
          eye2 = {x: x + offset, y: y + cellSize - offset};
        } else {
          eye1 = {x: x + cellSize - offset, y: y + offset};
          eye2 = {x: x + cellSize - offset, y: y + cellSize - offset};
        }
        ctx.beginPath();
        ctx.arc(eye1.x, eye1.y, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eye2.x, eye2.y, eyeSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, [activeSkin]);

  const gameLoop = useCallback((time: number) => {
    if (!gameActiveRef.current) return;

    if (time - lastTimeRef.current > speedRef.current) {
      moveSnake();
      draw();
      lastTimeRef.current = time;
    }

    requestAnimationFrame(gameLoop);
  }, [moveSnake, draw]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      const d = directionRef.current;
      if ((e.key === 'ArrowUp' || e.key === 'w') && d !== Direction.DOWN) nextDirectionRef.current = Direction.UP;
      if ((e.key === 'ArrowDown' || e.key === 's') && d !== Direction.UP) nextDirectionRef.current = Direction.DOWN;
      if ((e.key === 'ArrowLeft' || e.key === 'a') && d !== Direction.RIGHT) nextDirectionRef.current = Direction.LEFT;
      if ((e.key === 'ArrowRight' || e.key === 'd') && d !== Direction.LEFT) nextDirectionRef.current = Direction.RIGHT;
    };

    window.addEventListener('keydown', handleKeydown);
    const animationId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
      cancelAnimationFrame(animationId);
    };
  }, [gameLoop]);

  const touchStart = useRef<Point | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const dx = touchEnd.x - touchStart.current.x;
    const dy = touchEnd.y - touchStart.current.y;
    const d = directionRef.current;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30 && d !== Direction.LEFT) nextDirectionRef.current = Direction.RIGHT;
      else if (dx < -30 && d !== Direction.RIGHT) nextDirectionRef.current = Direction.LEFT;
    } else {
      if (dy > 30 && d !== Direction.UP) nextDirectionRef.current = Direction.DOWN;
      else if (dy < -30 && d !== Direction.DOWN) nextDirectionRef.current = Direction.UP;
    }
  };

  return (
    <div className="flex flex-col items-center w-full gap-4 touch-none" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="flex justify-between w-full px-4 font-game">
        <div className="flex flex-col">
          <span className="text-slate-400 text-xs uppercase tracking-tighter">Score</span>
          <span className="text-3xl text-white">{score}</span>
        </div>
        <div className="flex flex-col items-center">
            <span className="text-blue-400 text-[10px] uppercase font-bold">{activeSkin.name}</span>
            {activeSkin.stats.scoreMod && <span className="text-green-500 text-[8px] font-black">x{activeSkin.stats.scoreMod} POINTS</span>}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-slate-400 text-xs uppercase tracking-tighter">High Score</span>
          <span className="text-3xl text-amber-500">{highScore}</span>
        </div>
      </div>

      <div className="relative p-2 bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border-4 border-slate-700">
        <canvas 
          ref={canvasRef} 
          width={window.innerWidth < 450 ? window.innerWidth - 60 : 400} 
          height={window.innerWidth < 450 ? window.innerWidth - 60 : 400}
          className="rounded-lg"
        />
      </div>

      <div className="flex flex-col items-center gap-2 opacity-40">
        <div className="flex gap-2">
            <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center">W</div>
        </div>
        <div className="flex gap-2">
            <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center">A</div>
            <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center">S</div>
            <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center">D</div>
        </div>
        <p className="text-[10px] uppercase font-bold text-slate-500 mt-2">Or Swipe</p>
      </div>
    </div>
  );
};

export default GameView;
