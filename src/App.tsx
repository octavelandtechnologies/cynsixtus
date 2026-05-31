import React, { useState, useEffect } from 'react';
import { 
  PenTool, 
  Building, 
  Building2, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Linkedin, 
  CheckCircle2, 
  Calculator, 
  ChevronDown, 
  ArrowRight, 
  Menu, 
  X, 
  Clock, 
  Award, 
  CornerDownRight, 
  Send,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Data sources
import { SERVICES, PROJECTS, TESTIMONIALS, FAQS, KEY_METRICS, Service, Project } from './data';

// Hero Image Source
import cynsixtusHero from './assets/images/cynsixtus_hero_1780267438884.png';

export default function App() {
  // Navigation States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);

  // Modal / Detail States
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Quote Estimator States
  const [quoteService, setQuoteService] = useState('construction');
  const [quoteArea, setQuoteArea] = useState(150); // SQM
  const [quoteFinish, setQuoteFinish] = useState('premium');
  const [estimateResult, setEstimateResult] = useState({ min: 0, max: 0 });

  // Contact Form States
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: 'General Construction', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Show Back-to-Top Button
  const [showToTop, setShowToTop] = useState(false);

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      // Sticky header background
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Show back to top button
      if (window.scrollY > 600) {
        setShowToTop(true);
      } else {
        setShowToTop(false);
      }

      // Dynamic Section Active States
      const sections = ['hero', 'about', 'services', 'projects', 'why-us', 'quote', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Recalculate interactive quote costing on input change
  useEffect(() => {
    let baseRateSqm = 120000; // Standard building rate in Naira (₦) (approx 120k/sqm)
    
    if (quoteService === 'arch') {
      baseRateSqm = 15000; // Plan drawing rate/sqm
    } else if (quoteService === 'eng') {
      baseRateSqm = 10000; // Structural analysis rate/sqm
    } else if (quoteService === 'contract') {
      baseRateSqm = 45000; // Materials advisory procurement rate/sqm
    }

    // Adjust rate by finish tier
    let multiplier = 1.0;
    if (quoteFinish === 'luxury') {
      multiplier = 1.6;
    } else if (quoteFinish === 'standard') {
      multiplier = 0.85;
    }

    const calculatedBase = baseRateSqm * quoteArea * multiplier;
    setEstimateResult({
      min: Math.round(calculatedBase * 0.95),
      max: Math.round(calculatedBase * 1.15)
    });
  }, [quoteService, quoteArea, quoteFinish]);

  // Icons mapper for services helper
  const renderServiceIcon = (iconName: string, className: string = "w-6 h-6") => {
    switch (iconName) {
      case 'PenTool':
        return <PenTool className={className} id={`icon-${iconName}`} />;
      case 'HardHat':
        return <Building className={className} id={`icon-${iconName}`} />;
      case 'Construction':
        return <Building2 className={className} id={`icon-${iconName}`} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} id={`icon-${iconName}`} />;
      default:
        return <Building className={className} id={`icon-default`} />;
    }
  };

  // Format currencies beautifully in Central Bank Nigerian Naira (₦)
  const formatNaira = (number: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(number);
  };

  // Sync estimate to Contact Form message
  const applyEstimateToForm = () => {
    const serviceLabel = SERVICES.find(s => s.id === quoteService)?.title || 'Selected Service';
    const finishLabel = quoteFinish.toUpperCase();
    const minStr = formatNaira(estimateResult.min);
    const maxStr = formatNaira(estimateResult.max);

    setFormData(prev => ({
      ...prev,
      service: serviceLabel,
      message: `Dear Cynsixtus Solutions, I requested a ballpark quote estimate using your web tool:\n- Space Scope: ${quoteArea} SQM (${Math.round(quoteArea * 10.76)} sqft)\n- Finished Tier: ${finishLabel}\n- Estimated Price Range: ${minStr} - ${maxStr}\n\nI would love to schedule a custom consultation.`
    }));

    // Scroll to contact form
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Direct WhatsApp dispatch with preset parameters
  const handleWhatsAppQuote = () => {
    const serviceLabel = SERVICES.find(s => s.id === quoteService)?.title || 'Selected Service';
    const finishLabel = quoteFinish.toUpperCase();
    const minStr = formatNaira(estimateResult.min);
    const maxStr = formatNaira(estimateResult.max);
    
    const text = `Hello Cynsixtus Solutions Limited (RC: 9297918),\n\nI would like to request a professional construction/engineering quote.\n\nEstimator parameters:\n- Service: ${serviceLabel}\n- Scope: ${quoteArea} Sqm\n- Finish Level: ${finishLabel}\n- Estimated Pricing: ${minStr} to ${maxStr}\n\nPlease get back to me. Thanks!`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/2348061449876?text=${encodedText}`, '_blank');
  };

  // General Form submission handling
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields (Name, Email, Phone).');
      return;
    }
    setIsSubmitting(true);
    
    // Simulate API request endpoint securely
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      
      // Clear fields upon simulated success
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: '', email: '', phone: '', service: 'General Construction', message: '' });
      }, 5000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand-primary/20 selection:text-brand-primary" id="landing-root">
      
      {/* 24-HOUR FLOATING WHATSAPP BUTTON */}
      <a 
        href="https://wa.me/2348061449876?text=Hello%20Cynsixtus%20Solutions%20Limited%2C%20I%20would%20like%20to%20inquire%20about%20your%20services."
        target="_blank"
        rel="noopener noreferrer"
        id="floating-whatsapp-btn"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-green-400"
        title="Chat on WhatsApp"
      >
        <span className="absolute -left-36 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap font-medium">
          Chat Directly (08061449876)
        </span>
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-35 animate-ping -z-10"></span>
        <MessageSquare className="w-6 h-6 fill-current" />
      </a>

      {/* BACK TO TOP BUTTON */}
      <AnimatePresence>
        {showToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            id="back-to-top-btn"
            className="fixed bottom-24 right-7 z-45 bg-slate-900 hover:bg-slate-800 text-white p-3 rounded-full shadow-xl flex items-center justify-center transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none"
            aria-label="Back to Top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* STICKY NAVIGATION BAR */}
      <header 
        id="main-navigation"
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/50 py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#hero" className="flex items-center space-x-3 group" id="logo-link">
            <img 
              src={`${import.meta.env.BASE_URL}logo.png`} 
              alt="Cynsixtus Solutions Logo" 
              className="w-10 h-10 rounded-lg object-contain shadow-md group-hover:shadow-lg transition-all"
            />
            <div>
              <span className="block font-display font-bold text-lg leading-tight text-slate-900 group-hover:text-brand-primary transition-colors">
                Cynsixtus Solutions
              </span>
              <span className="block text-[10px] font-mono tracking-widest text-[#800e0e] font-semibold">
                RC: 9297918
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8" id="desktop-nav">
            {[
              { id: 'about', label: 'Company Profile' },
              { id: 'services', label: 'Our Services' },
              { id: 'projects', label: 'Portfolio' },
              { id: 'why-us', label: 'Strategic Edge' },
              { id: 'quote', label: 'Interactive Estimator' },
              { id: 'contact', label: 'Get In Touch' },
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                id={`nav-${link.id}`}
                className={`font-medium text-sm transition-colors relative py-2 ${
                  activeSection === link.id 
                    ? 'text-brand-primary' 
                    : 'text-slate-600 hover:text-brand-primary'
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.span 
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-primary"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Dynamic Action Buttons on Header */}
          <div className="hidden lg:flex items-center space-x-4">
            <a 
              href="tel:+2348061449876" 
              className="text-xs font-mono font-bold text-slate-700 hover:text-brand-primary flex items-center space-x-1.5"
              id="header-phone-link"
            >
              <Phone className="w-3.5 h-3.5 text-[#800e0e]" />
              <span>0806 144 9876</span>
            </a>
            <a 
              href="#quote" 
              className="bg-brand-primary hover:bg-brand-secondary text-white px-5 py-2 rounded-lg font-medium text-xs shadow-md shadow-brand-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
              id="header-cta-quote"
            >
              Get Custom Quote
            </a>
          </div>

          {/* Mobile Hamburguer Buttons */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-800 hover:text-brand-primary focus:outline-none"
            aria-label="Toggle Menu"
            id="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-slate-200 shadow-xl overflow-hidden mt-2"
              id="mobile-drawer"
            >
              <div className="px-6 py-4 flex flex-col space-y-4">
                {[
                  { id: 'about', label: 'Company Profile' },
                  { id: 'services', label: 'Our Services' },
                  { id: 'projects', label: 'Portfolio' },
                  { id: 'why-us', label: 'Why Choose Us' },
                  { id: 'quote', label: 'Interactive Estimator' },
                  { id: 'contact', label: 'Get In Touch' },
                ].map((link) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    id={`mobile-nav-${link.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-2 text-base font-semibold border-b border-slate-100 ${
                      activeSection === link.id 
                        ? 'text-brand-primary pl-2 border-l-4 border-l-brand-primary' 
                        : 'text-slate-700 hover:text-brand-primary'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
                
                <div className="pt-2 flex flex-col space-y-3">
                  <a 
                    href="tel:+2348061449876" 
                    className="flex items-center space-x-2 text-slate-700 py-2 text-sm font-semibold"
                  >
                    <Phone className="w-4 h-4 text-[#800e0e]" />
                    <span>Call Us: 0806 144 9876</span>
                  </a>
                  <a 
                    href="mailto:info@cynsixtus.com" 
                    className="flex items-center space-x-2 text-slate-700 py-2 text-sm font-semibold"
                  >
                    <Mail className="w-4 h-4 text-brand-primary" />
                    <span>Email us directly</span>
                  </a>
                  <a 
                    href="#quote" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="bg-brand-primary hover:bg-brand-secondary text-white py-3 px-4 rounded-xl text-center font-bold text-sm shadow-md block"
                  >
                    Calculate Cost Estimates
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* SECTION 1: HERO / BANNER SECTION */}
      <section 
        id="hero"
        className="relative min-h-[95vh] flex items-center pt-24 pb-16 overflow-hidden bg-slate-950 text-white"
      >
        {/* Background custom asset loaded dynamically */}
        <div className="absolute inset-0 z-0">
          <img 
            src={cynsixtusHero} 
            alt="Cynsixtus Solutions Headquarters Architecture Design" 
            className="w-full h-full object-cover object-center opacity-40 scale-105 animate-pulse" 
            style={{ animationDuration: '8s' }}
            referrerPolicy="no-referrer"
            id="hero-bg-img"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Copy */}
            <div className="lg:col-span-8 space-y-8 text-left">
              
              <div className="inline-flex items-center space-x-2.5 bg-brand-primary/15 border border-brand-primary/30 px-3.5 py-1.5 rounded-full text-brand-primary text-xs font-semibold backdrop-blur-md" id="badge-incorporated">
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-ping"></span>
                <span>Incorporated under RC: 9297918</span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[1.1] max-w-4xl" id="hero-heading">
                Building Excellence. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-emerald-400">
                  Designing the Future.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl" id="hero-subheading">
                Cynsixtus Solutions Limited is Nigeria's premier engineering and construction authority. We engineer high-integrity structural builds, craft approved architectural blueprints, and manage turnkey physical projects on time and on budget.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <a 
                  href="#contact" 
                  className="bg-brand-primary hover:bg-brand-secondary text-white text-base py-4 px-8 rounded-xl font-bold shadow-xl shadow-brand-primary/25 text-center transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center space-x-2 group"
                  id="hero-cta-btn"
                >
                  <span>Request Free Consultation</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </a>
                <a 
                  href="#quote" 
                  className="bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 text-base py-4 px-8 rounded-xl font-bold text-center transition-all hover:border-brand-primary flex items-center justify-center space-x-2"
                  id="hero-secondary-btn"
                >
                  <Calculator className="w-5 h-5 text-brand-primary" />
                  <span>Cost Ballpark Estimator</span>
                </a>
              </div>

              {/* Instant Social proof stats in Hero */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-800/80 max-w-3xl" id="hero-stats">
                {KEY_METRICS.map((metric, i) => (
                  <div key={i} className="space-y-1">
                    <span className="block font-display font-extrabold text-2xl lg:text-3xl text-brand-primary">
                      {metric.value}
                    </span>
                    <span className="block text-xs font-medium text-slate-400 uppercase tracking-widest leading-none">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* Quick Contact Highlight / Callout Container */}
            <div className="lg:col-span-4 hidden lg:block">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl space-y-6"
                id="hero-quick-card"
              >
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-xl text-white">Nigeria Operations</h3>
                  <p className="text-sm text-slate-300">Speak directly with our senior construction estimator and design architect.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary mt-1">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-mono text-slate-400 capitalize">Call Desk</span>
                      <a href="tel:+2348061449876" className="block text-base font-bold text-white hover:text-brand-primary">
                        +234 806 144 9876
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-[#25D366]/10 rounded-xl text-[#25D366] mt-1">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-mono text-slate-400 capitalize">WhatsApp Chat</span>
                      <a href="https://wa.me/2348061449876" className="block text-base font-bold text-white hover:text-[#25D366] transition-colors">
                        Available Now
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-brand-accent/20 rounded-xl text-rose-500 mt-1 animate-pulse">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-mono text-slate-400 capitalize">Weekly Schedule</span>
                      <span className="block text-sm font-semibold text-slate-200">
                        Mon - Sat, 8:00am - 6:00pm
                      </span>
                    </div>
                  </div>
                </div>

                <div className="h-[1px] bg-white/10 my-4"></div>
                <div className="text-center">
                  <span className="inline-block text-[10px] font-mono bg-brand-primary/20 text-brand-primary px-3 py-1 rounded-full font-bold">
                    RC REGISTRATION VERIFIED
                  </span>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT COMPANY & PROFILE */}
      <section id="about" className="py-24 bg-white relative overflow-hidden">
        {/* Subtle geometric grid background */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#049d16 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* About Images Collage / Grid Accent */}
            <div className="lg:col-span-5 relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                <img 
                  src={PROJECTS[2].image} 
                  alt="Architectural team plans and blueprint outlines" 
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  id="about-main-img"
                />
              </div>

              {/* Absolute Card for registered CAC */}
              <div 
                className="absolute -bottom-8 -right-4 lg:-right-8 bg-slate-900 text-white p-6 rounded-2xl shadow-2xl border border-brand-primary/30 z-20 max-w-xs"
                id="about-cac-box"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Award className="w-8 h-8 text-brand-primary shrink-0" />
                  <div>
                    <h4 className="font-display font-bold text-sm leading-tight text-white">Federal Republic of Nigeria</h4>
                    <p className="text-[10px] font-mono text-slate-400">CAC Incorporated Identity</p>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700 text-center">
                  <span className="block text-xs font-medium text-slate-300">REGISTRATION CERTIFICATE</span>
                  <span className="block font-mono font-bold text-lg text-brand-primary tracking-wider" id="about-rc-number">
                    RC NO: 9297918
                  </span>
                </div>
              </div>
            </div>

            {/* About Writeup */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-sm font-mono font-bold text-brand-primary uppercase tracking-widest block" id="about-section-label">
                  About Our Firm
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 leading-tight" id="about-heading">
                  Engineered Integrity. Built For Generations.
                </h2>
              </div>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed" id="about-desc-1">
                At <strong className="text-slate-900 font-bold">Cynsixtus Solutions Limited</strong>, our reputation is built upon solid foundations, strict mathematical execution, and timeless architectural aesthetics. Incorporated under Nigerian Corporate Affairs Commission <strong className="text-brand-accent font-bold">RC: 9297918</strong>, we bring comprehensive turnkey proficiency to building development, civil infrastructure, and detailed structural designs.
              </p>

              <p className="text-slate-600 text-base leading-relaxed" id="about-desc-2">
                Whether blueprinting luxury residences in Edo State or executing heavy construction contracting across southwestern Nigeria, our priority remains clear: unmatched structural durability, budget discipline, and transparent partner integration. We coordinate professional engineers, high-grade certified masons, and top-tier materials experts.
              </p>

              {/* core values columns */}
              <div className="grid sm:grid-cols-2 gap-4 pt-4" id="about-values">
                {[
                  { title: "Rigorous Safety Formulas", desc: "No guess estimation. All load structural configurations are subjected to stress-tests." },
                  { title: "CAC Incorporated Certified", desc: "Verifiable corporate legitimacy ensures secure transaction legalities." },
                  { title: "Schedules Guarded", desc: "We track and penalize milestones lag, ensuring targeted handovers represent client reality." },
                  { title: "Materials Sourcing Control", desc: "Direct procurement saves money by eliminating unnecessary middle-tier margins." }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-5 h-5 text-[#049d16] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-tight mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center space-x-6">
                <div>
                  <span className="block font-display font-extrabold text-3xl text-slate-900">120+</span>
                  <span className="block text-xs uppercase font-medium tracking-wide text-slate-400">Approved Blueprints</span>
                </div>
                <div className="w-[1px] h-10 bg-slate-200"></div>
                <div>
                  <span className="block font-display font-extrabold text-3xl text-slate-900">₦5B+</span>
                  <span className="block text-xs uppercase font-medium tracking-wide text-slate-400">Project Values Managed</span>
                </div>
                <div className="w-[1px] h-10 bg-slate-200"></div>
                <a 
                  href="#contact" 
                  className="inline-flex items-center space-x-2 text-brand-primary hover:text-brand-secondary font-bold text-sm group"
                  id="about-cta"
                >
                  <span>Meet Our Lead Engineers</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: SERVICES GRID */}
      <section id="services" className="py-24 bg-slate-50 relative border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Section title */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-sm font-mono font-bold text-[#158d26] uppercase tracking-widest block" id="services-section-label">
              Core Capabilities
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight" id="services-heading">
              Comprehensive Architectural & Engineering Services
            </h2>
            <p className="text-slate-500 text-base" id="services-subheading">
              We translate conceptual visions into physical concrete realities, safeguarding functional layouts and long-term durability.
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12" id="services-cards-grid">
            {SERVICES.map((service) => (
              <motion.div
                key={service.id}
                whileHover={{ y: -6 }}
                id={`service-card-${service.id}`}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-lg hover:shadow-xl transition-all flex flex-col h-full"
              >
                <div className="h-48 relative overflow-hidden group">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    id={`service-card-img-${service.id}`}
                  />
                  <div className="absolute top-4 left-4 p-3 bg-white rounded-xl shadow-md text-brand-primary">
                    {renderServiceIcon(service.iconName, "w-5 h-5")}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-semibold flex items-center space-x-1">
                      <span>Click to view details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-brand-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {service.shortDesc}
                    </p>
                  </div>

                  <button 
                    onClick={() => setSelectedService(service)}
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-brand-primary hover:text-white rounded-xl border border-slate-200 font-semibold text-xs text-slate-700 transition-all text-center focus:outline-none"
                    id={`service-card-btn-${service.id}`}
                  >
                    Deep-Dive Overview
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick link below services */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto" id="services-estimator-link">
            <div className="flex items-center space-x-4">
              <div className="p-3.5 bg-[#800e0e]/10 text-[#800e0e] rounded-xl hidden sm:block">
                <Calculator className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div className="space-y-0.5 text-center sm:text-left">
                <h4 className="font-bold text-slate-900 text-sm">Need a projected financial estimate?</h4>
                <p className="text-xs text-slate-500">Calculate budget ranges for drawing and structural work instantly using our custom algorithm.</p>
              </div>
            </div>
            <a 
              href="#quote" 
              className="bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md uppercase tracking-wider shrink-0 w-full md:w-auto text-center"
              id="services-estimator-cta"
            >
              Launch Quote Estimator
            </a>
          </div>

        </div>
      </section>

      {/* SECTION 4: PROJECTS / PORTFOLIO SECTION */}
      <section id="projects" className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div className="space-y-2 max-w-2xl text-left">
              <span className="text-sm font-mono font-bold text-[#158d26] uppercase tracking-widest block" id="portfolio-section-label">
                Operational Portfolio
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 leading-tight" id="portfolio-heading">
                Showcasing Structural Ingenuity
              </h2>
              <p className="text-slate-500 text-base">
                Explore real architectural drafts and actual high-end construction programs executed by our certified engineers across Nigeria.
              </p>
            </div>
            <div className="shrink-0 flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200" id="portfolio-stats-summary">
              <div className="px-3 py-1 bg-white text-xs font-mono font-bold text-slate-800 rounded-lg shadow-sm">
                CAC Verified
              </div>
              <div className="px-3 text-xs font-semibold text-slate-600">
                RC: 9297918
              </div>
            </div>
          </div>

          {/* Grid Layout with hover zooms */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" id="projects-grid">
            {PROJECTS.map((project) => (
              <motion.div 
                key={project.id}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedProject(project)}
                className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-md group cursor-pointer hover:shadow-lg transition-all"
                id={`project-card-${project.id}`}
              >
                <div className="h-60 relative overflow-hidden">
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors z-10"></div>
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    referrerPolicy="no-referrer"
                    id={`project-card-img-${project.id}`}
                  />
                  
                  {/* Category Pill */}
                  <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-mono tracking-wider uppercase font-bold py-1 px-3 rounded-full z-20 border border-white/10 shadow-sm">
                    {project.category}
                  </span>

                  {/* Hover visual arrow */}
                  <div className="absolute top-4 right-4 bg-white/25 backdrop-blur-md text-white p-2.5 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-all border border-white/25">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center space-x-1.5 font-bold">
                      <MapPin className="w-3 h-3 text-[#800e0e]" />
                      <span>{project.location}</span>
                    </span>
                    <span>Completed {project.completionYear}</span>
                  </div>

                  <h3 className="font-display font-bold text-slate-900 group-hover:text-brand-primary transition-colors text-base line-clamp-1">
                    {project.title}
                  </h3>
                  
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Prompt banner detailing authenticity */}
          <p className="text-center text-xs text-slate-400 mt-8" id="portfolio-authenticity-note">
            *Selected models represent artistic engineering configurations. Project specifics reflect legal guidelines registered under RC-9297918.
          </p>

        </div>
      </section>

      {/* SECTION 5: WHY CHOOSE US (STRATEGIC EDGE) */}
      <section id="why-us" className="py-24 bg-slate-50 border-t border-b border-slate-200 relative overflow-hidden">
        
        {/* Subtle geometric circles */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-primary/5 filter blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-brand-accent/5 filter blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Why choose us left block */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-sm font-mono font-bold text-[#158d26] uppercase tracking-widest block" id="why-coose-section-label">
                Guaranteed Excellence
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 leading-tight" id="why-choose-heading">
                Superlative QA Control In Every Blueprint and Build.
              </h2>
              <p className="text-slate-600 text-base leading-relaxed" id="why-choose-desc">
                Cynsixtus Solutions Limited maintains severe standards to safeguard infrastructure. By keeping a tightly integrated network, we eliminate coordination risks between drawing planners and building contractors.
              </p>

              {/* Bullet points array */}
              <div className="space-y-4" id="why-choose-bullets">
                {[
                  { title: "Experienced Engineering Command", desc: "Our supervisors utilize over 15 years combined experience in corporate structural layout calculations." },
                  { title: "Statutory Law Shielding (RC: 9297918)", desc: "Corporate Affairs Commission certified legitimacy protects you against contract disputes or title flaws." },
                  { title: "Direct Material Procurement Integrations", desc: "We utilize direct supplier relationships, securing premium steel and cement rates for clients." },
                  { title: "Turnkey Accountability Handovers", desc: "You maintain a single unified contact channel for drawings, calculations, and active physical masonry." }
                ].map((bullet, i) => (
                  <div key={i} className="flex items-start space-x-4 bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm">
                    <div className="p-2 bg-[#049d16]/10 text-brand-primary rounded-lg mt-0.5">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{bullet.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{bullet.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why choose us right box - interactive stats / testionials */}
            <div className="lg:col-span-6 space-y-8">
              
              {/* Stat callouts block */}
              <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl border border-slate-800 space-y-6" id="why-choose-stats-box">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-xl text-white">Engineering Quality Matrix</h3>
                    <p className="text-xs text-slate-400">Verifying safe loads and architectural design thresholds</p>
                  </div>
                  <Sparkles className="w-6 h-6 text-brand-primary animate-pulse" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700/50">
                    <span className="block text-3xl font-extrabold font-display text-white">0%</span>
                    <span className="block text-xs text-slate-400 font-mono mt-1">Structural failures recorded</span>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700/50">
                    <span className="block text-3xl font-extrabold font-display text-brand-primary">100%</span>
                    <span className="block text-xs text-slate-400 font-mono mt-1">Sate agency approvals secured</span>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700/50">
                    <span className="block text-3xl font-extrabold font-display text-[#25D366]">24/7</span>
                    <span className="block text-xs text-slate-400 font-mono mt-1">Direct support active channels</span>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700/50">
                    <span className="block text-3xl font-extrabold font-display text-rose-500">₦0</span>
                    <span className="block text-xs text-slate-400 font-mono mt-1">Hidden billing surcharges</span>
                  </div>
                </div>

                <div className="text-center py-2 border-t border-slate-800-80">
                  <span className="text-xs text-slate-400 font-mono">
                    Registered entity CAC: Cynsixtus Solutions Limited, 9297918
                  </span>
                </div>
              </div>

              {/* Client Testimonials Carousel (Vertical Stack for maximum read rate) */}
              <div className="space-y-4" id="testimonials-stack">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-mono font-bold uppercase text-slate-500">Client Endorsements</span>
                  <div className="flex items-center space-x-1.5 text-amber-500">
                    {Array(5).fill(0).map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                    <span className="text-slate-800 text-xs font-bold pl-1">5.0 Star Rated</span>
                  </div>
                </div>

                {TESTIMONIALS.slice(0, 2).map((test) => (
                  <div key={test.id} className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-md space-y-3 relative">
                    <div className="absolute right-6 top-6 text-4xl text-slate-100 font-serif leading-none select-none">“</div>
                    <p className="text-xs text-slate-600 leading-relaxed italic relative z-10">
                      "{test.quote}"
                    </p>
                    <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                      <div>
                        <span className="block font-bold text-xs text-slate-900">{test.name}</span>
                        <span className="block text-[10px] text-slate-400">{test.role} • {test.company}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-green-50 text-[#158d26] px-2 py-0.5 rounded-full">
                        Verified Partner
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SECTION 6 & 7: INTERACTIVE BALLPARK ESTIMATOR & FORM */}
      <section id="quote" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono font-bold text-brand-primary uppercase tracking-widest block" id="estimator-section-label">
              Financial Transparency
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight" id="estimator-heading">
              Instant Custom Budget Estimator
            </h2>
            <p className="text-slate-500 text-base" id="estimator-subheading">
              Configure your drawing scale, finish tiers, and calculate a ballpark pricing estimate based on standard Nigerian building matrices.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-stretch" id="estimator-interactive-container">
            
            {/* Estimator Configuration form */}
            <div className="lg:col-span-7 bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-lg flex flex-col justify-between space-y-6">
              
              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
                  <div className="p-2.5 bg-brand-primary/10 text-brand-primary rounded-xl">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900">Configure Scope Parameters</h3>
                    <p className="text-xs text-slate-500">Provide parameters to run base structural budget modeling</p>
                  </div>
                </div>

                {/* Service type select */}
                <div className="space-y-2">
                  <label htmlFor="est-service-select" className="block text-xs font-mono font-bold uppercase text-slate-600">
                    Required Service Category
                  </label>
                  <div className="grid grid-cols-2 gap-3" id="est-service-list">
                    {[
                      { id: 'arch', label: 'Architectural Drawing' },
                      { id: 'eng', label: 'Structural Engineering' },
                      { id: 'const', label: 'Building Construction' },
                      { id: 'contract', label: 'General Contracting' },
                    ].map((srv) => (
                      <button
                        key={srv.id}
                        type="button"
                        id={`btn-est-service-${srv.id}`}
                        onClick={() => setQuoteService(srv.id)}
                        className={`py-3 px-4 rounded-xl text-xs font-bold transition-all text-center border capitalize ${
                          quoteService === srv.id
                            ? 'bg-brand-primary text-white border-brand-primary shadow-md'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {srv.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slider for area (Sqm) */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <div>
                      <span className="block text-[10px] font-mono text-slate-400 capitalize">Area Square Meters</span>
                      <span className="font-display font-extrabold text-slate-900 text-lg">{quoteArea} SQM</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-mono text-slate-400 capitalize">Equivalent Sq Feet</span>
                      <span className="font-display font-medium text-slate-500 text-xs">
                        {Math.round(quoteArea * 10.76)} sqft
                      </span>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    id="est-area-slider"
                    min="30" 
                    max="1500" 
                    value={quoteArea}
                    onChange={(e) => setQuoteArea(parseInt(e.target.value))}
                    className="w-full accent-brand-primary h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>30 Sqm (Mini build)</span>
                    <span>500 Sqm (Standard duplex)</span>
                    <span>1500 Sqm (Larger structures)</span>
                  </div>
                </div>

                {/* Finish / Material Quality Tier selection */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-mono font-bold uppercase text-slate-600">Material & Finishing Profile</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" id="est-quality-list">
                    {[
                      { id: 'standard', name: 'Standard Grade', desc: 'Optimal concrete, standard local finishes' },
                      { id: 'premium', name: 'Premium Grade', desc: 'Superior materials, imported fixtures' },
                      { id: 'luxury', name: 'Luxury Executive', desc: 'Custom structural finishes, designer fixtures' },
                    ].map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        id={`btn-est-quality-${tier.id}`}
                        onClick={() => setQuoteFinish(tier.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          quoteFinish === tier.id
                            ? 'bg-white border-brand-primary ring-2 ring-brand-primary/20 shadow-md'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className={`block font-bold text-xs uppercase ${
                          quoteFinish === tier.id ? 'text-brand-primary' : 'text-slate-800'
                        }`}>{tier.name}</span>
                        <span className="block text-[10px] text-slate-400 leading-tight mt-1">{tier.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Informative footer */}
              <div className="p-4 bg-[#800e0e]/5 border border-[#800e0e]/15 rounded-xl flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-[#800e0e] shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 leading-normal">
                  *Disclaimer: Custom terrain topology, deep soil foundation reinforcements (piling/raft), and local Benin or Lagos planning permit fees vary depending on region. Real construction final sums require verified site engineering surveys.
                </p>
              </div>

            </div>

            {/* Estimator display result right panel */}
            <div className="lg:col-span-5 bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between border border-slate-800">
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-semibold text-lg text-slate-300">Projected Financial Models</h3>
                  <p className="text-xs text-slate-400">Values calculated based on contemporary material indexings.</p>
                </div>

                {/* Display outputs */}
                <div className="bg-slate-800 border border-slate-700/60 p-6 rounded-2xl text-center space-y-4">
                  <span className="inline-block text-[10px] font-mono bg-brand-primary/20 text-brand-primary px-3 py-1 rounded-full font-bold">
                    BALLPARK ESTIMATE SUM
                  </span>

                  <div className="space-y-1">
                    <span className="block text-xs text-slate-400">Calculated Range:</span>
                    <span className="block font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight" id="estimated-range-naira">
                      {formatNaira(estimateResult.min)} - <br />{formatNaira(estimateResult.max)}
                    </span>
                    <span className="block text-[11px] font-mono text-emerald-400">
                      Approx. USD equivalent ({Math.round(estimateResult.min / 1500).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} - {Math.round(estimateResult.max / 1500).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })})
                    </span>
                  </div>

                  <div className="h-[1px] bg-slate-700 my-4"></div>

                  <div className="grid grid-cols-2 gap-2 text-left text-xs font-mono">
                    <div>
                      <span className="block text-slate-400">Category:</span>
                      <span className="block font-bold text-slate-200 capitalize">
                        {/* lookup label */}
                        {SERVICES.find(s => s.id === quoteService)?.title.split(' ')[0]}
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Base rate/Sqm:</span>
                      <span className="block font-bold text-slate-200">
                        {quoteService === 'arch' ? '₦15,000' : quoteService === 'eng' ? '₦10,000' : quoteService === 'contract' ? '₦45,000' : '₦120,000'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-xs font-mono text-slate-400 uppercase tracking-widest">Next Actions:</h4>
                  
                  <ul className="text-xs text-slate-300 space-y-2">
                    <li className="flex items-center space-x-2">
                      <CornerDownRight className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                      <span>Sync estimate directly into contact form message below</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CornerDownRight className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                      <span>Connect with the registration desk on WhatsApp (08061449876)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CornerDownRight className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                      <span>Request land site visit for soil structural testing</span>
                    </li>
                  </ul>
                </div>

              </div>

              <div className="space-y-3 pt-6 lg:pt-0">
                <button
                  onClick={applyEstimateToForm}
                  className="w-full bg-white hover:bg-slate-100 text-slate-900 py-3 px-5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                  id="btn-apply-estimate"
                >
                  <Send className="w-4 h-4 text-[#800e0e]" />
                  <span>Sync & Populate Inquiry Form</span>
                </button>
                <button
                  onClick={handleWhatsAppQuote}
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 px-5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                  id="btn-whatsapp-estimate"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Submit Estimate via WhatsApp</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* SECTION 7: DETAILED CONTACT METHOD, PERMITS, AND FORM */}
      <section id="contact" className="py-24 bg-slate-900 text-white relative">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-50"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Columns - Corporate contact info */}
            <div className="lg:col-span-5 space-y-8 text-left">
              <div className="space-y-3">
                <span className="text-sm font-mono font-bold text-brand-primary uppercase tracking-widest block" id="contact-section-label">
                  Secure Consultation
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-white leading-tight" id="contact-heading">
                  Let's Discuss Your Physical Build Program.
                </h2>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  Partner with an established, CAC-registered entity. Whether processing state approvals or pricing material schedules, we guarantee corporate professionalism in writing.
                </p>
              </div>

              {/* Legal verification credentials */}
              <div className="p-5 bg-white/5 border border-white/10 rounded-2xl relative space-y-3" id="contact-legal-box">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#800e0e]/20 text-rose-500 rounded-lg">
                    <ShieldCheck className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Cynsixtus Solutions Limited</h4>
                    <p className="text-[10px] font-mono text-slate-400">Incorporation Identifier: RC NO. 9297918</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-normal">
                  All contracts, material procurements, and plan structural warranties are legally notarized and backed by our corporate registered asset structures.
                </p>
              </div>

              {/* Direct coordinates list */}
              <div className="space-y-5" id="contact-coordinates">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase font-mono tracking-wider text-slate-400">Voice hotlines:</span>
                    <a href="tel:+2348061449876" className="block text-base font-bold text-white hover:text-brand-primary transition-colors">
                      +234 (0) 806 144 9876
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-[#25D366]/10 rounded-xl text-[#25D366] shrink-0 mt-0.5">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase font-mono tracking-wider text-slate-400">WhatsApp Instant Desk:</span>
                    <a href="https://wa.me/2348061449876" className="block text-base font-bold text-[#25D366] hover:underline" target="_blank" rel="noopener noreferrer">
                      08061449876 (Nigeria Operations)
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-[#800e0e]/10 rounded-xl text-rose-500 shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase font-mono tracking-wider text-slate-400">Corporate correspondence email:</span>
                    <a href="mailto:info@cynsixtus.com" className="block text-base font-bold text-white hover:text-brand-primary">
                      info@cynsixtus.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase font-mono tracking-wider text-slate-400">Corporate site offices:</span>
                    <address className="block text-sm text-slate-300 not-italic leading-relaxed">
                      GRA Scheme, Ikeja, Lagos State, Nigeria <br />
                      &amp; Benin City Operations Branch, Edo State, Nigeria.
                    </address>
                  </div>
                </div>
              </div>

              {/* Social Channels inside contact left column */}
              <div className="space-y-3 pt-6 border-t border-white/5" id="contact-social-channels">
                <span className="block text-xs font-mono font-bold uppercase tracking-widest text-slate-500">Corporate Social Networks</span>
                <div className="flex items-center space-x-3">
                  <a href="https://facebook.com/cynsixtus" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 text-slate-300 hover:text-white hover:bg-brand-primary hover:scale-105 rounded-xl transition-all" aria-label="Facebook">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="https://instagram.com/cynsixtus" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 text-slate-300 hover:text-white hover:bg-brand-primary hover:scale-105 rounded-xl transition-all" aria-label="Instagram">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="https://linkedin.com/company/cynsixtus" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 text-slate-300 hover:text-white hover:bg-brand-primary hover:scale-105 rounded-xl transition-all" aria-label="LinkedIn">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="https://wa.me/2348061449876" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 text-slate-300 hover:text-white hover:bg-[#25D366] hover:scale-105 rounded-xl transition-all" aria-label="WhatsApp">
                    <MessageSquare className="w-5 h-5" />
                  </a>
                </div>
              </div>

            </div>

            {/* Right Columns - Complete Form validation */}
            <div className="lg:col-span-7 bg-white text-slate-900 p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden" id="contact-form-container">
              
              {/* Submission visual success message */}
              <AnimatePresence>
                {formSubmitted && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 bg-white z-30 flex flex-col items-center justify-center p-8 text-center space-y-4"
                    id="form-success-overlay"
                  >
                    <div className="w-16 h-16 bg-[#049d16]/10 text-brand-primary p-4 rounded-full flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display font-extrabold text-2xl text-slate-900">Consultation Request Placed</h3>
                      <p className="text-slate-500 text-sm max-w-md">
                        Thank you for reaching out to Cynsixtus Solutions Limited (RC: 9297918). A licensed civil engineer or planner will review your details and phone dial you within 12 working hours.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-500 w-full max-w-sm">
                      Urgent schedule? Dial Hot-desk: 08061449876
                    </div>
                    <button 
                      onClick={() => setFormSubmitted(false)}
                      className="text-xs text-brand-primary font-bold hover:underline"
                    >
                      Draft Another Inquiry Form
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                <div className="space-y-1 pb-4 border-b border-slate-100">
                  <h3 className="font-display font-bold text-xl text-slate-900">Secure Direct Site Inquiry</h3>
                  <p className="text-xs text-slate-500">Provide project specs below. Registered legal documents ensure confidentiality.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-1.5 matches-focus">
                    <label htmlFor="form-input-name" className="block text-xs font-mono font-semibold uppercase text-slate-500">
                      Representative Name *
                    </label>
                    <input 
                      type="text" 
                      id="form-input-name"
                      required
                      placeholder="e.g. Osaro Adebayo"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5 matches-focus">
                    <label htmlFor="form-input-email" className="block text-xs font-mono font-semibold uppercase text-slate-500">
                      Email address *
                    </label>
                    <input 
                      type="email" 
                      id="form-input-email"
                      required
                      placeholder="e.g. client@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Phone field */}
                  <div className="space-y-1.5 matches-focus">
                    <label htmlFor="form-input-phone" className="block text-xs font-mono font-semibold uppercase text-slate-500">
                      NGR Mobile Telephone *
                    </label>
                    <input 
                      type="tel" 
                      id="form-input-phone"
                      required
                      placeholder="e.g. 0806 144 9876"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Service selector */}
                  <div className="space-y-1.5 matches-focus">
                    <label htmlFor="form-input-service" className="block text-xs font-mono font-semibold uppercase text-slate-500">
                      Desired Core Service
                    </label>
                    <select
                      id="form-input-service"
                      value={formData.service}
                      onChange={(e) => setFormData({...formData, service: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all appearance-none"
                    >
                      <option value="Architectural Drawing &amp; Planning">Architectural Drawing &amp; Planning</option>
                      <option value="Structural Civil Engineering">Structural Civil Engineering</option>
                      <option value="Building Construction &amp; Handover">Building Construction &amp; Handover</option>
                      <option value="General Procurement Contracting">General Procurement Contracting</option>
                    </select>
                  </div>
                </div>

                {/* Message Field */}
                <div className="space-y-1.5 matches-focus">
                  <div className="flex items-center justify-between">
                    <label htmlFor="form-input-message" className="block text-xs font-mono font-semibold uppercase text-slate-500">
                      Describe Scope &amp; Site Location Specs
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Include state town location</span>
                  </div>
                  <textarea 
                    id="form-input-message"
                    rows={5}
                    placeholder="e.g. We require a 4-bedroom duplex structural concrete analysis in Benin City, Edo State with complete 3D elevations drawings..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                  ></textarea>
                </div>

                {/* Submit actions */}
                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-primary hover:bg-brand-secondary text-white py-4 px-6 rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                    id="form-submit-btn"
                  >
                    <span>{isSubmitting ? 'Securing Connection...' : 'Post Secure Consultation Inquiry'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Data encrypted locally. Direct WhatsApp hotline: +234 806 144 9876
                    </span>
                  </div>
                </div>

              </form>

            </div>

          </div>

        </div>
      </section>

      {/* SECTION 8: CORP ACCORDION FAQ */}
      <section id="faq" className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-mono font-bold text-brand-primary uppercase tracking-widest block" id="faq-section-label">
              Inquiry Resolution
            </span>
            <h2 className="font-display font-bold text-3xl text-slate-900 tracking-tight" id="faq-heading">
              Frequently Queried Specifications
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Got technical structural planning or corporate registration questions? Quick reference replies verified by legal counsel.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-4" id="faq-accordion-list">
            {FAQS.map((faq) => {
              const isExpanded = expandedFaq === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isExpanded 
                      ? 'border-brand-primary bg-slate-50/50 ring-2 ring-brand-primary/5' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                  id={`faq-item-${faq.id}`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                    className="w-full py-5 px-6 flex items-center justify-between text-left focus:outline-none"
                    id={`faq-toggle-${faq.id}`}
                  >
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      {faq.question}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${
                      isExpanded ? 'transform rotate-180 text-brand-primary' : ''
                    }`} />
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden bg-white border-t border-slate-100"
                        id={`faq-content-${faq.id}`}
                      >
                        <div className="px-6 py-5 text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 9: FOOTER WRAP */}
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-800" id="global-footer">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 xl:gap-12 pb-12 border-b border-slate-800" id="footer-layout">
            
            {/* Logo column */}
            <div className="col-span-2 space-y-6 text-left">
              <div className="flex items-center space-x-3">
                <img 
                  src={`${import.meta.env.BASE_URL}logo.png`} 
                  alt="Cynsixtus Solutions Logo" 
                  className="w-10 h-10 rounded-lg object-contain shadow-md"
                />
                <div>
                  <span className="block font-display font-bold text-lg leading-tight text-white">
                    Cynsixtus Solutions
                  </span>
                  <span className="block text-[10px] font-mono tracking-widest text-[#25D366] font-semibold">
                    RC: 9297918
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm" id="footer-desc">
                Cynsixtus Solutions Limited is Nigeria's premier corporate architectural drawing, civil structural engineering, and general contracting partner. We build safe, timeless physical spaces.
              </p>

              {/* CAC Registered verification badge */}
              <div className="inline-block p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-1">
                <span className="block text-[9px] font-mono uppercase tracking-widest text-slate-400">Incorporation Verification:</span>
                <span className="block text-xs font-mono font-bold text-[#25D366] tracking-widest">
                  CAC RC: 9297918
                </span>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="space-y-4 text-left">
              <h4 className="font-display font-bold text-xs text-white uppercase tracking-widest border-l-2 border-brand-primary pl-2">
                Core Services
              </h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#services" className="hover:text-white hover:underline transition-colors">Architectural plan drawings</a></li>
                <li><a href="#services" className="hover:text-white hover:underline transition-colors">Structural load calculations</a></li>
                <li><a href="#services" className="hover:text-white hover:underline transition-colors">Building site construction</a></li>
                <li><a href="#services" className="hover:text-white hover:underline transition-colors">General materials procurements</a></li>
              </ul>
            </div>

            {/* Strategic Edge Columns */}
            <div className="space-y-4 text-left">
              <h4 className="font-display font-bold text-xs text-white uppercase tracking-widest border-l-2 border-brand-primary pl-2">
                Operational Info
              </h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#about" className="hover:text-white hover:underline transition-colors">Corporate Credentials</a></li>
                <li><a href="#projects" className="hover:text-white hover:underline transition-colors">Physical Portfolio Grid</a></li>
                <li><a href="#why-us" className="hover:text-white hover:underline transition-colors">Why Choose Cynsixtus</a></li>
                <li><a href="#quote" className="hover:text-white hover:underline transition-colors">Naira Estimate Calculator</a></li>
              </ul>
            </div>

            {/* Contacts Hotlines Column */}
            <div className="space-y-4 text-left col-span-2 sm:col-span-1">
              <h4 className="font-display font-bold text-xs text-white uppercase tracking-widest border-l-2 border-brand-primary pl-2">
                Hot Desks
              </h4>
              <ul className="space-y-3 text-xs leading-normal">
                <li className="space-y-0.5">
                  <span className="block text-slate-500 font-mono text-[9px] uppercase">Telephone hotlines:</span>
                  <a href="tel:+2348061449876" className="block text-slate-300 hover:text-white font-bold">
                    +234 806 144 9876
                  </a>
                </li>
                <li className="space-y-0.5">
                  <span className="block text-slate-500 font-mono text-[9px] uppercase">Official Emails:</span>
                  <a href="mailto:info@cynsixtus.com" className="block text-slate-300 hover:text-white">
                    info@cynsixtus.com
                  </a>
                </li>
                <li className="space-y-0.5">
                  <span className="block text-slate-500 font-mono text-[9px] uppercase">Geographic Region:</span>
                  <span className="block text-slate-300">
                    Lagos &amp; Benin City, Nigeria
                  </span>
                </li>
              </ul>
            </div>

          </div>

          {/* Social icons row + Copyright banner */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4" id="footer-bottom">
            <div>
              <p>© {new Date().getFullYear()} Cynsixtus Solutions Limited. All rights reserved.</p>
              <p className="text-[10px] text-slate-600 mt-1">
                Fulfilling standards managed under Registration Certificate RC: 9297918. Verified Structural Engineering Services.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <a href="https://facebook.com/cynsixtus" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366]" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com/cynsixtus" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366]" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com/company/cynsixtus" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366]" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://wa.me/2348061449876" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366]" aria-label="WhatsApp">
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </footer>

      {/* DETAIL MODALS (ANImated via Framer Motion / react-motion) */}

      {/* Service Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" id="service-modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full border border-slate-200"
              id="service-modal-box"
            >
              <div className="h-48 relative">
                <img 
                  src={selectedService.image} 
                  alt={selectedService.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  id="service-modal-img"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent"></div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 bg-slate-950/50 hover:bg-slate-950 text-white p-2 rounded-full focus:outline-none transition-colors border border-white/10"
                  aria-label="Close"
                  id="btn-close-service-modal"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-6 flex items-center space-x-3 text-white">
                  <div className="p-2 bg-brand-primary rounded-xl">
                    {renderServiceIcon(selectedService.iconName, "w-5 h-5 text-white")}
                  </div>
                  <h3 className="font-display font-bold text-xl leading-none">{selectedService.title}</h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <p className="text-slate-600 font-medium text-sm leading-relaxed">
                  {selectedService.shortDesc}
                </p>

                <div className="space-y-3">
                  <h4 className="font-bold text-xs font-mono uppercase text-slate-400 tracking-wider">Comprehensive Division Description:</h4>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {selectedService.fullDesc}
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="block font-bold text-slate-800 text-xs">Ready to design or construct?</span>
                    <span className="block text-[10px] text-slate-500">Includes direct calculations &amp; approval support.</span>
                  </div>
                  <button
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        service: selectedService.title,
                        message: `Hello Cynsixtus Solutions,\n\nI am interested in your "${selectedService.title}" capabilities. I would like to schedule an engineering structural meeting.`
                      }));
                      setSelectedService(null);
                      const el = document.getElementById('contact');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-[#049d16] hover:bg-brand-secondary text-white text-xs font-bold py-2 px-4 rounded-lg shadow-sm whitespace-nowrap"
                    id="btn-confirm-service-modal"
                  >
                    Select this Service
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" id="project-modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full border border-slate-200"
              id="project-modal-box"
            >
              <div className="h-64 relative">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  id="project-modal-img"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 bg-slate-950/50 hover:bg-slate-950 text-white p-2 rounded-full focus:outline-none transition-colors border border-white/10"
                  aria-label="Close"
                  id="btn-close-project-modal"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <span className="absolute bottom-4 left-6 bg-brand-primary text-white text-[10px] font-mono tracking-widest uppercase font-bold py-1 px-3 rounded-full border border-white/10">
                  {selectedProject.category}
                </span>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-slate-900">{selectedProject.title}</h3>
                    <p className="text-[10px] text-slate-400 font-mono tracking-wider flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      <span>{selectedProject.location}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block font-mono font-bold text-slate-900 text-xs">COMMODITY VALUE</span>
                    <span className="block text-[10px] text-[#158d26] font-mono">Completed Year {selectedProject.completionYear}</span>
                  </div>
                </div>

                <div className="space-y-1.5 matches-focus">
                  <h4 className="font-bold text-xs uppercase font-mono text-slate-400">Engineering Work Description:</h4>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed p-4 bg-slate-50 rounded-xl">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="pt-2 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>Registered builder: Cynsixtus Solutions Limited</span>
                  <span>License reference: RC-9297918</span>
                </div>

                <div className="pt-4 flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="py-2.5 px-5 rounded-lg border text-xs font-semibold text-slate-500 hover:bg-slate-50"
                  >
                    Close Portfolio Details
                  </button>
                  <a
                    href={`https://wa.me/2348061449876?text=Hello%20Cynsixtus%2C%20I%20am%20referencing%20the%20portfolio%20project%20"${encodeURIComponent(selectedProject.title)}"%20and%20would%20like%20to%20build%20a%20similar%20concept.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs py-2.5 px-5 rounded-lg shadow-sm flex items-center space-x-1.5"
                    id="btn-confirm-project-modal"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Inquire About Similar Concept</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
