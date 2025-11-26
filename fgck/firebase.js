// ==== IMPORT FIREBASE ==== //
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";


// ==== YOUR FIREBASE CONFIG ==== //
const firebaseConfig = {
  apiKey: "AIzaSyCuHOE9KZ9UfMGAGSDbgYj9WD-fu6NI_fQ",
  authDomain: "full-gospel-nazareth.firebaseapp.com",
  projectId: "full-gospel-nazareth",
  storageBucket: "full-gospel-nazareth.appspot.com",
  messagingSenderId: "431661652513",
  appId: "1:431661652513:web:08008968f38acc329ba160",
  measurementId: "G-FWGDM3VBTT"
};


// ==== INITIALIZE APP ==== //
const app = initializeApp(firebaseConfig);


// ==== FIRESTORE DATABASE ==== //
const db = getFirestore(app);


// ==== AUTHENTICATION ==== //
const auth = getAuth(app);


// ==== STORAGE (IMAGES, FILES) ==== //
const storage = getStorage(app);


// ==== EXPORT ==== //
export { app, db, auth, storage };
