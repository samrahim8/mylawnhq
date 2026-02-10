"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// Types
type GameState = "start" | "select" | "playing" | "results";
type Difficulty = "starter" | "suburban" | "hoa" | "abandoned";

interface Position {
  x: number;
  y: number;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "sprinkler" | "poop" | "bicycle" | "gnome" | "hose" | "tree" | "flowerbed";
}

interface PowerUp {
  x: number;
  y: number;
  type: "time" | "speed" | "wide";
  collected: boolean;
}

interface YardConfig {
  name: string;
  description: string;
  difficulty: string;
  gridWidth: number;
  gridHeight: number;
  timeLimit: number;
  obstacles: Obstacle[];
  randomize?: boolean;
}

// Yard configurations
const YARDS: Record<Difficulty, YardConfig> = {
  starter: {
    name: "The Starter Home",
    description: "Small yard, few obstacles, good for learning",
    difficulty: "Easy",
    gridWidth: 20,
    gridHeight: 15,
    timeLimit: 45,
    obstacles: [
      { x: 5, y: 5, width: 2, height: 2, type: "tree" },
      { x: 14, y: 10, width: 1, height: 1, type: "gnome" },
      { x: 10, y: 7, width: 1, height: 1, type: "sprinkler" },
    ],
  },
  suburban: {
    name: "The Suburban Spread",
    description: "Bigger yard, more obstacles",
    difficulty: "Medium",
    gridWidth: 25,
    gridHeight: 18,
    timeLimit: 60,
    obstacles: [
      { x: 4, y: 4, width: 2, height: 2, type: "tree" },
      { x: 18, y: 12, width: 2, height: 2, type: "tree" },
      { x: 10, y: 3, width: 3, height: 2, type: "flowerbed" },
      { x: 8, y: 10, width: 2, height: 1, type: "bicycle" },
      { x: 15, y: 7, width: 1, height: 1, type: "gnome" },
      { x: 20, y: 5, width: 1, height: 1, type: "sprinkler" },
      { x: 6, y: 14, width: 1, height: 1, type: "poop" },
      { x: 12, y: 8, width: 3, height: 1, type: "hose" },
    ],
  },
  hoa: {
    name: "The HOA Nightmare",
    description: "Huge yard, tons of obstacles, tight time limit",
    difficulty: "Hard",
    gridWidth: 30,
    gridHeight: 22,
    timeLimit: 75,
    obstacles: [
      { x: 3, y: 3, width: 2, height: 2, type: "tree" },
      { x: 25, y: 3, width: 2, height: 2, type: "tree" },
      { x: 14, y: 18, width: 2, height: 2, type: "tree" },
      { x: 8, y: 2, width: 4, height: 2, type: "flowerbed" },
      { x: 20, y: 10, width: 3, height: 2, type: "flowerbed" },
      { x: 5, y: 12, width: 2, height: 1, type: "bicycle" },
      { x: 18, y: 6, width: 2, height: 1, type: "bicycle" },
      { x: 10, y: 10, width: 1, height: 1, type: "gnome" },
      { x: 22, y: 15, width: 1, height: 1, type: "gnome" },
      { x: 7, y: 8, width: 1, height: 1, type: "gnome" },
      { x: 12, y: 5, width: 1, height: 1, type: "sprinkler" },
      { x: 24, y: 18, width: 1, height: 1, type: "sprinkler" },
      { x: 3, y: 17, width: 1, height: 1, type: "poop" },
      { x: 16, y: 14, width: 1, height: 1, type: "poop" },
      { x: 27, y: 8, width: 1, height: 1, type: "poop" },
      { x: 10, y: 15, width: 4, height: 1, type: "hose" },
      { x: 5, y: 6, width: 3, height: 1, type: "hose" },
    ],
  },
  abandoned: {
    name: "The Abandoned Lot",
    description: "Overgrown chaos, random obstacles every time",
    difficulty: "Hard+",
    gridWidth: 28,
    gridHeight: 20,
    timeLimit: 70,
    obstacles: [],
    randomize: true,
  },
};

// Utility functions
function generateRandomObstacles(width: number, height: number): Obstacle[] {
  const obstacles: Obstacle[] = [];
  const types: Obstacle["type"][] = ["tree", "flowerbed", "bicycle", "gnome", "sprinkler", "poop", "hose"];

  // Add 2-3 trees
  for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
    obstacles.push({
      x: 2 + Math.floor(Math.random() * (width - 6)),
      y: 2 + Math.floor(Math.random() * (height - 6)),
      width: 2,
      height: 2,
      type: "tree",
    });
  }

  // Add 1-2 flowerbeds
  for (let i = 0; i < 1 + Math.floor(Math.random() * 2); i++) {
    obstacles.push({
      x: 2 + Math.floor(Math.random() * (width - 6)),
      y: 2 + Math.floor(Math.random() * (height - 5)),
      width: 3 + Math.floor(Math.random() * 2),
      height: 2,
      type: "flowerbed",
    });
  }

  // Add random smaller obstacles
  const smallTypes: Obstacle["type"][] = ["bicycle", "gnome", "sprinkler", "poop", "hose"];
  for (let i = 0; i < 8 + Math.floor(Math.random() * 5); i++) {
    const type = smallTypes[Math.floor(Math.random() * smallTypes.length)];
    obstacles.push({
      x: 1 + Math.floor(Math.random() * (width - 4)),
      y: 1 + Math.floor(Math.random() * (height - 4)),
      width: type === "hose" ? 3 + Math.floor(Math.random() * 2) : type === "bicycle" ? 2 : 1,
      height: 1,
      type,
    });
  }

  return obstacles;
}

function getScoreTier(percent: number): { title: string; message: string } {
  if (percent === 100) return { title: "Turf God", message: "Flawless. Every blade. The yard has never looked this good. You are the neighborhood legend." };
  if (percent >= 91) return { title: "Precision Machine", message: "You missed a sliver. It's going to bother you. Play again." };
  if (percent >= 76) return { title: "Clean Cut", message: "The yard looks good. The neighbors are impressed. One of them might ask for your number." };
  if (percent >= 51) return { title: "Getting There", message: "Respectable. A few missed spots but the HOA won't fine you. Probably." };
  if (percent >= 26) return { title: "Half-Assed", message: "Literally. You mowed half. The other half is judging you." };
  return { title: "Did You Even Start?", message: "The neighbors are talking. And not in a good way." };
}

// Game Component
export default function MowTownGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("start");
  const [selectedYard, setSelectedYard] = useState<Difficulty>("starter");
  const [timeLeft, setTimeLeft] = useState(60);
  const [percentMowed, setPercentMowed] = useState(0);
  const [hitCount, setHitCount] = useState(0);
  const [finalPattern, setFinalPattern] = useState<string | null>(null);

  // Game state refs (for animation loop)
  const gameStateRef = useRef({
    mower: { x: 1, y: 1, angle: 0, speed: 0.08 },
    targetAngle: 0,
    grass: [] as boolean[][],
    obstacles: [] as Obstacle[],
    powerUps: [] as PowerUp[],
    timeLeft: 60,
    speedBoost: false,
    speedBoostTimer: 0,
    widecut: false,
    widecutTimer: 0,
    stunned: false,
    stunnedTimer: 0,
    lastHitTime: 0,
    totalGrass: 0,
    cutGrass: 0,
    hits: 0,
  });

  const keysPressed = useRef<Set<string>>(new Set());
  const touchTarget = useRef<Position | null>(null);
  const animationFrame = useRef<number>();
  const lastTime = useRef<number>(0);

  // Cell size based on canvas
  const CELL_SIZE = 24;

  // Initialize game
  const initGame = useCallback((difficulty: Difficulty) => {
    const yard = YARDS[difficulty];
    const obstacles = yard.randomize ? generateRandomObstacles(yard.gridWidth, yard.gridHeight) : [...yard.obstacles];

    // Initialize grass grid
    const grass: boolean[][] = [];
    let totalGrass = 0;

    for (let y = 0; y < yard.gridHeight; y++) {
      grass[y] = [];
      for (let x = 0; x < yard.gridWidth; x++) {
        // Check if this cell is an obstacle
        const isObstacle = obstacles.some(
          (obs) => x >= obs.x && x < obs.x + obs.width && y >= obs.y && y < obs.y + obs.height
        );
        grass[y][x] = !isObstacle; // true = uncut grass, false = no grass (obstacle)
        if (!isObstacle) totalGrass++;
      }
    }

    // Generate power-ups
    const powerUps: PowerUp[] = [];
    const powerUpTypes: PowerUp["type"][] = ["time", "speed", "wide"];
    for (let i = 0; i < 5; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * yard.gridWidth);
        y = Math.floor(Math.random() * yard.gridHeight);
      } while (!grass[y][x] || (x < 3 && y < 3)); // Don't place on obstacles or near start

      powerUps.push({
        x,
        y,
        type: powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)],
        collected: false,
      });
    }

    gameStateRef.current = {
      mower: { x: 1, y: 1, angle: 0, speed: 0.08 },
      targetAngle: 0,
      grass,
      obstacles,
      powerUps,
      timeLeft: yard.timeLimit,
      speedBoost: false,
      speedBoostTimer: 0,
      widecut: false,
      widecutTimer: 0,
      stunned: false,
      stunnedTimer: 0,
      lastHitTime: 0,
      totalGrass,
      cutGrass: 0,
      hits: 0,
    };

    setTimeLeft(yard.timeLimit);
    setPercentMowed(0);
    setHitCount(0);
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Handle touch input
  const handleTouch = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    touchTarget.current = {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    };
  }, [gameState]);

  const handleTouchEnd = useCallback(() => {
    touchTarget.current = null;
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const yard = YARDS[selectedYard];
    canvas.width = yard.gridWidth * CELL_SIZE;
    canvas.height = yard.gridHeight * CELL_SIZE;

    let timerInterval: NodeJS.Timeout;

    const gameLoop = (timestamp: number) => {
      const delta = timestamp - lastTime.current;
      lastTime.current = timestamp;

      const state = gameStateRef.current;

      // Handle input
      let dx = 0, dy = 0;

      if (keysPressed.current.has("arrowup") || keysPressed.current.has("w")) dy -= 1;
      if (keysPressed.current.has("arrowdown") || keysPressed.current.has("s")) dy += 1;
      if (keysPressed.current.has("arrowleft") || keysPressed.current.has("a")) dx -= 1;
      if (keysPressed.current.has("arrowright") || keysPressed.current.has("d")) dx += 1;

      // Touch input
      if (touchTarget.current) {
        const targetX = touchTarget.current.x * yard.gridWidth;
        const targetY = touchTarget.current.y * yard.gridHeight;
        dx = targetX - state.mower.x;
        dy = targetY - state.mower.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0.5) {
          dx /= dist;
          dy /= dist;
        } else {
          dx = 0;
          dy = 0;
        }
      }

      // Update mower
      if (!state.stunned && (dx !== 0 || dy !== 0)) {
        state.targetAngle = Math.atan2(dy, dx);

        // Smooth rotation
        let angleDiff = state.targetAngle - state.mower.angle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        state.mower.angle += angleDiff * 0.15;

        // Move mower
        const speed = state.speedBoost ? state.mower.speed * 2 : state.mower.speed;
        const newX = state.mower.x + Math.cos(state.mower.angle) * speed * (delta / 16);
        const newY = state.mower.y + Math.sin(state.mower.angle) * speed * (delta / 16);

        // Boundary check
        if (newX >= 0.5 && newX < yard.gridWidth - 0.5) state.mower.x = newX;
        if (newY >= 0.5 && newY < yard.gridHeight - 0.5) state.mower.y = newY;

        // Cut grass
        const mowWidth = state.widecut ? 1.5 : 0.7;
        for (let oy = -Math.ceil(mowWidth); oy <= Math.ceil(mowWidth); oy++) {
          for (let ox = -Math.ceil(mowWidth); ox <= Math.ceil(mowWidth); ox++) {
            const gx = Math.floor(state.mower.x + ox * 0.5);
            const gy = Math.floor(state.mower.y + oy * 0.5);
            if (gx >= 0 && gx < yard.gridWidth && gy >= 0 && gy < yard.gridHeight) {
              if (state.grass[gy][gx] === true) {
                // Check if it's a flowerbed
                const hitFlowerbed = state.obstacles.some(
                  (obs) => obs.type === "flowerbed" && gx >= obs.x && gx < obs.x + obs.width && gy >= obs.y && gy < obs.y + obs.height
                );
                if (!hitFlowerbed) {
                  state.grass[gy][gx] = false;
                  state.cutGrass++;
                }
              }
            }
          }
        }

        // Collision detection
        const now = Date.now();
        if (now - state.lastHitTime > 1500) {
          for (const obs of state.obstacles) {
            if (
              state.mower.x >= obs.x - 0.3 &&
              state.mower.x < obs.x + obs.width + 0.3 &&
              state.mower.y >= obs.y - 0.3 &&
              state.mower.y < obs.y + obs.height + 0.3
            ) {
              state.lastHitTime = now;
              state.hits++;
              setHitCount(state.hits);

              if (obs.type === "poop") {
                // Slow down instead of stun
                state.speedBoost = false;
                state.mower.speed = 0.04;
                setTimeout(() => {
                  gameStateRef.current.mower.speed = 0.08;
                }, 2000);
              } else if (obs.type === "flowerbed") {
                state.timeLeft -= 5;
                setTimeLeft(Math.max(0, state.timeLeft));
              } else {
                state.stunned = true;
                state.stunnedTimer = 1000;
                state.timeLeft -= 3;
                setTimeLeft(Math.max(0, state.timeLeft));
              }
              break;
            }
          }
        }

        // Power-up collection
        for (const pu of state.powerUps) {
          if (!pu.collected && Math.abs(state.mower.x - pu.x - 0.5) < 0.8 && Math.abs(state.mower.y - pu.y - 0.5) < 0.8) {
            pu.collected = true;
            if (pu.type === "time") {
              state.timeLeft += 5;
              setTimeLeft(state.timeLeft);
            } else if (pu.type === "speed") {
              state.speedBoost = true;
              state.speedBoostTimer = 5000;
            } else if (pu.type === "wide") {
              state.widecut = true;
              state.widecutTimer = 5000;
            }
          }
        }
      }

      // Update timers
      if (state.stunned) {
        state.stunnedTimer -= delta;
        if (state.stunnedTimer <= 0) state.stunned = false;
      }
      if (state.speedBoost) {
        state.speedBoostTimer -= delta;
        if (state.speedBoostTimer <= 0) state.speedBoost = false;
      }
      if (state.widecut) {
        state.widecutTimer -= delta;
        if (state.widecutTimer <= 0) state.widecut = false;
      }

      // Update percentage
      const percent = Math.round((state.cutGrass / state.totalGrass) * 100);
      setPercentMowed(percent);

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grass
      for (let y = 0; y < yard.gridHeight; y++) {
        for (let x = 0; x < yard.gridWidth; x++) {
          const isObstacle = state.obstacles.some(
            (obs) => x >= obs.x && x < obs.x + obs.width && y >= obs.y && y < obs.y + obs.height
          );

          if (!isObstacle) {
            if (state.grass[y][x]) {
              // Uncut grass - darker, wilder
              ctx.fillStyle = "#4a7c3f";
              ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
              // Add texture
              ctx.fillStyle = "#3d6b34";
              for (let i = 0; i < 3; i++) {
                const tx = x * CELL_SIZE + Math.random() * CELL_SIZE;
                const ty = y * CELL_SIZE + Math.random() * CELL_SIZE;
                ctx.fillRect(tx, ty, 2, 4);
              }
            } else {
              // Cut grass - lighter, striped
              const stripe = (x + y) % 2 === 0;
              ctx.fillStyle = stripe ? "#7cb668" : "#8bc77a";
              ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
          }
        }
      }

      // Draw obstacles
      for (const obs of state.obstacles) {
        ctx.save();
        const ox = obs.x * CELL_SIZE;
        const oy = obs.y * CELL_SIZE;
        const ow = obs.width * CELL_SIZE;
        const oh = obs.height * CELL_SIZE;

        switch (obs.type) {
          case "tree":
            // Trunk
            ctx.fillStyle = "#8B4513";
            ctx.fillRect(ox + ow * 0.35, oy + oh * 0.5, ow * 0.3, oh * 0.5);
            // Foliage
            ctx.fillStyle = "#2d5a27";
            ctx.beginPath();
            ctx.arc(ox + ow / 2, oy + oh * 0.35, ow * 0.45, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#3d7a37";
            ctx.beginPath();
            ctx.arc(ox + ow / 2, oy + oh * 0.3, ow * 0.35, 0, Math.PI * 2);
            ctx.fill();
            break;
          case "flowerbed":
            ctx.fillStyle = "#5c4033";
            ctx.fillRect(ox + 2, oy + 2, ow - 4, oh - 4);
            // Flowers
            const colors = ["#ff6b6b", "#ffd93d", "#ff8fd0", "#fff"];
            for (let i = 0; i < 6; i++) {
              ctx.fillStyle = colors[i % colors.length];
              ctx.beginPath();
              ctx.arc(ox + 8 + (i % 3) * 16, oy + 8 + Math.floor(i / 3) * 14, 5, 0, Math.PI * 2);
              ctx.fill();
            }
            break;
          case "bicycle":
            ctx.fillStyle = "#e74c3c";
            ctx.fillRect(ox + 4, oy + 4, ow - 8, oh - 8);
            ctx.fillStyle = "#333";
            ctx.beginPath();
            ctx.arc(ox + 8, oy + oh / 2, 6, 0, Math.PI * 2);
            ctx.arc(ox + ow - 8, oy + oh / 2, 6, 0, Math.PI * 2);
            ctx.fill();
            break;
          case "gnome":
            // Body
            ctx.fillStyle = "#e74c3c";
            ctx.beginPath();
            ctx.arc(ox + ow / 2, oy + oh * 0.6, 8, 0, Math.PI * 2);
            ctx.fill();
            // Hat
            ctx.fillStyle = "#c0392b";
            ctx.beginPath();
            ctx.moveTo(ox + ow / 2, oy + 2);
            ctx.lineTo(ox + ow / 2 - 8, oy + oh * 0.45);
            ctx.lineTo(ox + ow / 2 + 8, oy + oh * 0.45);
            ctx.fill();
            // Face
            ctx.fillStyle = "#fdbf6f";
            ctx.beginPath();
            ctx.arc(ox + ow / 2, oy + oh * 0.45, 5, 0, Math.PI * 2);
            ctx.fill();
            break;
          case "sprinkler":
            ctx.fillStyle = "#666";
            ctx.beginPath();
            ctx.arc(ox + ow / 2, oy + oh / 2, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#3498db";
            ctx.fillRect(ox + ow / 2 - 2, oy + 2, 4, 8);
            break;
          case "poop":
            ctx.fillStyle = "#6b4423";
            ctx.beginPath();
            ctx.arc(ox + ow / 2, oy + oh / 2 + 3, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(ox + ow / 2, oy + oh / 2 - 2, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(ox + ow / 2, oy + oh / 2 - 6, 3, 0, Math.PI * 2);
            ctx.fill();
            break;
          case "hose":
            ctx.strokeStyle = "#27ae60";
            ctx.lineWidth = 6;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(ox + 4, oy + oh / 2);
            ctx.bezierCurveTo(
              ox + ow * 0.3, oy + oh * 0.2,
              ox + ow * 0.7, oy + oh * 0.8,
              ox + ow - 4, oy + oh / 2
            );
            ctx.stroke();
            break;
        }
        ctx.restore();
      }

      // Draw power-ups
      for (const pu of state.powerUps) {
        if (pu.collected) continue;
        const px = pu.x * CELL_SIZE + CELL_SIZE / 2;
        const py = pu.y * CELL_SIZE + CELL_SIZE / 2;

        // Glow
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.beginPath();
        ctx.arc(px, py, 14, 0, Math.PI * 2);
        ctx.fill();

        // Icon
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (pu.type === "time") ctx.fillText("⏱", px, py);
        else if (pu.type === "speed") ctx.fillText("⚡", px, py);
        else if (pu.type === "wide") ctx.fillText("📏", px, py);
      }

      // Draw mower
      ctx.save();
      const mx = state.mower.x * CELL_SIZE;
      const my = state.mower.y * CELL_SIZE;
      ctx.translate(mx, my);
      ctx.rotate(state.mower.angle);

      // Mower body
      if (state.stunned) {
        ctx.fillStyle = "#ff6b6b";
      } else if (state.speedBoost) {
        ctx.fillStyle = "#f1c40f";
      } else if (state.widecut) {
        ctx.fillStyle = "#9b59b6";
      } else {
        ctx.fillStyle = "#c0392b";
      }
      ctx.fillRect(-12, -8, 24, 16);

      // Handle
      ctx.fillStyle = "#333";
      ctx.fillRect(-16, -3, 6, 6);

      // Wheels
      ctx.fillStyle = "#222";
      ctx.fillRect(6, -10, 6, 4);
      ctx.fillRect(6, 6, 6, 4);

      // Direction indicator
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(4, -4);
      ctx.lineTo(4, 4);
      ctx.fill();

      ctx.restore();

      // Continue loop
      if (state.timeLeft > 0) {
        animationFrame.current = requestAnimationFrame(gameLoop);
      }
    };

    // Timer
    timerInterval = setInterval(() => {
      gameStateRef.current.timeLeft -= 1;
      setTimeLeft(gameStateRef.current.timeLeft);

      if (gameStateRef.current.timeLeft <= 0) {
        // Game over
        clearInterval(timerInterval);
        if (animationFrame.current) cancelAnimationFrame(animationFrame.current);

        // Capture final pattern
        const canvas = canvasRef.current;
        if (canvas) {
          setFinalPattern(canvas.toDataURL());
        }

        setGameState("results");
      }
    }, 1000);

    animationFrame.current = requestAnimationFrame(gameLoop);

    return () => {
      clearInterval(timerInterval);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [gameState, selectedYard]);

  // Start screen
  if (gameState === "start") {
    return (
      <div className="min-h-dvh bg-[#2d5a27] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <div className="text-6xl mb-4">🚜</div>
          <h1 className="font-display text-5xl font-bold text-white mb-3 tracking-tight">MOW TOWN</h1>
          <p className="text-xl text-white/80 mb-8">Mow the yard. Dodge the junk. Beat the clock.</p>
          <button
            onClick={() => setGameState("select")}
            className="bg-[#c17f59] hover:bg-[#a66b48] text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors shadow-lg"
          >
            Start Mowing
          </button>
        </div>

        <div className="mt-12 text-white/60 text-sm">
          <p>Desktop: Arrow keys or WASD to steer</p>
          <p>Mobile: Tap and hold to steer toward your finger</p>
        </div>
      </div>
    );
  }

  // Yard selection
  if (gameState === "select") {
    return (
      <div className="min-h-dvh bg-[#2d5a27] flex flex-col items-center justify-center p-6">
        <h2 className="font-display text-3xl font-bold text-white mb-8">Pick Your Yard</h2>

        <div className="grid gap-4 max-w-lg w-full">
          {(Object.entries(YARDS) as [Difficulty, YardConfig][]).map(([key, yard]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedYard(key);
                initGame(key);
                setGameState("playing");
              }}
              className="bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 rounded-xl p-4 text-left transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white text-lg">{yard.name}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  yard.difficulty === "Easy" ? "bg-green-500/20 text-green-300" :
                  yard.difficulty === "Medium" ? "bg-yellow-500/20 text-yellow-300" :
                  "bg-red-500/20 text-red-300"
                }`}>
                  {yard.difficulty}
                </span>
              </div>
              <p className="text-white/70 text-sm">{yard.description}</p>
              <p className="text-white/50 text-xs mt-2">{yard.timeLimit} seconds</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => setGameState("start")}
          className="mt-8 text-white/60 hover:text-white/80 text-sm"
        >
          ← Back
        </button>
      </div>
    );
  }

  // Results screen
  if (gameState === "results") {
    const tier = getScoreTier(percentMowed);
    const shareText = `I mowed ${percentMowed}% of the yard in Mow Town 🌱`;

    return (
      <div className="min-h-dvh bg-[#2d5a27] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full">
          {/* Score */}
          <div className="text-7xl font-bold text-white mb-2">{percentMowed}%</div>
          <p className="text-white/60 mb-6">of the yard mowed</p>

          {/* Tier */}
          <div className="bg-white/10 rounded-xl p-6 mb-6">
            <h3 className="font-display text-2xl font-bold text-[#f1c40f] mb-2">{tier.title}</h3>
            <p className="text-white/80">{tier.message}</p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 mb-6 text-white/70 text-sm">
            <div>💥 {hitCount} hits</div>
            <div>⏱ {YARDS[selectedYard].timeLimit}s</div>
          </div>

          {/* Pattern preview */}
          {finalPattern && (
            <div className="mb-6">
              <img src={finalPattern} alt="Your mow pattern" className="w-full rounded-xl border-2 border-white/20" />
            </div>
          )}

          {/* Share */}
          <div className="flex gap-3 justify-center mb-6">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent("https://mylawnhq-theta.vercel.app/sandbox/game")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1da1f2] hover:bg-[#1a8cd8] text-white font-medium px-4 py-2 rounded-lg text-sm"
            >
              Share on X
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${shareText} https://mylawnhq-theta.vercel.app/sandbox/game`);
              }}
              className="bg-white/20 hover:bg-white/30 text-white font-medium px-4 py-2 rounded-lg text-sm"
            >
              Copy Link
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                initGame(selectedYard);
                setGameState("playing");
              }}
              className="bg-[#c17f59] hover:bg-[#a66b48] text-white font-bold px-6 py-3 rounded-xl"
            >
              Mow Again
            </button>
            <button
              onClick={() => setGameState("select")}
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 rounded-xl"
            >
              New Yard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing
  return (
    <div className="min-h-dvh bg-[#1a3d15] flex flex-col items-center justify-center p-2 sm:p-4">
      {/* HUD */}
      <div className="w-full max-w-3xl flex items-center justify-between mb-2 px-2">
        <div className="bg-white/10 rounded-lg px-3 py-1.5">
          <span className="text-white/60 text-xs">Mowed</span>
          <span className="text-white font-bold text-lg ml-2">{percentMowed}%</span>
        </div>

        <div className={`bg-white/10 rounded-lg px-3 py-1.5 ${timeLeft <= 10 ? "animate-pulse bg-red-500/30" : ""}`}>
          <span className="text-white/60 text-xs">Time</span>
          <span className={`font-bold text-lg ml-2 ${timeLeft <= 10 ? "text-red-400" : "text-white"}`}>{timeLeft}s</span>
        </div>

        <div className="bg-white/10 rounded-lg px-3 py-1.5">
          <span className="text-white/60 text-xs">Hits</span>
          <span className="text-white font-bold text-lg ml-2">💥 {hitCount}</span>
        </div>
      </div>

      {/* Game canvas */}
      <div
        className="relative bg-[#4a7c3f] rounded-xl overflow-hidden shadow-2xl border-4 border-[#2d5a27] touch-none"
        onMouseDown={handleTouch}
        onMouseMove={(e) => e.buttons === 1 && handleTouch(e)}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onTouchStart={handleTouch}
        onTouchMove={handleTouch}
        onTouchEnd={handleTouchEnd}
      >
        <canvas ref={canvasRef} className="block" />

        {/* Power-up indicators */}
        <div className="absolute top-2 left-2 flex gap-2">
          {gameStateRef.current.speedBoost && (
            <div className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded animate-pulse">⚡ SPEED</div>
          )}
          {gameStateRef.current.widecut && (
            <div className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">📏 WIDE</div>
          )}
        </div>
      </div>

      {/* Mobile controls hint */}
      <p className="text-white/40 text-xs mt-3 lg:hidden">Tap and drag to steer the mower</p>
      <p className="text-white/40 text-xs mt-3 hidden lg:block">Use arrow keys or WASD to steer</p>
    </div>
  );
}
