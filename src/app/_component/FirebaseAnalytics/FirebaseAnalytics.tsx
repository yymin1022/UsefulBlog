"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logEvent } from "firebase/analytics";
import { analytics } from "@/utils/firebase";

export default function FirebaseAnalytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!analytics) return;

        try {
            const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
            logEvent(analytics, "page_view", {
                page_path: url,
                page_location: window.location.href,
                page_title: document.title,
            });
        } catch (error) {
            console.error("Failed to log page_view event to Firebase Analytics:", error);
        }
    }, [pathname, searchParams]);

    return null;
}
