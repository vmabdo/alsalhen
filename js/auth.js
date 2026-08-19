// ===================================
// الصالحين - منطق المصادقة
// ===================================
import { auth, db } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { showToast, showLoading, hideLoading } from './utils.js';

// ===== تسجيل الدخول =====
export async function loginUser(email, password) {
  showLoading('جارٍ تسجيل الدخول...');
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
    hideLoading();
    if (!userDoc.exists()) throw new Error('لم يتم العثور على بيانات المستخدم.');
    const userData = userDoc.data();
    return { uid: cred.user.uid, ...userData };
  } catch (err) {
    hideLoading();
    throw err;
  }
}

// ===== تسجيل الخروج =====
export async function logoutUser() {
  try {
    await signOut(auth);
    window.location.href = '/index.html';
  } catch (err) {
    showToast('حدث خطأ أثناء تسجيل الخروج', 'error');
  }
}

// ===== مراقبة حالة الدخول (Guard) =====
export function requireAuth(allowedRole, redirectPath = '/index.html') {
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      unsub();
      if (!user) { window.location.href = redirectPath; return reject('not-authenticated'); }
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) { await signOut(auth); window.location.href = redirectPath; return reject('no-user-doc'); }
        const data = userDoc.data();
        if (allowedRole && data.role !== allowedRole) {
          const redirect = data.role === 'admin' ? '/admin/dashboard.html' : '/customer/dashboard.html';
          window.location.href = redirect;
          return reject('wrong-role');
        }
        resolve({ uid: user.uid, email: user.email, ...data });
      } catch (e) {
        window.location.href = redirectPath;
        reject(e);
      }
    });
  });
}

// ===== رسائل خطأ Firebase =====
export function getAuthErrorMessage(code) {
  const messages = {
    'auth/invalid-credential': 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    'auth/user-not-found': 'لا يوجد حساب بهذا البريد الإلكتروني.',
    'auth/wrong-password': 'كلمة المرور غير صحيحة.',
    'auth/too-many-requests': 'تم تجاوز عدد المحاولات. يرجى المحاولة لاحقاً.',
    'auth/network-request-failed': 'خطأ في الاتصال بالإنترنت.',
    'auth/email-already-in-use': 'هذا البريد الإلكتروني مستخدم بالفعل.',
    'auth/weak-password': 'كلمة المرور ضعيفة. يجب أن تكون 6 أحرف على الأقل.',
    'auth/invalid-email': 'صيغة البريد الإلكتروني غير صحيحة.',
  };
  return messages[code] || 'حدث خطأ غير متوقع. يرجى المحاولة مجدداً.';
}
