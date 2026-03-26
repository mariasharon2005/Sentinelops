import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fingerprint, ShieldCheck, ShieldAlert, Lock, RefreshCw } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface LoginProps {
  onLogin: () => void;
}

/**
 * Login Component
 * Simulates a biometric mobile login experience with success and failure states.
 * Academic Note: Demonstrates robust error handling in security-critical UX.
 */
export default function Login({ onLogin }: LoginProps) {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [attempts, setAttempts] = useState(0);

  const handleAuthenticate = () => {
    setStatus('scanning');
    
    // Simulate processing delay
    setTimeout(() => {
      // Simulate a random failure on the first attempt for demonstration
      const isSuccess = attempts > 0 || Math.random() > 0.3;
      
      if (isSuccess) {
        setStatus('success');
        setTimeout(onLogin, 1000);
      } else {
        setStatus('failed');
        setAttempts(prev => prev + 1);
      }
    }, 2000);
  };

  const resetAuth = () => {
    setStatus('idle');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-deep-space">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 text-center glass rounded-3xl"
      >
        <div className="flex justify-center mb-6">
          <div className={cn(
            "p-4 rounded-full transition-colors duration-500",
            status === 'failed' ? "bg-red-500/10" : "bg-cyber-lime/10"
          )}>
            {status === 'failed' ? (
              <ShieldAlert className="w-8 h-8 text-red-500" />
            ) : (
              <Lock className="w-8 h-8 text-cyber-lime" />
            )}
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white">
          {status === 'failed' ? "Access Denied" : "Identity Verification"}
        </h2>
        <p className="mt-2 text-white/50">
          {status === 'failed' 
            ? "Biometric signature mismatch detected." 
            : "Sentinel-Ops requires biometric authentication."}
        </p>

        <div className="relative flex flex-col items-center justify-center my-12">
          {/* Fingerprint Animation */}
          <div className={cn(
            "relative p-8 rounded-full transition-all duration-500 border-2",
            status === 'idle' && "bg-white/5 border-white/10",
            status === 'scanning' && "bg-cyber-lime/20 border-cyber-lime",
            status === 'success' && "bg-green-500/20 border-green-500",
            status === 'failed' && "bg-red-500/20 border-red-500"
          )}>
            <AnimatePresence mode="wait">
              {status === 'idle' && (
                <motion.div key="idle" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Fingerprint className="w-16 h-16 text-white/40" />
                </motion.div>
              )}
              {status === 'scanning' && (
                <motion.div 
                  key="scanning"
                  animate={{ 
                    opacity: [0.4, 1, 0.4],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Fingerprint className="w-16 h-16 text-cyber-lime" />
                  {/* Scanning Line */}
                  <motion.div 
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-cyber-lime shadow-[0_0_10px_#00ff88] z-20"
                  />
                </motion.div>
              )}
              {status === 'success' && (
                <motion.div key="success" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <ShieldCheck className="w-16 h-16 text-green-500" />
                </motion.div>
              )}
              {status === 'failed' && (
                <motion.div key="failed" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <ShieldAlert className="w-16 h-16 text-red-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Scanning Pulse */}
          {status === 'scanning' && (
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 border-2 rounded-full border-cyber-lime"
            />
          )}
        </div>

        <div className="space-y-4">
          {status === 'idle' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAuthenticate}
              className="w-full py-4 font-bold tracking-widest uppercase rounded-2xl bg-cyber-lime text-deep-space shadow-[0_0_20px_rgba(0,255,136,0.3)]"
            >
              Authenticate
            </motion.button>
          )}

          {status === 'failed' && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetAuth}
              className="flex items-center justify-center w-full gap-2 py-4 font-bold tracking-widest uppercase border bg-red-500/10 border-red-500/50 text-red-500 rounded-2xl"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </motion.button>
          )}

          {status === 'scanning' && (
            <p className="text-sm font-medium text-cyber-lime animate-pulse">
              Analyzing Biometric Data...
            </p>
          )}

          {status === 'success' && (
            <p className="text-sm font-medium text-green-500">
              Authentication Successful
            </p>
          )}
        </div>
      </motion.div>

      <div className="mt-12 text-xs text-center text-white/30">
        <p>Sentinel-Ops Secure Gateway</p>
        <p>Hardware ID: SO-X99-PRO</p>
      </div>
    </div>
  );
}
