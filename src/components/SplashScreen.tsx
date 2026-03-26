import { motion } from 'motion/react';
import { Hexagon } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

/**
 * SplashScreen Component (Updated "Wow" Factor)
 * Provides a cinematic entry point with a "Neural Link" initialization.
 * Academic Note: Interactive splash screens increase user engagement and set the high-tech tone.
 */
export default function SplashScreen({ onFinish }: SplashScreenProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
      className="bg-[#050505] h-screen flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* The "Vibrant" Background Pulse */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />
      
      {/* Animated Background Particles (Subtle) */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: Math.random()
            }}
            animate={{ 
              y: [null, Math.random() * -100],
              opacity: [null, 0]
            }}
            transition={{ 
              duration: Math.random() * 5 + 2, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute w-1 h-1 bg-[#00ff88] rounded-full"
          />
        ))}
      </div>

      {/* The Neon Logo */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 p-8 rounded-full border-2 border-[#00ff88] shadow-[0_0_50px_rgba(0,255,136,0.3)] bg-black/50 backdrop-blur-xl"
      >
        <Hexagon size={80} className="text-[#00ff88] drop-shadow-[0_0_10px_#00ff88]" />
      </motion.div>

      {/* Bold Title */}
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-6xl font-black mt-8 text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#bc13fe] tracking-tighter z-10"
      >
        SENTINEL<span className="italic">OPS</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.6 }}
        className="mt-2 text-xs tracking-[0.3em] uppercase text-white font-medium z-10"
      >
        Predictive Cloud Governance
      </motion.p>

      {/* Glowing Start Button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        whileHover={{ 
          boxShadow: "0 0 30px #00ff88",
          scale: 1.05,
          brightness: 1.2
        }}
        whileTap={{ scale: 0.95 }}
        onClick={onFinish}
        className="mt-12 px-12 py-4 bg-[#00ff88] text-black font-bold rounded-full uppercase tracking-widest hover:brightness-110 transition-all z-10 shadow-[0_0_15px_rgba(0,255,136,0.5)]"
      >
        Initialize Neural Link
      </motion.button>
    </motion.div>
  );
}
