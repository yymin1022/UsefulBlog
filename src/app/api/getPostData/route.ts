import { NextRequest, NextResponse } from "next/server";
import { getPostData } from "@/utils/PostDataUtil";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { postID, postType } = body;

        if (!postID || !postType) {
            return NextResponse.json({
                RESULT_CODE: 100,
                RESULT_MSG: "Missing parameters"
            });
        }

        const result = await getPostData(postType, postID);
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({
            RESULT_CODE: 100,
            RESULT_MSG: error.message || String(error)
        });
    }
}
