export enum PostCategory {
    ABOUT = "about",
    BLOG = "blog",
    PROJECT = "project",
    SOLVING = "solving",
}

export const CATEGORY_MAP: Record<PostCategory, { en: string; ko: string }> = {
    [PostCategory.BLOG]: { en: "Blog", ko: "블로그" },
    [PostCategory.PROJECT]: { en: "Project", ko: "프로젝트" },
    [PostCategory.SOLVING]: { en: "Problem Solving", ko: "Problem Solving" },
    [PostCategory.ABOUT]: { en: "About Me", ko: "소개" },
};

export function getCategoryNameEn(slug: string): string {
    return CATEGORY_MAP[slug as PostCategory]?.en || slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function getCategoryNameKo(slug: string): string {
    return CATEGORY_MAP[slug as PostCategory]?.ko || slug;
}
