'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView, useAnimation, AnimatePresence } from 'motion/react';

const TERMINAL_COMMANDS = [
  { cmd: 'git log --oneline -1', output: '0xCAFEBABE - "present day, present time"' },
  { cmd: 'uptime', output: 'up since 1998, load average: lain.exe' },
  { cmd: 'whoami', output: 'you are connected to the wired' },
  { cmd: 'cat /etc/motd', output: 'close the world, open the next' },
];

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`アイウエオカキクケコ';

function GlitchText({ text, isActive }: { text: string; isActive: boolean }) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (!isActive) {
      setDisplayText(text);
      return;
    }

    let iterations = 0;
    const maxIterations = 10;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (index < iterations) return text[index];
            if (char === ' ') return ' ';
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join('')
      );

      iterations += 1;
      if (iterations > text.length + maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text, isActive]);

  return <span>{displayText}</span>;
}

function WaveformVisualizer() {
  const [bars, setBars] = useState<number[]>(Array(20).fill(2));

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(prev =>
        prev.map(() => Math.random() * 12 + 2)
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end gap-[2px] h-4">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className="w-[2px] bg-terminal-amber/60"
          animate={{ height }}
          transition={{ duration: 0.1, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

function MatrixRain() {
  const chars = '01アイウエオカキクケコサシスセソタチツテト日本語';
  const columns = 30;

  return (
    <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
      {Array.from({ length: columns }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-[8px] text-terminal-amber font-mono whitespace-nowrap"
          style={{
            left: `${(i / columns) * 100}%`,
            writingMode: 'vertical-rl',
          }}
          initial={{ y: '-100%', opacity: 0 }}
          animate={{
            y: ['0%', '200%'],
            opacity: [0, 0.8, 0.4, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'linear',
          }}
        >
          {Array.from({ length: 15 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')}
        </motion.div>
      ))}
    </div>
  );
}

function TerminalLine({ command, output, delay }: { command: string; output: string; delay: number }) {
  const [showOutput, setShowOutput] = useState(false);
  const [typedCommand, setTypedCommand] = useState('');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    const startDelay = setTimeout(() => {
      let index = 0;
      const typeInterval = setInterval(() => {
        if (index <= command.length) {
          setTypedCommand(command.slice(0, index));
          index++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => setShowOutput(true), 200);
        }
      }, 50);
      return () => clearInterval(typeInterval);
    }, delay);

    return () => clearTimeout(startDelay);
  }, [isInView, command, delay]);

  return (
    <motion.div
      ref={ref}
      className="font-mono text-xs mb-2"
      initial={{ opacity: 0, x: -10 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: delay / 1000, duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <span className="text-terminal-amber">$</span>
        <span className="text-terminal-dim">{typedCommand}</span>
        {typedCommand.length < command.length && (
          <motion.span
            className="w-1.5 h-3 bg-terminal-amber"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </div>
      <AnimatePresence>
        {showOutput && (
          <motion.div
            className="text-terminal-gold/70 ml-4 mt-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.2 }}
          >
            {output}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function HexDump() {
  const [hexLines, setHexLines] = useState<string[]>([]);

  useEffect(() => {
    const generateHexLine = () => {
      const address = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
      const hex = Array.from({ length: 8 }, () =>
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
      ).join(' ');
      return `0x${address}: ${hex}`;
    };

    setHexLines(Array.from({ length: 3 }, generateHexLine));

    const interval = setInterval(() => {
      setHexLines(prev => [...prev.slice(1), generateHexLine()]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-[9px] text-terminal-amber/30 space-y-0.5">
      {hexLines.map((line, i) => (
        <motion.div
          key={line}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
        >
          {line}
        </motion.div>
      ))}
    </div>
  );
}

function ConnectionStatus() {
  const [status, setStatus] = useState({ latency: 42, packets: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(prev => ({
        latency: Math.floor(Math.random() * 30) + 20,
        packets: prev.packets + Math.floor(Math.random() * 100),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-4 text-[10px] font-mono">
      <div className="flex items-center gap-1">
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-terminal-amber"
          animate={{
            scale: [1, 1.3, 1],
            boxShadow: [
              '0 0 0 0 rgba(255, 176, 0, 0.4)',
              '0 0 0 4px rgba(255, 176, 0, 0)',
              '0 0 0 0 rgba(255, 176, 0, 0)',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-terminal-dim">CONNECTED</span>
      </div>
      <span className="text-terminal-border">|</span>
      <span className="text-terminal-dim">
        RTT: <span className="text-terminal-gold">{status.latency}ms</span>
      </span>
      <span className="text-terminal-border">|</span>
      <span className="text-terminal-dim">
        PKT: <span className="text-terminal-amber">{status.packets.toLocaleString()}</span>
      </span>
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: '-100px' });
  const controls = useAnimation();
  const [glitchActive, setGlitchActive] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150);
      }
    }, 2000);
    return () => clearInterval(glitchInterval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  return (
    <motion.footer
      ref={footerRef}
      className="relative py-12 px-4 border-t border-terminal-border overflow-hidden"
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      {/* Matrix rain background */}
      <MatrixRain />

      {/* Gradient overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          background: 'radial-gradient(ellipse at center bottom, rgba(255, 176, 0, 0.03) 0%, transparent 70%)',
        }}
      />

      {/* Animated border glow */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 176, 0, 0.3), rgba(255, 193, 7, 0.3), rgba(255, 176, 0, 0.3), transparent)',
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Terminal session header */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6 pb-4 border-b border-terminal-border/50"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-red-500/70"
                whileHover={{ scale: 1.2, backgroundColor: 'rgba(239, 68, 68, 1)' }}
              />
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"
                whileHover={{ scale: 1.2, backgroundColor: 'rgba(234, 179, 8, 1)' }}
              />
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-green-500/70"
                whileHover={{ scale: 1.2, backgroundColor: 'rgba(34, 197, 94, 1)' }}
              />
            </div>
            <span className="text-xs text-terminal-dim font-mono">session://lain@void:~</span>
          </div>
          <div className="hidden sm:block">
            <ConnectionStatus />
          </div>
          {/* Mobile-only simplified status */}
          <div className="flex sm:hidden items-center gap-2 text-[10px] font-mono">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-terminal-amber"
              animate={{
                scale: [1, 1.3, 1],
                boxShadow: [
                  '0 0 0 0 rgba(255, 176, 0, 0.4)',
                  '0 0 0 4px rgba(255, 176, 0, 0)',
                  '0 0 0 0 rgba(255, 176, 0, 0)',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-terminal-dim">CONNECTED</span>
            <span className="text-terminal-border">|</span>
            <span className="text-terminal-dim">
              RTT: <span className="text-terminal-gold">38ms</span>
            </span>
          </div>
        </motion.div>

        {/* Main content grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Left: Terminal commands */}
          <motion.div className="space-y-2" variants={itemVariants}>
            <div className="text-xs text-terminal-amber mb-3 font-mono">
              {'>'} recent_activity.log
            </div>
            {TERMINAL_COMMANDS.slice(0, 2).map((item, i) => (
              <TerminalLine
                key={i}
                command={item.cmd}
                output={item.output}
                delay={i * 800}
              />
            ))}
          </motion.div>

          {/* Center: ASCII Art with animation */}
          <motion.div
            className="flex flex-col items-center justify-center"
            variants={itemVariants}
          >
            <motion.div
              className="text-terminal-amber/30 text-[10px] font-mono leading-tight cursor-pointer"
              onClick={() => setShowEasterEgg(!showEasterEgg)}
              whileHover={{ scale: 1.02 }}
              animate={glitchActive ? {
                x: [-2, 2, -1, 0],
                filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(0deg)'],
              } : {}}
              transition={{ duration: 0.1 }}
            >
              <pre className="select-none">
{`    ╔═══════════════════╗
    ║  LAYER 07: WIRED  ║
    ║    ┌─────────┐    ║
    ║    │ ◉ ◉ ◉   │    ║
    ║    │  ═══    │    ║
    ║    │ ▓▓▓▓▓▓▓ │    ║
    ║    └─────────┘    ║
    ╚═══════════════════╝`}
              </pre>
            </motion.div>
            <AnimatePresence>
              {showEasterEgg && (
                <motion.div
                  className="text-terminal-gold text-[10px] mt-2 text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  "no matter where you go, everyone's connected"
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right: System info */}
          <motion.div className="space-y-3" variants={itemVariants}>
            <div className="text-xs text-terminal-amber mb-3 font-mono">
              {'>'} system_monitor
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-terminal-dim">SIGNAL</span>
              <WaveformVisualizer />
            </div>
            <div className="text-xs">
              <span className="text-terminal-dim">MEM_DUMP:</span>
              <div className="mt-1">
                <HexDump />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-3 md:gap-4 pt-6 border-t border-terminal-border/30"
          variants={itemVariants}
        >
          <motion.div
            className="flex items-center gap-2 text-xs sm:text-sm text-terminal-dim text-center"
            whileHover={{ color: '#00ff00' }}
          >
            <motion.span
              className="text-terminal-amber"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              $
            </motion.span>
            <span className="hidden sm:inline">
              <GlitchText text='echo "Built with Next.js + Tailwind + Motion"' isActive={glitchActive} />
            </span>
            <span className="sm:hidden">
              <GlitchText text='echo "Next.js + Tailwind + Motion"' isActive={glitchActive} />
            </span>
          </motion.div>

          <div className="flex items-center gap-4 text-terminal-dim text-sm">
            <motion.span
              whileHover={{ color: '#00ffff', textShadow: '0 0 8px rgba(255, 193, 7, 0.5)' }}
              className="cursor-pointer"
            >
              {currentYear}
            </motion.span>
            <span className="text-terminal-border">|</span>
            <motion.span
              className="text-terminal-amber"
              animate={{
                textShadow: [
                  '0 0 0px rgba(255, 176, 0, 0)',
                  '0 0 8px rgba(255, 176, 0, 0.5)',
                  '0 0 0px rgba(255, 176, 0, 0)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              lain@void
            </motion.span>
          </div>

          <motion.div
            className="text-xs text-terminal-dim/50 font-mono flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.span
              className="text-terminal-amber/50"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              [
            </motion.span>
            <span>process.exit(0)</span>
            <motion.span
              className="text-terminal-amber/50"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            >
              ]
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Large ASCII art easter egg - hidden on mobile */}
        <motion.div
          className="hidden md:block mt-8 text-center overflow-hidden"
          variants={itemVariants}
        >
          <motion.pre
            className="text-[8px] text-terminal-amber/15 select-none leading-none inline-block"
            animate={{
              opacity: [0.15, 0.25, 0.15],
              textShadow: [
                '0 0 0px rgba(255, 176, 0, 0)',
                '0 0 20px rgba(255, 176, 0, 0.1)',
                '0 0 0px rgba(255, 176, 0, 0)',
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            whileHover={{
              opacity: 0.4,
              textShadow: '0 0 30px rgba(255, 176, 0, 0.2)',
            }}
          >
{`
    ██╗     ███████╗████████╗███████╗    ███████╗██╗  ██╗██████╗ ██╗      ██████╗ ██████╗ ███████╗
    ██║     ██╔════╝╚══██╔══╝██╔════╝    ██╔════╝╚██╗██╔╝██╔══██╗██║     ██╔═══██╗██╔══██╗██╔════╝
    ██║     █████╗     ██║   ███████╗    █████╗   ╚███╔╝ ██████╔╝██║     ██║   ██║██████╔╝█████╗
    ██║     ██╔══╝     ██║   ╚════██║    ██╔══╝   ██╔██╗ ██╔═══╝ ██║     ██║   ██║██╔══██╗██╔══╝
    ███████╗███████╗   ██║   ███████║    ███████╗██╔╝ ██╗██║     ███████╗╚██████╔╝██║  ██║███████╗
    ╚══════╝╚══════╝   ╚═╝   ╚══════╝    ╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝
`}
          </motion.pre>
        </motion.div>
      </div>
    </motion.footer>
  );
}
