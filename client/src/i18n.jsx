import { createContext, useContext, useState } from "react";

export const LANGS = [
  { code: "en", label: "English" },
  { code: "ta", label: "தமிழ்" },
  { code: "hi", label: "हिन्दी" },
  { code: "te", label: "తెలుగు" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
  { code: "bn", label: "বাংলা" },
];

const T = {
  en: {
    dash: "Dashboard", courses: "Courses", map: "Concept Map", ana: "Analytics",
    rewards: "Coins & Rewards", career: "CAREER PREP", aptitude: "Aptitude Practice",
    ivq: "Interview Questions", mock: "Mock Interview", coaching: "AI Coaching", chat: "AI Chatbot",
    path: "Learning Path", daily: "Daily Tasks", board: "Leaderboard", profile: "Profile",
    settings: "Settings", teach: "Teacher", out: "Logout", hi: "Hi",
    tagline: "Learn. Understand. Improve. Unlock.",
    achievements: "Achievements", locked: "Locked", name: "Name", email: "Email",
    role: "Role", coins: "Coins", language: "Language",
  },
  ta: {
    dash: "டாஷ்போர்டு", courses: "படிப்புகள்", map: "கருத்து வரைபடம்", ana: "பகுப்பாய்வு",
    rewards: "நாணயங்கள் & பரிசுகள்", career: "தொழில் தயாரிப்பு", aptitude: "திறனறிதல் பயிற்சி",
    ivq: "நேர்காணல் கேள்விகள்", mock: "மாதிரி நேர்காணல்", coaching: "AI பயிற்சி", chat: "AI சாட்பாட்",
    path: "கற்றல் பாதை", daily: "தினசரி பணிகள்", board: "தரவரிசை", profile: "சுயவிவரம்",
    settings: "அமைப்புகள்", teach: "ஆசிரியர்", out: "வெளியேறு", hi: "வணக்கம்",
    tagline: "கற்றுக்கொள். புரிந்துகொள். மேம்படு. திற.",
    achievements: "சாதனைகள்", locked: "பூட்டப்பட்டது", name: "பெயர்", email: "மின்னஞ்சல்",
    role: "பங்கு", coins: "நாணயங்கள்", language: "மொழி",
  },
  hi: {
    dash: "डैशबोर्ड", courses: "कोर्स", map: "कॉन्सेप्ट मैप", ana: "एनालिटिक्स",
    rewards: "सिक्के और पुरस्कार", career: "करियर तैयारी", aptitude: "एप्टीट्यूड अभ्यास",
    ivq: "इंटरव्यू प्रश्न", mock: "मॉक इंटरव्यू", coaching: "AI कोचिंग", chat: "AI चैटबॉट",
    path: "लर्निंग पाथ", daily: "दैनिक कार्य", board: "लीडरबोर्ड", profile: "प्रोफ़ाइल",
    settings: "सेटिंग्स", teach: "शिक्षक", out: "लॉग आउट", hi: "नमस्ते",
    tagline: "सीखें। समझें। सुधारें। अनलॉक करें।",
    achievements: "उपलब्धियाँ", locked: "लॉक", name: "नाम", email: "ईमेल",
    role: "भूमिका", coins: "सिक्के", language: "भाषा",
  },
  te: {
    dash: "డాష్‌బోర్డ్", courses: "కోర్సులు", map: "కాన్సెప్ట్ మ్యాప్", ana: "విశ్లేషణ",
    rewards: "నాణేలు & బహుమతులు", career: "కెరీర్ సన్నద్ధత", aptitude: "ఆప్టిట్యూడ్ ప్రాక్టీస్",
    ivq: "ఇంటర్వ్యూ ప్రశ్నలు", mock: "మాక్ ఇంటర్వ్యూ", coaching: "AI కోచింగ్", chat: "AI చాట్‌బాట్",
    path: "లెర్నింగ్ పాత్", daily: "రోజువారీ పనులు", board: "లీడర్‌బోర్డ్", profile: "ప్రొఫైల్",
    settings: "సెట్టింగ్స్", teach: "ఉపాధ్యాయుడు", out: "లాగ్ అవుట్", hi: "నమస్కారం",
    tagline: "నేర్చుకో. అర్థం చేసుకో. మెరుగుపడు. అన్‌లాక్ చేయి.",
    achievements: "విజయాలు", locked: "లాక్ చేయబడింది", name: "పేరు", email: "ఇమెయిల్",
    role: "పాత్ర", coins: "నాణేలు", language: "భాష",
  },
  kn: {
    dash: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", courses: "ಕೋರ್ಸ್‌ಗಳು", map: "ಕಾನ್ಸೆಪ್ಟ್ ಮ್ಯಾಪ್", ana: "ವಿಶ್ಲೇಷಣೆ",
    rewards: "ನಾಣ್ಯಗಳು ಮತ್ತು ಬಹುಮಾನಗಳು", career: "ವೃತ್ತಿ ಸಿದ್ಧತೆ", aptitude: "ಆಪ್ಟಿಟ್ಯೂಡ್ ಅಭ್ಯಾಸ",
    ivq: "ಸಂದರ್ಶನ ಪ್ರಶ್ನೆಗಳು", mock: "ಮಾಕ್ ಸಂದರ್ಶನ", coaching: "AI ಕೋಚಿಂಗ್", chat: "AI ಚಾಟ್‌ಬಾಟ್",
    path: "ಕಲಿಕೆಯ ಹಾದಿ", daily: "ದೈನಂದಿನ ಕಾರ್ಯಗಳು", board: "ಲೀಡರ್‌ಬೋರ್ಡ್", profile: "ಪ್ರೊಫೈಲ್",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು", teach: "ಶಿಕ್ಷಕ", out: "ಲಾಗ್ ಔಟ್", hi: "ನಮಸ್ಕಾರ",
    tagline: "ಕಲಿಯಿರಿ. ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ. ಸುಧಾರಿಸಿ. ಅನ್‌ಲಾಕ್ ಮಾಡಿ.",
    achievements: "ಸಾಧನೆಗಳು", locked: "ಲಾಕ್ ಆಗಿದೆ", name: "ಹೆಸರು", email: "ಇಮೇಲ್",
    role: "ಪಾತ್ರ", coins: "ನಾಣ್ಯಗಳು", language: "ಭಾಷೆ",
  },
  ml: {
    dash: "ഡാഷ്ബോർഡ്", courses: "കോഴ്സുകൾ", map: "കൺസെപ്റ്റ് മാപ്പ്", ana: "അനലിറ്റിക്സ്",
    rewards: "നാണയങ്ങളും സമ്മാനങ്ങളും", career: "കരിയർ തയ്യാറെടുപ്പ്", aptitude: "അഭിരുചി പരിശീലനം",
    ivq: "അഭിമുഖ ചോദ്യങ്ങൾ", mock: "മോക്ക് അഭിമുഖം", coaching: "AI കോച്ചിംഗ്", chat: "AI ചാറ്റ്ബോട്ട്",
    path: "പഠന പാത", daily: "ദൈനംദിന ടാസ്കുകൾ", board: "ലീഡർബോർഡ്", profile: "പ്രൊഫൈൽ",
    settings: "ക്രമീകരണങ്ങൾ", teach: "അധ്യാപകൻ", out: "ലോഗ് ഔട്ട്", hi: "നമസ്കാരം",
    tagline: "പഠിക്കൂ. മനസ്സിലാക്കൂ. മെച്ചപ്പെടൂ. അൺലോക്ക് ചെയ്യൂ.",
    achievements: "നേട്ടങ്ങൾ", locked: "ലോക്ക് ചെയ്തു", name: "പേര്", email: "ഇമെയിൽ",
    role: "റോൾ", coins: "നാണയങ്ങൾ", language: "ഭാഷ",
  },
  bn: {
    dash: "ড্যাশবোর্ড", courses: "কোর্স", map: "কনসেপ্ট ম্যাপ", ana: "অ্যানালিটিক্স",
    rewards: "কয়েন ও পুরস্কার", career: "ক্যারিয়ার প্রস্তুতি", aptitude: "অ্যাপটিটিউড অনুশীলন",
    ivq: "ইন্টারভিউ প্রশ্ন", mock: "মক ইন্টারভিউ", coaching: "AI কোচিং", chat: "AI চ্যাটবট",
    path: "শেখার পথ", daily: "দৈনিক কাজ", board: "লিডারবোর্ড", profile: "প্রোফাইল",
    settings: "সেটিংস", teach: "শিক্ষক", out: "লগ আউট", hi: "নমস্কার",
    tagline: "শিখুন। বুঝুন। উন্নতি করুন। আনলক করুন।",
    achievements: "অর্জন", locked: "লক করা", name: "নাম", email: "ইমেইল",
    role: "ভূমিকা", coins: "কয়েন", language: "ভাষা",
  },
};

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem("lang") || "en");

  const setLang = (l) => {
    localStorage.setItem("lang", l);
    setLangState(l);
  };

  const t = (key) => T[lang]?.[key] || T.en[key] || key;

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);

export function LangSelect() {
  const { lang, setLang } = useLang();
  return (
    <select value={lang} onChange={(e) => setLang(e.target.value)}>
      {LANGS.map((l) => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  );
}