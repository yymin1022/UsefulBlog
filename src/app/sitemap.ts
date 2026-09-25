import type { MetadataRoute } from "next";
import { CDN_BASE_URL, SITE_URL } from "@/utils/PostDataUtil";

export const revalidate = 86400; // 24시간마다 백그라운드 갱신 (ISR)

interface PostIndexItem {
    postID: string;
    postDate?: string;
}

function parsePostDate(dateStr?: string): Date | undefined {
    if (!dateStr) return undefined;

    // solving 카테고리 문제 번호("BOJ 32932", "Programmers 12906") 및 임의 텍스트 필터링
    if (/^(boj|programmers)/i.test(dateStr.trim())) {
        return undefined;
    }

    const cleaned = dateStr.replace(/\./g, ",");
    const parsed = new Date(cleaned);
    const time = parsed.getTime();

    if (isNaN(time)) return undefined;

    // 정상적인 연도 범위 (2000년 ~ 2100년) 외의 날짜는 제외
    const year = parsed.getFullYear();
    if (year < 2000 || year > 2100) {
        return undefined;
    }

    return parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = SITE_URL;

    // 1. 고정 페이지 목록 (Home 및 카테고리 목록 페이지)
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${siteUrl}`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${siteUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8,
        },
        {
            url: `${siteUrl}/project`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8,
        },
        {
            url: `${siteUrl}/solving`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8,
        },
    ];

    // 2. UsefulBlog_Data의 posts.json에서 전체 포스트 목록 가져오기
    let postRoutes: MetadataRoute.Sitemap = [];
    try {
        const response = await fetch(`${CDN_BASE_URL}/posts.json`, {
            next: { revalidate: 86400 },
        });

        if (response.ok) {
            const postsIndex: Record<string, PostIndexItem[]> = await response.json();

            postRoutes = Object.entries(postsIndex).flatMap(([category, posts]) => {
                if (!Array.isArray(posts) || category === "project") return [];

                return posts
                    .filter((post) => Boolean(post.postID))
                    .map((post) => {
                        const isAbout = category === "about";
                        const postDate = parsePostDate(post.postDate);

                        return {
                            url: `${siteUrl}/${category}/${post.postID}`,
                            ...(postDate ? { lastModified: postDate } : {}),
                            changeFrequency: isAbout ? ("monthly" as const) : ("weekly" as const),
                            priority: isAbout ? 0.7 : 0.6,
                        };
                    });
            });
        }
    } catch (error) {
        console.error("Failed to generate dynamic sitemap:", error);
    }

    return [...staticRoutes, ...postRoutes];
}
