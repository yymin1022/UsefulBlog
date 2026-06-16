import { NextRequest, NextResponse } from "next/server";
import { fetchWithTimeout, API_URL } from "@/utils/PostDataUtil";
import path from "path";

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
        const { postID, postType, srcID } = body;

        if (typeof postID !== "string" || typeof postType !== "string" || typeof srcID !== "string") {
            return NextResponse.json({
                RESULT_CODE: 100,
                RESULT_MSG: "Invalid parameters"
            });
        }

        if (!isSafeInput(postID) || !isSafeInput(postType) || !isSafeInput(srcID)) {
            return NextResponse.json({
                RESULT_CODE: 100,
                RESULT_MSG: "Invalid parameters"
            });
        }

        const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];
        const ext = path.extname(srcID).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            return NextResponse.json({
                RESULT_CODE: 100,
                RESULT_MSG: "Invalid file extension"
            });
        }

        const response = await fetchWithTimeout(`${API_URL}/getPostImage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ postType, postID, srcID })
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

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const postID = searchParams.get("postID");
        const postType = searchParams.get("postType");
        const srcID = searchParams.get("srcID");

        if (!postID || !postType || !srcID) {
            return new Response("Missing parameters", { status: 400 });
        }

        if (!isSafeInput(postID) || !isSafeInput(postType) || !isSafeInput(srcID)) {
            return new Response("Invalid parameters", { status: 400 });
        }

        const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];
        const ext = path.extname(srcID).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            return new Response("Invalid file extension", { status: 400 });
        }

        const response = await fetchWithTimeout(`${API_URL}/getPostImage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ postType, postID, srcID })
        });

        if (!response.ok) {
            const { origin } = new URL(req.url);
            return NextResponse.redirect(`${origin}/logo.png`, 307);
        }

        const result = await response.json();
        if (result.RESULT_CODE !== 200 || !result.RESULT_DATA?.ImageData) {
            const { origin } = new URL(req.url);
            return NextResponse.redirect(`${origin}/logo.png`, 307);
        }

        const base64Data = result.RESULT_DATA.ImageData;
        const fileBuffer = Buffer.from(base64Data, "base64");

        let contentType = "image/png";
        if (ext === ".jpg" || ext === ".jpeg") {
            contentType = "image/jpeg";
        } else if (ext === ".gif") {
            contentType = "image/gif";
        } else if (ext === ".svg") {
            contentType = "image/svg+xml";
        } else if (ext === ".webp") {
            contentType = "image/webp";
        }

        return new Response(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable"
            }
        });
    } catch (error: any) {
        return new Response(error.message || "Internal server error", { status: 500 });
    }
}
