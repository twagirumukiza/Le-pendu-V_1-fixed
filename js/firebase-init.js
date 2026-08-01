// ============================================================
// LE PENDU — Initialisation Firebase
// Config du projet "le-pendu-740f0" (déjà renseignée ci-dessous).
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyC9nC4wrFJm_Kxp2rYPB-_iviXeXTPlel4",
  authDomain: "le-pendu-740f0.firebaseapp.com",
  databaseURL: "https://le-pendu-740f0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "le-pendu-740f0",
  storageBucket: "le-pendu-740f0.firebasestorage.app",
  messagingSenderId: "962043042307",
  appId: "1:962043042307:web:e5ea65f38c053d653f4c36"
};

const FIREBASE_CONFIGURED = firebaseConfig.apiKey !== "REMPLACE_MOI";

let penduAuth = null;
let penduDb = null;
let penduInitError = null;

try {
  if (FIREBASE_CONFIGURED && typeof firebase !== "undefined") {
    // évite "Firebase App named '[DEFAULT]' already exists" si le script tourne 2x
    const app = firebase.apps.length ? firebase.apps[0] : firebase.initializeApp(firebaseConfig);
    penduAuth = firebase.auth(app);
    penduDb = firebase.database(app);
  } else if (FIREBASE_CONFIGURED && typeof firebase === "undefined") {
    penduInitError = "Le SDK Firebase ne s'est pas chargé (vérifie ta connexion ou un bloqueur de pub).";
  }
} catch (err) {
  penduInitError = err.message;
  console.error("Erreur d'initialisation Firebase :", err);
}

// IMPORTANT : cet objet doit TOUJOURS être créé, même en cas d'échec ci-dessus,
// sinon tout le reste de main.js (qui en dépend) casse silencieusement.
window.PenduFirebase = {
  configured: FIREBASE_CONFIGURED && !penduInitError,
  error: penduInitError,
  auth: () => penduAuth,
  db: () => penduDb
};
