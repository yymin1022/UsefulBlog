import { NextRequest, NextResponse } from "next/server";
import { fetchWithTimeout, API_URL } from "@/utils/PostDataUtil";

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

        const response = await fetchWithTimeout(`${API_URL}/getPostData`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ postType, postID })
        });

        if (!response.ok) {
            return NextResponse.json({
                RESULT_CODE: 100,
                RESULT_MSG: `Backend error (HTTP ${response.status})`
            });
        }

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({
            RESULT_CODE: 100,
            RESULT_MSG: error.message || String(error)
        });
    }
}
