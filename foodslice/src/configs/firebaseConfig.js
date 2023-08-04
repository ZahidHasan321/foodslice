// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmuvZyZi4EuYBr5yPJllueIUBc2A_8weU",
  authDomain: "food-slice-5df2a.firebaseapp.com",
  projectId: "food-slice-5df2a",
  storageBucket: "food-slice-5df2a.appspot.com",
  messagingSenderId: "1009435875035",
  appId: "1:1009435875035:web:0c5a1b780590ea540d9efe",
  measurementId: "G-11N651YBNR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);