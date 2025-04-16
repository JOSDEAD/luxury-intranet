// src/config/firebase.js
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// 🔐 Importar config de archivo JSON
import firebaseConfig from './firebase.json'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }