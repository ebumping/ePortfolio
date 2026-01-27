'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'motion/react';

const ASCII_FRAMES = [
  `
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  `,
  `
    ▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  `,
  `
     ██▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ▓██▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ▒██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ▒██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  `,
  `
     ██▓    ▄▄▄░░░░░░░░░░░░░░░░░░░░░░░
    ▓██▒   ▒████▄░░░░░░░░░░░░░░░░░░░░░
    ▒██░   ▒██  ▀█▄░░░░░░░░░░░░░░░░░░░
    ▒██░   ░██▄▄▄▄██░░░░░░░░░░░░░░░░░░
  `,
  `
     ██▓    ▄▄▄       ██▓░░░░░░░░░░░░░
    ▓██▒   ▒████▄    ▓██▒░░░░░░░░░░░░░
    ▒██░   ▒██  ▀█▄  ▒██▒▓░░░░░░░░░░░░
    ▒██░   ░██▄▄▄▄██ ░██░▓░░░░░░░░░░░░
  `,
  `
     ██▓    ▄▄▄       ██▓ ███▄    █
    ▓██▒   ▒████▄    ▓██▒ ██ ▀█   █
    ▒██░   ▒██  ▀█▄  ▒██▒▓██  ▀█ ██▒
    ▒██░   ░██▄▄▄▄██ ░██░▓██▒  ▐▌██▒
    ░██████▒▓█   ▓██▒░██░▒██░   ▓██░
    ░ ▒░▓  ░▒▒   ▓▒█░░▓  ░ ▒░   ▒ ▒
    ░ ░ ▒  ░ ▒   ▒▒ ░ ▒ ░░ ░░   ░ ▒░
      ░ ░    ░   ▒    ▒ ░   ░   ░ ░
        ░  ░     ░  ░ ░           ░
  `,
];

const EXPLORE_TEXT = "Let's explore the void...";

const DATA_STREAMS = [
  '01001100 01000001 01001001 01001110',
  'LAYER:07 >> CONNECTED',
  'sys.init() >> OK',
  'navi.exe >> RUNNING',
  '0xDEADBEEF',
  'PROTOCOL:7',
];

function DataStream({ index }: { index: number }) {
  const chars = '01アイウエオカキクケコサシスセソタチツテト';
  const [stream, setStream] = useState('');

  useEffect(() => {
    const length = 15 + Math.random() * 10;
    const interval = setInterval(() => {
      setStream(
        Array.from({ length: Math.floor(length) }, () =>
          chars[Math.floor(Math.random() * chars.length)]
        ).join('')
      );
    }, 100 + index * 20);
    return () => clearInterval(interval);
  }, [index]);

  return (
    <motion.div
      className="absolute text-[10px] text-terminal-amber/20 font-mono whitespace-nowrap pointer-events-none"
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: [0, 0.3, 0.1, 0.25, 0],
        y: ['0%', '100%'],
      }}
      transition={{
        duration: 8 + index * 2,
        repeat: Infinity,
        delay: index * 0.5,
        ease: 'linear',
      }}
      style={{
        left: `${5 + index * 12}%`,
        writingMode: 'vertical-rl',
      }}
    >
      {stream}
    </motion.div>
  );
}

function GlitchText({ children, className = '' }: { children: string; className?: string }) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 150);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <AnimatePresence>
        {isGlitching && (
          <>
            <motion.span
              className="absolute inset-0 text-terminal-gold"
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: [-2, 2, -1, 0], opacity: [0.8, 0.6, 0.9, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ clipPath: 'inset(0 0 50% 0)' }}
            >
              {children}
            </motion.span>
            <motion.span
              className="absolute inset-0 text-terminal-honey"
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: [2, -2, 1, 0], opacity: [0.8, 0.6, 0.9, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ clipPath: 'inset(50% 0 0 0)' }}
            >
              {children}
            </motion.span>
          </>
        )}
      </AnimatePresence>
    </span>
  );
}

function FloatingParticle({ index }: { index: number }) {
  const size = 2 + Math.random() * 3;
  const startX = Math.random() * 100;
  const duration = 15 + Math.random() * 10;

  return (
    <motion.div
      className="absolute rounded-full bg-terminal-amber/30"
      style={{
        width: size,
        height: size,
        left: `${startX}%`,
        bottom: 0,
        boxShadow: '0 0 6px rgba(255, 176, 0, 0.5)',
      }}
      animate={{
        y: [0, -800],
        x: [0, Math.sin(index) * 50],
        opacity: [0, 0.6, 0.3, 0],
        scale: [0, 1, 0.5],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay: index * 0.3,
        ease: 'easeOut',
      }}
    />
  );
}

function CircuitLine({ index }: { index: number }) {
  const isHorizontal = index % 2 === 0;
  const position = 10 + (index * 15) % 80;

  return (
    <motion.div
      className="absolute bg-terminal-amber/10"
      style={{
        [isHorizontal ? 'top' : 'left']: `${position}%`,
        [isHorizontal ? 'left' : 'top']: 0,
        [isHorizontal ? 'width' : 'height']: '100%',
        [isHorizontal ? 'height' : 'width']: '1px',
      }}
      initial={{ scaleX: isHorizontal ? 0 : 1, scaleY: isHorizontal ? 1 : 0 }}
      animate={{ scaleX: 1, scaleY: 1 }}
      transition={{ duration: 1.5, delay: index * 0.1, ease: 'easeOut' }}
    >
      <motion.div
        className="absolute bg-terminal-amber"
        style={{
          [isHorizontal ? 'width' : 'height']: '20px',
          [isHorizontal ? 'height' : 'width']: '100%',
          boxShadow: '0 0 10px rgba(255, 176, 0, 0.8)',
        }}
        animate={{
          [isHorizontal ? 'left' : 'top']: ['0%', '100%'],
        }}
        transition={{
          duration: 3 + index,
          repeat: Infinity,
          ease: 'linear',
          delay: index * 0.5,
        }}
      />
    </motion.div>
  );
}

export default function Header() {
  const [displayText, setDisplayText] = useState('');
  const [exploreText, setExploreText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [asciiFrame, setAsciiFrame] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [activeStreamIndex, setActiveStreamIndex] = useState(0);
  const fullText = 'Systems Programmer • ML Engineer • Security Researcher';
  const headerRef = useRef(null);
  const isInView = useInView(headerRef, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  useEffect(() => {
    const frameTimer = setInterval(() => {
      setAsciiFrame(prev => {
        if (prev < ASCII_FRAMES.length - 1) return prev + 1;
        clearInterval(frameTimer);
        return prev;
      });
    }, 150);
    return () => clearInterval(frameTimer);
  }, []);

  useEffect(() => {
    if (asciiFrame === ASCII_FRAMES.length - 1) {
      const glowTimer = setInterval(() => {
        setGlowIntensity(prev => (prev + 1) % 100);
      }, 50);
      return () => clearInterval(glowTimer);
    }
  }, [asciiFrame]);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 40);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      let index = 0;
      const timer = setInterval(() => {
        if (index <= EXPLORE_TEXT.length) {
          setExploreText(EXPLORE_TEXT.slice(0, index));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 60);
      return () => clearInterval(timer);
    }, 2500);
    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorTimer);
  }, []);

  useEffect(() => {
    const streamTimer = setInterval(() => {
      setActiveStreamIndex(prev => (prev + 1) % DATA_STREAMS.length);
    }, 2000);
    return () => clearInterval(streamTimer);
  }, []);

  const glowOpacity = 0.4 + Math.sin(glowIntensity * 0.1) * 0.2;

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
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  return (
    <motion.header
      ref={headerRef}
      className="relative py-16 px-4 border-b border-terminal-border overflow-hidden"
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      {/* Animated circuit lines background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {Array.from({ length: 6 }).map((_, i) => (
          <CircuitLine key={i} index={i} />
        ))}
      </div>

      {/* Data streams */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <DataStream key={i} index={i} />
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <FloatingParticle key={i} index={i} />
        ))}
      </div>

      {/* Gradient overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background: 'radial-gradient(ellipse at center top, rgba(255, 176, 0, 0.05) 0%, transparent 70%)',
        }}
      />

      {/* Scan line effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
      >
        <motion.div
          className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-terminal-green/50 to-transparent"
          animate={{ y: ['-100%', '2000%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Live data stream indicator */}
        <motion.div
          className="hidden md:flex items-center gap-3 mb-6 text-xs"
          variants={itemVariants}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-terminal-amber"
            animate={{
              scale: [1, 1.2, 1],
              boxShadow: [
                '0 0 0 0 rgba(255, 176, 0, 0.4)',
                '0 0 0 8px rgba(255, 176, 0, 0)',
                '0 0 0 0 rgba(255, 176, 0, 0)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-terminal-dim">STREAM ACTIVE</span>
          <span className="text-terminal-border">|</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={activeStreamIndex}
              className="text-terminal-amber/70 font-mono"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {DATA_STREAMS[activeStreamIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Animated ASCII Art */}
        <motion.div className="hidden md:block mb-8 relative" variants={itemVariants}>
          <motion.pre
            className="ascii-art select-none text-center transition-all duration-300"
            style={{
              color: `rgba(255, 176, 0, ${glowOpacity})`,
              textShadow: asciiFrame === ASCII_FRAMES.length - 1
                ? `0 0 ${5 + Math.sin(glowIntensity * 0.1) * 3}px rgba(255, 176, 0, 0.5),
                   0 0 ${10 + Math.sin(glowIntensity * 0.1) * 5}px rgba(255, 176, 0, 0.3),
                   0 0 ${20 + Math.sin(glowIntensity * 0.1) * 8}px rgba(255, 176, 0, 0.1)`
                : 'none',
            }}
            animate={asciiFrame === ASCII_FRAMES.length - 1 ? {
              filter: [
                'blur(0px) brightness(1)',
                'blur(0.5px) brightness(1.1)',
                'blur(0px) brightness(1)',
              ],
            } : {}}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {ASCII_FRAMES[asciiFrame]}
          </motion.pre>

          {asciiFrame === ASCII_FRAMES.length - 1 && (
            <motion.div
              className="text-center mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-terminal-gold/70 text-sm font-mono">
                {exploreText}
                <motion.span
                  className="ml-0.5 inline-block w-1.5 h-4 bg-terminal-gold"
                  animate={{ opacity: showCursor ? 0.7 : 0 }}
                />
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Mobile: Animated logo */}
        <motion.div
          className="md:hidden mb-6 text-center"
          variants={itemVariants}
        >
          <GlitchText className="text-4xl font-bold text-terminal-amber terminal-glow">
            LAIN
          </GlitchText>
        </motion.div>

        {/* Terminal Prompt */}
        <motion.div className="mb-6" variants={itemVariants}>
          <motion.div
            className="flex items-center gap-2 text-sm mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.span
              className="text-terminal-amber"
              animate={{ textShadow: ['0 0 5px rgba(255,176,0,0.5)', '0 0 10px rgba(255,176,0,0.8)', '0 0 5px rgba(255,176,0,0.5)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              lain
            </motion.span>
            <span className="text-terminal-dim">@</span>
            <motion.span
              className="text-terminal-gold"
              animate={{ textShadow: ['0 0 5px rgba(255,193,7,0.3)', '0 0 8px rgba(255,193,7,0.6)', '0 0 5px rgba(255,193,7,0.3)'] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              void
            </motion.span>
            <span className="text-terminal-dim">:</span>
            <span className="text-terminal-honey">~</span>
            <span className="text-terminal-dim">$</span>
            <motion.span
              className="text-terminal-text ml-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              whoami
            </motion.span>
          </motion.div>

          <motion.h1
            className="text-2xl md:text-3xl font-bold text-terminal-text mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <GlitchText>Full-Stack Developer & Systems Engineer</GlitchText>
          </motion.h1>

          <motion.div
            className="flex items-center text-terminal-dim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.span
              className="text-terminal-amber mr-2"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {'>'}
            </motion.span>
            <span>{displayText}</span>
            <motion.span
              className="ml-0.5 inline-block w-2 h-5 bg-terminal-amber"
              animate={{ opacity: showCursor ? 1 : 0 }}
            />
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
          variants={containerVariants}
        >
          {[
            { label: 'Languages', value: '6+', icon: 'λ' },
            { label: 'Projects', value: '99+', icon: '◆' },
            // { label: 'LOC', value: '435k+', icon: '▸' },
            { label: 'Years', value: '5+', icon: '◉' },
          ].map((stat, index) => (
            <StatCard key={stat.label} {...stat} index={index} />
          ))}
        </motion.div>
      </div>
    </motion.header>
  );
}

function StatCard({ label, value, icon, index }: { label: string; value: string; icon: string; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative bg-terminal-surface border border-terminal-border rounded-lg p-4 text-center overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.6 + index * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{
        scale: 1.02,
        borderColor: 'rgba(255, 176, 0, 0.5)',
        boxShadow: '0 0 30px rgba(255, 176, 0, 0.15), inset 0 0 30px rgba(255, 176, 0, 0.03)',
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Animated corner accents */}
      <motion.div
        className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-terminal-amber/0"
        animate={{ borderColor: isHovered ? 'rgba(255, 176, 0, 0.8)' : 'rgba(255, 176, 0, 0)' }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-terminal-amber/0"
        animate={{ borderColor: isHovered ? 'rgba(255, 176, 0, 0.8)' : 'rgba(255, 176, 0, 0)' }}
        transition={{ duration: 0.2, delay: 0.05 }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-terminal-amber/0"
        animate={{ borderColor: isHovered ? 'rgba(255, 176, 0, 0.8)' : 'rgba(255, 176, 0, 0)' }}
        transition={{ duration: 0.2, delay: 0.1 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-terminal-amber/0"
        animate={{ borderColor: isHovered ? 'rgba(255, 176, 0, 0.8)' : 'rgba(255, 176, 0, 0)' }}
        transition={{ duration: 0.2, delay: 0.15 }}
      />

      {/* Scan line on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute w-full h-[1px] bg-terminal-amber/50"
              initial={{ top: '0%' }}
              animate={{ top: '100%' }}
              transition={{ duration: 0.6, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="text-terminal-amber text-2xl mb-1"
        animate={isHovered ? {
          scale: [1, 1.2, 1],
          textShadow: ['0 0 0px rgba(255,176,0,0)', '0 0 20px rgba(255,176,0,0.8)', '0 0 10px rgba(255,176,0,0.4)'],
        } : {}}
        transition={{ duration: 0.3 }}
      >
        {icon}
      </motion.div>
      <motion.div
        className="text-xl font-bold text-terminal-text"
        animate={isHovered ? { color: '#00ff00' } : { color: '#e0e0e0' }}
      >
        {value}
      </motion.div>
      <div className="text-xs text-terminal-dim uppercase tracking-wider">{label}</div>
    </motion.div>
  );
}
