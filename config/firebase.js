// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth} from 'firebase/auth'
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8wXjJ9lB6xhNymym9cq2nCo7z9EffS6w",
  authDomain: "tarik-app-6adbc.firebaseapp.com",
  projectId: "tarik-app-6adbc",
  storageBucket: "tarik-app-6adbc.appspot.com",
  messagingSenderId: "517566189322",
  appId: "1:517566189322:web:759a2a3bc318c5a03634f3"
};


// these keys won't work because i've removed the app from firebase
// add your app on firebase, copy firebaseConfig here, enable email/password auth
// and test the app ;)

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialiser Firestore
export const db = getFirestore(app);

export const auth = getAuth(app);

export const storage = getStorage(app);
