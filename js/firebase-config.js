// ===================================
// الصالحين - إعداد Firebase
// ===================================
// ⚠️ استبدل هذه القيم بإعدادات مشروع Firebase الخاص بك
// من: Firebase Console → Project Settings → Your Apps → SDK setup

const firebaseConfig = {
  apiKey: "AIzaSyD8RFKHbsH7IFnwMLP90VLpkIA0HJcPPwo",
  authDomain: "alsalhen-store.firebaseapp.com",
  projectId: "alsalhen-store",
  storageBucket: "alsalhen-store.firebasestorage.app",
  messagingSenderId: "94824142452",
  appId: "1:94824142452:web:a303905cf5b989b9dfe321",
  measurementId: "G-LSDRXPN1BD"
};

// ===================================
// تهيئة Firebase الرئيسي (للمدير والعملاء)
// ===================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ===================================
// تهيئة Firebase الثانوي (لإنشاء حسابات العملاء دون تسجيل خروج المدير)
// ===================================
const secondaryApp = initializeApp(firebaseConfig, "secondary");
const secondaryAuth = getAuth(secondaryApp);

export { app, auth, db, secondaryAuth };
