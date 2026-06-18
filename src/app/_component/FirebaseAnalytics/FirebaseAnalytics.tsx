"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAnalytics, logEvent, Analytics } from "firebase/analytics";

interface FirebaseConfig {
    apiKey?: string;
    authDomain?: string;
    projectId?: string;
    appId?: string;
    measurementId?: string;
}

export default function FirebaseAnalytics({ config }: { config: FirebaseConfig }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const analyticsRef = useRef<Analytics | null>(null);

    useEffect(() => {
        if (typeof window === "undefined" || !config.apiKey) return;

        let app: FirebaseApp;
        try {
            app = getApps().length === 0 ? initializeApp(config) : getApp();
            
            if (config.measurementId && config.measurementId !== "G-XXXXXXXXXX" && !analyticsRef.current) {
                analyticsRef.current = getAnalytics(app);
            }
        } catch (error) {
            console.error("Failed to initialize Firebase in client:", error);
            return;
        }

        const analyticsInstance = analyticsRef.current;
        if (!analyticsInstance) return;

        // Delay execution to let Next.js update the document title in the DOM
        const handle = setTimeout(() => {
            try {
                const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
                logEvent(analyticsInstance, "page_view", {
                    page_path: url,
                    page_location: window.location.href,
                    page_title: document.title,
                    source: "web",
                });
            } catch (error) {
                console.error("Failed to log page_view event to Firebase Analytics:", error);
            }
        }, 100);

        return () => {
            clearTimeout(handle);
        };
    }, [pathname, searchParams, config]);

    return null;
}
