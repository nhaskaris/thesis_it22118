import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY || process.env.API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN || process.env.AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID || process.env.PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET || process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID || process.env.MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID || process.env.APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID || process.env.MEASUREMENT_ID
};

// 1. Check if we have a valid config and if we are in a browser/server environment
const app = !getApps().length && firebaseConfig.apiKey 
    ? initializeApp(firebaseConfig) 
    : getApps().length > 0 
        ? getApp() 
        : null;

export const auth = app ? getAuth(app) : null;