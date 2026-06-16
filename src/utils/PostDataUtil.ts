import path from "path";
import { cache } from "react";

export interface PostData {
    postDate: string;
    postID: string;
    postIsPinned: boolean;
    postTag: string[];
    postTitle: string;
    postURL: string;
}

function isSafeInput(input: string | null): boolean {
    if (!input) return false;
    if (input.includes("/") || input.includes("\\") || input.includes("..")) {
        return false;
    }
    return true;
}

function stripFrontMatter(content: string): string {
    if (content.startsWith("---")) {
        const nextSeparatorIdx = content.indexOf("---", 3);
        if (nextSeparatorIdx !== -1) {
            return content.slice(nextSeparatorIdx + 3).trimStart();
        }
    }
    return content;
}

export const CDN_BASE_URL = "https://cdn.jsdelivr.net/gh/yymin1022/Blog_LR_Data@master";
export const SITE_URL = process.env.URL_PUB || "http://localhost:3000";

const getBaseUrl = () => {
    if (typeof window !== "undefined") return ""; // client-side 상대 경로 사용
    return SITE_URL; // server-side 절대 경로 사용
};

export async function fetchWithTimeout(resource: string, options: RequestInit & { timeout?: number } = {}) {
    const { timeout = 8000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

export const getPostList = cache(async (postType: string) => {
    const resultData = {
        RESULT_CODE: 0,
        RESULT_MSG: "",
        RESULT_DATA: {
            PostCount: 0,
            PostList: [] as PostData[]
        }
    };

    if (!isSafeInput(postType)) {
        resultData.RESULT_CODE = 100;
        resultData.RESULT_MSG = "Invalid post type";
        return resultData;
    }

    try {
        const url = `${getBaseUrl()}/getPostList`;
        const response = await fetchWithTimeout(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ postType }),
            next: { revalidate: 60 }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch post list (HTTP ${response.status})`);
        }

        return await response.json();
    } catch (error: any) {
        resultData.RESULT_CODE = 100;
        resultData.RESULT_MSG = error.message || String(error);
        return resultData;
    }
});

export const getPostData = cache(async (postType: string, postID: string) => {
    const resultData = {
        RESULT_CODE: 0,
        RESULT_MSG: "",
        RESULT_DATA: {
            PostContent: "",
            PostDate: "",
            PostIsPinned: false,
            PostTag: [] as string[],
            PostTitle: "",
            PostURL: ""
        }
    };

    if (!isSafeInput(postType) || !isSafeInput(postID)) {
        resultData.RESULT_CODE = 100;
        resultData.RESULT_MSG = "Invalid parameters";
        return resultData;
    }

    try {
        const url = `${getBaseUrl()}/getPostData`;
        const response = await fetchWithTimeout(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ postType, postID }),
            next: { revalidate: 60 }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch post data (HTTP ${response.status})`);
        }

        const result = await response.json();
        if (result.RESULT_CODE === 200 && result.RESULT_DATA) {
            if (result.RESULT_DATA.PostContent) {
                result.RESULT_DATA.PostContent = stripFrontMatter(result.RESULT_DATA.PostContent);
            }
            // Ensure types match what frontend expects
            result.RESULT_DATA.PostIsPinned = !!result.RESULT_DATA.PostIsPinned;
            if (typeof result.RESULT_DATA.PostTag === "string") {
                result.RESULT_DATA.PostTag = result.RESULT_DATA.PostTag ? result.RESULT_DATA.PostTag.split(",").map((t: string) => t.trim()) : [];
            }
        }
        return result;
    } catch (error: any) {
        resultData.RESULT_CODE = 100;
        resultData.RESULT_MSG = error.message || String(error);
        return resultData;
    }
});

export const getPostImage = async (postType: string, postID: string, srcID: string) => {
    const resultData = {
        RESULT_CODE: 0,
        RESULT_MSG: "",
        RESULT_DATA: {
            ImageData: ""
        }
    };

    if (!isSafeInput(postType) || !isSafeInput(postID) || !isSafeInput(srcID)) {
        resultData.RESULT_CODE = 100;
        resultData.RESULT_MSG = "Invalid parameters";
        return resultData;
    }

    try {
        const url = `${getBaseUrl()}/getPostImage`;
        const response = await fetchWithTimeout(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ postType, postID, srcID })
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch image (HTTP ${response.status})`);
        }

        return await response.json();
    } catch (error: any) {
        resultData.RESULT_CODE = 100;
        resultData.RESULT_MSG = error.message || String(error);
        return resultData;
    }
};

