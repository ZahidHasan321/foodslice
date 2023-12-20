// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth/';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


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

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default app;
