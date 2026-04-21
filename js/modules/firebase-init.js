/**
 * ============================================================================
 * ABD LUXURY SYSTEM | FIREBASE ARCHITECTURE
 * ============================================================================
 * WORLD-CLASS REAL-TIME SYNC ENGINE (ACTIVATED)
 * ============================================================================
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// FIREBASE CONFIGURATION (SECURELY APPLIED)
const firebaseConfig = {
  apiKey: "AIzaSyAWNxa6xLMSjrn9u6TZzNEkJee0AQQ-U1A",
  authDomain: "abd-grande.firebaseapp.com",
  projectId: "abd-grande",
  storageBucket: "abd-grande.firebasestorage.app",
  messagingSenderId: "791525023775",
  appId: "1:791525023775:web:b6acd66a04148cf050b52a",
  measurementId: "G-NQ3ZYQ531F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

console.log("ABD Firebase Engine: Fully Activated & Connected");
