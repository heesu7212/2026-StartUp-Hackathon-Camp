// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// 1. 로그인 기능(Auth)을 가져옵니다.
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; 

// Your web app's Firebase configuration
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

// 2. 로그인 기능을 초기화하고 내보냅니다.
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// 3. 구글 로그인 함수 (다른 파일에서 가져다 쓸 수 있게 만듦)
export const signInGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // 로그인 성공 시 실행될 코드
      const user = result.user;
      console.log("로그인 성공!", user);
      alert("환영합니다! " + user.displayName + "님");
    })
    .catch((error) => {
      // 로그인 실패 시 실행될 코드
      console.error("로그인 에러:", error);
      alert("로그인에 실패했습니다.");
    });
};