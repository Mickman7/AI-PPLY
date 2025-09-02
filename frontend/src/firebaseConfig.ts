// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDYOIdopfs2LGiSlBYnt12PCoT-ZAfhC1w",
    authDomain: "ai-pply.firebaseapp.com",
    projectId: "ai-pply",
    storageBucket: "ai-pply.firebasestorage.app",
    messagingSenderId: "589056397730",
    appId: "1:589056397730:web:5a1f64c22bd3e96189a2fb"
};

// Init Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
