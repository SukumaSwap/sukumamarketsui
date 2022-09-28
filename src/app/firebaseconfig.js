
import { initializeApp } from 'firebase/app';

import { getStorage } from 'firebase/storage'
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection, where, doc, getDocs, QuerySnapshot, query, getDoc, addDoc, setDoc, updateDoc, serverTimestamp, arrayUnion, onSnapshot, DocumentSnapshot } from 'firebase/firestore'
  
const firebaseConfig = {
  apiKey: "AIzaSyB_89JJQSLKENAoFeuXEC_cSnhz56zjAik",
  authDomain: "sukuma-swap-chat.firebaseapp.com",
  projectId: "sukuma-swap-chat",
  storageBucket: "sukuma-swap-chat.appspot.com",
  messagingSenderId: "124048828871",
  appId: "1:124048828871:web:d2f23446bc7867b316d1e2",
  measurementId: "G-55JH180DHQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Analytics
export { analytics }

// Firestore database
export { db, collection, where, query, QuerySnapshot, doc, getDoc, getDocs, addDoc, setDoc, updateDoc, serverTimestamp, arrayUnion, onSnapshot, DocumentSnapshot }

// Storage
export { storage }

// Authentication
export { auth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword, }