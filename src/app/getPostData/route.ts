import { NextRequest, NextResponse } from "next/server";
import { fetchWithTimeout, CDN_BASE_URL, PostData } from "@/utils/PostDataUtil";

function isSafeInput(input: string | null): boolean {
    if (!input) return false;
    if (input.includes("/") || input.includes("\\") || input.includes("..")) {
        return false;
    }
    return true;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { postID, postType } = body;

        if (typeof postID !== "string" || typeof postType !== "string") {
            return NextResponse.json({
                RESULT_CODE: 100,
                RESULT_MSG: "Invalid parameters"
            });
        }

        if (!isSafeInput(postID) || !isSafeInput(postType)) {
            return NextResponse.json({
                RESULT_CODE: 100,
                RESULT_MSG: "Invalid parameters"
            });
        }

        // Fetch posts index from CDN
        const indexUrl = `${CDN_BASE_URL}/posts.json`;
        const indexResponse = await fetchWithTimeout(indexUrl, { next: { revalidate: 60 } });
        if (!indexResponse.ok) {
            throw new Error(`Failed to fetch posts index (HTTP ${indexResponse.status})`);
        }
        const postsIndex = await indexResponse.json() as Record<string, PostData[]>;
        const categoryPosts = postsIndex && Array.isArray(postsIndex[postType]) ? postsIndex[postType] : [];
        const post = categoryPosts.find((p) => p.postID === postID);

        if (!post) {
            return NextResponse.json({
                RESULT_CODE: 100,
                RESULT_MSG: "Post not found"
            });
        }

        const postURL = post.postURL || "";
        if (!isSafeInput(postURL)) {
            return NextResponse.json({
                RESULT_CODE: 100,
                RESULT_MSG: "Invalid post URL"
            });
        }

        // Fetch original markdown content from CDN (with Front Matter intact)
        const folderName = postType === "about" ? postID : postURL;
        const postUrl = `${CDN_BASE_URL}/${postType}/${folderName}/post.md`;
        const postResponse = await fetchWithTimeout(postUrl);
        if (!postResponse.ok) {
            throw new Error(`Failed to fetch post content (HTTP ${postResponse.status})`);
        }

        const rawContent = await postResponse.text();

        return NextResponse.json({
            RESULT_CODE: 200,
            RESULT_MSG: "Success",
            RESULT_DATA: {
                PostContent: rawContent,
                PostDate: post.postDate || "",
                PostIsPinned: post.postIsPinned || false,
                PostTag: post.postTag || [],
                PostTitle: post.postTitle || "",
                PostURL: postURL
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            RESULT_CODE: 100,
            RESULT_MSG: error.message || String(error)
        });
    }
}
