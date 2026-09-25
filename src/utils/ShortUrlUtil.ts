import { CDN_BASE_URL, fetchWithTimeout } from "@/utils/PostDataUtil";
import { cache } from "react";

function isSafeCode(code: string | null): boolean {
    if (!code) return false;
    return /^[a-zA-Z0-9_-]+$/.test(code);
}

function isValidRedirectUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}

const fetchShortUrlsIndex = cache(async (): Promise<Record<string, string>> => {
    const url = `${CDN_BASE_URL}/short_url.json`;
    const response = await fetchWithTimeout(url, {
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch short URLs index (HTTP ${response.status})`);
    }

    const data = await response.json();
    if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new Error("Invalid short URLs index structure: expected a JSON object");
    }

    return data as Record<string, string>;
});

export async function getRedirectTarget(code: string): Promise<string | null> {
    if (!isSafeCode(code)) {
        return null;
    }

    try {
        const urlsIndex = await fetchShortUrlsIndex();
        if (!urlsIndex) {
            return null;
        }

        const directMatch = urlsIndex[code];
        if (directMatch && isValidRedirectUrl(directMatch)) {
            return directMatch;
        }

        const normalizedCode = code.toLowerCase();
        for (const [key, value] of Object.entries(urlsIndex)) {
            if (key.toLowerCase() === normalizedCode && isValidRedirectUrl(value)) {
                return value;
            }
        }

        return null;
    } catch (error) {
        console.error("Failed to resolve redirect target:", error);
        return null;
    }
}
