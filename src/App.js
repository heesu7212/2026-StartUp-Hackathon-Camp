import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, MapPin, Star, BookOpen, User, Phone, Globe, Activity, Heart, 
  ChevronRight, X, ChevronLeft, Flame, Info, Filter, Camera, ScanLine,
  Pill, Stethoscope, Sun, Ear, Bone, Scissors, Siren, ShieldCheck, RefreshCw, Zap, Upload, Plus,
  Venus, Users, Lock, Edit2, Check, Share2, ArrowRight
} from 'lucide-react';

/**
 * Sick&Seek Prototype V30 (Quick Access Fix)
 * Team: Kare
 * Updates:
 * 1. LoginScreen: Added 'Emergency / My Health' quick access button.
 * 2. Navigation Logic: Updated to support opening specific tabs ('profile', 'home') directly from login.
 */

// --- Custom Icons ---
const Tooth = ({ size = 24, className = "", color = "currentColor" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color === "currentColor" ? "currentColor" : color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M7 20L10.6 22.4C10.9 22.6 11.2 22.5 11.4 22.3L12 21L12.6 22.3C12.8 22.5 13.1 22.6 13.4 22.4L17 20C18.7 18.9 20 16.4 20 13V9C20 5.1 16.9 2 13 2H11C7.1 2 4 5.1 4 9V13C4 16.4 5.3 18.9 7 20Z" />
    <path d="M10 10H14" />
    <path d="M12 10V16" />
  </svg>
);

// --- UI Components ---
const Badge = ({ children, color = "blue", onClick }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    purple: "bg-purple-100 text-purple-800",
    gray: "bg-gray-100 text-gray-800",
    red: "bg-red-100 text-red-800",
  };
  return (
    <span 
      onClick={onClick}
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[color] || colors.gray} ${onClick ? 'cursor-pointer hover:opacity-80' : ''}`}
    >
      {children}
    </span>
  );
};

const NavItem = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-teal-600' : 'text-gray-400'}`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

// --- Data Constants ---
const INSURANCE_INFO = {
  "NHIS": {
    title: "National Health Insurance (NHIS)",
    coverage: "Covers ~70-80% of general treatments.",
    benefits: "Same price as Korean citizens. Automatic deduction for registered employees.",
    who: "Registered aliens (ARC holders) residing > 6 months.",
    tips: "Bring your ARC card. Dental/Cosmetic is usually NOT covered."
  },
  "Travel Ins.": {
    title: "Travel Insurance",
    coverage: "Varies by policy (Pay first, Claim later).",
    benefits: "Covers accidents & sudden illnesses during travel.",
    who: "Short-term visitors / Tourists.",
    tips: "Ask for a 'Medical Certificate' & 'Receipt' for reimbursement."
  },
  "Private Only": {
    title: "Private Insurance Only",
    coverage: "Does NOT accept NHIS.",
    benefits: "High-end service, shorter wait times, often English-native staff.",
    who: "Patients seeking premium care or uncovered procedures.",
    tips: "Check if your private global insurance supports direct billing here."
  },
  "Tax Refund": {
    title: "Tax Refund Available",
    coverage: "VAT (10%) Refund.",
    benefits: "Get 10% tax back at the airport for bills > 30,000 KRW.",
    who: "Tourists (Stay < 6 months).",
    tips: "Ask for the 'Tax Refund Receipt' at the desk."
  },
  "Intl. Direct Billing": {
    title: "International Direct Billing",
    coverage: "100% or Copay (Depends on provider).",
    benefits: "Hospital bills your insurance company directly. No out-of-pocket.",
    who: "Holders of Cigna, Aetna, Tricare, etc.",
    tips: "Bring your physical insurance card."
  },
  "NHIS (Partially)": {
    title: "NHIS (Partial Coverage)",
    coverage: "Covers basic treatments only.",
    benefits: "Scaling (cleaning) is covered once a year.",
    who: "NHIS holders.",
    tips: "Implants and whitening are excluded."
  },
  "All Types": {
    title: "All Insurance Types Accepted",
    coverage: "NHIS, Travel, Private, Direct Billing.",
    benefits: "Most flexible payment options.",
    who: "Everyone.",
    tips: "Visit the International Healthcare Center for assistance."
  }
};

const HOSPITALS = [
  {
    id: 1,
    name: "Severance Hospital",
    type: "General",
    location: "Seodaemun-gu, Seoul",
    rating: 4.9,
    reviews: 1205, // HOT
    englishLevel: "Native",
    insurance: ["All Types", "Intl. Direct Billing"],
    description: "Top-tier University Hospital with International Health Care Center. Over 860 specialists available.",
    tags: ["Emergency", "Surgery", "Comprehensive", "Cancer", "Fever", "Severe Pain"]
  },
  {
    id: 2,
    name: "Hangmiso Surgical Clinic",
    type: "Surgery",
    location: "Mapo-gu, Seoul",
    rating: 4.7,
    reviews: 45,
    englishLevel: "Advanced",
    insurance: ["NHIS"],
    description: "Specialized Proctology Clinic. Experienced specialists for surgical procedures.",
    tags: ["Proctology", "Hemorrhoids", "Surgery", "Bleeding", "Constipation"]
  },
  {
    id: 3,
    name: "Yonsei Star Dermatology",
    type: "Dermatology",
    location: "Sinchon, Seoul",
    rating: 4.8,
    reviews: 210, // HOT
    englishLevel: "Fluent",
    insurance: ["Tax Refund", "Private Only"],
    description: "Famous for specialized Scar Treatment. 5 Dermatologists on site.",
    tags: ["Scar Treatment", "Acne", "Laser", "Skin Rash", "Itchy"]
  },
  {
    id: 4,
    name: "Yonsei Sintong Surgical",
    type: "Surgery",
    location: "Seodaemun-gu, Seoul",
    rating: 4.5,
    reviews: 32,
    englishLevel: "Intermediate",
    insurance: ["NHIS"],
    description: "Designated Drug Screening Center. 8 specialists available for general surgery needs.",
    tags: ["Drug Screening", "General Surgery", "Stomach Pain", "Lumps"]
  },
  {
    id: 5,
    name: "Seoul Baream Clinic",
    type: "Orthopedics",
    location: "Sinchon, Seoul",
    rating: 4.6,
    reviews: 88,
    englishLevel: "Advanced",
    insurance: ["NHIS", "Travel Ins."],
    description: "Orthopedic specialists. Also provides Gardasil vaccinations.",
    tags: ["Joint Pain", "Gardasil", "Vaccination", "Back Pain", "Fracture"]
  },
  {
    id: 6,
    name: "Ipsagwi Dental Hospital",
    type: "Dental",
    location: "Sinchon, Seoul",
    rating: 4.7,
    reviews: 156, // HOT
    englishLevel: "Fluent",
    insurance: ["NHIS (Partially)"],
    description: "Renowned for Wisdom Tooth Removal. General dentists and residents available.",
    tags: ["Wisdom Tooth", "Oral Surgery", "Implants", "Toothache", "Swollen Gums"]
  },
  {
    id: 7,
    name: "Like Dental Clinic",
    type: "Dental",
    location: "Mapo-gu, Seoul",
    rating: 4.8,
    reviews: 92,
    englishLevel: "Fluent",
    insurance: ["Private Only"],
    description: "Clean and modern facility with 2 specialists. Great for general checkups.",
    tags: ["General Dental", "Whitening", "Cavity"]
  },
  {
    id: 9,
    name: "Kwon Internal Medicine",
    type: "Internal Med",
    location: "Mapo-gu, Seoul",
    rating: 4.5,
    reviews: 41,
    englishLevel: "Intermediate",
    insurance: ["NHIS"],
    description: "Neighborhood clinic for common colds and stomach issues. 1 Specialist.",
    tags: ["Cold", "Flu", "Digestion", "Stomach Pain", "Nausea"]
  },
  {
    id: 10,
    name: "Ahyeon Seoul ENT",
    type: "ENT",
    location: "Ahyeon, Seoul",
    rating: 4.4,
    reviews: 28,
    englishLevel: "Intermediate",
    insurance: ["NHIS"],
    description: "Local ENT clinic. Good for seasonal allergies and throat infections.",
    tags: ["Allergy", "Throat", "Runny Nose", "Cough"]
  },
  {
    id: 11,
    name: "Sinchon Yonsei ENT",
    type: "ENT",
    location: "Sinchon, Seoul",
    rating: 4.7,
    reviews: 112, // HOT
    englishLevel: "Fluent",
    insurance: ["NHIS", "Travel Ins."],
    description: "Ewha Branch. 2 Specialists available. Popular among students.",
    tags: ["Ears", "Nose", "Throat", "Hearing Loss", "Dizziness"]
  },
  {
    id: 12,
    name: "Leejiham Skin Clinic",
    type: "Dermatology",
    location: "Sinchon, Seoul",
    rating: 4.6,
    reviews: 85,
    englishLevel: "Fluent",
    insurance: ["Tax Refund"],
    description: "Well-known skin clinic chain. 2 Specialists for various skin conditions.",
    tags: ["Acne", "Skincare", "Botox", "Eczema"]
  },
  {
    id: 14,
    name: "Sarah Women’s Clinic",
    type: "OBGYN",
    location: "Mapo-gu, Seoul",
    rating: 4.9,
    reviews: 143, // HOT
    englishLevel: "Native",
    insurance: ["NHIS", "Travel Ins."],
    description: "Foreigner-friendly women's clinic. English consulting available.",
    tags: ["Checkup", "Women's Health", "Pregnancy", "Period Pain"]
  },
  {
    id: 15,
    name: "Yonsei AreumDuan OBGYN",
    type: "OBGYN",
    location: "Seodaemun-gu, Seoul",
    rating: 4.7,
    reviews: 67,
    englishLevel: "Fluent",
    insurance: ["NHIS"],
    description: "2 Specialists. Comprehensive care for women.",
    tags: ["Pregnancy", "Screening", "Birth Control"]
  }
];

const REVIEWS_DB = [
  { id: 1, hospitalId: 1, user: "Sarah J.", nationality: "USA", rating: 5, comment: "Doctor spoke perfect English.", tags: ["Language: Perfect"] },
  { id: 2, user: "Marco P.", nationality: "Italy", rating: 4, comment: "Quick and less painful.", tags: ["Skill: Good"] },
  { id: 3, hospitalId: 3, user: "Aiko T.", nationality: "Japan", rating: 5, comment: "Professional service.", tags: ["Result: Great"] },
  { id: 4, hospitalId: 1, user: "Li Wei", nationality: "China", rating: 4, comment: "Good doctors.", tags: ["Skill: Top"] }
];

const FLASHCARD_CATEGORIES = [
  { 
    id: 'general', 
    label: 'General / Internal', 
    icon: <Stethoscope className="text-blue-500" size={28} />, 
    color: 'bg-blue-50', 
    activeColor: 'bg-blue-600', 
    textColor: 'text-blue-700',
    procedures: [
      {
        title: "Cold / Flu Treatment",
        steps: [
          "Register at the front desk with your ARC or Passport.",
          "Wait for your name to be called.",
          "Consult with the doctor (describe symptoms).",
          "Doctor may use a stethoscope or check your throat.",
          "Receive a prescription paper (Prescription is NOT medicine).",
          "Go to a nearby pharmacy (Yak-guk) to buy the medicine."
        ]
      },
      {
        title: "Digestive Issues",
        steps: [
          "Explain symptoms (pain location, nausea, diarrhea).",
          "Doctor might press your stomach to check for pain.",
          "If severe, they might suggest an Endoscopy (requires appointment).",
          "Get prescription for medicine.",
          "Pharmacy will explain when to take meds (usually '30 min after meal')."
        ]
      }
    ]
  },
  { 
    id: 'dental', 
    label: 'Dentistry', 
    icon: <Tooth className="text-purple-500" size={28} color="currentColor"/>, 
    color: 'bg-purple-50', 
    activeColor: 'bg-purple-600', 
    textColor: 'text-purple-700',
    procedures: [
      {
        title: "Cavity Treatment",
        steps: [
          "X-ray scanning (Panoramic or specific tooth).",
          "Doctor examines the X-ray.",
          "Local anesthesia injection (numbing).",
          "Remove decayed part (drilling sound).",
          "Fill the tooth with Resin (tooth color) or Gold/Amalgam.",
          "Bite check to ensure it fits comfortably."
        ]
      },
      {
        title: "Wisdom Tooth Removal",
        steps: [
          "CT Scan to check nerve position.",
          "Anesthesia (might be stronger).",
          "Extraction procedure (pressure is normal, pain is not).",
          "Stitching the gum.",
          "Bite on gauze for 2 hours to stop bleeding.",
          "Return after 1 week to remove stitches."
        ]
      },
      {
        title: "Scaling (Cleaning)",
        steps: [
          "covered by NHIS once a year (very cheap ~15,000 KRW).",
          "Hygienist uses ultrasound tool to remove tartar.",
          "Water spray and vibrating sensation.",
          "Takes about 20-30 minutes.",
          "Gums might bleed slightly afterwards."
        ]
      }
    ]
  },
  { 
    id: 'ent', 
    label: 'ENT (Ears/Nose)', 
    icon: <Ear className="text-orange-500" size={28} />, 
    color: 'bg-orange-50', 
    activeColor: 'bg-orange-600', 
    textColor: 'text-orange-700',
    procedures: [
      {
        title: "Sore Throat / Cough",
        steps: [
          "Doctor checks throat with a light.",
          "Often uses a metal tongue depressor.",
          "Spray medication directly into throat.",
          "Nebulizer treatment (breathing steam) for 2-3 mins.",
          "Receive prescription."
        ]
      },
      {
        title: "Ear Infection / Cleaning",
        steps: [
          "Camera inspection of the ear canal (shown on screen).",
          "Suction device to clean earwax or pus.",
          "Infrared light therapy (warm light on ear).",
          "Avoid water in ear for a few days."
        ]
      }
    ]
  },
  { 
    id: 'ortho', 
    label: 'Orthopedics', 
    icon: <Bone className="text-slate-500" size={28} />, 
    color: 'bg-slate-50', 
    activeColor: 'bg-slate-600', 
    textColor: 'text-slate-700',
    procedures: [
      {
        title: "Sprain / Joint Pain",
        steps: [
          "X-ray to check for fractures.",
          "Doctor manipulation (moving the joint).",
          "Physical Therapy (Heat pack, electrical stimulation, ultrasound).",
          "Maybe acupuncture (if it's an oriental clinic).",
          "Prescription for muscle relaxants and painkillers."
        ]
      }
    ]
  },
  { 
    id: 'derma', 
    label: 'Dermatology', 
    icon: <Sun className="text-yellow-500" size={28} />, 
    color: 'bg-yellow-50', 
    activeColor: 'bg-yellow-500', 
    textColor: 'text-yellow-700',
    procedures: [
      {
        title: "Acne / Skin Rash",
        steps: [
          "Visual inspection (sometimes with magnifier).",
          "Determine cause (allergy, bacteria, hormonal).",
          "Prescription for oral medicine and topical ointment.",
          "Laser treatment or extrusion (optional, extra cost)."
        ]
      }
    ]
  },
  { 
    id: 'pharmacy', 
    label: 'Pharmacy', 
    icon: <Pill className="text-green-500" size={28} />, 
    color: 'bg-green-50', 
    activeColor: 'bg-green-600', 
    textColor: 'text-green-700',
    procedures: [
      {
        title: "Buying Prescription Meds",
        steps: [
          "Give the prescription paper to the pharmacist.",
          "Wait for them to prepare the packets.",
          "Pharmacist explains dosage (e.g., '3 times a day, after meals').",
          "Pay (NHIS covers a significant portion)."
        ]
      },
      {
        title: "Buying OTC Meds",
        steps: [
          "Describe symptoms (Headache, period pain, bandage).",
          "Pharmacist recommends a product.",
          "Pay full price (usually cheap, 3,000 ~ 6,000 KRW)."
        ]
      }
    ]
  },
  { 
    id: 'admin', 
    label: 'Admin / Insurance', 
    icon: <BookOpen className="text-indigo-500" size={28} />, 
    color: 'bg-indigo-50', 
    activeColor: 'bg-indigo-600', 
    textColor: 'text-indigo-700',
    procedures: [
      {
        title: "Getting a Receipt",
        steps: [
          "Ask at the front desk *after* payment.",
          "For insurance claims, ask for 'Jin-ryo-bi-se-bu-nae-yeok-seo'.",
          "Diagnosis Certificate (Jin-dan-seo) costs extra."
        ]
      }
    ]
  },
  { 
    id: 'obgyn', 
    label: 'OBGYN', 
    icon: <Venus className="text-pink-500" size={28} />, 
    color: 'bg-pink-50', 
    activeColor: 'bg-pink-500', 
    textColor: 'text-pink-700',
    procedures: [
      {
        title: "Routine Checkup / Pap Smear",
        steps: [
          "Consultation about cycle and symptoms.",
          "Ultrasound (internal or external) to check uterus/ovaries.",
          "Pap Smear (screening for cervical cancer) - swift and slightly uncomfortable.",
          "Results usually available in 3-7 days via text/email."
        ]
      },
      {
        title: "Pregnancy Check",
        steps: [
          "Urine test confirms pregnancy.",
          "Ultrasound to check fetal heartbeat (visible around 6 weeks).",
          "Receive 'Pregnancy Confirmation' for government support (Voucher).",
          "Schedule regular prenatal visits."
        ]
      }
    ]
  },
  { 
    id: 'surgery', 
    label: 'Surgery', 
    icon: <Scissors className="text-cyan-500" size={28} />, 
    color: 'bg-cyan-50', 
    activeColor: 'bg-cyan-600', 
    textColor: 'text-cyan-700',
    procedures: [
      {
        title: "Wound Treatment (Sutures)",
        steps: [
          "Thorough cleaning and disinfection of the wound.",
          "Local anesthesia injection near the wound.",
          "Suturing (Stitching) the wound.",
          "Applying dressing/bandage.",
          "Return in 7-14 days to remove stitches."
        ]
      },
      {
        title: "Abscess / Cyst Removal",
        steps: [
          "Ultrasound may be used to check size.",
          "Incision and drainage (I&D) under local anesthesia.",
          "Removing the cyst sac if necessary.",
          "Prescription for antibiotics to prevent infection."
        ]
      }
    ]
  },
  { 
    id: 'emergency', 
    label: 'Emergency / Urgent', 
    icon: <Siren className="text-red-500" size={28} />, 
    color: 'bg-red-50', 
    activeColor: 'bg-red-600', 
    textColor: 'text-red-700',
    procedures: [
      {
        title: "Emergency Room (ER)",
        steps: [
          "Go to the ER reception (Eung-geup-sil).",
          "Triage: Nurse checks vitals to determine urgency.",
          "Wait (Critical patients go first).",
          "Doctor examination -> Tests (Blood, CT, X-ray).",
          "Payment is higher than regular visits."
        ]
      }
    ]
  }
];

const CATEGORIES = ["All", "General", "Dental", "Dermatology", "ENT", "Orthopedic", "Internal Med", "OBGYN", "Surgery"];

const CATEGORY_MAPPING = {
  'general': 'General',
  'dental': 'Dental',
  'derma': 'Dermatology',
  'ent': 'ENT',
  'ortho': 'Orthopedics',
  'surgery': 'Surgery', 
  'urology': 'Urology',
  'obgyn': 'OBGYN',
  'internal': 'Internal Med'
};

const getCategoryColor = (catName) => {
  if (catName === "All") return { bg: "bg-gray-100", text: "text-gray-600", active: "bg-gray-800 text-white" };
  
  const catKey = Object.keys(CATEGORY_MAPPING).find(key => CATEGORY_MAPPING[key] === catName) || 
                 FLASHCARD_CATEGORIES.find(c => c.label.includes(catName))?.id;

  const category = FLASHCARD_CATEGORIES.find(c => c.id === catKey);
  
  if (category) {
    return { 
      bg: "bg-white border " + category.textColor.replace("text", "border"), 
      text: category.textColor,
      active: category.activeColor + " text-white shadow-md border-transparent"
    };
  }
  return { bg: "bg-white border-gray-200", text: "text-teal-600", active: "bg-teal-600 text-white" };
};

// --- Main App Component ---
export default function SickAndSeekApp() {
  // 'splash' -> 'login' -> 'main'
  const [currentView, setCurrentView] = useState('splash');
  const [initialTab, setInitialTab] = useState('home');

  // Splash Screen Logic
  useEffect(() => {
    if (currentView === 'splash') {
      const timer = setTimeout(() => {
        setCurrentView('login');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentView]);

  const handleLogin = (targetTab = 'home') => {
    setInitialTab(targetTab);
    setCurrentView('main');
  };

  if (currentView === 'splash') {
    return <SplashScreen />;
  }

  if (currentView === 'login') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Once 'main' view is active, render the full app
  return <MainAppView initialTab={initialTab} />;
}

// --- Screens ---

function SplashScreen() {
  return (
    <div className="min-h-screen bg-teal-600 flex flex-col items-center justify-center text-white animate-fade-in">
      <div className="mb-6 animate-bounce">
        <Activity size={80} strokeWidth={1.5} />
      </div>
      <h1 className="text-4xl font-bold mb-2 tracking-tight">Sick&Seek</h1>
      <p className="text-teal-100 text-lg opacity-90">Kare for everyone</p>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  return (
    <div className="min-h-screen bg-white p-8 flex flex-col justify-center max-w-md mx-auto relative">
      <div className="mb-12 text-center">
        <div className="inline-block p-4 bg-teal-50 rounded-full mb-4">
          <Activity size={48} className="text-teal-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
        <p className="text-gray-500">Sign in to find the best care.</p>
      </div>

      <div className="space-y-4 mb-8">
        <input 
          type="email" 
          placeholder="Email Address" 
          className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all" 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all" 
        />
      </div>

      <button 
        onClick={() => onLogin('home')} 
        className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-teal-700 transition-colors mb-4 flex items-center justify-center gap-2"
      >
        Sign In <ArrowRight size={20}/>
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-400">Or</span>
        </div>
      </div>

      <button 
        onClick={() => onLogin('home')} 
        className="w-full bg-white text-gray-700 font-bold py-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors mb-8"
      >
        Continue as Guest
      </button>

      {/* Emergency / My Health Button */}
      <button 
        onClick={() => onLogin('profile')}
        className="w-full bg-red-50 text-red-600 font-bold py-3 rounded-xl border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 absolute bottom-8 left-0 right-0 mx-auto max-w-[calc(100%-4rem)]"
      >
        <Siren size={18} /> Emergency / My Health
      </button>
    </div>
  );
}

function MainAppView({ initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'home');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [insuranceType, setInsuranceType] = useState(null);
  const [userData, setUserData] = useState({
    name: "John Doe",
    allergies: ["Peanuts", "Penicillin"],
    medications: ["Tylenol"]
  });

  // Deep link support
  useEffect(() => { 
    if (window.location.hash === '#profile') setActiveTab('profile'); 
  }, []);

  const toggleModal = (e, type) => {
    if(e) e.stopPropagation();
    setInsuranceType(type);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white shadow-xl min-h-screen flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="px-6 py-5 bg-teal-600 text-white shadow-md z-10 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Sick&Seek</h1>
            <p className="text-xs text-teal-100">Kare for everyone</p>
          </div>
          <div className="bg-teal-500 p-2 rounded-full">
            <User size={20} />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
          {selectedHospital ? (
            <HospitalDetail 
              hospital={selectedHospital} 
              onBack={() => setSelectedHospital(null)} 
              onShowInsurance={toggleModal} 
            />
          ) : (
            <>
              {activeTab === 'home' && <HomeView onSelect={setSelectedHospital} onInfo={toggleModal} />}
              {activeTab === 'cards' && <FlashcardView />}
              {activeTab === 'scan' && <ScanView />}
              {activeTab === 'matching' && <MatchingView />}
              {activeTab === 'profile' && (
                <ProfileView 
                  user={userData} 
                  setUser={setUserData} 
                  onShowInsurance={toggleModal} 
                  allergies={userData.allergies}
                  setAllergies={(val) => setUserData({...userData, allergies: val})}
                  medications={userData.medications}
                  setMedications={(val) => setUserData({...userData, medications: val})}
                />
              )}
            </>
          )}
        </main>

        {/* Navigation */}
        <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 py-3 px-6 flex justify-between z-20">
          <NavItem 
            icon={<Search size={22} />} 
            label="Find" 
            isActive={activeTab === 'home'} 
            onClick={() => {setActiveTab('home'); setSelectedHospital(null);}} 
          />
          <NavItem 
            icon={<BookOpen size={22} />} 
            label="Procedures" 
            isActive={activeTab === 'cards'} 
            onClick={() => {setActiveTab('cards'); setSelectedHospital(null);}} 
          />
          <NavItem 
            icon={<Camera size={22} />} 
            label="Scan" 
            isActive={activeTab === 'scan'} 
            onClick={() => {setActiveTab('scan'); setSelectedHospital(null);}} 
          />
          <NavItem 
            icon={<Users size={22} />} 
            label="Matching" 
            isActive={activeTab === 'matching'} 
            onClick={() => {setActiveTab('matching'); setSelectedHospital(null);}} 
          />
          <NavItem 
            icon={<Activity size={22} />} 
            label="Health" 
            isActive={activeTab === 'profile'} 
            onClick={() => {setActiveTab('profile'); setSelectedHospital(null);}} 
          />
        </nav>

        {/* Modal */}
        {insuranceType && <InsuranceModal type={insuranceType} onClose={() => setInsuranceType(null)} />}
      </div>
    </div>
  );
}

// --- Sub Views ---

function HomeView({ onSelect, onInfo }) {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const HOT_THRESHOLD = 100;
  
  const list = HOSPITALS.filter(h => 
    (cat === "All" || h.type === cat) && 
    (h.name.toLowerCase().includes(search.toLowerCase()) || h.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
  ).sort((a, b) => {
      const isAHot = a.reviews >= HOT_THRESHOLD;
      const isBHot = b.reviews >= HOT_THRESHOLD;
      if (isAHot && !isBHot) return -1;
      if (!isAHot && isBHot) return 1;
      return 0;
  });

  return (
    <div className="p-4 space-y-5">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search symptoms..." 
          className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
        <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(c => {
          const col = getCategoryColor(c);
          return (
            <button 
              key={c} 
              onClick={() => setCat(c)} 
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border ${cat === c ? col.active : `${col.bg} ${col.text}`}`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {list.map(h => {
           const typeColor = getCategoryColor(h.type).text;
           return (
            <div 
              key={h.id} 
              onClick={() => onSelect(h)} 
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer"
            >
              <div className="flex justify-between mb-2">
                <div>
                  <span className={`text-xs font-bold uppercase ${typeColor}`}>{h.type}</span>
                  <h3 className="font-bold text-gray-900 text-lg">{h.name}</h3>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                    <Star size={12} className="text-yellow-500 fill-current mr-1"/>
                    <span className="text-xs font-bold text-yellow-700">{h.rating}</span>
                  </div>
                  {h.reviews >= 100 && (
                    <div className="flex items-center bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      <Flame size={10} className="fill-current mr-1"/>HOT
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center text-gray-500 text-xs mb-3">
                <MapPin size={14} className="mr-1"/>{h.location}
              </div>
              <div className="flex gap-2 flex-wrap">
                {h.insurance.map(i => (
                  <Badge key={i} color="green" onClick={(e) => onInfo(e, i)}>{i}</Badge>
                ))}
              </div>
            </div>
           );
        })}
      </div>
    </div>
  );
}

function HospitalDetail({ hospital, onBack, onShowInsurance }) {
  const [filterNation, setFilterNation] = useState("All");
  const reviews = REVIEWS_DB; // Filter logic here if needed

  return (
    <div className="bg-white min-h-full">
      <div className="sticky top-0 bg-white/95 z-10 px-4 py-3 border-b flex items-center">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <X size={20}/>
        </button>
        <span className="ml-2 font-semibold">Details</span>
      </div>
      
      <div className="p-5 space-y-6">
        <div>
          <h2 className="text-2xl font-bold">{hospital.name}</h2>
          <div className="flex text-gray-500 text-sm mt-1">
            <MapPin size={16} className="mr-1"/>{hospital.location}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="flex justify-center gap-2 py-3 bg-teal-50 text-teal-700 rounded-xl text-sm font-bold">
            <Phone size={18}/> Call
          </button>
          <button className="flex justify-center gap-2 py-3 bg-teal-50 text-teal-700 rounded-xl text-sm font-bold">
            <Globe size={18}/> Web
          </button>
        </div>

        <div>
           <h3 className="font-bold mb-2">About & Insurance</h3>
           <p className="text-sm text-gray-600 mb-3">{hospital.description}</p>
           <div className="flex gap-2 flex-wrap">
             {hospital.insurance.map(i => (
               <Badge key={i} color="green" onClick={e => onShowInsurance(e,i)}>
                 {i} <Info size={10} className="inline"/>
               </Badge>
             ))}
           </div>
        </div>

        <div className="border-t pt-4">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold">Reviews</h3>
             <div className="relative">
               <select 
                 value={filterNation} 
                 onChange={e => setFilterNation(e.target.value)} 
                 className="bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold py-2 pl-3 pr-8 rounded-lg outline-none"
               >
                 {["All", ...new Set(reviews.map(r => r.nationality))].map(n => (
                   <option key={n} value={n}>{n}</option>
                 ))}
               </select>
               <Filter size={12} className="absolute right-2 top-2.5 text-teal-700 pointer-events-none" />
             </div>
           </div>

           {reviews.filter(r => filterNation === "All" || r.nationality === filterNation).map(r => (
             <div key={r.id} className="bg-gray-50 p-3 rounded-xl mb-2">
               <div className="flex justify-between mb-1">
                 <span className="text-xs font-bold">{r.user} ({r.nationality})</span>
                 <div className="flex text-yellow-400">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} size={10} fill={i < r.rating ? "currentColor" : "none"}/>
                   ))}
                 </div>
               </div>
               <p className="text-xs text-gray-600">"{r.comment}"</p>
             </div>
           ))}
        </div>
      </div>
      
      <div className="sticky bottom-0 p-4 bg-white border-t">
        <button className="w-full bg-teal-600 text-white font-bold py-3.5 rounded-xl shadow-lg">
          Book Appointment
        </button>
      </div>
    </div>
  );
}

function FlashcardView() {
  const [sel, setSel] = useState(null);
  const [proc, setProc] = useState(null);

  if (!sel) return (
    <div className="p-5">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Medical Procedures</h2>
      <p className="text-sm text-gray-500 mb-6">Select a category to learn about treatments.</p>
      <div className="grid grid-cols-2 gap-4">
        {FLASHCARD_CATEGORIES.map(c => (
          <button 
            key={c.id} 
            onClick={() => setSel(c)} 
            className={`${c.color} p-5 rounded-2xl hover:border-teal-500 border border-transparent transition-all flex flex-col items-center justify-center gap-3 h-36`}
          >
            <div className="bg-white p-3 rounded-full shadow-sm">{c.icon}</div>
            <span className={`font-bold text-sm text-center ${c.textColor.replace("text-", "text-opacity-80 ")}`}>
              {c.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  if (sel && !proc) return (
    <div className={`p-5 min-h-full ${sel.color}`}>
      <div className="flex items-center mb-6">
        <button onClick={() => setSel(null)} className="mr-3 p-2 bg-white rounded-full shadow-sm">
          <ChevronLeft size={20}/>
        </button>
        <h2 className={`text-xl font-bold ${sel.textColor}`}>{sel.label}</h2>
      </div>
      <div className="space-y-3">
        {sel.procedures.map((p, i) => (
          <div 
            key={i} 
            onClick={() => setProc(p)} 
            className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center cursor-pointer"
          >
            <span className="font-bold text-gray-800">{p.title}</span>
            <ChevronRight size={20} className="text-gray-300"/>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-5">
      <div className="flex items-center mb-6">
        <button onClick={() => setProc(null)} className="mr-3 p-2 bg-gray-100 rounded-full">
          <ChevronLeft size={20}/>
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold leading-tight">{proc.title}</h2>
        </div>
      </div>
      <div className={`p-4 rounded-xl ${sel.color} border border-transparent`}>
         <h3 className={`font-bold mb-2 flex items-center gap-2 ${sel.textColor}`}>
           <Info size={18}/> Procedure Steps
         </h3>
         <div className="relative border-l-2 border-gray-300 ml-2 space-y-6 py-2">
            {proc.steps.map((s, i) => (
              <div key={i} className="relative pl-6">
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${sel.activeColor}`}></div>
                <p className="text-sm text-gray-700 font-medium leading-relaxed">{s}</p>
              </div>
            ))}
         </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-xl text-center mt-6">
        <p className="text-xs text-gray-400 mb-2">Is this procedure covered by insurance?</p>
        <button className="bg-teal-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm">
          Check Insurance Guide
        </button>
      </div>
    </div>
  );
}

function ScanView() {
  const [st, setSt] = useState('idle');
  const [img, setImg] = useState(null);
  const fRef = useRef(null);
  
  const handle = (e) => { 
    if (e.target.files[0]) { 
      setImg(URL.createObjectURL(e.target.files[0])); 
      setSt('scanning'); 
      setTimeout(() => setSt('result'), 2000); 
    }
  };

  return (
    <div className="p-5 flex flex-col items-center">
      <div className="mb-6 w-full">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ScanLine className="text-teal-600"/> Smart Scan
        </h2>
        <p className="text-sm text-gray-500">Analyze prescriptions.</p>
      </div>
      
      <input type="file" accept="image/*" ref={fRef} onChange={handle} className="hidden" />
      
      {st === 'idle' && (
        <div 
          onClick={() => fRef.current.click()} 
          className="w-64 h-80 border-4 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center bg-gray-50 cursor-pointer"
        >
          <Upload size={48} className="text-gray-400 mb-4"/>
          <p className="text-gray-400 font-bold">Upload Image</p>
        </div>
      )}
      
      {st === 'scanning' && (
        <div className="relative w-72 h-96 bg-gray-800 rounded-3xl overflow-hidden flex items-center justify-center">
           <img src={img} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="scan" />
           <ScanLine className="text-teal-400 animate-pulse z-20" size={64}/>
           <p className="absolute bottom-10 z-20 text-white font-bold animate-bounce">Scanning...</p>
        </div>
      )}
      
      {st === 'result' && (
        <div className="w-full flex flex-col items-center animate-fade-in">
           <div className="bg-teal-50 border border-teal-200 px-4 py-2 rounded-full flex items-center gap-2 mb-4">
             <RefreshCw size={14} className="text-teal-600"/>
             <span className="text-xs font-bold text-teal-800">AR Active</span>
           </div>
           
           <div className="relative w-72 h-96 bg-gray-900 rounded-3xl overflow-hidden border-4 border-white mb-4">
             <img src={img} className="absolute inset-0 w-full h-full object-cover" alt="result" />
             <div className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-2 rounded-lg shadow-lg border border-teal-200 animate-bounce">
               <p className="text-[10px] font-bold">Medicine</p>
               <p className="text-sm font-bold text-teal-700">Tylenol</p>
             </div>
             <div className="absolute bottom-20 left-4 bg-white/90 px-3 py-2 rounded-lg shadow-lg border-teal-200">
               <p className="text-[10px] font-bold">Take</p>
               <p className="text-sm font-bold text-red-600">After Meal</p>
             </div>
           </div>
           
           <p className="mt-4 mb-3 text-sm font-bold text-teal-600 text-center px-4 leading-tight">
             The information provided above does not constitute medical advice.
           </p>
           
           <div className="w-full max-w-xs flex gap-3">
             <button 
               onClick={() => {setSt('idle'); setImg(null);}} 
               className="flex-1 py-3 px-6 rounded-xl bg-gray-800 text-white font-bold flex items-center justify-center gap-2"
             >
               <Camera size={18}/> New Scan
             </button>
             <button className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center gap-2">
               <Zap size={18}/> Save Info
             </button>
           </div>
        </div>
      )}
    </div>
  );
}

function MatchingView() {
  return (
    <div className="p-5 min-h-full flex flex-col items-center relative overflow-hidden">
      <div className="mb-6 w-full z-10">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="text-teal-600"/> Matching
        </h2>
        <p className="text-sm text-gray-500">Connect with buddies.</p>
      </div>
      
      <div className="w-full space-y-4 filter blur-[6px] opacity-60 pointer-events-none select-none">
         {[1,2,3].map(i => (
           <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 h-20"></div>
         ))}
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-6 text-center">
         <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-teal-100 w-full max-w-xs flex flex-col items-center">
            <div className="bg-teal-100 p-4 rounded-full mb-4">
              <Lock className="text-teal-600" size={32}/>
            </div>
            <h3 className="text-xl font-bold mb-2">Premium Feature</h3>
            <p className="text-sm text-gray-500 mb-6">Connect with verified local bilingual buddies.</p>
            <button className="w-full bg-teal-600 text-white font-bold py-3.5 rounded-xl shadow-lg">
              Unlock Premium
            </button>
         </div>
      </div>
    </div>
  );
}

// Reusable Tag Manager
const TagManager = ({ title, icon, color, items, setItems, placeholder }) => {
  const [val, setVal] = useState("");
  const c = { 
    yellow: {bg:"bg-yellow-50",t:"text-yellow-800",b:"border-yellow-200",btn:"bg-yellow-500"}, 
    blue: {bg:"bg-blue-50",t:"text-blue-800",b:"border-blue-200",btn:"bg-blue-500"} 
  }[color];
  
  const add = () => { 
    if (val.trim() && !items.includes(val)) { 
      setItems([...items, val]); 
      setVal(""); 
    } 
  };

  return (
    <div className={`${c.bg} rounded-xl p-4 border ${c.b} mb-4`}>
       <h4 className={`font-bold ${c.t} mb-2 flex items-center gap-2`}>{icon} {title}</h4>
       <div className="flex flex-wrap gap-2 mb-3">
         {items.map(it => (
           <span key={it} className={`bg-white ${c.t} text-xs font-bold px-3 py-1.5 rounded-lg border ${c.b} flex items-center gap-2`}>
             {it} 
             <button onClick={() => setItems(items.filter(i => i !== it))}>
               <X size={12}/>
             </button>
           </span>
         ))}
         {items.length === 0 && <span className="text-xs text-gray-400 italic">None added.</span>}
       </div>
       <div className="flex gap-2">
         <input 
           type="text" 
           value={val} 
           onChange={e => setVal(e.target.value)} 
           placeholder={placeholder} 
           className={`flex-1 text-sm px-3 py-2 rounded-lg border ${c.b} focus:outline-none`} 
         />
         <button onClick={add} className={`${c.btn} text-white px-3 py-2 rounded-lg`}>
           <Plus size={18}/>
         </button>
       </div>
    </div>
  );
};

function ProfileView({ onShowInsurance, allergies, setAllergies, medications, setMedications, user, setUser }) {
  const [edit, setEdit] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const copyLink = () => {
    const url = window.location.origin + '/#profile';
    navigator.clipboard.writeText(url).then(() => { 
      setCopied(true); 
      setTimeout(() => setCopied(false), 2000); 
    });
  };

  return (
    <div className="p-5 relative">
      {copied && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-full shadow-lg z-50">
          Link Copied!
        </div>
      )}
      
      <h2 className="text-2xl font-bold mb-6">My Health</h2>
      
      <div className="bg-white rounded-2xl p-5 shadow-sm border mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-teal-600 bg-teal-100">
            JD
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 {edit ? (
                   <div className="flex gap-2">
                     <input 
                       value={user.name} 
                       onChange={e => setUser({...user, name:e.target.value})} 
                       className="border rounded px-2 py-1 w-32"
                     />
                     <button onClick={() => setEdit(false)}>
                       <Check size={16} className="text-green-600"/>
                     </button>
                   </div>
                 ) : (
                   <>
                     <h3 className="font-bold text-lg">{user.name}</h3>
                     <button onClick={() => setEdit(true)}>
                       <Edit2 size={14} className="text-gray-400"/>
                     </button>
                   </>
                 )}
               </div>
               <button onClick={copyLink} className="text-gray-400 hover:text-teal-600">
                 <Share2 size={18}/>
               </button>
            </div>
            <p className="text-sm text-gray-500">Foreign Resident (E-7)</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-gray-50 p-2 rounded-lg">
              <p className="text-xs text-gray-400">Blood</p>
              <p className="font-bold">O+</p>
            </div>
            <div 
              className="bg-gray-50 p-2 rounded-lg cursor-pointer" 
              onClick={e => onShowInsurance(e,"NHIS")}
            >
              <p className="text-xs text-gray-400 flex justify-center items-center gap-1">
                Insurance <Info size={10}/>
              </p>
              <p className="font-bold text-teal-600">NHIS Active</p>
            </div>
        </div>
      </div>

      <TagManager 
        title="My Allergies" 
        icon={<Heart size={16} className="fill-current"/>} 
        color="yellow" 
        items={allergies} 
        setItems={setAllergies} 
        placeholder="Add allergy..." 
      />
      
      <TagManager 
        title="Current Medications" 
        icon={<Pill size={16} className="fill-current"/>} 
        color="blue" 
        items={medications} 
        setItems={setMedications} 
        placeholder="Add medication..." 
      />

      <button className="w-full bg-red-50 text-red-600 text-xs font-bold py-3 rounded-lg border border-red-200 mt-4 flex justify-center items-center gap-2">
        <Siren size={16}/> Show Emergency Card
      </button>
    </div>
  );
}

function InsuranceModal({ type, onClose }) {
  const i = INSURANCE_INFO[type];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-teal-600 p-4 flex justify-between text-white">
          <h3 className="font-bold flex gap-2"><ShieldCheck/> Guide</h3>
          <button onClick={onClose}><X/></button>
        </div>
        <div className="p-6 space-y-3 text-sm text-gray-700">
           <div className="text-center mb-4">
             <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">{i.title}</span>
           </div>
           <div className="bg-gray-50 p-3 rounded">
             <p className="font-bold text-teal-700 text-xs">Coverage</p>
             <p>{i.coverage}</p>
           </div>
           <div>
             <p className="font-bold text-xs">Tips</p>
             <p>{i.tips}</p>
           </div>
        </div>
      </div>
    </div>
  );
}