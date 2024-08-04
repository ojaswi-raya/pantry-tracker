// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQABSMEkiYmcNzWO1ZA7LO6G92aCW4ni4",
  authDomain: "pantry-tracker-f0cf4.firebaseapp.com",
  projectId: "pantry-tracker-f0cf4",
  storageBucket: "pantry-tracker-f0cf4.appspot.com",
  messagingSenderId: "810261258471",
  appId: "1:810261258471:web:a2daf2442721faada60242",
  measurementId: "G-57JZQ2RHJN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);