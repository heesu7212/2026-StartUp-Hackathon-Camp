import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, MapPin, Star, BookOpen, User, Phone, Globe, Activity, Heart, 
  ChevronRight, X, ChevronLeft, Flame, Info, Filter, Camera, ScanLine,
  Pill, Stethoscope, Sun, Ear, Bone, Scissors, Siren, ShieldCheck, RefreshCw, Zap, Upload, Plus,
  Venus, Users, Lock, Edit2, Check, Share2, MessageCircle, Home, CreditCard, ExternalLink
} from 'lucide-react';

// --- Firebase Imports & Initialization ---
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  signInWithCustomToken,
  signInAnonymously
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc 
} from "firebase/firestore";

// Initialize Firebase (System Global Variable or Fallback)
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : {}; // Fallback for local testing if needed

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ==============================================================================
// [로고 설정 영역] 
// ==============================================================================

// 1. 로고 심볼 (로딩 화면 & 로그인 화면용)
const LOGO_SYMBOL_URL = "https://i.postimg.cc/W1ms6TqB/seukeulinsyas-2026-01-16-014925.png"; 

// 2. 텍스트 로고 (메인 앱 상단용)
const LOGO_WITH_TEXT_URL = "https://i.postimg.cc/6QPX03zr/Kakao-Talk-20260115-183611067.jpg"; 

// ==============================================================================


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

// --- Constants & Data ---

const FLASHCARD_CATEGORIES = [
  { 
    id: 'general', 
    label: 'General / Internal', 
    icon: <Stethoscope className="text-[#198F51]" size={28} />, 
    color: 'bg-white', 
    activeColor: 'bg-[#198F51]', 
    textColor: 'text-[#198F51]',
    borderColor: 'border-[#198F51]/20',
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
    color: 'bg-white', 
    activeColor: 'bg-purple-600', 
    textColor: 'text-purple-700',
    borderColor: 'border-purple-100',
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
    color: 'bg-white', 
    activeColor: 'bg-orange-600', 
    textColor: 'text-orange-700',
    borderColor: 'border-orange-100',
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
    color: 'bg-white', 
    activeColor: 'bg-slate-600', 
    textColor: 'text-slate-700',
    borderColor: 'border-slate-100',
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
    color: 'bg-white', 
    activeColor: 'bg-yellow-500', 
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-100',
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
    id: 'obgyn', 
    label: 'OBGYN', 
    icon: <Venus className="text-pink-500" size={28} />, 
    color: 'bg-white', 
    activeColor: 'bg-pink-500', 
    textColor: 'text-pink-700',
    borderColor: 'border-pink-100',
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
    color: 'bg-white', 
    activeColor: 'bg-cyan-600', 
    textColor: 'text-cyan-700',
    borderColor: 'border-cyan-100',
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
    color: 'bg-white', 
    activeColor: 'bg-red-600', 
    textColor: 'text-red-700',
    borderColor: 'border-red-100',
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
    id: 8,
    name: "Sarang I Apuni Dental",
    type: "Dental",
    location: "Seodaemun-gu, Seoul",
    rating: 4.6,
    reviews: 74,
    englishLevel: "Advanced",
    insurance: ["NHIS"],
    description: "Focused on pain relief and extractions. 1 Specialist on duty.",
    tags: ["Toothache", "Extraction", "Root Canal"]
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
  { id: 1, hospitalId: 1, user: "Sarah J.", nationality: "USA", rating: 5, comment: "Severance Intl Center is huge but very organized. The doctor spoke perfect English.", tags: ["Language: Perfect", "Wait time: Long"] },
  { id: 2, hospitalId: 6, user: "Marco P.", nationality: "Italy", rating: 4, comment: "Went to Ipsagwi for wisdom tooth. Quick and less painful than expected.", tags: ["Skill: Good", "Friendly"] },
  { id: 3, hospitalId: 3, user: "Aiko T.", nationality: "Japan", rating: 5, comment: "Yonsei Star helped with my acne scars. Very professional.", tags: ["Result: Great", "Clean"] },
  { id: 4, hospitalId: 1, user: "Li Wei", nationality: "China", rating: 4, comment: "Doctors are great, but the registration process was a bit confusing.", tags: ["Skill: Top", "Admin: Slow"] },
  { id: 5, hospitalId: 1, user: "Hans M.", nationality: "Germany", rating: 5, comment: "Efficient and trustworthy. Direct billing worked perfectly with Cigna.", tags: ["Insurance: Easy", "Professional"] },
  { id: 6, hospitalId: 6, user: "Jessica K.", nationality: "USA", rating: 5, comment: "Best dental experience I've had. Cheap compared to the US.", tags: ["Price: Good", "Kind"] },
  { id: 7, hospitalId: 14, user: "Elena R.", nationality: "Russia", rating: 5, comment: "Dr. Sarah is very understanding and speaks English well.", tags: ["Comfortable", "Private"] },
  { id: 8, hospitalId: 14, user: "Chloe P.", nationality: "France", rating: 4, comment: "Good clinic, but you need to book 2 weeks in advance.", tags: ["Popular", "Language: Good"] },
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
  return { bg: "bg-white border-gray-200", text: "text-[#198F51]", active: "bg-[#198F51] text-white" };
};


// --- Components ---

const Badge = ({ children, color = "blue", onClick }) => {
  const colors = {
    blue: "bg-[#198F51]/10 text-[#198F51]", 
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

const InsuranceModal = ({ type, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center">
        <h3 className="font-bold text-lg mb-2 text-[#198F51]">Insurance Info</h3>
        <p className="text-gray-600 text-sm mb-4">
          Please check the <b>Insurance Tab</b> for detailed guidelines on {type} and NHIS procedures.
        </p>
        <button onClick={onClose} className="text-[#198F51] font-bold text-sm hover:underline">
          Close
        </button>
      </div>
    </div>
  );
};

// --- 1. Splash Screen ---
const SplashScreen = ({ onFinish }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = LOGO_SYMBOL_URL;
    img.onload = () => setImageLoaded(true);
    const fallbackTimer = setTimeout(() => setImageLoaded(true), 3000);
    return () => clearTimeout(fallbackTimer);
  }, []);

  useEffect(() => {
    if (imageLoaded) {
      const timer = setTimeout(() => {
        onFinish();
      }, 2500); 
      return () => clearTimeout(timer);
    }
  }, [imageLoaded, onFinish]);

  if (!imageLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#198F51] text-white">
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#198F51] text-white animate-fade-in">
      <div className="animate-bounce mb-6 bg-white p-4 rounded-3xl shadow-xl">
        <img src={LOGO_SYMBOL_URL} alt="Kare Logo" className="w-20 h-20 object-contain" />
      </div>
      <h1 className="text-3xl font-bold tracking-wider mb-2">Kare</h1>
      <p className="text-green-100 text-sm font-medium">Your Health, Our Priority</p>
      <div className="mt-8 w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin opacity-80"></div>
    </div>
  );
};

// --- Main App Logic (Consolidated) ---
function SickAndSeekApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [insuranceModalType, setInsuranceModalType] = useState(null);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Auth Initialization & Listener
  useEffect(() => {
    // Try to use a custom token if provided by the environment
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        try {
          await signInWithCustomToken(auth, __initial_auth_token);
        } catch (e) {
          console.error("Custom token sign in failed", e);
        }
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  // Deep linking check
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#profile') {
      setActiveTab('profile');
    }
  }, []);

  const openInsuranceModal = (e, type) => {
    e.stopPropagation();
    setInsuranceModalType(type);
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // 2. Not Logged In -> Show Google Login with Custom Logo (No more intermediate Login Page)
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          
          {/* Updated Logo Area */}
          <div className="flex justify-center mb-8">
             <img 
               src={LOGO_SYMBOL_URL} 
               alt="Sick&Seek Logo" 
               className="w-32 h-32 object-contain drop-shadow-md" 
             />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sick&Seek</h1>
          <p className="text-gray-500 mb-8">Your healthcare companion in Korea</p>
          
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }
 
  // 3. Logged In -> Main App Interface
  return (
    <div className="min-h-screen bg-[#FFFCF4] flex justify-center font-sans">
      <div className="w-full max-w-md bg-[#FFFCF4] shadow-xl h-screen flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <header className="px-6 py-4 bg-[#198F51] text-white shadow-md z-10 flex justify-between items-center">
          <div>
            <div className="h-10 mb-1">
                <img src={LOGO_WITH_TEXT_URL} alt="Kare" className="h-full object-contain" />
            </div>
            <p className="text-xs text-green-100 opacity-90 pl-1">Medical Care for Everyone</p>
          </div>
          
          <div 
            onClick={() => setActiveTab('profile')}
            className="bg-[#198F51] brightness-110 p-2 rounded-full border border-white/20 cursor-pointer hover:bg-green-700 transition-colors"
          >
            <User size={20} />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
          {selectedHospital ? (
            <HospitalDetail 
              hospital={selectedHospital} 
              onBack={() => setSelectedHospital(null)}
              onShowInsurance={openInsuranceModal}
            />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomeView 
                  onSelectHospital={setSelectedHospital} 
                  onShowInsurance={openInsuranceModal} 
                />
              )}
              {activeTab === 'cards' && <FlashcardView />}
              {activeTab === 'matching' && <MatchingView />}
              {activeTab === 'insurance' && <InsuranceView />}
              {activeTab === 'profile' && (
                <ProfileView 
                  onShowInsurance={openInsuranceModal}
                  user={user}
                  onLogout={handleLogout}
                />
              )}
            </>
          )}
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 h-[80px] flex items-center justify-between px-2 z-20">
          
          <NavItem 
            icon={<BookOpen size={24} />} 
            label="Procedures" 
            isActive={activeTab === 'cards'} 
            onClick={() => { setActiveTab('cards'); setSelectedHospital(null); }} 
          />

          <NavItem 
            icon={<Users size={24} />} 
            label="Matching" 
            isActive={activeTab === 'matching'} 
            onClick={() => { setActiveTab('matching'); setSelectedHospital(null); }} 
          />

          {/* Center Main Button */}
          <div className="relative -top-6">
            <button 
              onClick={() => { setActiveTab('home'); setSelectedHospital(null); }}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-[#FFFCF4] transition-transform ${activeTab === 'home' ? 'bg-[#198F51] text-white scale-110' : 'bg-gray-100 text-gray-400'}`}
            >
              <Search size={28} />
            </button>
            <span className={`text-[10px] font-bold absolute -bottom-4 left-1/2 transform -translate-x-1/2 ${activeTab === 'home' ? 'text-[#198F51]' : 'text-gray-400'}`}>Find</span>
          </div>

          <NavItem 
            icon={<ShieldCheck size={24} />} 
            label="Insurance" 
            isActive={activeTab === 'insurance'} 
            onClick={() => { setActiveTab('insurance'); setSelectedHospital(null); }} 
          />

          <NavItem 
            icon={<Activity size={24} />} 
            label="My Health" 
            isActive={activeTab === 'profile'} 
            onClick={() => { setActiveTab('profile'); setSelectedHospital(null); }} 
          />
        </nav>

        {/* Modal Overlay */}
        {insuranceModalType && (
          <InsuranceModal 
            type={insuranceModalType} 
            onClose={() => setInsuranceModalType(null)} 
          />
        )}
      </div>
    </div>
  );
}

// --- Sub-Views ---

function HomeView({ onSelectHospital, onShowInsurance }) {
  const [activeCat, setActiveCat] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const HOT_THRESHOLD = 100;

  const filteredHospitals = HOSPITALS.filter(h => 
    (activeCat === "All" || h.type === activeCat) &&
    (h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     h.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
     h.location.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => {
    const isAHot = a.reviews >= HOT_THRESHOLD;
    const isBHot = b.reviews >= HOT_THRESHOLD;
    
    if (isAHot && !isBHot) return -1;
    if (!isAHot && isBHot) return 1;
    return 0;
  });

  return (
    <div className="p-4 space-y-6 pb-32">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search symptoms (e.g. Headache), clinics..." 
          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#198F51] transition-shadow shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => {
          const colors = getCategoryColor(cat);
          const isActive = activeCat === cat;
          
          return (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                isActive ? colors.active : `${colors.bg} ${colors.text}`
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="font-bold text-gray-800 text-lg">Hospitals in Seoul</h2>
          <span className="text-xs text-gray-500">Filtered Result: {filteredHospitals.length}</span>
        </div>

        {filteredHospitals.map(hospital => {
          const categoryColors = getCategoryColor(hospital.type);
          
          return (
            <div 
              key={hospital.id} 
              onClick={() => onSelectHospital(hospital)}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className={`text-xs font-bold uppercase tracking-wide ${categoryColors.text}`}>
                    {hospital.type}
                  </span>
                  <h3 className="font-bold text-gray-900 text-lg">{hospital.name}</h3>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star size={14} className="text-yellow-500 fill-current mr-1" />
                    <span className="text-xs font-bold text-yellow-700">{hospital.rating}</span>
                    <span className="text-xs text-gray-400 ml-1">({hospital.reviews})</span>
                  </div>
                  {hospital.reviews >= HOT_THRESHOLD && (
                    <div className="flex items-center bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-red-100 animate-pulse">
                      <Flame size={12} className="fill-current mr-1" />
                      HOT
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center text-gray-500 text-xs mb-3">
                <MapPin size={14} className="mr-1" />
                {hospital.location}
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                <Badge color="purple">Eng: {hospital.englishLevel}</Badge>
                {hospital.insurance.map(ins => (
                  <Badge key={ins} color="green" onClick={(e) => onShowInsurance(e, ins)}>
                    {ins}
                  </Badge>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                 {hospital.tags.slice(0, 4).map(tag => (
                   <span key={tag} className="text-[10px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded">#{tag}</span>
                 ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InsuranceView() {
  return (
    <div className="p-5 min-h-full pb-32">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ShieldCheck className="text-[#198F51]" /> NHIS Guide
        </h2>
        <p className="text-sm text-gray-500">How to use Korea's National Health Insurance</p>
      </div>

      <div className="space-y-6 mb-8">
        <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
          
          <div className="relative pl-8">
            <div className="absolute -left-[9px] top-0 w-5 h-5 rounded-full bg-[#198F51] border-4 border-[#FFFCF4]"></div>
            <h3 className="font-bold text-gray-800 text-lg">1. Alien Registration</h3>
            <p className="text-sm text-gray-600 mt-1">
              You must have an <b>Alien Registration Card (ARC)</b>. 
              NHIS enrollment is mandatory for foreigners staying <b>6+ months</b> in Korea.
            </p>
          </div>

          <div className="relative pl-8">
            <div className="absolute -left-[9px] top-0 w-5 h-5 rounded-full bg-[#198F51] border-4 border-[#FFFCF4]"></div>
            <h3 className="font-bold text-gray-800 text-lg">2. Enrollment</h3>
            <p className="text-sm text-gray-600 mt-1">
              <b>Employee:</b> Automatic by employer.<br/>
              <b>Student (D-2/D-4):</b> Automatic processing.<br/>
              <b>Others:</b> Receive a bill as "Local Subscriber" at your registered address.
            </p>
          </div>

          <div className="relative pl-8">
            <div className="absolute -left-[9px] top-0 w-5 h-5 rounded-full bg-[#198F51] border-4 border-[#FFFCF4]"></div>
            <h3 className="font-bold text-gray-800 text-lg">3. Paying Premiums</h3>
            <p className="text-sm text-gray-600 mt-1">
              Monthly premium is approx. <b>150,990 KRW</b> (2024 min for local). <br/>
              Students get a discount (~50-70% off).<br/>
              <span className="text-red-500 text-xs font-bold block mt-1">Warning: Visa extension is denied if you have unpaid premiums.</span>
            </p>
          </div>

          <div className="relative pl-8">
            <div className="absolute -left-[9px] top-0 w-5 h-5 rounded-full bg-[#198F51] border-4 border-[#FFFCF4]"></div>
            <h3 className="font-bold text-gray-800 text-lg">4. Benefits</h3>
            <p className="text-sm text-gray-600 mt-1">
              Same coverage as Korean citizens.<br/>
              <b>Outpatient:</b> Pay 30~60% of cost.<br/>
              <b>Inpatient:</b> Pay 20%.<br/>
              <b>Pharmacy:</b> Pay 30%.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Phone size={18} className="text-[#198F51]"/> Official NHIS Contacts
        </h3>
        
        <div className="space-y-3">
          <a 
            href="https://www.nhis.or.kr/english/index.do" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm font-bold text-gray-700">Official Website (English)</span>
            <ExternalLink size={16} className="text-gray-400"/>
          </a>

          <div className="grid grid-cols-2 gap-3">
            <a href="tel:033-811-2000" className="flex flex-col items-center justify-center p-3 bg-[#198F51]/10 rounded-xl hover:bg-[#198F51]/20 transition-colors text-center">
              <span className="text-xs text-[#198F51] font-bold mb-1">English / Chinese</span>
              <span className="text-lg font-bold text-[#198F51]">033-811-2000</span>
            </a>
            <a href="tel:1577-1000" className="flex flex-col items-center justify-center p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors text-center">
              <span className="text-xs text-gray-500 font-bold mb-1">Korean General</span>
              <span className="text-lg font-bold text-gray-700">1577-1000</span>
            </a>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg mb-8">
         <div className="p-6 filter blur-[2px] opacity-50 select-none">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
               <div className="h-4 bg-gray-200 w-32 rounded"></div>
            </div>
            <div className="space-y-2">
               <div className="h-3 bg-gray-100 w-full rounded"></div>
               <div className="h-3 bg-gray-100 w-3/4 rounded"></div>
            </div>
         </div>

         <div className="absolute inset-0 bg-gradient-to-br from-[#198F51]/90 to-[#147a43]/90 flex flex-col items-center justify-center text-white p-6 text-center">
            <div className="bg-white/20 p-3 rounded-full mb-3 backdrop-blur-sm">
               <MessageCircle size={28} className="text-white"/>
            </div>
            <h3 className="font-bold text-lg mb-1">1:1 Insurance Concierge</h3>
            <p className="text-xs text-green-100 mb-4 opacity-90">
               Chat with a professional agent to solve complex insurance issues.
            </p>
            <button className="bg-white text-[#198F51] text-xs font-bold py-2.5 px-6 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
               Unlock Premium
            </button>
         </div>
      </div>
    </div>
  );
}

function FlashcardView() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [showScan, setShowScan] = useState(false);

  if (showScan) {
    return (
      <div className="min-h-full flex flex-col">
        <div className="p-4 flex items-center border-b border-gray-100 bg-white sticky top-0 z-10">
          <button onClick={() => setShowScan(false)} className="mr-3 p-2 bg-gray-50 rounded-full text-gray-600">
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-gray-800">Smart Scan</span>
        </div>
        <ScanView />
      </div>
    );
  }

  if (!selectedCategory) {
    return (
      <div className="p-5 min-h-full pb-32">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Medical Procedures</h2>
          <p className="text-sm text-gray-500">Select a category to learn about treatments.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {FLASHCARD_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className={`${cat.color} p-5 rounded-2xl border ${cat.borderColor || 'border-transparent'} hover:border-[#198F51] hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 h-36 bg-white`}
            >
              <div className="bg-[#198F51]/10 p-3 rounded-full shadow-sm">
                {cat.icon}
              </div>
              <span className={`font-bold text-sm text-center ${cat.textColor}`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        <div 
          onClick={() => setShowScan(true)}
          className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-5 text-white shadow-lg flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-transform"
        >
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <ScanLine size={20} className="text-[#198F51]" /> Smart Scan
            </h3>
            <p className="text-xs text-gray-300 mt-1">Translate medicine bags & prescriptions</p>
          </div>
          <div className="bg-white/10 p-2 rounded-lg">
            <ChevronRight size={20} />
          </div>
        </div>
      </div>
    );
  }

  if (selectedCategory && !selectedProcedure) {
    return (
      <div className={`p-5 min-h-full bg-white transition-colors duration-500 pb-32`}>
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setSelectedCategory(null)}
            className="mr-3 p-2 bg-gray-100 rounded-full shadow-sm text-gray-600 hover:bg-gray-200"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className={`text-xl font-bold ${selectedCategory.textColor}`}>
              {selectedCategory.label}
            </h2>
            <p className="text-xs text-gray-500 opacity-80">Common Procedures</p>
          </div>
        </div>

        <div className="space-y-3">
          {selectedCategory.procedures ? (
            selectedCategory.procedures.map((proc, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedProcedure(proc)}
                className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex justify-between items-center cursor-pointer hover:shadow-md transition-all"
              >
                <span className="font-bold text-gray-800">{proc.title}</span>
                <ChevronRight size={20} className="text-gray-300" />
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-white/50 rounded-xl">
              <p className="text-gray-500">No procedure data available.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 min-h-full bg-white pb-32">
       <div className="flex items-center mb-6">
          <button 
            onClick={() => setSelectedProcedure(null)}
            className="mr-3 p-2 bg-gray-100 rounded-full shadow-sm text-gray-600 hover:bg-gray-200"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800 leading-tight">
              {selectedProcedure.title}
            </h2>
          </div>
        </div>

        <div className="space-y-6">
          <div className={`p-4 rounded-xl ${selectedCategory.color} border border-transparent`}>
             <h3 className={`font-bold mb-2 flex items-center gap-2 ${selectedCategory.textColor}`}>
               <Info size={18}/> Procedure Steps
             </h3>
             <div className="relative border-l-2 border-gray-300 ml-2 space-y-6 py-2">
                {selectedProcedure.steps.map((step, idx) => (
                  <div key={idx} className="relative pl-6">
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${selectedCategory.activeColor}`}></div>
                    <p className="text-sm text-gray-700 font-medium leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <p className="text-xs text-gray-400 mb-2">Is this procedure covered by insurance?</p>
            <button className="bg-[#198F51] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm">
              Check Insurance Guide
            </button>
          </div>
        </div>
    </div>
  );
}

function ScanView() {
  const [scanningState, setScanningState] = useState('idle');
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setScanningState('scanning');
      
      setTimeout(() => {
        setScanningState('result');
      }, 2500);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const resetScan = () => {
    setScanningState('idle');
    setSelectedImage(null);
  };

  return (
    <div className="p-5 flex flex-col items-center flex-1 justify-center min-h-[60vh] pb-32">
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {scanningState === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xs gap-6">
           <div 
             onClick={triggerFileInput}
             className="w-64 h-80 border-4 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center bg-white hover:bg-gray-50 hover:border-[#198F51] cursor-pointer transition-all group shadow-sm"
           >
             <Upload size={48} className="text-gray-400 group-hover:text-[#198F51] mb-4 transition-colors"/>
             <p className="text-gray-400 font-bold group-hover:text-[#198F51]">Upload Image</p>
             <p className="text-xs text-gray-300 mt-2 px-6 text-center">Tap to select your photo of medicine</p>
           </div>
           <p className="text-xs text-center text-gray-400">
             AI automatically translates medicine ingredients <br/> and overlays instructions.
           </p>
        </div>
      )}

      {scanningState === 'scanning' && (
        <div className="flex-1 flex flex-col items-center justify-center w-full">
           <div className="relative w-72 h-96 bg-gray-800 rounded-3xl overflow-hidden shadow-xl flex items-center justify-center">
             {selectedImage && (
               <img src={selectedImage} alt="Scanning" className="absolute inset-0 w-full h-full object-cover opacity-80" />
             )}
             
             <div className="absolute inset-0 bg-black/20 z-10"></div>
             <ScanLine className="text-[#198F51] animate-pulse z-20" size={64} />
             <div className="absolute inset-x-0 h-1 bg-[#198F51] shadow-[0_0_15px_rgba(25,143,81,0.8)] z-20 animate-[scan_2s_ease-in-out_infinite] top-0"></div>
             <p className="absolute bottom-10 z-20 text-white font-bold animate-bounce bg-black/50 px-3 py-1 rounded-full text-xs backdrop-blur-sm">Analyzing Image...</p>
           </div>
        </div>
      )}

      {scanningState === 'result' && (
        <div className="w-full h-full flex flex-col items-center animate-fade-in">
           <div className="bg-[#198F51]/10 border border-[#198F51]/30 px-4 py-2 rounded-full flex items-center gap-2 mb-4">
             <RefreshCw className="text-[#198F51] animate-spin-slow" size={14} />
             <span className="text-xs font-bold text-[#198F51]">AR Translation Active</span>
           </div>

           <div className="relative w-72 h-96 bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-gray-200">
             
             {selectedImage && (
                <img src={selectedImage} alt="Result" className="absolute inset-0 w-full h-full object-cover" />
             )}

             <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg border border-[#198F51]/30 animate-[bounce_1s_ease-out]">
                 <p className="text-[10px] text-gray-500 font-bold uppercase">Medicine</p>
                 <p className="text-sm font-bold text-[#198F51]">타이레놀 (Painkiller)</p>
                 <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#198F51] rounded-full animate-ping"></div>
             </div>

             <div className="absolute bottom-1/3 right-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg border border-[#198F51]/30 delay-100 animate-[bounce_1.2s_ease-out]">
                 <p className="text-[10px] text-gray-500 font-bold uppercase">Dose</p>
                 <p className="text-sm font-bold text-indigo-700">2 Tablets</p>
             </div>

             <div className="absolute bottom-20 left-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg border border-[#198F51]/30 delay-200 animate-[bounce_1.4s_ease-out]">
                 <p className="text-[10px] text-gray-500 font-bold uppercase">How to take</p>
                 <p className="text-sm font-bold text-red-600">After Meal (30min)</p>
             </div>

             <div className="absolute inset-0 border-2 border-[#198F51]/30 rounded-3xl pointer-events-none"></div>
             <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 rounded text-[10px] backdrop-blur-sm">
                 AI Confidence: 98%
             </div>
           </div>
           
           <p className="mt-4 mb-3 text-sm font-bold text-[#198F51] text-center px-4 leading-tight">
             The information provided above does not constitute medical advice.
           </p>

           <div className="w-full max-w-xs flex gap-3">
             <button 
               onClick={resetScan}
               className="flex-1 py-3 rounded-xl bg-gray-800 text-white font-bold hover:bg-gray-700 transition-colors shadow-lg flex items-center justify-center gap-2"
             >
               <Camera size={18}/> New Scan
             </button>
             <button 
                className="flex-1 py-3 rounded-xl bg-[#198F51] text-white font-bold hover:bg-[#147a43] transition-colors shadow-lg flex items-center justify-center gap-2"
             >
                <Zap size={18} className="fill-current"/> Save Info
             </button>
           </div>
        </div>
      )}
    </div>
  );
}

function MatchingView() {
  return (
    <div className="p-5 min-h-full flex flex-col items-center relative overflow-hidden pb-32">
      <div className="mb-6 w-full z-10">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-[#198F51]"/> Matching
          </h2>
          <p className="text-sm text-gray-500">Connect with local medical buddies.</p>
      </div>

      <div className="w-full space-y-4 filter blur-[6px] opacity-60 pointer-events-none select-none">
         {[1, 2, 3].map((i) => (
           <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
             <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
             <div className="flex-1">
                 <div className="w-1/2 h-4 bg-gray-200 rounded mb-2"></div>
                 <div className="w-3/4 h-3 bg-gray-100 rounded"></div>
             </div>
             <div className="w-16 h-8 bg-[#198F51]/20 rounded-lg"></div>
           </div>
         ))}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-6 text-center">
         <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-[#198F51]/30 w-full max-w-xs flex flex-col items-center animate-fade-in">
            <div className="bg-[#198F51]/10 p-4 rounded-full mb-4">
               <Lock className="text-[#198F51]" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Premium Feature</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Connect with verified local bilingual buddies who can accompany you to the hospital.
            </p>
            <button className="w-full bg-[#198F51] text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-[#147a43] transition-colors flex items-center justify-center gap-2">
               Unlock through Premium
            </button>
            <p className="text-[10px] text-gray-400 mt-3">Starting at $4.99/month</p>
         </div>
      </div>
    </div>
  );
}

function HospitalDetail({ hospital, onBack, onShowInsurance }) {
  const [filterNation, setFilterNation] = useState("All");

  const hospitalReviews = REVIEWS_DB.filter(r => r.hospitalId === hospital.id || (hospital.id === 1 && r.hospitalId === undefined)); 
  
  const nationalities = ["All", ...new Set(hospitalReviews.map(r => r.nationality))];

  const filteredReviews = filterNation === "All" 
    ? hospitalReviews 
    : hospitalReviews.filter(r => r.nationality === filterNation);

  return (
    <div className="bg-white min-h-full pb-32">
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 px-4 py-3 border-b border-gray-100 flex items-center">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <X size={20} className="text-gray-600" />
        </button>
        <span className="ml-2 font-semibold text-gray-800">Hospital Detail</span>
      </div>

      <div className="p-5 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{hospital.name}</h2>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <MapPin size={16} className="mr-1" />
            {hospital.location}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-3 bg-[#198F51]/10 text-[#198F51] rounded-xl font-medium text-sm">
            <Phone size={18} /> Call (Eng)
          </button>
          <button className="flex items-center justify-center gap-2 py-3 bg-[#198F51]/10 text-[#198F51] rounded-xl font-medium text-sm">
            <Globe size={18} /> Website
          </button>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-2">About & Insurance</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">{hospital.description}</p>
          <div className="flex flex-wrap gap-2 mb-2">
             {hospital.insurance.map(ins => (
                <Badge key={ins} color="green" onClick={(e) => onShowInsurance(e, ins)}>
                  {ins} <Info size={10} className="inline ml-1"/>
                </Badge>
              ))}
          </div>
          <p className="text-[10px] text-gray-400">*Click insurance badge for details.</p>
        </div>

        <div className="border-t border-gray-100 pt-2">
           <h3 className="font-bold text-gray-900 mb-2 text-sm">Available for:</h3>
           <div className="flex flex-wrap gap-2">
            {hospital.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 rounded-lg text-xs text-gray-600">#{tag}</span>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-gray-900">Reviews ({filteredReviews.length})</h3>
              <p className="text-xs text-gray-500">Verified Foreign Residents</p>
            </div>
            
            <div className="relative">
              <select 
                value={filterNation}
                onChange={(e) => setFilterNation(e.target.value)}
                className="appearance-none bg-[#198F51]/10 border border-[#198F51]/20 text-[#198F51] text-xs font-bold py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#198F51]"
              >
                {nationalities.map(nat => (
                  <option key={nat} value={nat}>{nat === "All" ? "All Nations" : nat}</option>
                ))}
              </select>
              <Filter size={12} className="absolute right-2 top-2.5 text-[#198F51] pointer-events-none" />
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredReviews.length > 0 ? (
              filteredReviews.map(review => (
                <div key={review.id} className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                        {review.user.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{review.user}</p>
                        <p className="text-[10px] text-gray-500 uppercase flex items-center gap-1">
                          <Globe size={10} /> {review.nationality}
                        </p>
                      </div>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} stroke={i < review.rating ? "none" : "currentColor"} className={i >= review.rating ? "text-gray-300" : ""} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm italic">"{review.comment}"</p>
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {review.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm">No reviews from {filterNation} yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
       
      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-100 pb-8">
        <button className="w-full bg-[#198F51] text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-[#147a43] transition-colors">
          Book Appointment
        </button>
      </div>
    </div>
  );
}

function ProfileView({ onShowInsurance, user, onLogout }) {
  const [myAllergies, setMyAllergies] = useState([]);
  const [myMedications, setMyMedications] = useState([]);
  const [newAllergy, setNewAllergy] = useState("");
  const [newMedication, setNewMedication] = useState("");
  const [name, setName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const userId = user?.uid || "guest";

  useEffect(() => {
    if (!user) return;
    
    const loadUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setMyAllergies(data.allergies || []);
          setMyMedications(data.medications || []);
          setName(data.name || user.displayName || "User");
        } else {
          setName(user.displayName || "User");
        }
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };
    
    loadUserData();
  }, [user, userId]);

  const handleAddAllergy = async () => {
    if (newAllergy.trim() && !myAllergies.includes(newAllergy.trim())) {
      const updated = [...myAllergies, newAllergy.trim()];
      setMyAllergies(updated);
      setNewAllergy("");
      
      try {
        await setDoc(doc(db, 'users', userId), {
          allergies: updated,
          medications: myMedications,
          name: name
        }, { merge: true });
      } catch (error) {
        console.error("알레르기 저장 실패:", error);
      }
    }
  };

  const handleRemoveAllergy = async (allergyToRemove) => {
    const updated = myAllergies.filter(a => a !== allergyToRemove);
    setMyAllergies(updated);
    
    try {
      await setDoc(doc(db, 'users', userId), {
        allergies: updated,
        medications: myMedications,
        name: name
      }, { merge: true });
    } catch (error) {
      console.error("알레르기 삭제 실패:", error);
    }
  };

  const handleAddMedication = async () => {
    if (newMedication.trim() && !myMedications.includes(newMedication.trim())) {
      const updated = [...myMedications, newMedication.trim()];
      setMyMedications(updated);
      setNewMedication("");
      
      try {
        await setDoc(doc(db, 'users', userId), {
          allergies: myAllergies,
          medications: updated,
          name: name
        }, { merge: true });
      } catch (error) {
        console.error("약 저장 실패:", error);
      }
    }
  };

  const handleRemoveMedication = async (medToRemove) => {
    const updated = myMedications.filter(m => m !== medToRemove);
    setMyMedications(updated);
    
    try {
      await setDoc(doc(db, 'users', userId), {
        allergies: myAllergies,
        medications: updated,
        name: name
      }, { merge: true });
    } catch (error) {
      console.error("약 삭제 실패:", error);
    }
  };

  const copyProfileLink = () => {
    const url = window.location.origin + '/#profile';
    const textArea = document.createElement("textarea");
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="p-5 relative pb-32">
      {showToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-full shadow-lg z-50 animate-fade-in">
          Link Copied!
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Health</h2>
      
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden shrink-0">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#198F51]/10 text-[#198F51] font-bold text-xl">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2 w-full">
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="border border-[#198F51]/50 rounded px-2 py-1 text-sm font-bold text-gray-800 w-32 focus:outline-none focus:ring-2 focus:ring-[#198F51]"
                    />
                    <button onClick={() => setIsEditingName(false)} className="bg-[#198F51]/10 p-1 rounded-full text-[#198F51]">
                      <Check size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-lg">{name}</h3>
                    <button onClick={() => setIsEditingName(true)} className="text-gray-400 hover:text-[#198F51]">
                      <Edit2 size={14} />
                    </button>
                  </>
                )}
              </div>
              
              <button onClick={copyProfileLink} className="text-gray-400 hover:text-[#198F51] p-1">
                <Share2 size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Blood Type</p>
                <p className="font-bold text-gray-700">O+</p>
            </div>
            <div 
              className="bg-gray-50 p-2 rounded-lg cursor-pointer hover:bg-gray-100"
              onClick={(e) => onShowInsurance(e, "NHIS")}
            >
                <p className="text-xs text-gray-400 flex items-center justify-center gap-1">Insurance <Info size={10}/></p>
                <p className="font-bold text-[#198F51]">NHIS Active</p>
            </div>
        </div>
      </div>

      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 mb-4">
        <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
            <Heart size={16} className="fill-current" /> My Allergies
        </h4>
        <p className="text-xs text-yellow-900 mb-3 opacity-80">
            Add substances you are allergic to for emergency use.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {myAllergies.map(allergy => (
            <span key={allergy} className="bg-white text-yellow-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-yellow-200 flex items-center gap-2">
              {allergy}
              <button onClick={() => handleRemoveAllergy(allergy)}>
                <X size={12} className="text-yellow-500 hover:text-red-500" />
              </button>
            </span>
          ))}
          {myAllergies.length === 0 && (
            <span className="text-xs text-gray-400 italic">No allergies added yet.</span>
          )}
        </div>

        <div className="flex gap-2">
          <input 
            type="text" 
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            placeholder="Add allergy..." 
            className="flex-1 text-sm px-3 py-2 rounded-lg border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button 
            onClick={handleAddAllergy}
            className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="bg-[#198F51]/5 rounded-xl p-4 border border-[#198F51]/20 mb-4">
        <h4 className="font-bold text-[#198F51] mb-2 flex items-center gap-2">
            <Pill size={16} className="fill-current" /> Current Medications
        </h4>
        <p className="text-xs text-[#198F51]/80 mb-3 opacity-80">
            List medications you are currently taking.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {myMedications.map(med => (
            <span key={med} className="bg-white text-[#198F51] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#198F51]/20 flex items-center gap-2">
              {med}
              <button onClick={() => handleRemoveMedication(med)}>
                <X size={12} className="text-[#198F51] hover:text-red-500" />
              </button>
            </span>
          ))}
          {myMedications.length === 0 && (
            <span className="text-xs text-gray-400 italic">No medications added yet.</span>
          )}
        </div>

        <div className="flex gap-2">
          <input 
            type="text" 
            value={newMedication}
            onChange={(e) => setNewMedication(e.target.value)}
            placeholder="Add medication..." 
            className="flex-1 text-sm px-3 py-2 rounded-lg border border-[#198F51]/20 focus:outline-none focus:ring-2 focus:ring-[#198F51]"
          />
          <button 
            onClick={handleAddMedication}
            className="bg-[#198F51] text-white px-3 py-2 rounded-lg hover:bg-[#147a43] transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="mt-4">
            <button className="w-full bg-red-50 text-red-600 text-xs font-bold py-3 rounded-lg border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
              <Siren size={16} /> Show Emergency Card (Korean)
          </button>
      </div>

      <div className="mt-6 space-y-2">
         <h4 className="font-bold text-gray-700 text-sm">Insurance Guide</h4>
         <div className="grid grid-cols-2 gap-2">
             {["NHIS", "Travel Ins.", "Private Only", "Tax Refund"].map(type => (
                 <button 
                  key={type}
                  onClick={(e) => onShowInsurance(e, type)}
                  className="bg-white p-3 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-[#198F51] hover:text-[#198F51] transition-all text-left"
                 >
                    {type}
                 </button>
             ))}
         </div>
      </div>

      <div className="mt-6">
        <button 
          onClick={onLogout}
          className="w-full bg-gray-100 text-gray-700 text-sm font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors w-14 ${isActive ? 'text-[#198F51]' : 'text-gray-400'}`}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

// --- Main App Orchestrator ---
export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // 이제 'login' state 대신 SickAndSeekApp 내부에서 user 상태를 체크하여 
  // 로그인 화면을 보여줄지 메인 화면을 보여줄지 결정합니다.
  return <SickAndSeekApp />;
}