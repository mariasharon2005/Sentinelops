import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Zap, 
  Leaf, 
  AlertTriangle, 
  Power, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Terminal as TerminalIcon,
  X,
  ShieldAlert
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '@/src/lib/utils';

// --- Types ---
interface AnalyticsData {
  date: string;
  cost: number;
  predicted: number;
}

// --- Mock Data ---
const MOCK_CHART_DATA: AnalyticsData[] = [
  { date: 'Mon', cost: 400, predicted: 400 },
  { date: 'Tue', cost: 300, predicted: 350 },
  { date: 'Wed', cost: 600, predicted: 500 },
  { date: 'Thu', cost: 800, predicted: 700 },
  { date: 'Fri', cost: 500, predicted: 600 },
  { date: 'Sat', cost: 400, predicted: 550 },
  { date: 'Sun', cost: 300, predicted: 450 },
];

interface AnalyticsSummary {
  carbon: {
    kwh_saved: number;
    co2_offset_kg: number;
  };
  optimization: {
    id: string;
    type: string;
    avgCpu: number;
    recommendedAction: string;
  }[];
  budget: {
    limit: number;
    predictedDailySpend: number;
    daysRemaining: number;
    exhaustionDate: string;
  };
}

/**
 * Dashboard Component
 * The central hub of Sentinel-Ops.
 * Features: Live Heartbeat, Money Saved Counter, Kill Switch, and Predictive Analytics.
 */
export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [moneySaved, setMoneySaved] = useState(0);
  const [isKillSwitchTriggered, setIsKillSwitchTriggered] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);

  // Handle Recharts SSR/Hydration issue
  useEffect(() => {
    setIsMounted(true);
    
    // Fetch Analytics Summary
    fetch('/api/analytics/summary')
      .then(res => res.json())
      .then(data => setSummary(data));

    // Money Saved Counter Animation
    const target = 12450.85;
    const duration = 2000;
    const startTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      setMoneySaved(progress * target);
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }, []);

  const handleKillSwitchClick = () => {
    if (isKillSwitchTriggered) return;
    setShowConfirmModal(true);
  };

  const confirmKillSwitch = async () => {
    setShowConfirmModal(false);
    setIsKillSwitchTriggered(true);
    setShowTerminal(true);
    
    // Trigger Interactive Telegram Alert via API
    try {
      await fetch('/api/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'kill-switch',
          message: 'Kill Switch activated. All resources are being shut down.',
          interactive: true
        })
      });
    } catch (e) {
      console.error("Failed to send alert", e);
    }

    simulateTerminal();
  };

  const simulateTerminal = () => {
    const commands = [
      "> sentinel-ops --kill-switch init",
      "> Loading cloud credentials...",
      "> Authenticated with AWS (us-east-1)",
      "> Scanning for non-essential resources...",
      "> [ANALYTICS] Downsizing 4 instances (CPU < 10%)",
      "> [ANALYTICS] Terminating 8 ghost instances (CPU < 5%)",
      "> Executing 'terraform destroy --auto-approve'...",
      "> [AWS] Terminating i-0a1b2c3d4e5f6g7h8...",
      "> [AWS] Terminating i-9i8j7k6l5m4n3o2p1...",
      "> Releasing Elastic IPs...",
      "> Cleaning up orphaned EBS volumes...",
      "> Alert sent to Telegram: Cloud resources purged.",
      "> SYSTEM SECURED. COST LEAKAGE HALTED."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < commands.length) {
        setTerminalLines(prev => [...prev, commands[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 400);
  };

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="relative min-h-screen p-4 pb-24 overflow-x-hidden bg-deep-space bg-grid">
      {/* Live Heartbeat Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ 
            opacity: isKillSwitchTriggered ? [0.2, 0.4, 0.2] : [0.05, 0.1, 0.05],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className={cn(
            "absolute inset-0 transition-colors duration-1000",
            isKillSwitchTriggered ? "bg-red-500/20" : "bg-cyber-lime/5"
          )}
        />
        <svg className="absolute w-full h-full opacity-20">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={isKillSwitchTriggered ? "#ef4444" : "#00ff88"} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight italic">SENTINEL<span className="text-cyber-lime">-OPS</span></h1>
          <div className="flex items-center gap-2 mt-1">
            <div className={cn("w-2 h-2 rounded-full animate-pulse", isKillSwitchTriggered ? "bg-red-500 shadow-[0_0_8px_#ef4444]" : "bg-cyber-lime")} />
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
              {isKillSwitchTriggered ? "System Locked" : "Live Monitoring"}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Kill Switch Header Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleKillSwitchClick}
            disabled={isKillSwitchTriggered}
            className={cn(
              "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all",
              isKillSwitchTriggered 
                ? "bg-red-500/20 border border-red-500 text-red-500" 
                : "bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]"
            )}
          >
            <Power className="w-3 h-3" />
            Kill Switch
          </motion.button>
          
          <button className="p-2 rounded-full glass">
            <Activity className="w-5 h-5 text-cyber-lime" />
          </button>
        </div>
      </header>

      {/* Main Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className={cn(
          "relative z-10 grid grid-cols-2 gap-4 transition-all duration-500",
          isKillSwitchTriggered && "opacity-50 pointer-events-none grayscale"
        )}
      >
        {/* Money Saved Card */}
        <motion.div variants={itemVariants} className="col-span-2 p-6 glass rounded-3xl border-l-4 border-cyber-lime">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold tracking-widest uppercase text-white/40">Total Savings</span>
            <TrendingUp className="w-4 h-4 text-cyber-lime" />
          </div>
          <div className="text-4xl font-bold text-glow">
            ${moneySaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-cyber-lime">
            <ArrowUpRight className="w-3 h-3" />
            <span>+12.4% vs last month</span>
          </div>
        </motion.div>

        {/* Budget Exhaustion Card */}
        <motion.div variants={itemVariants} className="col-span-2 p-5 glass rounded-3xl border-l-4 border-[#bc13fe]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#bc13fe]" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/40">Budget Exhaustion</span>
            </div>
            <span className="text-[10px] font-bold text-[#bc13fe] bg-[#bc13fe]/10 px-2 py-0.5 rounded-full">Prophet Model</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold text-[#bc13fe]">
                {summary?.budget.exhaustionDate || 'Calculating...'}
              </div>
              <p className="text-[10px] text-white/30 mt-1">Predicted date for $100 limit</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-white/60">{summary?.budget.daysRemaining} Days</div>
              <p className="text-[8px] uppercase tracking-widest text-white/20">Remaining</p>
            </div>
          </div>
        </motion.div>

        {/* Ghost Resources / Downsizing */}
        <motion.div variants={itemVariants} className="p-4 glass rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/40">Optimization</span>
            </div>
            <div className="text-2xl font-bold">
              {summary?.optimization?.filter(o => o.recommendedAction !== 'OPTIMAL').length || 0}
            </div>
            <p className="text-[10px] text-white/30 mt-1">Flags for Downsizing</p>
          </div>
          
          <button 
            onClick={async (e) => {
              e.stopPropagation();
              const btn = e.currentTarget;
              btn.disabled = true;
              btn.innerText = "Analyzing...";
              
              await new Promise(r => setTimeout(r, 1500));
              
              try {
                await fetch('/api/alert', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    type: 'optimization',
                    message: 'Resource Optimization: 4 instances identified for vertical downsizing.',
                    interactive: true
                  })
                });
                alert("Optimization Scan Complete. Interactive Alert Sent.");
              } catch (err) {
                console.error(err);
              } finally {
                btn.disabled = false;
                btn.innerText = "Analyze Now";
              }
            }}
            className="mt-4 py-2 text-[8px] font-bold uppercase tracking-widest border border-cyber-lime/30 rounded-xl hover:bg-cyber-lime/10 transition-colors"
          >
            Analyze Now
          </button>
        </motion.div>

        {/* Sustainability Tracker */}
        <motion.div variants={itemVariants} className="p-4 glass rounded-3xl">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-4 h-4 text-green-400" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/40">Sustainability</span>
          </div>
          <div className="text-2xl font-bold">
            {summary?.carbon.co2_offset_kg.toFixed(1) || '0.0'}<span className="text-sm ml-1">kg</span>
          </div>
          <p className="text-[10px] text-white/30 mt-1">CO2 offset (1kWh = 0.4kg)</p>
          <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '65%' }}
              className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
            />
          </div>
        </motion.div>

        {/* Predictive Chart */}
        <motion.div variants={itemVariants} className="col-span-2 p-6 glass rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Cost Forecasting</h3>
              <p className="text-[10px] text-white/30">Prophet Seasonality Model</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-cyber-lime" />
                <span className="text-[8px] uppercase text-white/40">Actual</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#bc13fe]" />
                <span className="text-[8px] uppercase text-white/40">Predicted</span>
              </div>
            </div>
          </div>
          
          <div className="h-48 w-full">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_CHART_DATA}>
                  <defs>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#bc13fe" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#bc13fe" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f0f1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cost" 
                    stroke="#00ff88" 
                    fillOpacity={1} 
                    fill="url(#colorCost)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#bc13fe" 
                    fill="url(#colorPredicted)" 
                    strokeDasharray="5 5"
                    strokeWidth={1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm p-8 text-center glass rounded-3xl border-red-500/30"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-red-500/10">
                  <ShieldAlert className="w-10 h-10 text-red-500" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white">Activate Kill Switch?</h2>
              <p className="mt-4 text-sm text-white/60 leading-relaxed">
                Are you sure you want to activate the Kill Switch? This action will terminate all non-essential resources and <span className="text-red-500 font-bold underline">cannot be undone</span>.
              </p>
              <div className="flex flex-col gap-3 mt-8">
                <button
                  onClick={confirmKillSwitch}
                  className="w-full py-4 font-bold uppercase tracking-widest bg-red-500 text-white rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                >
                  Confirm Purge
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="w-full py-4 font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-white/60 rounded-2xl"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Terminal Overlay */}
      <AnimatePresence>
        {showTerminal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            className="fixed inset-4 bottom-8 z-50 glass rounded-3xl overflow-hidden flex flex-col border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)]"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-red-500/10">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-red-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-red-500">CRITICAL PURGE SEQUENCE</span>
              </div>
              <button onClick={() => setShowTerminal(false)} className="p-1 rounded-full hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 p-4 font-mono text-[10px] overflow-y-auto no-scrollbar bg-black/60">
              {terminalLines.map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "mb-1",
                    line?.includes("SYSTEM SECURED") ? "text-green-500 font-bold" : 
                    line?.includes("Terminating") ? "text-red-400" : "text-white/70"
                  )}
                >
                  {line}
                </motion.div>
              ))}
              <div className="w-1 h-4 bg-red-500 animate-pulse inline-block ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
