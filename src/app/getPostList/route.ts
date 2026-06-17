import { NextRequest, NextResponse } from "next/server";
import { getPostList } from "@/utils/PostDataUtil";

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

        const result = await getPostList(postType);
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({
            RESULT_CODE: 100,
            RESULT_MSG: error.message || String(error)
        });
    }
}
