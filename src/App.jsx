import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowUpRight, 
  Cpu, 
  Database, 
  Calendar, 
  Check, 
  TrendingUp, 
  Lock, 
  Compass, 
  Menu, 
  X,
  Clock,
  Sparkles
} from 'lucide-react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00:00");
  
  // Ref hooks for GSAP animations
  const heroRef = useRef(null);
  const heroHeadingRef = useRef(null);
  const heroSubHeadingRef = useRef(null);
  const heroCtaRef = useRef(null);
  const philosophyRef = useRef(null);
  const cardsContainerRef = useRef(null);

  // Time indicator in Footer
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Navbar scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP Entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section staggered fade-up
      const tl = gsap.timeline();
      tl.fromTo(heroHeadingRef.current, 
        { y: 60, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );
      tl.fromTo(heroSubHeadingRef.current, 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.7'
      );
      tl.fromTo(heroCtaRef.current, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      );

      // Philosophy Manifesto ScrollTrigger word split reveal
      const words = philosophyRef.current.querySelectorAll('.phi-word');
      if (words.length > 0) {
        gsap.fromTo(words, 
          { y: '100%', opacity: 0 },
          { 
            y: '0%', 
            opacity: 1, 
            stagger: 0.015, 
            duration: 0.8, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: philosophyRef.current,
              start: 'top 75%',
              end: 'bottom 80%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }

      // Stacking Protocol cards animations (scale, blur, and opacity of card underneath)
      // Only execute this layout stacking scroll effects on screen size wider than mobile (768px)
      const container = cardsContainerRef.current;
      if (container && window.innerWidth > 768) {
        const cards = container.querySelectorAll('.protocol-card');
        cards.forEach((card, idx) => {
          if (idx === cards.length - 1) return; // Skip last card
          const nextCard = cards[idx + 1];
          
          gsap.to(card, {
            scrollTrigger: {
              trigger: nextCard,
              start: 'top 95%',
              end: 'top 15%',
              scrub: true,
            },
            scale: 0.9,
            filter: 'blur(16px)',
            opacity: 0.45,
            ease: 'power1.inOut',
          });
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-ivory text-slate min-h-screen selection:bg-champagne selection:text-obsidian relative">
      
      {/* A. NAVBAR — "The Floating Island" */}
      <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl rounded-full transition-all duration-500 ${
        isScrolled 
          ? 'bg-ivory/80 backdrop-blur-xl border border-slate/10 py-3 px-6 shadow-[0_10px_30px_-10px_rgba(13,13,18,0.15)] text-obsidian' 
          : 'bg-transparent py-5 px-6 sm:px-8 text-ivory'
      }`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="font-sans font-extrabold tracking-tight text-base sm:text-xl flex items-center gap-2 hover-lift">
            <span className="text-champagne">VA</span>
            <span>VANGUARD LIVING</span>
          </a>

          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 font-sans font-medium text-sm">
            <a href="#features" className="hover-lift hover:text-champagne transition-colors">Portfolios</a>
            <a href="#philosophy" className="hover-lift hover:text-champagne transition-colors">Manifesto</a>
            <a href="#protocol" className="hover-lift hover:text-champagne transition-colors">Acquisition</a>
            <a href="#pricing" className="hover-lift hover:text-champagne transition-colors">Access Tiers</a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a href="#pricing" className={`btn-magnetic group font-sans font-semibold text-xs uppercase tracking-wider border rounded-full px-5 py-2.5 flex items-center justify-center ${
              isScrolled 
                ? 'border-obsidian bg-obsidian text-ivory hover:text-obsidian' 
                : 'border-ivory bg-transparent text-ivory hover:text-obsidian'
            }`}>
              <span className={`btn-slide bg-champagne`}></span>
              <span className="btn-magnetic-text gap-2">
                Book consultation <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-1 hover:text-champagne transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full mt-2 rounded-[2rem] bg-obsidian text-ivory border border-slate/10 p-6 flex flex-col gap-4 shadow-xl md:hidden">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate/10 font-sans text-base hover:text-champagne">Portfolios</a>
            <a href="#philosophy" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate/10 font-sans text-base hover:text-champagne">Manifesto</a>
            <a href="#protocol" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate/10 font-sans text-base hover:text-champagne">Acquisition</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate/10 font-sans text-base hover:text-champagne">Access Tiers</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="btn-magnetic bg-champagne text-obsidian font-sans font-bold text-center py-3 rounded-full mt-4">
              Book consultation
            </a>
          </div>
        )}
      </nav>

      {/* B. HERO SECTION — "The Opening Shot" */}
      <section ref={heroRef} className="relative h-screen w-full flex flex-col justify-end bg-obsidian overflow-hidden">
        {/* Background Image with heavy primary-to-black gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop" 
            alt="Seattle Penthouse Skyline" 
            className="w-full h-full object-cover opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-transparent to-transparent z-10"></div>
        </div>

        {/* Content bottom-left third */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 pb-20 md:pb-32 flex flex-col gap-6 items-start">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-champagne/20 bg-champagne/5 text-champagne text-xs font-mono tracking-widest uppercase">
            <Sparkles size={12} /> Seattle Penthouses
          </div>
          
          <div className="flex flex-col gap-2 max-w-4xl text-left">
            <h1 ref={heroHeadingRef} className="font-sans font-black tracking-tight text-ivory text-3xl sm:text-5xl md:text-7xl leading-none uppercase">
              Sanctuary meets
            </h1>
            <h2 ref={heroSubHeadingRef} className="font-serif italic font-light tracking-tighter text-champagne text-5xl sm:text-7xl md:text-[9rem] lg:text-[11rem] leading-none -mt-2 md:-mt-5">
              Precision.
            </h2>
          </div>

          <p className="font-sans text-slate text-xs sm:text-sm md:text-lg max-w-lg text-left mt-2 leading-relaxed">
            Algorithmic inventory sourcing, zero-commission buy-side coordination, and direct developer pricing models. Engineered for Seattle's premier penthouses.
          </p>

          <div ref={heroCtaRef} className="mt-4 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <a href="#pricing" className="btn-magnetic group bg-champagne text-obsidian font-sans font-bold text-xs sm:text-sm tracking-wide rounded-full px-6 sm:px-8 py-3.5 sm:py-4 flex items-center justify-center gap-2 shadow-lg">
              <span className="btn-slide bg-ivory"></span>
              <span className="btn-magnetic-text gap-2">
                Book a private consultation <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </a>
            <a href="#features" className="btn-magnetic group border border-slate/30 text-ivory font-sans font-semibold text-xs sm:text-sm tracking-wide rounded-full px-6 sm:px-8 py-3.5 sm:py-4 flex items-center justify-center hover:border-ivory">
              <span className="btn-slide bg-slate/10"></span>
              <span className="btn-magnetic-text">Explore Engine</span>
            </a>
          </div>
        </div>
      </section>

      {/* C. FEATURES — "Interactive Functional Artifacts" */}
      <section id="features" className="py-24 md:py-32 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-4 mb-16 md:mb-20 text-left">
          <span className="text-champagne font-mono text-xs sm:text-sm tracking-widest uppercase flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-champagne animate-pulse-slow"></span> System Core
          </span>
          <h2 className="font-sans font-black text-2xl sm:text-4xl md:text-5xl text-obsidian tracking-tight uppercase">
            Value Propositions Engineered
          </h2>
          <p className="font-sans text-slate max-w-xl text-xs sm:text-sm md:text-base leading-relaxed">
            Replacing outdated broker mechanisms with automated validation telemetry. Transparency verified at every layer.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1 — "Diagnostic Shuffler" */}
          <DiagnosticShuffler />

          {/* Card 2 — "Telemetry Typewriter" */}
          <TelemetryTypewriter />

          {/* Card 3 — "Cursor Protocol Scheduler" */}
          <CursorProtocolScheduler />

        </div>
      </section>

      {/* D. PHILOSOPHY — "The Manifesto" */}
      <section id="philosophy" className="relative bg-obsidian text-ivory py-28 md:py-40 overflow-hidden min-h-[70vh] flex items-center justify-center">
        {/* Parallaxing architectural background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2000&auto=format&fit=crop" 
            alt="Dark Marble Architecture Detail" 
            className="w-full h-full object-cover opacity-15 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian z-10"></div>
        </div>

        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <span className="px-3 py-1 rounded-full border border-champagne/30 text-champagne text-xs font-mono tracking-widest uppercase">
              The Manifesto
            </span>
          </div>

          <div ref={philosophyRef} className="flex flex-col gap-8 md:gap-10">
            <p className="font-sans text-slate text-sm sm:text-base md:text-xl max-w-3xl mx-auto leading-relaxed">
              Most real estate firms focus on: high-commission transactions, opaque broker representation channels, and static, outdated property brokerage sheets.
            </p>
            
            <h2 className="font-serif italic font-light text-xl sm:text-3xl md:text-5xl lg:text-6xl text-ivory leading-tight max-w-4xl mx-auto">
              We focus on:{" "}
              <span className="text-champagne font-normal relative">
                algorithmic transparency
              </span>
              ,{" "}
              <span className="text-champagne font-normal">
                direct-from-source developer pricing
              </span>
              , and{" "}
              <span className="text-champagne font-normal">
                frictionless asset acquisition
              </span>{" "}
              for the modern investor.
            </h2>
          </div>
          
          {/* Staggered text support structure (Hidden but parsed for GSAP SplitText simulation) */}
          <div className="hidden">
            <span className="phi-word">We</span>
            <span className="phi-word">believe</span>
            <span className="phi-word">traditional</span>
            <span className="phi-word">brokerages</span>
            <span className="phi-word">create</span>
            <span className="phi-word">artificial</span>
            <span className="phi-word">friction</span>
            <span className="phi-word">to</span>
            <span className="phi-word">justify</span>
            <span className="phi-word">fees.</span>
            <span className="phi-word">Our</span>
            <span className="phi-word">protocol</span>
            <span className="phi-word">restores</span>
            <span className="phi-word">direct</span>
            <span className="phi-word">connectivity</span>
            <span className="phi-word">between</span>
            <span className="phi-word">investor</span>
            <span className="phi-word">and</span>
            <span className="phi-word">developer.</span>
          </div>
        </div>
      </section>

      {/* E. PROTOCOL — "Sticky Stacking Archive" */}
      <section id="protocol" ref={cardsContainerRef} className="relative bg-obsidian py-0 w-full z-30">
        
        {/* Card 1 */}
        <div className="protocol-card relative md:sticky md:top-0 h-auto md:h-screen w-full flex flex-col justify-center bg-obsidian border-t border-slate/10 px-6 py-20 md:py-0 overflow-hidden">
          <div className="absolute inset-0 z-0 flex items-center justify-center p-8">
            <ConcentricRingsSVG />
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
            <div className="flex flex-col gap-4 sm:gap-6 items-start text-left">
              <span className="font-mono text-champagne text-xs sm:text-sm tracking-widest uppercase">01 / QUANTIFY</span>
              <h3 className="font-sans font-black text-ivory text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight">
                Neural Sourcing
              </h3>
              <p className="font-sans text-slate text-xs sm:text-sm md:text-base leading-relaxed">
                Our proprietary AI model filters Seattle's off-market penthouse inventory. Analyzing block development pipelines, micro-zoning, and shadow pricing to isolate undervalued pre-sale assets before public offering.
              </p>
              <div className="flex flex-col gap-2 font-mono text-[10px] sm:text-xs text-champagne/80">
                <span className="flex items-center gap-2"><Check size={12} /> Shadow valuation matrix calculation</span>
                <span className="flex items-center gap-2"><Check size={12} /> Developer liquidity matching</span>
              </div>
            </div>
            <div className="flex justify-end p-6 md:p-8 border border-slate/10 bg-slate/5 rounded-[2rem] backdrop-blur-md w-full">
              <div className="w-full font-mono text-[10px] sm:text-xs text-left p-4 sm:p-6 bg-obsidian/90 border border-champagne/20 rounded-2xl flex flex-col gap-3 shadow-inner">
                <div className="flex justify-between border-b border-slate/10 pb-2 text-slate uppercase">
                  <span>METRIC</span>
                  <span>VALUE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Index Depth:</span>
                  <span className="text-ivory">4,209 Units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Off-Market Match:</span>
                  <span className="text-champagne">14 Penthouses</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Valuation Accuracy:</span>
                  <span className="text-ivory">99.84% (Akaike Inf)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="protocol-card relative md:sticky md:top-0 h-auto md:h-screen w-full flex flex-col justify-center bg-[#111116] border-t border-slate/10 px-6 py-20 md:py-0 overflow-hidden">
          <div className="absolute inset-0 z-0 flex items-center justify-center p-8">
            <ScanningGridSVG />
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
            <div className="flex flex-col gap-4 sm:gap-6 items-start text-left">
              <span className="font-mono text-champagne text-xs sm:text-sm tracking-widest uppercase">02 / INDEX</span>
              <h3 className="font-sans font-black text-ivory text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight">
                Developer Integration
              </h3>
              <p className="font-sans text-slate text-xs sm:text-sm md:text-base leading-relaxed">
                Connect directly with original developer contracts. We bypass the traditional broker distribution chain, saving up to 6% in commission payouts and locking unit costs at baseline development financing rates.
              </p>
              <div className="flex flex-col gap-2 font-mono text-[10px] sm:text-xs text-champagne/80">
                <span className="flex items-center gap-2"><Check size={12} /> Bypassing multi-tier brokerage fees</span>
                <span className="flex items-center gap-2"><Check size={12} /> Direct allocation confirmation</span>
              </div>
            </div>
            <div className="flex justify-end p-6 md:p-8 border border-slate/10 bg-slate/5 rounded-[2rem] backdrop-blur-md w-full">
              <div className="w-full font-mono text-[10px] sm:text-xs text-left p-4 sm:p-6 bg-obsidian/90 border border-champagne/20 rounded-2xl flex flex-col gap-2 shadow-inner">
                <div className="text-slate mb-2 border-b border-slate/10 pb-2">ESCROW ROUTING INDEX</div>
                <div className="text-green-400">► DEV_CONTRACT: active</div>
                <div className="text-ivory">► BYPASS_AGENT_COMM: 100%</div>
                <div className="text-ivory">► DEPOSIT_ESCROW_TARGET: standard</div>
                <div className="text-champagne font-bold mt-2">► ALLOCATION: RESERVED</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="protocol-card relative md:sticky md:top-0 h-auto md:h-screen w-full flex flex-col justify-center bg-[#15151B] border-t border-slate/10 px-6 py-20 md:py-0 overflow-hidden">
          <div className="absolute inset-0 z-0 flex items-center justify-center p-8">
            <EKGWaveformSVG />
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
            <div className="flex flex-col gap-4 sm:gap-6 items-start text-left">
              <span className="font-mono text-champagne text-xs sm:text-sm tracking-widest uppercase">03 / SETTLE</span>
              <h3 className="font-sans font-black text-ivory text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight">
                Automated Transaction
              </h3>
              <p className="font-sans text-slate text-xs sm:text-sm md:text-base leading-relaxed">
                A streamlined settlement framework. We synchronize escrow milestones, developer building compliance reviews, legal title checks, and coordinate immediate digital-key handover with zero transaction friction.
              </p>
              <div className="flex flex-col gap-2 font-mono text-[10px] sm:text-xs text-champagne/80">
                <span className="flex items-center gap-2"><Check size={12} /> Automated legal title clearance</span>
                <span className="flex items-center gap-2"><Check size={12} /> Multi-sig escrow handshakes</span>
              </div>
            </div>
            <div className="flex justify-end p-6 md:p-8 border border-slate/10 bg-slate/5 rounded-[2rem] backdrop-blur-md w-full">
              <div className="w-full font-mono text-[10px] sm:text-xs text-left p-4 sm:p-6 bg-obsidian/90 border border-champagne/20 rounded-2xl flex flex-col gap-3 shadow-inner">
                <div className="flex justify-between items-center border-b border-slate/10 pb-2 text-slate">
                  <span>ESCROW PROTOCOL</span>
                  <span className="text-green-400">READY</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></div>
                  <span className="text-ivory">Title Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></div>
                  <span className="text-ivory">Developer Compliance Checked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-champagne rounded-full"></div>
                  <span className="text-champagne">Finalizing Legal Handover</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* F. LISTINGS / PRICING */}
      <section id="pricing" className="py-24 md:py-32 px-6 max-w-7xl mx-auto w-full relative z-40 bg-ivory">
        <div className="flex flex-col gap-4 mb-16 md:mb-20 text-center items-center">
          <span className="text-champagne font-mono text-xs sm:text-sm tracking-widest uppercase flex items-center gap-2">
            <Compass size={14} /> Service Matrix
          </span>
          <h2 className="font-sans font-black text-2xl sm:text-4xl md:text-5xl text-obsidian tracking-tight uppercase">
            Exclusive Client Portfolios
          </h2>
          <p className="font-sans text-slate max-w-xl text-center text-xs sm:text-sm md:text-base leading-relaxed">
            Select your verification level. Access directly matching pre-sale developer inventory immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Card 1 - Essential */}
          <div className="bg-ivory border border-slate/10 rounded-[2.5rem] p-6 sm:p-8 md:p-10 flex flex-col justify-between hover-lift shadow-[0_10px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
            <div className="flex flex-col gap-6 text-left">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate uppercase tracking-wider">Level 01</span>
                <span className="px-3 py-1 bg-slate/5 text-slate rounded-full text-xs font-mono">Starter</span>
              </div>
              <div>
                <h3 className="font-sans font-black text-xl sm:text-2xl text-obsidian uppercase tracking-tight">Essential</h3>
                <p className="font-sans text-xs text-slate mt-2 leading-relaxed">
                  Basic database lookup access for active development locations and shadow listings.
                </p>
              </div>
              <div className="border-t border-slate/10 pt-6 flex flex-col gap-4">
                <span className="font-sans text-obsidian font-black text-3xl sm:text-5xl tracking-tight">
                  Free
                </span>
                <p className="text-xs text-slate font-mono">Bypasses basic brokers only</p>
              </div>
              <ul className="flex flex-col gap-3 font-mono text-xs text-slate pt-4">
                <li className="flex items-center gap-2"><Check size={14} className="text-champagne" /> Direct developer index</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-champagne" /> Static market alerts</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-champagne" /> Shadow pricing alerts</li>
                <li className="flex items-center gap-2 text-slate/40 line-through"><Check size={14} /> AI neural evaluation matrix</li>
              </ul>
            </div>
            <a href="#consultation" className="btn-magnetic group w-full mt-8 md:mt-10 border border-slate/20 font-sans font-semibold text-xs uppercase tracking-wider py-4 rounded-full text-obsidian hover:border-obsidian text-center">
              <span className="btn-slide bg-slate/5"></span>
              <span className="btn-magnetic-text">Access Index</span>
            </a>
          </div>

          {/* Card 2 - Full Acquisition (Pop middle card) */}
          <div className="bg-obsidian text-ivory border border-champagne/30 rounded-[2.5rem] p-6 sm:p-8 md:p-10 flex flex-col justify-between hover-lift shadow-[0_20px_50px_rgba(13,13,18,0.25)] relative overflow-hidden transform md:scale-105 z-10">
            <div className="absolute top-0 right-0 bg-champagne text-obsidian font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-[1.5rem]">
              Recommended
            </div>
            
            <div className="flex flex-col gap-6 text-left">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-champagne uppercase tracking-wider">Level 02</span>
                <span className="px-3 py-1 bg-champagne/10 text-champagne rounded-full text-xs font-mono">Acquisition</span>
              </div>
              <div>
                <h3 className="font-sans font-black text-xl sm:text-2xl text-ivory uppercase tracking-tight">Full Sourcing</h3>
                <p className="font-sans text-xs text-slate mt-2 leading-relaxed">
                  Complete acquisition pipeline. Direct transaction coordination with zero broker commissions.
                </p>
              </div>
              <div className="border-t border-slate/10 pt-6 flex flex-col gap-4">
                <span className="font-sans text-champagne font-black text-3xl sm:text-5xl tracking-tight">
                  0.75%
                </span>
                <p className="text-xs text-slate font-mono">Of acquisition value (vs standard 6%)</p>
              </div>
              <ul className="flex flex-col gap-3 font-mono text-xs text-slate pt-4">
                <li className="flex items-center gap-2"><Check size={14} className="text-champagne" /> Deep database sourcing</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-champagne" /> AI neural evaluation matrix</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-champagne" /> Direct developer allocation</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-champagne" /> Escrow coordination protocol</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-champagne" /> Zero broker fees confirmed</li>
              </ul>
            </div>
            
            <a href="#consultation" className="btn-magnetic group w-full mt-8 md:mt-10 bg-champagne text-obsidian font-sans font-semibold text-xs uppercase tracking-wider py-4 rounded-full shadow-lg text-center">
              <span className="btn-slide bg-ivory"></span>
              <span className="btn-magnetic-text gap-2">
                Initiate Sourcing <ArrowUpRight size={14} />
              </span>
            </a>
          </div>

          {/* Card 3 - Private Portfolio */}
          <div className="bg-ivory border border-slate/10 rounded-[2.5rem] p-6 sm:p-8 md:p-10 flex flex-col justify-between hover-lift shadow-[0_10px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
            <div className="flex flex-col gap-6 text-left">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate uppercase tracking-wider">Level 03</span>
                <span className="px-3 py-1 bg-slate/5 text-slate rounded-full text-xs font-mono">VIP</span>
              </div>
              <div>
                <h3 className="font-sans font-black text-xl sm:text-2xl text-obsidian uppercase tracking-tight">Private Portfolio</h3>
                <p className="font-sans text-xs text-slate mt-2 leading-relaxed">
                  Bespoke off-market developer blocks and multi-unit acquisition mandates.
                </p>
              </div>
              <div className="border-t border-slate/10 pt-6 flex flex-col gap-4">
                <span className="font-sans text-obsidian font-black text-3xl sm:text-5xl tracking-tight">
                  Custom
                </span>
                <p className="text-xs text-slate font-mono">Retainer-based structure</p>
              </div>
              <ul className="flex flex-col gap-3 font-mono text-xs text-slate pt-4">
                <li className="flex items-center gap-2"><Check size={14} className="text-champagne" /> Custom shadow catalog scans</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-champagne" /> Bulk multi-unit pre-sale blocks</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-champagne" /> Dedicated legal & escrow liaison</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-champagne" /> API endpoint shadow alerts</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-champagne" /> Developer funding matching</li>
              </ul>
            </div>
            <a href="#consultation" className="btn-magnetic group w-full mt-8 md:mt-10 border border-slate/20 font-sans font-semibold text-xs uppercase tracking-wider py-4 rounded-full text-obsidian hover:border-obsidian text-center">
              <span className="btn-slide bg-slate/5"></span>
              <span className="btn-magnetic-text">Request allocation</span>
            </a>
          </div>

        </div>

        {/* Large Centered Consultation Hook */}
        <div id="consultation" className="mt-20 md:mt-24 bg-obsidian text-ivory rounded-[3rem] p-6 sm:p-8 md:p-16 text-left border border-champagne/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="absolute inset-0 z-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <circle cx="90" cy="50" r="40" stroke="#C9A84C" stroke-width="0.3" fill="none" stroke-dasharray="2 4" />
            </svg>
          </div>
          
          <div className="relative z-10 max-w-xl flex flex-col gap-3 sm:gap-4">
            <span className="font-mono text-xs uppercase tracking-widest text-champagne flex items-center gap-2">
              <Lock size={12} /> Secure Connection Established
            </span>
            <h3 className="font-sans font-black text-xl sm:text-3xl uppercase tracking-tight">
              Request Sourcing Allocation
            </h3>
            <p className="font-sans text-xs sm:text-sm text-slate leading-relaxed">
              Initiate zero-commission portfolio tracking. All consultation requests are processed through secure digital agreements with verified developer channels.
            </p>
          </div>
          
          <div className="relative z-10 w-full md:w-auto">
            <a href="mailto:acquire@vanguardliving.com" className="btn-magnetic group w-full md:w-auto bg-champagne text-obsidian font-sans font-bold text-xs sm:text-sm uppercase tracking-wider px-8 sm:px-10 py-4.5 sm:py-5 rounded-full flex items-center justify-center gap-2 shadow-lg">
              <span className="btn-slide bg-ivory"></span>
              <span className="btn-magnetic-text gap-2">
                Book a private consultation <ArrowUpRight size={16} />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* G. FOOTER */}
      <footer className="bg-obsidian text-slate py-16 md:py-20 px-6 rounded-t-[3rem] sm:rounded-t-[4rem] border-t border-slate/10 relative z-40">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 text-left mb-16">
          
          {/* Col 1 */}
          <div className="flex flex-col gap-6">
            <a href="#" className="font-sans font-extrabold tracking-tight text-lg sm:text-xl text-ivory flex items-center gap-2">
              <span className="text-champagne">VA</span>
              <span>VANGUARD LIVING</span>
            </a>
            <p className="font-sans text-xs leading-relaxed text-slate max-w-xs">
              Next-generation property technology. Sourcing off-market penthouse architectures through verified developer pricing APIs. Zero-commission transactions.
            </p>
            {/* Live listings update indicator */}
            <div className="flex items-center gap-2.5 font-mono text-[10px] text-green-400 bg-green-500/10 px-4 py-2 border border-green-500/20 rounded-full w-fit">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-ping"></span>
              <span>LISTINGS_LIVE • {currentTime}</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <h4 className="font-sans font-bold text-xs uppercase text-ivory tracking-widest">Portfolios</h4>
            <a href="#" className="font-sans text-xs text-slate hover:text-champagne transition-colors">Seattle Core Penthouses</a>
            <a href="#" className="font-sans text-xs text-slate hover:text-champagne transition-colors">Bellevue Sky Villas</a>
            <a href="#" className="font-sans text-xs text-slate hover:text-champagne transition-colors">Developer Allocation Batches</a>
            <a href="#" className="font-sans text-xs text-slate hover:text-champagne transition-colors">Under-Market Analytics</a>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <h4 className="font-sans font-bold text-xs uppercase text-ivory tracking-widest">Protocol</h4>
            <a href="#features" className="font-sans text-xs text-slate hover:text-champagne transition-colors">Diagnostic Sourcing</a>
            <a href="#philosophy" className="font-sans text-xs text-slate hover:text-champagne transition-colors">Direct API Settle</a>
            <a href="#protocol" className="font-sans text-xs text-slate hover:text-champagne transition-colors">Contract Integration</a>
            <a href="#pricing" className="font-sans text-xs text-slate hover:text-champagne transition-colors">Access Level Pricing</a>
          </div>

          {/* Col 4 */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <h4 className="font-sans font-bold text-xs uppercase text-ivory tracking-widest">Security & Compliance</h4>
            <span className="font-mono text-xs text-slate flex items-center gap-2">
              <Lock size={12} className="text-champagne" /> TLS SECURED TUNNEL
            </span>
            <span className="font-mono text-xs text-slate flex items-center gap-2">
              <Database size={12} className="text-champagne" /> ENCRYPTED REGISTRY
            </span>
            <span className="font-mono text-xs text-slate flex items-center gap-2">
              <Cpu size={12} className="text-champagne" /> SHADOW INDEX ACTIVE
            </span>
          </div>

        </div>

        <div className="max-w-7xl mx-auto w-full pt-8 border-t border-slate/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono">
          <div className="text-slate/60 text-center md:text-left">
            &copy; {new Date().getFullYear()} Vanguard Living Technologies Inc. All rights reserved. Sourced direct-contracts pipeline.
          </div>
          <div className="flex gap-6 text-slate/60">
            <a href="#" className="hover:text-champagne transition-colors">Privacy Key</a>
            <a href="#" className="hover:text-champagne transition-colors">Escrow Terms</a>
            <a href="#" className="hover:text-champagne transition-colors">Regulatory Index</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

/* ----------------------------------------------------
   SUB-COMPONENTS (Defined inline to adhere to rules)
   ---------------------------------------------------- */

// Card 1 — "Diagnostic Shuffler"
function DiagnosticShuffler() {
  const [shuffleIdx, setShuffleIdx] = useState(0);
  
  const shuffleData = [
    {
      label: "Yield Forecasting",
      desc: "Predictive analysis of long-term rental appreciation metrics in Downtown Seattle.",
      value: "8.42% APR",
      dataLabel: "EST_YIELD"
    },
    {
      label: "Micro-Market Heatmaps",
      desc: "Block-by-block buyer demand tracking across high-rise zones.",
      value: "94.8 Index",
      dataLabel: "DEMAND_VOLUME"
    },
    {
      label: "Off-Market Valuation",
      desc: "Automated neural net estimate matching real-time developer liquidity.",
      value: "$1.4M Direct",
      dataLabel: "FAIR_VALUE"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setShuffleIdx((prev) => (prev + 1) % shuffleData.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const getStyle = (idx) => {
    const position = (idx - shuffleIdx + shuffleData.length) % shuffleData.length;
    if (position === 0) {
      return {
        transform: 'translateY(0) scale(1) translateZ(0)',
        zIndex: 30,
        opacity: 1,
        filter: 'blur(0px)',
      };
    } else if (position === 1) {
      return {
        transform: 'translateY(24px) scale(0.92) translateZ(-10px)',
        zIndex: 20,
        opacity: 0.75,
        filter: 'blur(1.5px)',
      };
    } else {
      return {
        transform: 'translateY(48px) scale(0.84) translateZ(-20px)',
        zIndex: 10,
        opacity: 0.4,
        filter: 'blur(3px)',
      };
    }
  };

  return (
    <div className="bg-ivory border border-slate/10 rounded-[2.5rem] p-6 sm:p-8 md:p-10 flex flex-col justify-between hover-lift shadow-[0_10px_30px_rgba(0,0,0,0.02)] h-[440px] sm:h-[450px]">
      <div className="text-left">
        <div className="flex items-center justify-between mb-6">
          <span className="font-mono text-xs uppercase tracking-wider text-slate">AI Analysis</span>
          <span className="font-mono text-xs text-champagne bg-obsidian px-2.5 py-1 rounded-md">DIAGNOSTIC_V1</span>
        </div>
        <h3 className="font-sans font-black text-xl sm:text-2xl text-obsidian uppercase tracking-tight">
          Diagnostic Shuffler
        </h3>
        <p className="font-sans text-xs text-slate mt-2 leading-relaxed">
          Cycle and review algorithmic valuation datasets generated directly from the source pipeline.
        </p>
      </div>

      {/* Overlapping Deck */}
      <div className="relative w-full h-[200px] mt-4 flex justify-center items-start">
        {shuffleData.map((item, idx) => (
          <div
            key={idx}
            style={getStyle(idx)}
            className="absolute top-0 w-full bg-obsidian text-ivory border border-slate/10 p-5 rounded-3xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] text-left flex flex-col justify-between h-[145px] shadow-lg"
          >
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] text-champagne tracking-widest uppercase">{item.dataLabel}</span>
              <span className="font-sans font-bold text-xs sm:text-sm text-ivory">{item.label}</span>
              <p className="text-[10px] text-slate leading-normal line-clamp-2 mt-1">{item.desc}</p>
            </div>
            <div className="flex justify-between items-center border-t border-slate/10 pt-2 font-mono text-xs">
              <span className="text-slate">Result Matrix</span>
              <span className="text-champagne font-bold">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Card 2 — "Telemetry Typewriter"
function TelemetryTypewriter() {
  const typewriterMessages = [
    "FETCHING DIRECT DEVELOPER CATALOG... DONE.",
    "BYPASSING THIRD-PARTY COMMISSIONS... 100% SAVED.",
    "ACCESSING ORIGINAL BASE UNIT COSTS... VERIFIED.",
    "ALIGNED: Shadow valuation matched Seattle averages."
  ];

  const [messageIdx, setMessageIdx] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(50);

  useEffect(() => {
    let timer;
    const fullMessage = typewriterMessages[messageIdx];

    if (!isDeleting) {
      if (currentText.length < fullMessage.length) {
        timer = setTimeout(() => {
          setCurrentText(fullMessage.substring(0, currentText.length + 1));
        }, typingSpeed);
      } else {
        // Pause at completion
        timer = setTimeout(() => {
          setIsDeleting(true);
          setTypingSpeed(25);
        }, 3000);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(fullMessage.substring(0, currentText.length - 1));
        }, typingSpeed);
      } else {
        setIsDeleting(false);
        setMessageIdx((prev) => (prev + 1) % typewriterMessages.length);
        setTypingSpeed(80);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, messageIdx]);

  return (
    <div className="bg-ivory border border-slate/10 rounded-[2.5rem] p-6 sm:p-8 md:p-10 flex flex-col justify-between hover-lift shadow-[0_10px_30px_rgba(0,0,0,0.02)] h-[440px] sm:h-[450px]">
      <div className="text-left w-full">
        <div className="flex items-center justify-between mb-6">
          <span className="font-mono text-xs uppercase tracking-wider text-slate">Live pricing</span>
          <span className="flex items-center gap-1.5 font-mono text-xs text-red-500 font-semibold">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span> Live Feed
          </span>
        </div>
        <h3 className="font-sans font-black text-xl sm:text-2xl text-obsidian uppercase tracking-tight">
          Telemetry Typewriter
        </h3>
        <p className="font-sans text-xs text-slate mt-2 leading-relaxed">
          Monitor transactional database connections and direct valuation handshakes in real-time.
        </p>
      </div>

      {/* Terminal View */}
      <div className="bg-obsidian border border-slate/10 p-5 rounded-3xl w-full h-[180px] mt-4 font-mono text-left text-xs flex flex-col justify-between shadow-inner overflow-hidden select-none">
        <div className="flex items-center gap-1.5 border-b border-slate/10 pb-2 text-[9px] sm:text-[10px] text-slate">
          <div className="w-2.5 h-2.5 rounded-full bg-slate/20"></div>
          <span>SECURE SHELL CONNECTION (PORT_8080)</span>
        </div>
        <div className="flex-1 flex flex-col justify-between py-1 text-slate leading-relaxed text-[11px] mt-1">
          <div>
            <span className="text-champagne">root@vanguard:~#</span> {currentText}
            <span className="inline-block w-1.5 h-3.5 bg-champagne ml-1 animate-[pulse_1s_infinite]"></span>
          </div>
          <div className="text-[10px] text-slate/50 border-t border-slate/10 pt-2 flex justify-between">
            <span>PACKET_LOSS: 0%</span>
            <span>PING: 14ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Card 3 — "Cursor Protocol Scheduler"
function CursorProtocolScheduler() {
  const calendarContainerRef = useRef(null);
  const cursorRef = useRef(null);
  const buttonRef = useRef(null);
  const gridCellsRef = useRef([]);

  const days = [
    { label: "S", active: false },
    { label: "M", active: false },
    { label: "T", active: false },
    { label: "W", active: false },
    { label: "T", active: false },
    { label: "F", active: false },
    { label: "S", active: false }
  ];

  useEffect(() => {
    if (!cursorRef.current || !calendarContainerRef.current) return;
    
    let tl;

    const initTimeline = () => {
      if (tl) tl.kill();

      const container = calendarContainerRef.current;
      const cursor = cursorRef.current;
      const targetCell = gridCellsRef.current[3];
      const targetButton = buttonRef.current;

      if (!targetCell || !targetButton) return;

      // Calculate relative coordinates dynamically to ensure perfect responsive tracking
      const parentRect = container.getBoundingClientRect();
      const cellRect = targetCell.getBoundingClientRect();
      const btnRect = targetButton.getBoundingClientRect();

      const cellX = cellRect.left - parentRect.left + cellRect.width / 2;
      const cellY = cellRect.top - parentRect.top + cellRect.height / 2;

      const btnX = btnRect.left - parentRect.left + btnRect.width / 2;
      const btnY = btnRect.top - parentRect.top + btnRect.height / 2;

      // Start cursor at the bottom right corner
      const startX = parentRect.width - 20;
      const startY = parentRect.height - 20;

      tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
      
      // Reset animation state
      tl.set(cursor, { x: startX, y: startY, opacity: 0, scale: 1 });
      gridCellsRef.current.forEach((cell) => {
        if (cell) cell.classList.remove('bg-champagne', 'text-obsidian', 'scale-95');
      });
      if (targetButton) {
        targetButton.classList.remove('scale-95', 'bg-champagne/20', 'border-champagne');
      }

      // 1. Enter simulated cursor
      tl.to(cursor, { opacity: 1, duration: 0.3 });

      // 2. Select Wednesday cell
      tl.to(cursor, { 
        x: cellX, 
        y: cellY, 
        duration: 1.2, 
        ease: "power2.out" 
      });
      
      // Simulating click
      tl.to(cursor, { scale: 0.8, duration: 0.1 });
      tl.to(targetCell, { scale: 0.95, duration: 0.1 }, "<");
      tl.add(() => {
        targetCell.classList.add('bg-champagne', 'text-obsidian');
      });
      tl.to(cursor, { scale: 1, duration: 0.1 });
      tl.to(targetCell, { scale: 1, duration: 0.1 }, "<");

      // 3. Move cursor to booking action button
      tl.to(cursor, { 
        x: btnX, 
        y: btnY, 
        duration: 0.9, 
        ease: "power2.out" 
      }, "+=0.4");
      
      // Simulating click
      tl.to(cursor, { scale: 0.8, duration: 0.1 });
      tl.to(targetButton, { scale: 0.95, duration: 0.1 }, "<");
      tl.add(() => {
        targetButton.classList.add('bg-champagne/20', 'border-champagne');
      });
      tl.to(cursor, { scale: 1, duration: 0.1 });
      tl.to(targetButton, { scale: 1, duration: 0.1 }, "<");

      // 4. Fade cursor out
      tl.to(cursor, { opacity: 0, duration: 0.4 }, "+=0.8");
    };

    // Initialize after a tiny timeout to ensure page fonts and positions are settled
    const timer = setTimeout(initTimeline, 500);

    const handleResize = () => {
      clearTimeout(timer);
      initTimeline();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (tl) tl.kill();
    };
  }, []);

  return (
    <div className="bg-ivory border border-slate/10 rounded-[2.5rem] p-6 sm:p-8 md:p-10 flex flex-col justify-between hover-lift shadow-[0_10px_30px_rgba(0,0,0,0.02)] h-[440px] sm:h-[450px]">
      <div className="text-left">
        <div className="flex items-center justify-between mb-6">
          <span className="font-mono text-xs uppercase tracking-wider text-slate">Zero Markup</span>
          <span className="font-mono text-xs text-champagne bg-obsidian px-2.5 py-1 rounded-md">SCHEDULER_V1</span>
        </div>
        <h3 className="font-sans font-black text-xl sm:text-2xl text-obsidian uppercase tracking-tight">
          Zero-Commission Buying
        </h3>
        <p className="font-sans text-xs text-slate mt-2 leading-relaxed">
          Lock direct pre-sale allocations on Wednesday batches bypass agent-led pricing inflation.
        </p>
      </div>

      {/* Calendar Grid container */}
      <div 
        ref={calendarContainerRef}
        className="relative bg-obsidian border border-slate/10 p-5 rounded-3xl w-full h-[180px] mt-4 flex flex-col justify-between shadow-inner select-none overflow-hidden"
      >
        {/* Day row */}
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day, idx) => (
            <div
              key={idx}
              ref={(el) => (gridCellsRef.current[idx] = el)}
              className="h-10 rounded-xl bg-slate/5 border border-slate/10 text-ivory font-sans font-bold text-xs flex items-center justify-center transition-all duration-300"
            >
              {day.label}
            </div>
          ))}
        </div>

        {/* Lock Valuation CTA button in simulated screen */}
        <div 
          ref={buttonRef}
          className="w-full text-center py-3 border border-slate/10 rounded-2xl font-mono text-[9px] sm:text-[10px] text-ivory uppercase tracking-wider transition-all duration-300"
        >
          DIRECT ALLOCATION RESERVED
        </div>

        {/* Animated Simulated Cursor */}
        <div 
          ref={cursorRef} 
          className="absolute z-50 pointer-events-none origin-top-left"
          style={{ width: '18px', height: '18px', left: 0, top: 0 }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="drop-shadow-md">
            <path d="M4.5 3V17.5L9.5 13.2L14.8 21L17.5 19.2L12.3 11.5L18.5 11.5L4.5 3Z" fill="#C9A84C" stroke="#0D0D12" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------
   SVG MOTION COMPONENT ARCHITECTURE
   ---------------------------------------------------- */

// SVG 1: Rotating concentric property boundary rings
function ConcentricRingsSVG() {
  return (
    <svg className="w-full h-full max-w-[280px] max-h-[280px] opacity-[0.14]" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" stroke="#C9A84C" strokeWidth="0.1" fill="none" strokeDasharray="2 3" />
      <circle cx="50" cy="50" r="35" stroke="#FAF8F5" strokeWidth="0.05" fill="none" />
      <circle cx="50" cy="50" r="28" stroke="#C9A84C" strokeWidth="0.1" fill="none" strokeDasharray="5 2" />
      <circle cx="50" cy="50" r="18" stroke="#FAF8F5" strokeWidth="0.1" fill="none" />
      
      {/* Rotating scans */}
      <line x1="50" y1="50" x2="50" y2="5" stroke="#C9A84C" strokeWidth="0.25" className="origin-center animate-[spin_16s_linear_infinite]" />
      <line x1="50" y1="50" x2="85" y2="50" stroke="#FAF8F5" strokeWidth="0.15" className="origin-center animate-[spin_26s_linear_infinite_reverse]" />
      <circle cx="50" cy="5" r="1" fill="#C9A84C" className="origin-center animate-[spin_16s_linear_infinite]" />
    </svg>
  );
}

// SVG 2: Horizontal laser scan over property grid data
function ScanningGridSVG() {
  return (
    <svg className="w-full h-full max-w-[400px] max-h-[260px] opacity-[0.09]" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="laser" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0" />
          <stop offset="50%" stopColor="#C9A84C" stopOpacity="1" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Grid lines */}
      <path d="M10,0 L10,100 M20,0 L20,100 M30,0 L30,100 M40,0 L40,100 M50,0 L50,100 M60,0 L60,100 M70,0 L70,100 M80,0 L80,100 M90,0 L90,100" stroke="#FAF8F5" strokeWidth="0.05" />
      <path d="M0,10 L100,10 M0,20 L100,20 M0,30 L100,30 M0,40 L100,40 M0,50 L100,50 M0,60 L100,60 M0,70 L100,70 M0,80 L100,80 M0,90 L100,90" stroke="#FAF8F5" strokeWidth="0.05" />
      
      {/* Scanning Bar */}
      <rect x="0" y="0" width="100" height="6" fill="url(#laser)" className="animate-laser" />
    </svg>
  );
}

// SVG 3: Heartbeat price EKG path animation
function EKGWaveformSVG() {
  return (
    <svg className="w-full h-full max-w-[500px] max-h-[160px] opacity-[0.11]" viewBox="0 0 200 100" preserveAspectRatio="none">
      <path 
        d="M0,50 L40,50 L48,25 L53,75 L58,40 L63,60 L68,50 L110,50 L118,15 L123,85 L128,35 L133,65 L138,50 L200,50" 
        fill="none" 
        stroke="#C9A84C" 
        strokeWidth="1.2" 
        strokeDasharray="800" 
        strokeDashoffset="800" 
        className="animate-ekg"
      />
    </svg>
  );
}
