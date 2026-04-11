export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription?: string;
  tech: string[];
  category: 'systems' | 'ml-ai' | 'web' | 'security' | 'trading';
  highlights: string[];
  scale?: string;
  status: 'active' | 'maintained' | 'complete';
  codeHighlight?: {
    language: string;
    filename: string;
    code: string;
  };
}

export const projects: Project[] = [
  {
    id: 'zerg',
    name: 'Zerg',
    tagline: 'Multi-Server Self-Improving AI Agent Orchestration',
    description: 'Autonomous agent orchestration framework with 4-tier C2 hierarchy, plan-driven completion guarantees, and deterministic state machines constraining non-deterministic LLM agents across distributed servers.',
    longDescription: 'A 113-crate Rust monorepo implementing autonomous multi-server AI agent orchestration. 4-tier hierarchy (Overmind/Cerebrate/Overlord/Drone) with 7-phase deterministic state machine (Ralph Loop) constraining non-deterministic LLM agents. Plan-as-source-of-truth completion tracking with three-way plan merging, parallel agent coordination via isolated jj (Jujutsu) workspaces with union-merge, and content-addressable Merkle DAG audit logging. K8s pod spawning with hardened security (non-root, read-only FS, capability drops, SPIFFE mTLS) and eBPF kernel-level syscall monitoring for sandbox escape detection. WireGuard tunnel management with x25519 key exchange, DERP relay NAT traversal, and TCP port forwarding.',
    tech: ['Rust', 'Tokio', 'Kubernetes', 'WireGuard', 'eBPF', 'Jujutsu (jj)', 'Nix', 'PostgreSQL'],
    category: 'systems',
    highlights: [
      '113-crate workspace with modular architecture',
      '4-tier C2 hierarchy (Overmind/Cerebrate/Overlord/Drone)',
      '7-phase deterministic state machine (Ralph Loop)',
      'K8s pod spawning with eBPF syscall monitoring',
      'WireGuard tunnels with DERP relay NAT traversal',
      'Plan-driven completion with jj workspace isolation',
      'Multi-provider LLM proxy (Anthropic, OpenAI, Google, DeepSeek, Groq)',
    ],
    scale: '241,000+ LOC across 113 crates',
    status: 'active',
    codeHighlight: {
      language: 'rust',
      filename: 'zerg_core/src/state.rs',
      code: `/// Phases of the Ralph Loop — deterministic state machine
/// constraining non-deterministic LLM agents
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum DronePhase {
    Idle,              // Waiting for input
    Planning,          // Gestalt — generate steps from context
    Executing,         // Evolve — run tools
    AwaitingToolResult,// Feed result back to LLM
    Checkpointing,     // Metamorphosis — snapshot + re-anchor
    Completed,         // Terminal success
    Failed,            // Terminal failure / needs re-anchor
}

fn transition(&mut self, to: DronePhase) {
    let from = self.state.phase;
    if from != to {
        self.state.phase = to;
        self.emit(DroneEvent::PhaseChanged { from, to });
    }
}

pub async fn execute_tool(
    &mut self, tool_use_id: &str, tool_name: &str, input: Value,
) -> Result<ToolOutput, ToolError> {
    self.transition(DronePhase::Executing);
    let start = std::time::Instant::now();
    let result = self.tools.execute(tool_name, input, &self.tool_ctx).await;

    self.state.current_step += 1;
    self.transition(DronePhase::AwaitingToolResult);

    // Deterministic context bound — checkpoint when token limit reached
    if self.state.needs_reanchor(self.context_limit) {
        self.create_checkpoint("context_limit_reached");
    }
    result
}

fn create_checkpoint(&mut self, reason: &str) {
    self.transition(DronePhase::Checkpointing);
    let checkpoint = self.state.checkpoint(); // SHA-256 content-addressed
    self.state.checkpoints.push(checkpoint.state_hash.clone());
    self.emit(DroneEvent::ReanchorTriggered {
        reason: reason.to_string(),
        checkpoint_hash: checkpoint.state_hash,
    });
}`,
    },
  },
  {
    id: 'hll-evo-rust',
    name: 'HLL-Evo-Rust',
    tagline: 'Evolutionary Binary Analysis & Reconstruction',
    description: 'Research-grade reverse engineering toolkit using genetic algorithms for code reconstruction from compiled binaries.',
    longDescription: 'Cutting-edge reverse engineering platform implementing genetic algorithm-based code reconstruction, multi-architecture disassembly (x86, ARM, MIPS, RISC-V), symbolic execution with Z3 SMT solver, and taint analysis for vulnerability detection.',
    tech: ['Rust', 'Z3 SMT', 'DWARF', 'SmartCore ML', 'egui', 'ptrace'],
    category: 'security',
    highlights: [
      'Genetic algorithm code reconstruction',
      'Multi-architecture disassembly support',
      'Symbolic execution with constraint solving',
      'Cryptographic algorithm detection',
      'Dynamic analysis via ptrace',
      'Ghidra-style GUI interface',
    ],
    scale: '30,000+ LOC',
    status: 'active',
    codeHighlight: {
      language: 'rust',
      filename: 'evolution/chamber.rs',
      code: `pub fn evolve_generation(&mut self, name: &str, test_data: &[f64]) -> Option<LambdaCandidate> {
    // PHASE 1: EVALUATE - Test current best candidate
    if let Some(best) = self.get_fittest(name) {
        let result = best.implementation.execute(test_data);
        let assessment = self.oracle.assess(result, test_data);
        self.report_feedback(name, &best.id, assessment.success, assessment.perf_penalty);
    }

    let candidates = match self.registry.get_candidates(name) {
        Some(c) if c.len() >= 2 => c,
        _ => return None,
    };

    // PHASE 2: SELECTION - Sort by fitness
    let mut sorted: Vec<_> = candidates.iter().collect();
    sorted.sort_by(|a, b| b.fitness().partial_cmp(&a.fitness()).unwrap());
    let selected = &sorted[..(candidates.len() / 2).max(2)];

    // PHASE 3: REPRODUCTION - Mutation and crossover
    let mut offspring = Vec::new();
    for &candidate in selected.iter().take(3) {
        if rand::rng().random::<f64>() < 0.7 {
            offspring.push(self.synthesizer.mutate(candidate));
        }
    }

    if selected.len() >= 2 {
        offspring.push(self.synthesizer.crossover(selected[0], selected[1]));
    }

    for child in offspring {
        self.registry.add_candidate(name.to_string(), child);
    }
    self.registry.cull_weakest(name, self.max_population);
    self.get_fittest(name)
}`,
    },
  },
  {
    id: 'obsidian-veil',
    name: 'Obsidian-Veil',
    tagline: 'Multi-Protocol C2 & Steganography Framework',
    description: 'Multi-protocol C2 framework with priority-ordered failover across DNS tunneling, ICMP covert channels, HTTP/2 steganography, and timing-based channels. LSB steganography with AES-256-GCM encryption across PNG/WAV/MP4/PDF carriers.',
    longDescription: 'Full-spectrum covert communications toolkit combining multi-format steganography with a multi-protocol C2 framework. Steganography supports PNG (SIMD-optimized LSB), WAV (PCM LSB), MP4 (subtitle track injection), PDF (invisible text injection via Tr3/metadata/micro-font for ATS bypass), and zero-width Unicode (Sigil). C2 layer provides automatic failover across DNS tunneling, ICMP covert channels, HTTP/2 header encoding, WebSocket with protocol disguise modes, and CloudC2 across 15 providers (GitHub, Slack, Discord, etc.). Includes DGA domain generation, traffic shaping with human mimicry, and a TCP command listener with shell execution, file ops, port scanning, and persistence mechanisms. GUI (egui), TUI (Ratatui), and CLI interfaces with tab-completion.',
    tech: ['Rust', 'AES-256-GCM', 'SSE2 SIMD', 'lopdf', 'FFmpeg', 'egui', 'Ratatui', 'Tokio'],
    category: 'security',
    highlights: [
      'PNG/WAV/MP4/PDF steganography with AES-256-GCM',
      'PDF invisible text injection (ATS resume stuffing)',
      'Multi-protocol C2 with automatic failover',
      'DNS/ICMP/HTTP2/WebSocket/CloudC2 covert channels',
      'SSE2 SIMD-optimized LSB bit packing',
      'DGA domain generation and traffic shaping',
      'GUI, TUI, and CLI with hidden text scanner',
    ],
    scale: '12,000+ LOC across 14 crates',
    status: 'active',
    codeHighlight: {
      language: 'rust',
      filename: 'listener/src/multi_protocol.rs',
      code: `/// Trait for covert channel protocol implementations
#[async_trait]
pub trait Protocol: Send + Sync {
    async fn execute(&self, cmd: &RemoteCommand) -> Result<CommandResponse>;
    fn name(&self) -> &'static str;
    async fn health_check(&self) -> bool;
    fn priority(&self) -> u8; // lower = higher priority
}

/// Multi-protocol C2 with automatic failover
pub struct MultiProtocolC2 {
    protocols: Vec<Arc<dyn Protocol>>,  // DNS, ICMP, HTTP/2, timing
    current_index: Arc<RwLock<usize>>,
    retry_timeout: Duration,
}

/// Execute command with priority-ordered protocol failover
pub async fn execute_with_failover(&self, cmd: &RemoteCommand) -> Result<CommandResponse> {
    let start_index = *self.current_index.read().await;
    let mut attempts = 0;

    loop {
        let current = *self.current_index.read().await;
        let protocol = &self.protocols[current];

        match timeout(self.retry_timeout, protocol.execute(cmd)).await {
            Ok(Ok(response)) => return Ok(response),
            Ok(Err(e)) => warn!("Protocol {} failed: {}", protocol.name(), e),
            Err(_) => warn!("Protocol {} timed out", protocol.name()),
        }

        // Failover to next protocol in priority order
        let mut index = self.current_index.write().await;
        *index = (*index + 1) % self.protocols.len();
        attempts += 1;

        if *index == start_index || attempts >= self.max_retries * self.protocols.len() {
            return Err(anyhow!("All {} protocols exhausted", self.protocols.len()));
        }
    }
}`,
    },
  },
  {
    id: 'vortex',
    name: 'Vortex',
    tagline: 'AI-Powered Web Intelligence Platform',
    description: 'Three-stage AI web scraping pipeline with semantic network mapping and visual workflow builder featuring 3D force-directed graph visualization.',
    tech: ['Rust', 'Axum', 'React', 'TypeScript', 'Three.js', 'WebSocket', 'SQLite'],
    category: 'web',
    highlights: [
      'Echo Chain semantic network mapping',
      'Liquid Spider visual workflow builder',
      'Real-time 3D force-directed visualization',
      'ML-powered DOM selector optimization',
      'WebSocket live crawl updates',
      'Workflow-to-instruction translation',
    ],
    scale: '30,000+ LOC',
    status: 'active',
    codeHighlight: {
      language: 'rust',
      filename: 'adaptive_selector.rs',
      code: `pub fn auto_match(
    cur: &Html, hist: &Html, prev_selector: &str, top_k: usize, depth: usize
) -> Result<Vec<SelectorMatch>, String> {
    let mut target = extract_target(hist, prev_selector);

    // Try relaxed selector if exact match fails
    if target.is_none() && prev_selector.contains('[') {
        let relaxed = relax_selector(prev_selector);
        target = extract_target(hist, &relaxed);
    }

    let target = target.ok_or_else(|| format!(
        "Target '{}' not found in historical snapshot", prev_selector
    ))?;

    let cands = extract_candidates(cur, prev_selector);
    if cands.is_empty() {
        return Err("No candidates in current HTML".to_string());
    }

    let ranked = rank_candidates(&target, cands, prev_selector);

    let mut results = Vec::new();
    for (cand, score) in ranked.into_iter().take(top_k) {
        let (p, s, t, d) = synthesise_selectors(cur, &cand.features, &cand.element, depth);
        results.push(SelectorMatch {
            primary: p, secondary: s, tertiary: t, score, exploration_depth: d
        });
    }
    Ok(results)
}`,
    },
  },
  {
    id: 'hydra-net',
    name: 'Hydra Net',
    tagline: 'Autonomous Trading System with ML/RL',
    description: 'Sophisticated cryptocurrency trading bot for Solana with ensemble machine learning, reinforcement learning, and real-time market analysis.',
    tech: ['Python', 'PyTorch', 'Solana', 'Jupiter DEX', 'Scikit-learn', 'Selenium', 'asyncio'],
    category: 'trading',
    highlights: [
      'Multi-position portfolio management (8 concurrent)',
      'Ensemble ML models (RF, GB, NN)',
      'Deep Q-Network reinforcement learning',
      'Jupiter DEX integration for execution',
      'Real-time DexScreener market data',
      'Dynamic risk management with trailing stops',
    ],
    scale: '21,000+ LOC',
    status: 'active',
    codeHighlight: {
      language: 'python',
      filename: 'services/position_sizer.py',
      code: `def calculate_position_size(
    self, token_data: Dict, signal: str, market_regime: str = "SIDEWAYS",
    regime_adjustments: Optional[Dict] = None, current_exposure_sol: float = 0.0
) -> float:
    sol_balance = self.wallet._update_sol_balance()
    if sol_balance <= 0.01:
        return 0.0

    base_size_sol = sol_balance * (self.BASE_POSITION_PCT / 100)

    # Multi-factor position sizing
    signal_mult = self._get_signal_multiplier(signal)
    quality_mult = self._get_quality_multiplier(token_data)
    regime_mult = regime_adjustments.get('position_size_mult', 1.0) if regime_adjustments else 1.0

    # Reduce size as portfolio exposure grows
    exposure_pct = (current_exposure_sol / sol_balance) * 100 if sol_balance > 0 else 0
    exposure_mult = self._get_exposure_multiplier(exposure_pct)
    history_mult = self._get_history_multiplier(token_data.get('symbol', 'UNKNOWN'))

    final_mult = signal_mult * quality_mult * regime_mult * exposure_mult * history_mult
    position_size = base_size_sol * final_mult

    # Apply min/max constraints
    return max(self.MIN_POSITION_SOL, min(position_size, self.MAX_POSITION_SOL))`,
    },
  },
  {
    id: 'neural-pipeline',
    name: 'Real-Time Neural Pipeline',
    tagline: 'Multi-Model CV at 25-35 FPS on Constrained Hardware',
    description: 'Real-time computer vision pipeline running 5 simultaneous neural networks at 25-35 FPS on an RTX 3070 (8GB VRAM) with precision-aware FP16/FP32 model splitting, TensorRT acceleration, and async threaded inference.',
    tech: ['Python', 'ONNX Runtime', 'TensorRT', 'CUDA', 'SCRFD', 'ArcFace', 'GFPGAN', 'BiSeNet'],
    category: 'ml-ai',
    highlights: [
      '5 neural networks at 25-35 FPS on 8GB VRAM',
      'Precision-aware FP16/FP32 model splitting',
      'TensorRT engine caching and acceleration',
      'Async threaded detection with GPU overlap',
      'Adaptive resolution scaling via rolling FPS',
      'Motion-predictive temporal stabilization',
    ],
    scale: '4,500+ LOC',
    status: 'active',
    codeHighlight: {
      language: 'python',
      filename: 'stream_swap.py',
      code: `def get_providers(use_trt=False, fp16=True):
    """Build ONNX Runtime execution provider list with optional TensorRT."""
    available = set(ort.get_available_providers())
    providers = []
    if use_trt and 'TensorrtExecutionProvider' in available:
        providers.append(('TensorrtExecutionProvider', {
            'device_id': 0,
            'trt_fp16_enable': fp16,
            'trt_engine_cache_enable': True,
            'trt_engine_cache_path': '/tmp/trt_cache',
        }))
    if 'CUDAExecutionProvider' in available:
        providers.append(('CUDAExecutionProvider', {'device_id': 0}))
    providers.append('CPUExecutionProvider')
    return providers

class FaceSwapStream:
    def __init__(self, identity_path, inswapper_path, source=0,
                 gfpgan_path=None, bisenet_path=None, use_trt=False):
        # Precision-aware model splitting: swap + restoration run FP32
        # to preserve identity embedding geometry; face parser runs FP16
        # — segmentation masks tolerate reduced precision
        fp32_providers = get_providers(use_trt, fp16=False)
        fp16_providers = get_providers(use_trt, fp16=True)

        identity = np.load(identity_path)
        self.identity_normed = identity.flatten().astype(np.float32)
        self.identity_normed /= max(np.linalg.norm(self.identity_normed), 1e-6)

        self.analyzer = FaceAnalyzer(det_size=(640, 640))  # SCRFD detector
        self.swapper  = InSwapper(inswapper_path, identity, fp32_providers)
        self.restorer = FaceRestorer(gfpgan_path, fp32_providers)   # FP32
        self.parser   = FaceParser(bisenet_path, fp16_providers)    # FP16 ok`,
    },
  },
  {
    id: 'wired-chan',
    name: 'Wired-Chan',
    tagline: 'Modern Imageboard Platform',
    description: 'Full-featured imageboard with Serial Experiments Lain aesthetic, built on Next.js 15 with comprehensive moderation and security features.',
    tech: ['Next.js 15', 'TypeScript', 'Tailwind', 'Turso/libSQL', 'Drizzle ORM'],
    category: 'web',
    highlights: [
      '70+ Unicode symbol-based boards',
      'Markdown with greentext support',
      'Rate limiting and spam detection',
      'Image uploads with validation',
      'Admin panel with authentication',
      'Retro-future aesthetic design',
    ],
    scale: '26,000+ LOC',
    status: 'maintained',
    codeHighlight: {
      language: 'typescript',
      filename: 'lib/moderation.ts',
      code: `export type RestrictionAction =
  | 'hard_ban' | 'shadow_ban' | 'timeout'
  | 'cooldown' | 'post_only_ban' | 'image_upload_ban';

export type RestrictionSubject = 'ip' | 'cidr' | 'device';

export async function findActiveRestriction(identity: ClientIdentity) {
  const nowIso = new Date().toISOString();
  const list = await db.select().from(restrictions);

  for (const r of list) {
    if (r.startsAt && r.startsAt > nowIso) continue;
    if (r.expiresAt && r.expiresAt <= nowIso) continue;
    if (r.revokedAt) continue;

    if (r.subjectType === 'ip' && identity.ip !== 'unknown') {
      if (r.subjectValue === identity.ip) return r;
    }
    if (r.subjectType === 'device' && identity.deviceId) {
      if (r.subjectValue === identity.deviceId) return r;
    }
    if (r.subjectType === 'cidr' && identity.ip !== 'unknown') {
      if (ipMatchesCidr(identity.ip, r.subjectValue)) return r;
    }
  }
  return null;
}

export function checkCooldown(
  identity: ClientIdentity, cooldownMinutes: number
): { allowed: boolean; waitSeconds?: number } {
  const key = identity.deviceId || identity.ip;
  const lastPost = cooldownCache.get(key);
  if (!lastPost) return { allowed: true };

  const elapsed = Date.now() - lastPost;
  const cooldownMs = cooldownMinutes * 60_000;
  if (elapsed < cooldownMs) {
    return { allowed: false, waitSeconds: Math.ceil((cooldownMs - elapsed) / 1000) };
  }
  return { allowed: true };
}`,
    },
  },
  {
    id: 'lumina',
    name: 'Lumina',
    tagline: 'Subscription Gallery & E-Commerce Platform',
    description: 'Professional subscription platform with Stripe integration, exclusive galleries, auction system, and comprehensive content management.',
    tech: ['Next.js 16', 'TypeScript', 'PostgreSQL', 'Prisma', 'Stripe', 'NextAuth.js', 'Cloudflare R2'],
    category: 'web',
    highlights: [
      'Stripe subscription integration (monthly/yearly)',
      'Subscriber-exclusive galleries with EXIF stripping',
      'Auction system with automatic payment processing',
      'Secure file storage via Cloudflare R2',
      'Admin content management panel',
      'Payment method storage via Setup Intent',
    ],
    scale: '15,000+ LOC',
    status: 'active',
    codeHighlight: {
      language: 'typescript',
      filename: 'lib/stripe.ts',
      code: `export async function chargeAuctionWinner(
  customerId: string,
  amount: number,
  auctionId: string,
  auctionTitle: string
) {
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  });

  if (paymentMethods.data.length === 0) {
    throw new Error('No payment method on file');
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'usd',
    customer: customerId,
    payment_method: paymentMethods.data[0].id,
    off_session: true,
    confirm: true,
    description: \`Auction win: \${auctionTitle}\`,
    metadata: {
      auctionId,
      type: 'auction_payment',
    },
  });

  return paymentIntent;
}`,
    },
  },
  {
    id: 'selector-engine',
    name: 'Selector Engine',
    tagline: 'Adaptive DOM Selector Recovery System',
    description: 'Intelligent CSS selector repair system that automatically generates resilient element locators when web page structures change.',
    longDescription: 'An intelligent DOM element recovery system for web automation. Uses dual-pass scoring (strict text-sensitive and relaxed structural matching), multi-strategy selector generation, and Levenshtein-based path similarity to maintain working selectors across UI changes.',
    tech: ['JavaScript', 'Node.js', 'Cheerio', 'Puppeteer', 'CSS Selectors'],
    category: 'web',
    highlights: [
      'Dual-pass scoring (strict/relaxed)',
      'Multi-strategy selector generation',
      'Levenshtein path similarity matching',
      'Stable attribute prioritization',
      'Puppeteer integration wrapper',
      'Auto-relaxation for minor text changes',
    ],
    scale: '500+ LOC',
    status: 'active',
    codeHighlight: {
      language: 'javascript',
      filename: 'scorer.js',
      code: `function score(target, cand, prevSelTokens, strict = true) {
  let s = 0;

  // ID comparison
  if (target.id) {
    if (cand.id === target.id) s += 5;
    else if (cand.id) {
      const shared = lcp(target.id, cand.id);
      if (shared >= 6) s += 3;
      else if (shared >= 3) s += 1;
    } else s -= 2;
  }

  // Tag bonus/penalty
  s += target.tag === cand.tag ? 1 : -1;

  // Class overlap (+1 each)
  s += cand.classes.filter(c => target.classes.includes(c)).length;

  // Stable attributes (+3 exact, +1 contains)
  Object.keys(target.attrs).forEach(k => {
    if (target.attrs[k] === cand.attrs[k]) s += 3;
    else if (target.attrs[k]?.includes(cand.attrs[k])) s += 1;
  });

  // Text similarity - skip when relaxed
  if (strict && target.textHash === cand.textHash) s += 3;

  // Depth proximity
  if (Math.abs(target.depth - cand.depth) <= 1) s += 2;

  // Path-token Levenshtein bonus (0-3)
  const tokenBonus = 3 * (1 - levenshtein(prevSelTokens, cand.pathTokens) /
    Math.max(prevSelTokens.length, cand.pathTokens.length, 1));
  s += tokenBonus;

  return s;
}`,
    },
  },
  {
    id: 'spawning_pool',
    name: 'Spawning Pool',
    tagline: 'Scalable Cognitive Influence Framework',
    description: 'Autonomous agent swarms generating culturally-tuned narratives across social media surfaces with real-time sentiment analysis, engagement feedback loops, and LLM-driven persona generation with behavioral modeling.',
    longDescription: 'Scalable cognitive influence framework for adversary population shaping at scale. Autonomous agent swarms generate culturally-tuned narratives across social media surfaces, adapting messaging cadence based on real-time sentiment analysis and engagement feedback loops. LLM-driven persona generation with behavioral modeling produces authentic-seeming digital actors with coordinated but non-uniform messaging patterns. Integrates with Zerg orchestration layer for hierarchical campaign management \u2014 operators define influence objectives and the system autonomously decomposes them into per-platform narrative strategies, A/B tests messaging variants, and converges on highest-engagement framings.',
    tech: ['Python', 'Rust', 'PyTorch', 'Transformers', 'Selenium', 'PyQt6', 'OpenTelemetry'],
    category: 'systems',
    highlights: [
      'LLM-driven persona generation with behavioral modeling',
      'Per-platform narrative strategy decomposition',
      'Real-time sentiment analysis and engagement feedback',
      'A/B testing of messaging variants with convergence',
      'Zerg orchestration integration for campaign hierarchy',
      'Multi-platform surface penetration automation',
    ],
    scale: '49,000+ LOC',
    status: 'active',
    codeHighlight: {
      language: 'python',
      filename: 'autonomous_campaign_controller.py',
      code: `class ControllerState(Enum):
    INITIALIZING = "initializing"
    IDLE = "idle"
    ANALYZING = "analyzing"
    EXECUTING = "executing"
    PAUSED = "paused"
    ERROR = "error"
    EMERGENCY_STOP = "emergency_stop"

class ExecutionPolicy(Enum):
    CONSERVATIVE = "conservative"   # Minimum risk, slow growth
    BALANCED = "balanced"           # Moderate risk/reward
    AGGRESSIVE = "aggressive"       # Higher risk, faster growth
    STEALTH = "stealth"             # Maximum opsec, minimal footprint

def run(self):
    """Main autonomous control loop"""
    self.running = True
    self.state = ControllerState.IDLE

    while self.running:
        if self.paused:
            self.state = ControllerState.PAUSED
            continue

        loop_start = datetime.now()

        self._perform_health_check()
        self._process_pending_confirmations()

        # Periodic analysis — AI evaluates campaign performance
        if (loop_start - last_analysis).seconds >= self.config.analysis_interval:
            self.state = ControllerState.ANALYZING
            self._perform_analysis_cycle()
            last_analysis = loop_start

        # Execute AI-recommended actions across platforms
        self.state = ControllerState.EXECUTING
        self._execute_action_cycle()

        # Continuous learning from engagement outcomes
        if self.config.enable_learning:
            self._update_learning()

        self.state = ControllerState.IDLE
        elapsed = (datetime.now() - loop_start).total_seconds()
        time.sleep(max(1, self.config.min_action_interval - elapsed))`,
    },
  },
];

export const categories = {
  'systems': { name: 'Systems Programming', color: 'terminal-gold' },
  'ml-ai': { name: 'Machine Learning & AI', color: 'terminal-honey' },
  'web': { name: 'Full-Stack Web', color: 'terminal-amber' },
  'security': { name: 'Security & Cryptography', color: 'terminal-magenta' },
  'trading': { name: 'Quantitative Trading', color: 'terminal-cyan' },
};

export const skills = {
  languages: ['Rust', 'Python', 'TypeScript', 'JavaScript', 'C++', 'C (embedded)', 'x86 Assembly'],
  systems: ['Nix/NixOS', 'Kubernetes', 'Docker', 'WireGuard', 'eBPF', 'Linux', 'AWS Lambda', 'AWS S3'],
  ml: ['PyTorch', 'Transformers', 'Diffusers', 'TensorRT', 'ONNX Runtime', 'Scikit-learn'],
  web: ['React', 'Next.js', 'Axum', 'Tailwind CSS', 'Ratatui/egui', 'Puppeteer', 'Cheerio'],
  databases: ['PostgreSQL', 'MongoDB', 'SQLite', 'libSQL/Turso', 'Drizzle ORM', 'Prisma'],
  security: ['AES-256-GCM', 'Steganography', 'Covert Channels', 'Reverse Engineering', 'Binary Analysis', 'HackRF/SIGINT'],
  blockchain: ['Solana', 'Jupiter DEX', 'Web3'],
  devops: ['Nix Flakes', 'Jujutsu (jj)', 'GitHub Actions', 'Cloudflare Tunnels/Zero Trust'],
};
