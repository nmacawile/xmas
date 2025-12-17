import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebaseConfig";
import { getFirestore } from "firebase/firestore/lite";

const firebaseApp = initializeApp(firebaseConfig);
export const firestoreDB = getFirestore(firebaseApp, "christmas2025");
export default firestoreDB;