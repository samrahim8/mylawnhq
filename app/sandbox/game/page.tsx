"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// Types
type GameState = "start" | "select" | "playing" | "results" | "email" | "leaderboard";
type Difficulty = "starter" | "suburban" | "hoa" | "abandoned";

interface LeaderboardEntry {
  id?: string;
  name: string;
  yard: Difficulty;
  percent: number;
  combo: number;
  hits: number;
  created_at?: string;
}

interface JoystickState {
  active: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  dx: number;
  dy: number;
}

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

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
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
  locked?: boolean;
}

// Sound Manager using Web Audio API
class SoundManager {
  private audioContext: AudioContext | null = null;
  private mowerOscillator: OscillatorNode | null = null;
  private mowerGain: GainNode | null = null;
  private initialized = false;
  private muted = false;

  init() {
    if (this.initialized) return;
    try {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.log("Web Audio not supported");
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    // If muting while mower is running, stop it
    if (muted && this.mowerGain) {
      this.mowerGain.gain.setValueAtTime(0, this.audioContext?.currentTime || 0);
    } else if (!muted && this.mowerGain && this.audioContext) {
      this.mowerGain.gain.setValueAtTime(0.08, this.audioContext.currentTime);
    }
  }

  isMuted() {
    return this.muted;
  }

  startMower() {
    if (!this.audioContext) return;
    if (this.mowerOscillator) return;

    // Create oscillator for mower hum
    this.mowerOscillator = this.audioContext.createOscillator();
    this.mowerGain = this.audioContext.createGain();

    this.mowerOscillator.type = "sawtooth";
    this.mowerOscillator.frequency.setValueAtTime(55, this.audioContext.currentTime);
    this.mowerGain.gain.setValueAtTime(this.muted ? 0 : 0.08, this.audioContext.currentTime);

    this.mowerOscillator.connect(this.mowerGain);
    this.mowerGain.connect(this.audioContext.destination);
    this.mowerOscillator.start();
  }

  stopMower() {
    if (this.mowerOscillator) {
      this.mowerOscillator.stop();
      this.mowerOscillator = null;
      this.mowerGain = null;
    }
  }

  adjustMowerPitch(moving: boolean) {
    if (!this.audioContext || !this.mowerOscillator) return;
    const targetFreq = moving ? 75 : 55;
    this.mowerOscillator.frequency.setTargetAtTime(targetFreq, this.audioContext.currentTime, 0.1);
  }

  playGrassCut() {
    if (!this.audioContext || this.muted) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(800 + Math.random() * 400, this.audioContext.currentTime);

    filter.type = "highpass";
    filter.frequency.setValueAtTime(600, this.audioContext.currentTime);

    gain.gain.setValueAtTime(0.02, this.audioContext.currentTime);
    gain.gain.setTargetAtTime(0.001, this.audioContext.currentTime, 0.02);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.05);
  }

  playCollision() {
    if (!this.audioContext || this.muted) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(150, this.audioContext.currentTime);
    osc.frequency.setTargetAtTime(80, this.audioContext.currentTime, 0.1);

    gain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    gain.gain.setTargetAtTime(0, this.audioContext.currentTime, 0.15);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.2);
  }

  playPowerUp() {
    if (!this.audioContext || this.muted) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(400, this.audioContext.currentTime);
    osc.frequency.setTargetAtTime(800, this.audioContext.currentTime, 0.1);

    gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gain.gain.setTargetAtTime(0, this.audioContext.currentTime + 0.15, 0.1);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.25);
  }

  playCombo(level: number) {
    if (!this.audioContext || this.muted) return;

    const baseFreq = 300 + level * 50;

    for (let i = 0; i < 3; i++) {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq * (1 + i * 0.25), this.audioContext.currentTime + i * 0.05);

      gain.gain.setValueAtTime(0, this.audioContext.currentTime + i * 0.05);
      gain.gain.linearRampToValueAtTime(0.08, this.audioContext.currentTime + i * 0.05 + 0.02);
      gain.gain.setTargetAtTime(0, this.audioContext.currentTime + i * 0.05 + 0.05, 0.05);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      osc.start(this.audioContext.currentTime + i * 0.05);
      osc.stop(this.audioContext.currentTime + i * 0.05 + 0.15);
    }
  }

  playGameOver(win: boolean) {
    if (!this.audioContext || this.muted) return;

    const notes = win ? [523, 659, 784, 1047] : [400, 350, 300, 250];

    notes.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.type = win ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, this.audioContext!.currentTime + i * 0.15);

      gain.gain.setValueAtTime(0.1, this.audioContext!.currentTime + i * 0.15);
      gain.gain.setTargetAtTime(0, this.audioContext!.currentTime + i * 0.15 + 0.1, 0.05);

      osc.connect(gain);
      gain.connect(this.audioContext!.destination);
      osc.start(this.audioContext!.currentTime + i * 0.15);
      osc.stop(this.audioContext!.currentTime + i * 0.15 + 0.2);
    });
  }
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
    locked: false,
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
    locked: true,
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
    locked: true,
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
    locked: true,
  },
};

// Utility functions
function generateRandomObstacles(width: number, height: number): Obstacle[] {
  const obstacles: Obstacle[] = [];

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

// Local storage keys
const UNLOCKED_KEY = "mowtown_unlocked";
const EMAIL_KEY = "mowtown_email";
const LEADERBOARD_KEY = "mowtown_leaderboard";
const PLAYER_NAME_KEY = "mowtown_player_name";
const SOUND_ENABLED_KEY = "mowtown_sound_enabled";

// Game Component
export default function MowTownGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const soundManager = useRef<SoundManager>(new SoundManager());
  const [gameState, setGameState] = useState<GameState>("start");
  const [selectedYard, setSelectedYard] = useState<Difficulty>("starter");
  const [timeLeft, setTimeLeft] = useState(60);
  const [percentMowed, setPercentMowed] = useState(0);
  const [hitCount, setHitCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [finalPattern, setFinalPattern] = useState<string | null>(null);
  const [unlockedYards, setUnlockedYards] = useState<Set<Difficulty>>(new Set<Difficulty>(["starter"]));
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pendingYard, setPendingYard] = useState<Difficulty | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [showUnlockPrompt, setShowUnlockPrompt] = useState(false);
  const [showNameInput, setShowNameInput] = useState(true);
  const [nameInput, setNameInput] = useState("");

  // Screen shake state
  const [shake, setShake] = useState({ x: 0, y: 0 });

  // Game state refs (for animation loop)
  const gameStateRef = useRef({
    mower: { x: 1, y: 1, angle: 0, speed: 0.08 },
    targetAngle: 0,
    grass: [] as boolean[][],
    obstacles: [] as Obstacle[],
    powerUps: [] as PowerUp[],
    particles: [] as Particle[],
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
    combo: 0,
    maxCombo: 0,
    lastCutTime: 0,
    isMoving: false,
  });

  const keysPressed = useRef<Set<string>>(new Set());
  const touchTarget = useRef<Position | null>(null);
  const animationFrame = useRef<number>();
  const lastTime = useRef<number>(0);

  // Virtual joystick state
  const [joystick, setJoystick] = useState<JoystickState>({
    active: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    dx: 0,
    dy: 0,
  });
  const joystickRef = useRef<JoystickState>(joystick);
  const [isMobile, setIsMobile] = useState(false);
  const [leaderboardEmail, setLeaderboardEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Cell size based on canvas
  const CELL_SIZE = 24;

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 1024px)").matches || "ontouchstart" in window);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load sound preference from localStorage
  useEffect(() => {
    const savedSound = localStorage.getItem(SOUND_ENABLED_KEY);
    if (savedSound !== null) {
      const enabled = savedSound === "true";
      setSoundEnabled(enabled);
      soundManager.current.setMuted(!enabled);
    }
  }, []);

  // Keep joystick ref in sync
  useEffect(() => {
    joystickRef.current = joystick;
  }, [joystick]);

  // Load unlocked yards and player name from localStorage, fetch global leaderboard
  useEffect(() => {
    const saved = localStorage.getItem(UNLOCKED_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUnlockedYards(new Set(parsed));
      } catch {
        setUnlockedYards(new Set<Difficulty>(["starter"]));
      }
    }

    const savedEmail = localStorage.getItem(EMAIL_KEY);
    if (savedEmail) {
      setEmail(savedEmail);
      setLeaderboardEmail(savedEmail);
    }

    const savedName = localStorage.getItem(PLAYER_NAME_KEY);
    if (savedName) {
      setPlayerName(savedName);
      setNameInput(savedName);
      setShowNameInput(false);
    }

    // Fetch global leaderboard
    fetch("/api/game/leaderboard?limit=50")
      .then((res) => res.json())
      .then((data) => {
        if (data.leaderboard) {
          setLeaderboard(data.leaderboard);
        }
      })
      .catch(console.error);
  }, []);

  // Save score to global leaderboard
  const saveToLeaderboard = useCallback(async (name: string, email: string) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/game/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          yard: selectedYard,
          percent: percentMowed,
          combo: maxCombo,
          hits: hitCount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || "Failed to save score");
        setIsSubmitting(false);
        return false;
      }

      // Save name and email locally
      localStorage.setItem(PLAYER_NAME_KEY, name);
      localStorage.setItem(EMAIL_KEY, email);
      setPlayerName(name);
      setEmail(email);

      // Refresh leaderboard
      const lbRes = await fetch("/api/game/leaderboard?limit=50");
      const lbData = await lbRes.json();
      if (lbData.leaderboard) {
        setLeaderboard(lbData.leaderboard);
      }

      setIsSubmitting(false);
      setShowNameInput(false);
      return true;
    } catch (error) {
      console.error("Leaderboard submit error:", error);
      setSubmitError("Network error. Please try again.");
      setIsSubmitting(false);
      return false;
    }
  }, [selectedYard, percentMowed, maxCombo, hitCount]);

  // Toggle sound
  const toggleSound = useCallback(() => {
    const newEnabled = !soundEnabled;
    setSoundEnabled(newEnabled);
    soundManager.current.setMuted(!newEnabled);
    localStorage.setItem(SOUND_ENABLED_KEY, String(newEnabled));
  }, [soundEnabled]);

  // Trigger screen shake
  const triggerShake = useCallback((intensity: number = 8) => {
    let shakeCount = 0;
    const shakeInterval = setInterval(() => {
      if (shakeCount >= 6) {
        setShake({ x: 0, y: 0 });
        clearInterval(shakeInterval);
        return;
      }
      setShake({
        x: (Math.random() - 0.5) * intensity,
        y: (Math.random() - 0.5) * intensity,
      });
      shakeCount++;
    }, 50);
  }, []);

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
      particles: [],
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
      combo: 0,
      maxCombo: 0,
      lastCutTime: 0,
      isMoving: false,
    };

    setTimeLeft(yard.timeLimit);
    setPercentMowed(0);
    setHitCount(0);
    setCombo(0);
    setMaxCombo(0);
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

  // Handle touch input for canvas (desktop mouse)
  const handleCanvasTouch = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (gameState !== "playing" || isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    touchTarget.current = {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    };
  }, [gameState, isMobile]);

  const handleCanvasTouchEnd = useCallback(() => {
    if (!isMobile) {
      touchTarget.current = null;
    }
  }, [isMobile]);

  // Virtual joystick handlers
  const handleJoystickStart = useCallback((e: React.TouchEvent) => {
    if (gameState !== "playing") return;
    e.preventDefault();
    const touch = e.touches[0];
    setJoystick({
      active: true,
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      dx: 0,
      dy: 0,
    });
  }, [gameState]);

  const handleJoystickMove = useCallback((e: React.TouchEvent) => {
    if (!joystickRef.current.active) return;
    e.preventDefault();
    const touch = e.touches[0];
    const maxDistance = 50;
    let dx = touch.clientX - joystickRef.current.startX;
    let dy = touch.clientY - joystickRef.current.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > maxDistance) {
      dx = (dx / distance) * maxDistance;
      dy = (dy / distance) * maxDistance;
    }

    setJoystick((prev) => ({
      ...prev,
      currentX: prev.startX + dx,
      currentY: prev.startY + dy,
      dx: dx / maxDistance,
      dy: dy / maxDistance,
    }));
  }, []);

  const handleJoystickEnd = useCallback(() => {
    setJoystick((prev) => ({
      ...prev,
      active: false,
      dx: 0,
      dy: 0,
    }));
  }, []);

  // Spawn grass particles
  const spawnParticles = useCallback((x: number, y: number, count: number = 3) => {
    const particles = gameStateRef.current.particles;
    const colors = ["#4a7c3f", "#3d6b34", "#5a8c4f", "#6b9d5f"];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: x * CELL_SIZE + CELL_SIZE / 2,
        y: y * CELL_SIZE + CELL_SIZE / 2,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 3 - 1,
        life: 1,
        maxLife: 0.5 + Math.random() * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 3,
      });
    }
  }, []);

  // Handle yard selection
  const handleYardSelect = useCallback((yard: Difficulty) => {
    const isLocked = YARDS[yard].locked && !unlockedYards.has(yard);

    if (isLocked) {
      setPendingYard(yard);
      setGameState("email");
    } else {
      setSelectedYard(yard);
      initGame(yard);
      soundManager.current.init();
      soundManager.current.startMower();
      setGameState("playing");
    }
  }, [unlockedYards, initGame]);

  // Handle email submit
  const handleEmailSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Save email and unlock all yards
    localStorage.setItem(EMAIL_KEY, email);
    const allYards: Difficulty[] = ["starter", "suburban", "hoa", "abandoned"];
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify(allYards));
    setUnlockedYards(new Set(allYards));
    setEmailError("");

    // Start the pending yard
    if (pendingYard) {
      setSelectedYard(pendingYard);
      initGame(pendingYard);
      soundManager.current.init();
      soundManager.current.startMower();
      setGameState("playing");
      setPendingYard(null);
    } else {
      setGameState("select");
    }
  }, [email, pendingYard, initGame]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") {
      soundManager.current.stopMower();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const yard = YARDS[selectedYard];
    canvas.width = yard.gridWidth * CELL_SIZE;
    canvas.height = yard.gridHeight * CELL_SIZE;

    let timerInterval: NodeJS.Timeout;
    let grassCutSoundCooldown = 0;

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

      // Virtual joystick input (mobile)
      if (joystickRef.current.active) {
        dx = joystickRef.current.dx;
        dy = joystickRef.current.dy;
      }

      // Mouse/touch input on canvas (desktop)
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

      const wasMoving = state.isMoving;
      state.isMoving = dx !== 0 || dy !== 0;

      if (state.isMoving !== wasMoving) {
        soundManager.current.adjustMowerPitch(state.isMoving);
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
        let cutThisFrame = false;

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
                  cutThisFrame = true;

                  // Spawn particles
                  spawnParticles(gx, gy, 2);

                  // Update combo
                  const now = Date.now();
                  if (now - state.lastCutTime < 500) {
                    state.combo++;
                    if (state.combo > state.maxCombo) {
                      state.maxCombo = state.combo;
                      setMaxCombo(state.maxCombo);
                    }
                    // Play combo sound at milestones
                    if (state.combo % 10 === 0) {
                      soundManager.current.playCombo(Math.floor(state.combo / 10));
                    }
                  } else {
                    state.combo = 1;
                  }
                  state.lastCutTime = now;
                  setCombo(state.combo);
                }
              }
            }
          }
        }

        // Play grass cut sound (with cooldown to avoid spam)
        if (cutThisFrame) {
          grassCutSoundCooldown -= delta;
          if (grassCutSoundCooldown <= 0) {
            soundManager.current.playGrassCut();
            grassCutSoundCooldown = 100; // 100ms cooldown
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
              state.combo = 0; // Reset combo on hit
              setCombo(0);
              setHitCount(state.hits);

              // Play collision sound and shake
              soundManager.current.playCollision();
              triggerShake(10);

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
            soundManager.current.playPowerUp();

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
      } else if (!state.stunned) {
        // Not moving, reset combo after a delay
        const now = Date.now();
        if (now - state.lastCutTime > 1000 && state.combo > 0) {
          state.combo = 0;
          setCombo(0);
        }
      }

      // Update particles
      state.particles = state.particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // Gravity
        p.life -= delta / 1000 / p.maxLife;
        return p.life > 0;
      });

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

      // Check for 100% completion - end game immediately
      if (state.cutGrass >= state.totalGrass) {
        // Perfect score! End the game
        soundManager.current.stopMower();
        soundManager.current.playGameOver(true);

        // Capture final pattern
        const canvasEl = canvasRef.current;
        if (canvasEl) {
          setFinalPattern(canvasEl.toDataURL());
        }

        setGameState("results");
        return; // Exit the game loop
      }

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
        if (pu.type === "time") ctx.fillText("\u23F1", px, py);
        else if (pu.type === "speed") ctx.fillText("\u26A1", px, py);
        else if (pu.type === "wide") ctx.fillText("\uD83D\uDCCF", px, py);
      }

      // Draw particles
      for (const p of state.particles) {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
      ctx.globalAlpha = 1;

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
        soundManager.current.stopMower();

        const percent = Math.round((gameStateRef.current.cutGrass / gameStateRef.current.totalGrass) * 100);
        soundManager.current.playGameOver(percent >= 76);

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
      soundManager.current.stopMower();
    };
  }, [gameState, selectedYard, spawnParticles, triggerShake]);

  // Email capture screen
  if (gameState === "email") {
    return (
      <div className="min-h-dvh bg-[#2d5a27] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">Unlock All Yards</h2>
          <p className="text-white/70 mb-6">
            Enter your email to unlock <strong className="text-white">{pendingYard ? YARDS[pendingYard].name : "all premium yards"}</strong> and get weekly lawn care tips.
          </p>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/50"
              />
              {emailError && (
                <p className="text-red-400 text-sm mt-2">{emailError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#c17f59] hover:bg-[#a66b48] text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors shadow-lg"
            >
              Unlock Yards
            </button>
          </form>

          <p className="text-white/40 text-xs mt-6">
            We&apos;ll send you 1 email per week with lawn tips. Unsubscribe anytime.
          </p>

          <button
            onClick={() => setGameState("select")}
            className="mt-6 text-white/60 hover:text-white/80 text-sm"
          >
            ← Back to yard selection
          </button>
        </div>
      </div>
    );
  }

  // Start screen
  if (gameState === "start") {
    return (
      <div className="min-h-dvh bg-[#2d5a27] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <div className="text-6xl mb-4">🚜</div>
          <h1 className="font-display text-5xl font-bold text-white mb-3 tracking-tight">MOW TOWN</h1>
          <p className="text-xl text-white/80 mb-8">Mow the yard. Dodge the junk. Beat the clock.</p>
          <button
            onClick={() => {
              soundManager.current.init();
              setGameState("select");
            }}
            className="bg-[#c17f59] hover:bg-[#a66b48] text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors shadow-lg"
          >
            Start Mowing
          </button>

          {leaderboard.length > 0 && (
            <button
              onClick={() => setGameState("leaderboard")}
              className="mt-6 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-6 py-3 rounded-xl transition-colors flex items-center gap-2 mx-auto"
            >
              <span className="text-lg">🏆</span>
              <span>View Leaderboard</span>
            </button>
          )}
        </div>

        <div className="mt-12 text-white/60 text-sm">
          <p>Desktop: Arrow keys or WASD to steer</p>
          <p>Mobile: Virtual joystick in bottom-left corner</p>
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
          {(Object.entries(YARDS) as [Difficulty, YardConfig][]).map(([key, yard]) => {
            const isLocked = yard.locked && !unlockedYards.has(key);

            return (
              <button
                key={key}
                onClick={() => handleYardSelect(key)}
                className={`bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 rounded-xl p-4 text-left transition-all relative ${isLocked ? "opacity-80" : ""}`}
              >
                {isLocked && (
                  <div className="absolute top-4 right-4 text-2xl">🔒</div>
                )}
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
                <p className="text-white/50 text-xs mt-2">
                  {yard.timeLimit} seconds
                  {isLocked && <span className="ml-2 text-[#c17f59]">• Enter email to unlock</span>}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex gap-4 items-center">
          <button
            onClick={() => setGameState("start")}
            className="text-white/60 hover:text-white/80 text-sm"
          >
            ← Back
          </button>
          {unlockedYards.size > 1 && (
            <button
              onClick={() => {
                localStorage.removeItem(UNLOCKED_KEY);
                localStorage.removeItem(EMAIL_KEY);
                setUnlockedYards(new Set<Difficulty>(["starter"]));
                setEmail("");
              }}
              className="text-white/40 hover:text-white/60 text-xs"
            >
              Reset progress
            </button>
          )}
        </div>
      </div>
    );
  }

  // Results screen - Overlay on top of final mow pattern
  if (gameState === "results") {
    const tier = getScoreTier(percentMowed);
    const needsEmail = !email && showNameInput;
    const canUnlockYards = unlockedYards.size === 1;

    return (
      <div className="min-h-dvh bg-[#1a3d15] flex items-center justify-center p-2 sm:p-4 relative">
        {/* Mow pattern background */}
        {finalPattern && (
          <img
            src={finalPattern}
            alt="Your mow pattern"
            className="absolute inset-0 w-full h-full object-contain opacity-40"
          />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Results overlay card */}
        <div className="relative z-10 w-full max-w-sm mx-auto">
          <div className="bg-[#2d3b2d]/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/10">
            {/* Score header */}
            <div className="text-center mb-4">
              <div className="text-5xl sm:text-6xl font-bold text-white mb-1">{percentMowed}%</div>
              <p className="text-white/60 text-sm">of the yard mowed</p>
            </div>

            {/* Tier badge */}
            <div className="bg-white/10 rounded-xl p-4 mb-4 text-center">
              <h3 className="font-display text-xl font-bold text-[#f1c40f] mb-1">{tier.title}</h3>
              <p className="text-white/70 text-sm">{tier.message}</p>
            </div>

            {/* Stats row */}
            <div className="flex justify-center gap-4 mb-5 text-white/70 text-xs">
              <div className="text-center">
                <div className="text-lg font-bold text-white">💥 {hitCount}</div>
                <div>hits</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-400">🔥 {maxCombo}x</div>
                <div>combo</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">⏱ {YARDS[selectedYard].timeLimit}s</div>
                <div>time</div>
              </div>
            </div>

            {/* Email capture for leaderboard + yard unlock */}
            {needsEmail ? (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🏆</span>
                  <div>
                    <p className="text-white font-medium text-sm">Join the Global Leaderboard</p>
                    {canUnlockYards && (
                      <p className="text-[#c17f59] text-xs">+ Unlock 3 more yards!</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Your name"
                    maxLength={20}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#c17f59] text-sm"
                  />
                  <input
                    type="email"
                    value={leaderboardEmail}
                    onChange={(e) => setLeaderboardEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#c17f59] text-sm"
                  />
                  {submitError && (
                    <p className="text-red-400 text-xs">{submitError}</p>
                  )}
                  <button
                    onClick={async () => {
                      if (nameInput.trim() && leaderboardEmail.trim()) {
                        const success = await saveToLeaderboard(nameInput.trim(), leaderboardEmail.trim());
                        if (success && canUnlockYards) {
                          // Also unlock yards when saving to leaderboard
                          const allYards: Difficulty[] = ["starter", "suburban", "hoa", "abandoned"];
                          localStorage.setItem(UNLOCKED_KEY, JSON.stringify(allYards));
                          setUnlockedYards(new Set(allYards));
                        }
                      }
                    }}
                    disabled={isSubmitting || !nameInput.trim() || !leaderboardEmail.trim()}
                    className="w-full bg-[#c17f59] hover:bg-[#a66b48] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-colors"
                  >
                    {isSubmitting ? "Saving..." : canUnlockYards ? "Save Score & Unlock Yards" : "Save to Leaderboard"}
                  </button>
                </div>
                <p className="text-white/40 text-xs mt-2 text-center">Weekly lawn tips. Unsubscribe anytime.</p>
              </div>
            ) : (
              <button
                onClick={() => setGameState("leaderboard")}
                className="w-full mb-4 bg-[#f1c40f]/20 hover:bg-[#f1c40f]/30 border border-[#f1c40f]/40 text-[#f1c40f] font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-lg">🏆</span>
                <span>View Leaderboard</span>
              </button>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowNameInput(true);
                  initGame(selectedYard);
                  soundManager.current.startMower();
                  setGameState("playing");
                }}
                className="flex-1 bg-[#c17f59] hover:bg-[#a66b48] text-white font-bold py-3 rounded-xl text-sm"
              >
                Mow Again
              </button>
              <button
                onClick={() => {
                  setShowNameInput(true);
                  setGameState("select");
                }}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-xl text-sm"
              >
                New Yard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Leaderboard screen
  if (gameState === "leaderboard") {
    return (
      <div className="min-h-dvh bg-[#2d5a27] flex flex-col items-center justify-center p-6">
        <div className="max-w-lg w-full">
          <h2 className="font-display text-3xl font-bold text-white mb-2 text-center">🏆 Leaderboard</h2>
          <p className="text-white/60 text-center mb-6">Top mowers in the neighborhood</p>

          {leaderboard.length === 0 ? (
            <div className="bg-white/10 rounded-xl p-8 text-center">
              <p className="text-white/60">No scores yet. Be the first!</p>
            </div>
          ) : (
            <div className="bg-white/10 rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-white/10 text-white/60 text-xs font-medium">
                <div className="col-span-1">#</div>
                <div className="col-span-4">Name</div>
                <div className="col-span-3">Yard</div>
                <div className="col-span-2 text-right">Score</div>
                <div className="col-span-2 text-right">Combo</div>
              </div>
              <div className="divide-y divide-white/10">
                {leaderboard.slice(0, 20).map((entry, index) => (
                  <div
                    key={entry.id || `${entry.name}-${index}`}
                    className={`grid grid-cols-12 gap-2 px-4 py-3 text-sm ${
                      index === 0 ? "bg-yellow-500/10 text-yellow-300" :
                      index === 1 ? "bg-gray-300/10 text-gray-300" :
                      index === 2 ? "bg-orange-500/10 text-orange-300" :
                      "text-white/80"
                    }`}
                  >
                    <div className="col-span-1 font-bold">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                    </div>
                    <div className="col-span-4 truncate">{entry.name}</div>
                    <div className="col-span-3 text-white/60 text-xs truncate">
                      {YARDS[entry.yard].name.replace("The ", "")}
                    </div>
                    <div className="col-span-2 text-right font-bold">{entry.percent}%</div>
                    <div className="col-span-2 text-right text-orange-400">{entry.combo}x</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={() => setGameState("select")}
              className="bg-[#c17f59] hover:bg-[#a66b48] text-white font-bold px-6 py-3 rounded-xl"
            >
              Play Again
            </button>
            <button
              onClick={() => setGameState("start")}
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 rounded-xl"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing
  return (
    <div
      className="min-h-dvh bg-[#1a3d15] flex flex-col items-center justify-center p-2 sm:p-4 select-none"
      style={{
        transform: `translate(${shake.x}px, ${shake.y}px)`,
      }}
    >
      {/* HUD */}
      <div className="w-full max-w-3xl flex items-center justify-between mb-2 px-2">
        <div className="bg-white/10 rounded-lg px-3 py-1.5">
          <span className="text-white/60 text-xs">Mowed</span>
          <span className="text-white font-bold text-lg ml-2">{percentMowed}%</span>
        </div>

        {/* Combo display */}
        {combo > 1 && (
          <div className={`bg-orange-500/30 rounded-lg px-3 py-1.5 ${combo >= 10 ? "animate-pulse" : ""}`}>
            <span className="text-orange-400 font-bold text-lg">🔥 {combo}x</span>
          </div>
        )}

        <div className={`bg-white/10 rounded-lg px-3 py-1.5 ${timeLeft <= 10 ? "animate-pulse bg-red-500/30" : ""}`}>
          <span className="text-white/60 text-xs">Time</span>
          <span className={`font-bold text-lg ml-2 ${timeLeft <= 10 ? "text-red-400" : "text-white"}`}>{timeLeft}s</span>
        </div>

        <div className="bg-white/10 rounded-lg px-3 py-1.5">
          <span className="text-white/60 text-xs">Hits</span>
          <span className="text-white font-bold text-lg ml-2">💥 {hitCount}</span>
        </div>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          className="bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5 transition-colors"
          title={soundEnabled ? "Mute" : "Unmute"}
        >
          <span className="text-xl">{soundEnabled ? "🔊" : "🔇"}</span>
        </button>
      </div>

      {/* Game canvas */}
      <div
        className="relative bg-[#4a7c3f] rounded-xl overflow-hidden shadow-2xl border-4 border-[#2d5a27] touch-none"
        onMouseDown={handleCanvasTouch}
        onMouseMove={(e) => e.buttons === 1 && handleCanvasTouch(e)}
        onMouseUp={handleCanvasTouchEnd}
        onMouseLeave={handleCanvasTouchEnd}
      >
        <canvas ref={canvasRef} className="block" style={{ maxWidth: "100%", height: "auto" }} />

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

      {/* Virtual Joystick (Mobile) */}
      {isMobile && (
        <div
          className="fixed bottom-8 left-8 w-32 h-32 touch-none"
          onTouchStart={handleJoystickStart}
          onTouchMove={handleJoystickMove}
          onTouchEnd={handleJoystickEnd}
        >
          {/* Joystick base */}
          <div className="absolute inset-0 rounded-full bg-white/10 border-2 border-white/20" />

          {/* Joystick knob */}
          <div
            className="absolute w-14 h-14 rounded-full bg-white/30 border-2 border-white/40 transition-transform duration-75"
            style={{
              left: "50%",
              top: "50%",
              transform: joystick.active
                ? `translate(calc(-50% + ${joystick.dx * 40}px), calc(-50% + ${joystick.dy * 40}px))`
                : "translate(-50%, -50%)",
            }}
          />

          {/* Direction indicator */}
          {joystick.active && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-4 h-4 border-t-4 border-r-4 border-white/60"
                style={{
                  transform: `rotate(${Math.atan2(joystick.dy, joystick.dx) * (180 / Math.PI) + 45}deg)`,
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Controls hint */}
      {isMobile ? (
        <p className="text-white/40 text-xs mt-3">Use the joystick to steer</p>
      ) : (
        <p className="text-white/40 text-xs mt-3">Use arrow keys or WASD to steer</p>
      )}
    </div>
  );
}
