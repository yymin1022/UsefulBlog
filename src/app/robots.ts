import type { MetadataRoute } from "next";
import { SITE_URL } from "@/utils/PostDataUtil";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/getPostData", "/getPostImage", "/getPostList", "/s/"],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
