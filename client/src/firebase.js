import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXOJkPLLn0TUmaWdFRGF6NUkJPiMcpE_M",
  authDomain: "portofolio-13667.firebaseapp.com",
  projectId: "portofolio-13667",
  storageBucket: "portofolio-13667.firebasestorage.app",
  messagingSenderId: "178273556965",
  appId: "1:178273556965:web:6e5cdd3784d5d388fdf70c",
  measurementId: "G-GQ6H6MHFLJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
