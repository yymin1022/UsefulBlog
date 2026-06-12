/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_FB_API_KEY: process.env.FB_API_KEY || process.env.NEXT_PUBLIC_FB_API_KEY,
        NEXT_PUBLIC_FB_AUTH_DOMAIN: process.env.FB_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
        NEXT_PUBLIC_FB_PROJECT_ID: process.env.FB_PROJECT_ID || process.env.NEXT_PUBLIC_FB_PROJECT_ID,
        NEXT_PUBLIC_FB_APP_ID: process.env.FB_APP_ID || process.env.NEXT_PUBLIC_FB_APP_ID,
        NEXT_PUBLIC_FB_MEASUREMENT_ID: process.env.FB_MEASUREMENT_ID || process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID,
    }
};

export default nextConfig;
