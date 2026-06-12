import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FB_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID,
};

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;

// Initialize Firebase only on client-side AND when apiKey is present
if (typeof window !== "undefined" && firebaseConfig.apiKey) {
    try {
        app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
        
        // Initialize Analytics if measurementId is valid and not the placeholder
        if (firebaseConfig.measurementId && firebaseConfig.measurementId !== "G-XXXXXXXXXX") {
            analytics = getAnalytics(app);
        }
    } catch (error) {
        console.error("Failed to initialize Firebase:", error);
    }
}

export { app, analytics };
