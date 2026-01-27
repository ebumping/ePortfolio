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
    tagline: 'Enterprise Multi-LLM Orchestration Platform',
    description: 'Distributed system for orchestrating multiple LLM providers with Kubernetes integration, WireGuard tunneling, and advanced agent spawning capabilities.',
    longDescription: 'A massive enterprise platform featuring multi-LLM orchestration across Anthropic, OpenAI, Google, DeepSeek, and more. Includes agent spawning and execution, Kubernetes pod execution (Weavers), WireGuard tunnel management, LLM proxy server with key management, and PostHog-compatible analytics.',
    tech: ['Rust', 'Tokio', 'Kubernetes', 'WireGuard', 'gRPC', 'PostgreSQL', 'Nix'],
    category: 'systems',
    highlights: [
      '90+ subcrates with modular architecture',
      'Multi-provider LLM integration (6+ providers)',
      'Kubernetes-native agent execution',
      'Secure tunnel management via WireGuard',
      'Feature flags and analytics pipeline',
    ],
    scale: '241,000+ LOC across 90+ crates',
    status: 'active',
    codeHighlight: {
      language: 'rust',
      filename: 'zerg_core/src/tool.rs',
      code: `/// The core Tool trait - implement this to create new agent capabilities
#[async_trait]
pub trait Tool: Send + Sync {
    fn name(&self) -> &str;
    fn description(&self) -> &str;
    fn input_schema(&self) -> Value;
    async fn execute(&self, input: Value, ctx: &ToolContext) -> ToolResult;

    fn definition(&self) -> ToolDefinition {
        ToolDefinition {
            name: self.name().to_string(),
            description: self.description().to_string(),
            input_schema: self.input_schema(),
            cache_control: None,
        }
    }
}

/// Registry of available tools for agent execution
#[derive(Default)]
pub struct ToolRegistry {
    tools: HashMap<String, Arc<dyn Tool>>,
}

impl ToolRegistry {
    pub fn register(&mut self, tool: impl Tool + 'static) {
        self.tools.insert(tool.name().to_string(), Arc::new(tool));
    }

    pub fn definitions(&self) -> Vec<ToolDefinition> {
        self.tools.values().map(|t| t.definition()).collect()
    }

    pub async fn execute(&self, name: &str, input: Value, ctx: &ToolContext) -> ToolResult {
        let tool = self.get(name).ok_or_else(|| ToolError {
            code: "TOOL_NOT_FOUND".into(),
            message: format!("Tool '{}' not found in registry", name),
            recoverable: false,
        })?;
        tool.execute(input, ctx).await
    }
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
    tagline: 'Multi-Protocol Steganography Toolkit',
    description: 'High-performance steganography suite supporting multiple media formats with military-grade encryption and SIMD optimization.',
    tech: ['Rust', 'AES-256-GCM', 'SIMD', 'FFmpeg', 'egui', 'Ratatui'],
    category: 'security',
    highlights: [
      'PNG/WAV/MP4 steganography support',
      'Zero-width character encoding (Sigil)',
      'AES-256-GCM encryption layer',
      'SIMD-optimized processing',
      'GUI and TUI interfaces',
      'Network steganography protocols',
    ],
    scale: '6,500+ LOC across 11 crates',
    status: 'maintained',
    codeHighlight: {
      language: 'rust',
      filename: 'steg/sigil/src/lib.rs',
      code: `impl Steganographer for SigilSteganographer {
    fn embed(&self, cover: &[u8], payload: &[u8]) -> Result<Vec<u8>, StegError> {
        let carrier = std::str::from_utf8(cover)
            .map_err(|_| StegError::InvalidFormat(
                "Carrier must be valid UTF-8".to_string()
            ))?
            .chars().next().unwrap_or('\u{1F300}');

        let mut encoded = String::new();
        for &byte in payload {
            for i in 0..8 {
                if (byte >> i) & 1 == 1 {
                    encoded.push(ZERO_WIDTH_JOINER);
                } else {
                    encoded.push(ZERO_WIDTH_NON_JOINER);
                }
            }
        }

        let mut result = String::new();
        result.push(carrier);
        result.push(ZERO_WIDTH_SPACE);
        result.push(ZERO_WIDTH_NON_JOINER);
        result.push_str(&encoded);
        result.push(ZERO_WIDTH_JOINER);
        result.push(ZERO_WIDTH_SPACE);

        Ok(result.into_bytes())
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
    id: 'synthesis',
    name: 'Synthesis',
    tagline: 'Cloud GPU Image & Video Generation Pipeline',
    description: 'Production-grade multi-model diffusion pipeline for context-aware image editing and video generation with cloud GPU deployment.',
    tech: ['Python', 'PyTorch', 'Diffusers', 'FLUX', 'SDXL', 'WAN', 'Gradio', 'CUDA'],
    category: 'ml-ai',
    highlights: [
      '6 inference engines (FLUX, SDXL, SD1.5, WAN)',
      'ACE+ context-aware editing with LoRAs',
      'Image-to-Video and Text-to-Video generation',
      'LoRA training infrastructure',
      'Vast.ai cloud deployment automation',
      'Memory optimization for 8GB-48GB VRAM',
    ],
    scale: '17,500+ LOC',
    status: 'active',
    codeHighlight: {
      language: 'python',
      filename: 'wan_inference.py',
      code: `def _generate_dual_model_i2v(
    self, image: Image.Image, prompt: str,
    generator: torch.Generator, gen_kwargs: dict,
):
    """
    Generate video using dual-model (H/L) Lightning workflow.
    First N steps use the H (High) model, then L (Low) for refinement.
    """
    if not self.i2v_pipeline_high or not self.i2v_pipeline_low:
        raise RuntimeError("Dual-model pipelines not loaded")

    config = self.model_config
    h_steps, l_steps = config.dual_model_steps

    print(f"Running dual-model: {h_steps} steps H, {l_steps} steps L")

    # Phase 1: Run H model for initial generation
    gen_kwargs_h = gen_kwargs.copy()
    gen_kwargs_h['num_inference_steps'] = h_steps
    gen_kwargs_h['output_type'] = 'latent'  # Get latents for continuation

    with torch.inference_mode():
        result_h = self.i2v_pipeline_high(**gen_kwargs_h)

    # Phase 2: Run L model for refinement from latents
    gen_kwargs_l = gen_kwargs.copy()
    gen_kwargs_l['num_inference_steps'] = l_steps
    gen_kwargs_l['latents'] = result_h.frames

    with torch.inference_mode():
        result_l = self.i2v_pipeline_low(**gen_kwargs_l)

    return result_l`,
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
      filename: 'turbogif/imageProcessingService.ts',
      code: `const ease = (t: number, type: AnimatorConfig['easing']): number => {
    switch (type) {
        case 'easeIn': return t * t;
        case 'easeOut': return t * (2 - t);
        case 'easeInOut': return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default: return t;
    }
};

const NOISE_TABLE = Array.from({length: 256}, () => Math.random());
const valueNoise1D = (x: number): number => {
    const x_floor = Math.floor(x);
    const t_smooth = (x - x_floor) ** 2 * (3 - 2 * (x - x_floor));
    return NOISE_TABLE[x_floor & 255] * (1 - t_smooth) + NOISE_TABLE[(x_floor + 1) & 255] * t_smooth;
};

const resolveAnimatedParams = (effect: Effect, frameIndex: number, totalFrames: number) => {
    const resolved = { ...effect.params };
    if (!effect.animators) return resolved;

    for (const paramId in effect.animators) {
        const { type, min, max, speed = 1, phase = 0 } = effect.animators[paramId];
        const progress = totalFrames > 1 ? frameIndex / (totalFrames - 1) : 0;

        let unit: number;
        switch (type) {
            case 'noise': unit = valueNoise1D((progress * speed + phase) * 5); break;
            case 'sine': unit = (Math.sin((progress * speed + phase) * 2 * Math.PI) + 1) / 2; break;
            case 'triangle': unit = 1 - Math.abs(((progress * speed + phase) % 1) * 2 - 1); break;
            default: unit = progress;
        }
        resolved[paramId] = min + unit * (max - min);
    }
    return resolved;
};`,
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
    id: 'nexus',
    name: 'Nexus',
    tagline: 'Enterprise Identity Management Platform',
    description: 'Distributed identity orchestration system with multi-platform automation, real-time analytics, and AI-driven campaign optimization.',
    longDescription: 'A sophisticated identity management and campaign orchestration platform handling multi-platform automation, real-time analytics, and intelligent campaign optimization. Features modular architecture with PyQt6 UI, advanced security controls, and predictive analytics engine.',
    tech: ['Python', 'PyQt6', 'Selenium', 'PyTorch', 'Transformers', 'OpenTelemetry', 'Prometheus'],
    category: 'systems',
    highlights: [
      'Multi-platform identity orchestration',
      'Real-time analytics and metrics dashboard',
      'AI-driven campaign optimization',
      'Enterprise security (AES encryption, proxy rotation)',
      'Persistent state management with recovery',
      'PyQt6 professional dashboard UI',
    ],
    scale: '49,000+ LOC',
    status: 'active',
    codeHighlight: {
      language: 'python',
      filename: 'action_executor.py',
      code: `def execute_action(self, action: QueuedAction) -> str:
    self.action_queue.update_status(action.job_id, ActionStatus.IN_PROGRESS)

    # 1. Validate identity readiness
    if not self._validate_identity_ready(action):
        self.action_queue.update_status(action.job_id, ActionStatus.FAILED,
            error="Identity not ready")
        return 'validation_failed'

    # 2. Check rate limits
    if not self._check_rate_limit(action):
        self.action_queue.update_status(action.job_id, ActionStatus.RATE_LIMITED)
        return 'rate_limited'

    # 3. Check circuit breaker
    if self._is_circuit_open(action.identity_username, action.platform):
        self.action_queue.update_status(action.job_id, ActionStatus.FAILED,
            error="Circuit breaker open - too many recent failures")
        return 'failed'

    # 4. Get platform automation and execute
    identity = self._get_identity(action.identity_username)
    automation = self.platform_factory.get_automation(action.platform)

    success, error_msg = self._dispatch_action(automation, identity, action)

    if success:
        self.action_queue.update_status(action.job_id, ActionStatus.COMPLETED)
        self._record_success(action.identity_username, action.platform)
        return 'success'
    else:
        self.action_queue.update_status(action.job_id, ActionStatus.FAILED, error=error_msg)
        self._record_failure(action.identity_username, action.platform)
        return 'failed'`,
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
  languages: ['Rust', 'Python', 'TypeScript', 'JavaScript', 'Go', 'C++'],
  systems: ['Kubernetes', 'Docker', 'WireGuard', 'Linux', 'Nix/NixOS', 'AWS Lambda', 'AWS S3'],
  ml: ['PyTorch', 'Transformers', 'Diffusers', 'Scikit-learn', 'llama.cpp', 'LibROSA'],
  web: ['React', 'Svelte', 'Next.js', 'Meteor', 'Axum', 'Puppeteer', 'Cheerio'],
  databases: ['PostgreSQL', 'MongoDB', 'SQLite', 'libSQL/Turso', 'Drizzle ORM', 'Prisma'],
  security: ['AES-256-GCM', 'Steganography', 'OAuth2/Passport', 'Reverse Engineering', 'Binary Analysis'],
  blockchain: ['Solana', 'Jupiter DEX', 'Web3'],
  automation: ['Web Scraping', 'Puppeteer', 'Selenium', 'Cheerio'],
};
