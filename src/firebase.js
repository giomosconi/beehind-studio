// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// ⚠️ SOSTITUISCI QUESTI VALORI CON I TUOI DALLA CONSOLE FIREBASE
// Guarda il passo 4.2 della guida per trovare queste informazioni
const firebaseConfig = {
  apiKey: "AIzaSyC3G38CzLUJerTxIedQz2a8ERWvqwOR82s",
  authDomain: "beehind-studio.firebaseapp.com",
  projectId: "beehind-studio",
  storageBucket: "beehind-studio.firebasestorage.app",
  messagingSenderId: "737320600382",
  appId: "1:737320600382:web:8540d21914f40d6ccfa26f"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Inizializza Firestore Database
const db = getFirestore(app);

// Esporta il database per usarlo nell'app
export { db };
