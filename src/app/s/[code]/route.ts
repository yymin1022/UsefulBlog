import { getRedirectTarget } from "@/utils/ShortUrlUtil";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    const { code } = await params;
    const targetUrl = await getRedirectTarget(code);

    if (!targetUrl) {
        notFound();
    }

    return NextResponse.redirect(targetUrl, 307);
}
