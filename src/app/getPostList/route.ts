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
        const { postType } = body;

        if (typeof postType !== "string") {
            return NextResponse.json({
                RESULT_CODE: 100,
                RESULT_MSG: "Invalid parameters"
            });
        }

        if (!isSafeInput(postType)) {
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

        return NextResponse.json({
            RESULT_CODE: 200,
            RESULT_MSG: "Success",
            RESULT_DATA: {
                PostCount: categoryPosts.length,
                PostList: categoryPosts
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            RESULT_CODE: 100,
            RESULT_MSG: error.message || String(error)
        });
    }
}
