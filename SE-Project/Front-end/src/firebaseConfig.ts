// filepath: c:\Users\Lenovo\Downloads\thesis-trek-main\doctoral_student_portal\src\firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDmS6m3QrTF0cqekt3uLb14SKxsAUsp1Qw",
  authDomain: "doctoral-research-portal.firebaseapp.com",
  projectId: "doctoral-research-portal",
  storageBucket: "doctoral-research-portal.firebasestorage.app",
  messagingSenderId: "431921107060",
  appId: "1:431921107060:web:7dea16a48cb495ff2bc121",
  measurementId: "G-HSNL09GE0X"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };