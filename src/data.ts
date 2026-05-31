/**
 * Cynsixtus Solutions Limited Data Source
 */

import cynsixtusDrawing from './assets/images/cynsixtus_drawing_1780267458496.png';
import cynsixtusConstruction from './assets/images/cynsixtus_construction_1780267474046.png';
import cynsixtusEngineering from './assets/images/cynsixtus_engineering_1780267493377.png';
import cynsixtusContracting from './assets/images/cynsixtus_contracting_1780267512820.png';

export interface Service {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  image: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  image: string;
  completionYear: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const SERVICES: Service[] = [
  {
    id: "arch",
    title: "Architectural Drawing & Design",
    shortDesc: "Bespoke spatial engineering, comprehensive 3D visualization, detailed floorplans, and local building approvals.",
    fullDesc: "We craft detailed 2D/3D floor designs, realistic rendering prototypes, and structural draft layouts. Our custom blueprints combine maximize-aesthetic luxury with strict statutory Nigerian regulatory standards, guaranteeing flawless regulatory board submissions and building safety compliance.",
    iconName: "PenTool",
    image: cynsixtusDrawing
  },
  {
    id: "eng",
    title: "Structural Civil Engineering",
    shortDesc: "Rigorous load structural calculations, steel/concrete foundations, mechanical systems and electrical layouts.",
    fullDesc: "Our structural engineering division handles detailed concrete reinforcement plans, material strength formulas, steel beams structures, and electrical-mechanical service blueprints. We leverage modern stress simulation programs ensuring ultimate building persistence against land shifts and vibrations.",
    iconName: "HardHat",
    image: cynsixtusEngineering
  },
  {
    id: "const",
    title: "Building Construction & Handover",
    shortDesc: "Superlative hands-on general bricks masonry, modern steel framings, luxury finishes, and timely project handovers.",
    fullDesc: "From clearing raw foundations in Benin or Lagos to handing over luxury duplex keys, we provide premium workmanship. We operate strict concrete mix specifications, premium material integrity checks, and high project speed to complete modern corporate towers and premium residential homes on schedule.",
    iconName: "Construction",
    image: cynsixtusConstruction
  },
  {
    id: "contract",
    title: "General Procurement Contracting",
    shortDesc: "Comprehensive supply chains, master site surveying, material logistics, and trusted project management.",
    fullDesc: "We manage materials sourcing, vendor supply pipelines, and cost auditing. Our general contracting service shields owners from inflation spikes by securing bulk prices directly from trusted suppliers of premium steel, electrical components, and heavy-grade roofing sheets.",
    iconName: "ShieldCheck",
    image: cynsixtusContracting
  }
];

export const PROJECTS: Project[] = [
  {
    id: "proj1",
    title: "The Glass Sentinel Tower",
    category: "Commercial Office Complex",
    location: "Victoria Island, Lagos",
    image: cynsixtusContracting,
    completionYear: "2025",
    description: "A prestigious corporate layout utilizing structural cantilever engineering and tinted soundproof glass facades."
  },
  {
    id: "proj2",
    title: "The Oasis Crest Estate",
    category: "Luxury Residential Duplexes",
    location: "GRA, Ikeja, Lagos",
    image: cynsixtusConstruction,
    completionYear: "2024",
    description: "An enclave of modern residential spaces characterized by high ceiling lines, premium finishing, and solar energy installations."
  },
  {
    id: "proj3",
    title: "Cynsixtus Design Blueprint Hub",
    category: "Industrial Architectural Prototype",
    location: "Benin City, Edo State",
    image: cynsixtusDrawing,
    completionYear: "2025",
    description: "An open architectural design workspace built with hybrid reinforced panels and spacious custom drafting galleries."
  },
  {
    id: "proj4",
    title: "Aethelgard Structural Bridge",
    category: "Civil Infrastructure Steelwork",
    location: "Asaba, Delta State",
    image: cynsixtusEngineering,
    completionYear: "2026",
    description: "A customized heavy-duty access road bridge utilizing modern span girders and high-grade rustproof steel columns."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test1",
    name: "Engr. Osasere Alao",
    role: "Project Director",
    company: "Westfield Developers",
    quote: "Cynsixtus Solutions delivered our commercial layout 3 weeks ahead of schedule. Their structural calculations and engineering integrity saved us millions in redesign costs.",
    rating: 5
  },
  {
    id: "test2",
    name: "Mrs. Chioma Nkemdilim",
    role: "Homeowner",
    company: "Private Residence GRA",
    quote: "The architectural drawings they drafted for our 5-bedroom duplex were breathtaking. Everyone loves the cross-ventilation lines and optimal natural lighting they engineered.",
    rating: 5
  },
  {
    id: "test3",
    name: "Alhaji Ibrahim Usman",
    role: "Managing Director",
    company: "Solid Infrastructure Group",
    quote: "Highly reliable, completely professional engineering contracting. Their RC: 9297918 verification checked out perfectly, and their quote transparently detailed everything.",
    rating: 5
  }
];

export const FAQS: FAQ[] = [
  {
    id: "faq1",
    question: "Is Cynsixtus Solutions Limited fully incorporated in Nigeria?",
    answer: "Yes, Cynsixtus Solutions Limited is a fully registered corporate entity with the Corporate Affairs Commission (CAC) of Nigeria under Registration Number (RC: 9297918). We hold active professional clearance for civil, structural engineering, and building operations."
  },
  {
    id: "faq2",
    question: "What geographical areas does the company cover?",
    answer: "Our primary offices and projects are located in Lagos and Benin City (Edo State), Nigeria. However, we deliver civil engineering, architectural drawings, and general contracting nationwide, with on-site project supervisors deployed as required."
  },
  {
    id: "faq3",
    question: "How do you charge for architectural rendering and drawing designs?",
    answer: "Our fees are highly competitive and structured based on total floor square footage and level of design complexity. We provide scalable plans (Standard, Premium, and Luxury options) to suit various budgets. You can use our interactive Quote Estimator tool below to generate an instant ballpark figure."
  },
  {
    id: "faq4",
    question: "Do you handle local government building approval processes?",
    answer: "Absolutely. As professional registered general contractors, we stamp drawings with qualified seal systems and process the necessary site approval documentations through state building control authorities (like LASBCA in Lagos or local panels in Benin)."
  },
  {
    id: "faq5",
    question: "How can I interact directly with your lead architects or engineers?",
    answer: "You can send an immediate inquiry using our contact form, request a face-to-face consultation, or click our floating WhatsApp button (08061449876) to chat with a civil structural team leader instantly."
  }
];

export const KEY_METRICS = [
  { label: "State Approvals", value: "100%" },
  { label: "Projects Completed", value: "120+" },
  { label: "RC Registered No.", value: "9297918" },
  { label: "Trusted Partners", value: "15+" }
];
