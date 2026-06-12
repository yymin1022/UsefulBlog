import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FB_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics (client-side only and if measurementId is provided and not the default placeholder)
let analytics: Analytics | null = null;
if (typeof window !== "undefined" && firebaseConfig.measurementId && firebaseConfig.measurementId !== "G-XXXXXXXXXX") {
    analytics = getAnalytics(app);
}

export { app, analytics };
