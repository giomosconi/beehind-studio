// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// ⚠️ SOSTITUISCI QUESTI VALORI CON I TUOI DALLA CONSOLE FIREBASE
// Guarda il passo 4.2 della guida per trovare queste informazioni
const firebaseConfig = {
  apiKey: "LA-TUA-API-KEY-QUI",
  authDomain: "il-tuo-progetto.firebaseapp.com",
  projectId: "il-tuo-project-id",
  storageBucket: "il-tuo-progetto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Inizializza Firestore Database
const db = getFirestore(app);

// Esporta il database per usarlo nell'app
export { db };
