"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logEvent } from "firebase/analytics";
import { analytics } from "@/utils/firebase";

export default function FirebaseAnalytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const currentAnalytics = analytics;
        if (!currentAnalytics) return;

        // Delay execution to let Next.js update the document title in the DOM
        const handle = setTimeout(() => {
            try {
                const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
                logEvent(currentAnalytics, "page_view", {
                    page_path: url,
                    page_location: window.location.href,
                    page_title: document.title,
                });
            } catch (error) {
                console.error("Failed to log page_view event to Firebase Analytics:", error);
            }
        }, 100);

        return () => {
            clearTimeout(handle);
        };
    }, [pathname, searchParams]);

    return null;
}
