import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4lZ0-EhhtpfDlfSPXyVwyWQbCf00zNQQ",
  authDomain: "mysnap-d6e1e.firebaseapp.com",
  projectId: "mysnap-d6e1e",
  storageBucket: "mysnap-d6e1e.appspot.com",
  messagingSenderId: "870182532110",
  appId: "1:870182532110:web:e80247f5b3cb2faf7c785f",
  measurementId: "G-9H6BNSY835",
};

// Initialize Firebase
// let app;
// if (firebase.apps.length === 0) {
const app = initializeApp(firebaseConfig);
// } else {
// app = app();
// }

const storage = getStorage(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

export { auth, storage, db };
