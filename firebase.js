// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKiSChhxTJiPMknVrvPw5k8ErRO3bU1DY",
  authDomain: "inventory-management-78d58.firebaseapp.com",
  projectId: "inventory-management-78d58",
  storageBucket: "inventory-management-78d58.appspot.com",
  messagingSenderId: "160607626503",
  appId: "1:160607626503:web:e1ece4d84c258eabfe11a2",
  measurementId: "G-BE9X4H93LV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore=getFirestore(app);

export {firestore};