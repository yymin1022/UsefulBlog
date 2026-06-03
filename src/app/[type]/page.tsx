import React, { Suspense } from "react";
import type { Metadata } from "next";
import PostCard from "@/app/[type]/_component/PostCard/PostCard";
import { getPostList, PostData } from "@/utils/PostDataUtil";
import { redirect } from "next/navigation";
import PostListLoading from "./loading";

import { getCategoryNameEn } from "@/utils/CategoryUtil";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ type: string }>;
}): Promise<Metadata> {
    const { type } = await params;
    const categoryName = getCategoryNameEn(type);
    return {
        title: `${categoryName} - Useful Blog`,
        description: `Useful의 IT블로그: ${categoryName} 포스팅 목록`,
    };
}

export default async function PostListPage({
    params,
}: {
    params: Promise<{ type: string }>;
}) {
    const { type } = await params;
    if (type === "about") {
        redirect("/about/Useful");
    }

    return (
        <Suspense fallback={<PostListLoading />}>
            <PostListContent type={type} />
        </Suspense>
    );
}

async function PostListContent({ type }: { type: string }) {
    const result = await getPostList(type);
    const postList: PostData[] = result.RESULT_CODE === 200 ? result.RESULT_DATA.PostList : [];

    const pinnedPosts = postList.filter((post) => post.postIsPinned);
    const unpinnedPosts = postList.filter((post) => !post.postIsPinned);

    return (
        <div className="w-full max-w-[1000px] flex flex-col mx-auto px-[16px] sm:px-[24px] py-[30px] lg:my-[50px] animate-fade-in-up select-none">

            {/* ── Pinned / Featured Posts Section ─────────────── */}
            {pinnedPosts.length > 0 && (
                <div className="w-full mb-[10px]">
                    <div className="flex items-center gap-[8px] mb-[6px]">
                        <span className="w-[3px] h-[16px] bg-primary-blog_blue rounded-full" />
                        <span className="text-[12px] font-bold text-primary-blog_blue uppercase tracking-widest font-nanum-b">Featured</span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[20px] w-full">
                        {pinnedPosts.map((post) => (
                            <PostCard key={post.postID} post={post} postType={type} />
                        ))}
                    </div>
                </div>
            )}

            {/* Divider */}
            {pinnedPosts.length > 0 && unpinnedPosts.length > 0 && (
                <hr className="w-full border-0 bg-gradient-to-r from-transparent via-[#DDDDDD] to-transparent h-[1px] my-[16px]" />
            )}

            {/* ── Regular Posts Grid ───────────────────────────── */}
            {unpinnedPosts.length > 0 && (
                <div className="w-full">
                    {pinnedPosts.length > 0 && (
                        <div className="flex items-center gap-[8px] mb-[12px]">
                            <span className="w-[3px] h-[16px] bg-[#DDDDDD] rounded-full" />
                            <span className="text-[12px] font-bold text-[#9CA3AF] uppercase tracking-widest font-nanum-b">Posts</span>
                        </div>
                    )}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[20px] w-full">
                        {unpinnedPosts.map((post) => (
                            <PostCard key={post.postID} post={post} postType={type} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
