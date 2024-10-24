// app/firebase.ts
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  sendPasswordResetEmail, // Import sendPasswordResetEmail
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD93LL68PIk2675GEvkvu7U5iqh4jtqmvs",
  authDomain: "ai-seo-tool-14a70.firebaseapp.com",
  projectId: "ai-seo-tool-14a70",
  storageBucket: "ai-seo-tool-14a70.appspot.com",
  messagingSenderId: "7401357775",
  appId: "1:7401357775:web:ba6d6d4d856bcb2fa6d2ba",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

// Function to handle Google sign-in
const signInWithGoogle = async (id_token: string) => {
  try {
    const credential = GoogleAuthProvider.credential(id_token);
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;
    return { success: true, user };
  } catch (error) {
    alert(JSON.stringify(error))
    console.error('Error during Google sign-in:', error);
    console.log(".....",error)
    return { success: false, message: error.message };
  }
};

// Function to handle user sign-up
const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send email verification
    await sendEmailVerification(user);
    return { success: true, message: 'Verification email sent.' };
  } catch (error) {
    console.error('Error signing up:', error);
    return { success: false, message: error.message };
  }
};

// Function to handle password reset
 const resetPassword = async (email) => {
  const auth = getAuth();
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "Password reset email sent!" };
  } catch (error) {
    console.error("Error in resetPassword:", error); // Log the error for debugging
    return { success: false, message: error.message };
  }
};
const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return { success: true, message: 'Login successful.', user };
  } catch (error) {
    console.error('Error signing in:', error);
    return { success: false, message: error.message };
  }
};

// Export Firebase services and functions
export { auth, firestore, storage, signUp, provider, signInWithGoogle, resetPassword ,signIn}; // Export the new resetPassword function
