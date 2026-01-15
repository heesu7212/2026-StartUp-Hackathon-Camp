// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6LtWDSk5s-qgGXiMpi3FRVPvrd4SjV9o",
  authDomain: "sicknseek.firebaseapp.com",
  projectId: "sicknseek",
  storageBucket: "sicknseek.firebasestorage.app",
  messagingSenderId: "16605190526",
  appId: "1:16605190526:web:231132976b1fa7fe343b2f",
  measurementId: "G-JBH2FD5Z7R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);