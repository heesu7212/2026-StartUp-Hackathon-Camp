import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth'; // 🔥 이 줄 추가!

const firebaseConfig = {
  apiKey: "AIzaSyB6LtWDSk5s-qgGXiMpi3FRVPvrd4SjV9o",
  authDomain: "sicknseek.firebaseapp.com",
  projectId: "sicknseek",
  storageBucket: "sicknseek.firebasestorage.app",
  messagingSenderId: "16605190526",
  appId: "1:16605190526:web:23113297b1fa7fe343b2f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // 🔥 이 줄 추가!
export const googleProvider = new GoogleAuthProvider(); // 🔥 이 줄 추가!