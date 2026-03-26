import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

/**
 * Main Application Entry Point
 * Manages the high-level state machine for the Sentinel-Ops experience.
 * 
 * Flow:
 * 1. SplashScreen (Animated Boot)
 * 2. Login (Biometric Simulation)
 * 3. Dashboard (Main Analytics Hub)
 */
export default function App() {
  const [stage, setStage] = useState<'splash' | 'login' | 'dashboard'>('splash');

  return (
    <main className="min-h-screen bg-deep-space text-white selection:bg-cyber-lime selection:text-deep-space">
      <AnimatePresence mode="wait">
        {stage === 'splash' && (
          <motion.div key="splash" className="w-full h-full">
            <SplashScreen onFinish={() => setStage('login')} />
          </motion.div>
        )}
        
        {stage === 'login' && (
          <motion.div key="login" className="w-full h-full">
            <Login onLogin={() => setStage('dashboard')} />
          </motion.div>
        )}
        
        {stage === 'dashboard' && (
          <motion.div key="dashboard" className="w-full h-full">
            <Dashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
