import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Log config for debugging
console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? '[HIDDEN]' : 'MISSING',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  appId: firebaseConfig.appId ? '[HIDDEN]' : 'MISSING'
});

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = async () => {
  try {
    console.log('Attempting Google sign in...');
    const result = await signInWithPopup(auth, provider);
    console.log('Google sign in successful');
    return result;
  } catch (error: any) {
    console.error('Google sign in failed:', error);
    
    // More detailed error handling
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Popup đã bị đóng. Vui lòng thử lại.');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Yêu cầu đăng nhập đã bị hủy. Vui lòng thử lại.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup bị chặn. Vui lòng cho phép popup và thử lại.');
    }
    
    throw error;
  }
};
export const logout = () => signOut(auth);

export default app;