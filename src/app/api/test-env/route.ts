import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        has_NEXT_PUBLIC_FB_API_KEY: !!process.env.NEXT_PUBLIC_FB_API_KEY,
        has_NEXT_PUBLIC_FB_MEASUREMENT_ID: !!process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID,
        has_legacy_FB_API_KEY: !!process.env.FB_API_KEY,
        has_legacy_FB_MEASUREMENT_ID: !!process.env.FB_MEASUREMENT_ID,
        // Safe check for the values (obfuscated for security)
        measurementId_prefix: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID 
            ? process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID.substring(0, 4) + "..."
            : "not_found",
    });
}
