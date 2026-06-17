import { NextRequest, NextResponse } from "next/server";
import { getPostImage } from "@/utils/PostDataUtil";
import path from "path";

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

        const result = await getPostImage(postType, postID, srcID);
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

        const result = await getPostImage(postType, postID, srcID);
        if (result.RESULT_CODE !== 200) {
            const { origin } = new URL(req.url);
            return NextResponse.redirect(`${origin}/logo.png`, 307);
        }

        const ext = path.extname(srcID).toLowerCase();
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

        const fileBuffer = Buffer.from(result.RESULT_DATA.ImageData, "base64");

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
