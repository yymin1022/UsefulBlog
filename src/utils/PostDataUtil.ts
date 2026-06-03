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
export const SITE_URL = process.env.URL_PUB || "https://dev-lr.com";

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

// Fetch posts index mapping category slugs to PostData array
const fetchPostsIndex = cache(async () => {
    const url = `${CDN_BASE_URL}/posts.json`;
    const response = await fetchWithTimeout(url, {
        next: { revalidate: 60 } // Cache index for 60 seconds
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch posts index (HTTP ${response.status})`);
    }
    return await response.json() as Record<string, PostData[]>;
});

export const getPostList = cache(async (postType: string) => {
    const postList: PostData[] = [];
    const resultData = {
        RESULT_CODE: 0,
        RESULT_MSG: "",
        RESULT_DATA: {
            PostCount: 0,
            PostList: postList
        }
    };

    if (!isSafeInput(postType)) {
        resultData.RESULT_CODE = 100;
        resultData.RESULT_MSG = "Invalid post type";
        return resultData;
    }

    try {
        const postsIndex = await fetchPostsIndex();
        const categoryPosts = postsIndex[postType] || [];
        
        resultData.RESULT_DATA.PostList = categoryPosts;
        resultData.RESULT_DATA.PostCount = categoryPosts.length;
        resultData.RESULT_CODE = 200;
        resultData.RESULT_MSG = "Success";
    } catch (error: any) {
        resultData.RESULT_CODE = 100;
        resultData.RESULT_MSG = error.message || String(error);
    }

    return resultData;
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
        const postsIndex = await fetchPostsIndex();
        const categoryPosts = postsIndex[postType] || [];
        const post = categoryPosts.find((p) => p.postID === postID);

        if (!post) {
            resultData.RESULT_CODE = 100;
            resultData.RESULT_MSG = "Post not found";
            return resultData;
        }

        resultData.RESULT_DATA.PostDate = post.postDate || "";
        resultData.RESULT_DATA.PostIsPinned = post.postIsPinned || false;
        resultData.RESULT_DATA.PostTag = post.postTag || [];
        resultData.RESULT_DATA.PostTitle = post.postTitle || "";
        
        const postURL = post.postURL || "";
        resultData.RESULT_DATA.PostURL = postURL;

        if (!isSafeInput(postURL)) {
            resultData.RESULT_CODE = 100;
            resultData.RESULT_MSG = "Invalid post URL";
            return resultData;
        }

        // For 'about' posts, the folder name matches the postID
        const folderName = postType === "about" ? postID : postURL;
        const url = `${CDN_BASE_URL}/${postType}/${folderName}/post.md`;
        const response = await fetchWithTimeout(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch post content (HTTP ${response.status})`);
        }

        const rawContent = await response.text();
        resultData.RESULT_DATA.PostContent = stripFrontMatter(rawContent);
        resultData.RESULT_CODE = 200;
        resultData.RESULT_MSG = "Success";
    } catch (error: any) {
        resultData.RESULT_CODE = 100;
        resultData.RESULT_MSG = error.message || String(error);
    }

    return resultData;
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

    const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];
    const ext = path.extname(srcID).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        resultData.RESULT_CODE = 100;
        resultData.RESULT_MSG = "Invalid file extension";
        return resultData;
    }

    try {
        const baseUrl = CDN_BASE_URL;
        const url = postType === "solving"
            ? `${baseUrl}/${postType}/${srcID}`
            : `${baseUrl}/${postType}/${postID}/${srcID}`;

        const response = await fetchWithTimeout(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch image (HTTP ${response.status})`);
        }

        const arrayBuffer = await response.arrayBuffer();
        resultData.RESULT_DATA.ImageData = Buffer.from(arrayBuffer).toString("base64");

        resultData.RESULT_CODE = 200;
        resultData.RESULT_MSG = "Success";
    } catch (error: any) {
        resultData.RESULT_CODE = 100;
        resultData.RESULT_MSG = error.message || String(error);
    }

    return resultData;
};
