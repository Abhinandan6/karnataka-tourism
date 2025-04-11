// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBgqaqcNa33CCbiIcIpwkK-GZf8XXbKe4A",
    authDomain: "dustbin-data-57583.firebaseapp.com",
    projectId: "dustbin-data-57583",
    storageBucket: "dustbin-data-57583.firebasestorage.app",
    messagingSenderId: "257079354722",
    appId: "1:257079354722:web:539d58ddad95de2314b83b",
    measurementId: "G-6F5ZRPY1ST"
  };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db; // ✅ default export // <-- named export, not default
