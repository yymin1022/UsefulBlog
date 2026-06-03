import React, { Suspense } from "react";
import type { Metadata } from "next";
import MDRender from "../_component/MDRender/MDRender";
import Utterances from "../_component/Utterances/Utterances";
import { getPostData, SITE_URL } from "@/utils/PostDataUtil";
import { notFound } from "next/navigation";
import PostDetailLoading from "./loading";

import { getCategoryNameKo } from "@/utils/CategoryUtil";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ type: string; id: string }>;
}): Promise<Metadata> {
    const { type, id } = await params;
    const result = await getPostData(type, id);


    if (result.RESULT_CODE !== 200) {
        return {
            title: "Post Not Found",
        };
    }

    const { PostTitle, PostTag } = result.RESULT_DATA;
    const categoryName = getCategoryNameKo(type);
    const tagsString = PostTag && PostTag.length > 0 ? `. 태그: ${PostTag.join(", ")}` : "";
    const description = `Useful의 ${categoryName} 포스팅: ${PostTitle}${tagsString}`;

    // Determine dynamic OG image
    let imageUrl = "/logo.png";
    if (type === "solving") {
        if (id.startsWith("boj")) {
            imageUrl = "/api/getPostImage?postType=solving&postID=dummy&srcID=thumb_boj.png";
        } else if (id.startsWith("programmers")) {
            imageUrl = "/api/getPostImage?postType=solving&postID=dummy&srcID=thumb_programmers.png";
        }
    } else {
        imageUrl = `/api/getPostImage?postType=${type}&postID=${id}&srcID=post.png`;
    }

    return {
        title: PostTitle,
        description,
        openGraph: {
            title: `${PostTitle} - Useful Blog`,
            description,
            url: `${SITE_URL}/${type}/${id}`,
            type: "article",
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: PostTitle,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${PostTitle} - Useful Blog`,
            description,
            images: [imageUrl],
        },
    };
}

export default async function PostViewPage({
    params,
}: {
    params: Promise<{ type: string; id: string }>;
}) {
    const { type, id } = await params;

    return (
        <Suspense fallback={<PostDetailLoading />}>
            <PostViewContent type={type} id={id} />
        </Suspense>
    );
}

async function PostViewContent({ type, id }: { type: string; id: string }) {
    const result = await getPostData(type, id);

    if (result.RESULT_CODE !== 200) {
        notFound();
    }

    const { PostContent, PostDate, PostTag, PostTitle, PostURL } = result.RESULT_DATA;

    return (
        <div className="w-full flex flex-col items-center py-[40px] lg:py-[60px] px-[20px] max-w-[860px] mx-auto animate-fade-in-up">

            {/* Header Block */}
            <div className="w-full max-w-[720px] text-left">
                {/* Tags row above title */}
                <div className="flex flex-row flex-wrap gap-[6px] mb-[16px]">
                    {PostTag.map((tag: string, idx: number) => (
                        <span
                            key={`${tag}-${idx}`}
                            className="inline-block px-[10px] py-[3px] bg-[#EEF2FF] text-primary-blog_blue text-[12px] font-medium rounded-full font-nanum-r"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>

                <h1 className="text-[24px] sm:text-[30px] lg:text-[34px] font-black text-primary-blog_blue leading-[1.3] tracking-tight font-nanum-b mb-[14px]">
                    {PostTitle}
                </h1>
                <div className="flex flex-row items-center text-[13px] text-[#AAAAAA] font-nanum-r gap-[6px] select-none">
                    <span>written by <strong className="text-primary-blog_blue font-bold font-nanum-b">Useful</strong></span>
                    <span className="text-[#DDDDDD]">·</span>
                    <span>{PostDate}</span>
                </div>
            </div>

            {/* Separator line */}
            <hr className="w-full max-w-[720px] border-0 bg-[#EEEEEE] h-[1px] my-[32px]" />

            {/* Markdown Content */}
            <div className="w-full max-w-[720px]">
                <MDRender content={PostContent} postURL={PostURL} postType={type} />
            </div>

            {/* Comments block */}
            <div className="w-full max-w-[720px] mt-[60px] border-t border-[#EEEEEE] pt-[32px]">
                <Utterances />
            </div>

            {/* Footer */}
            <div className="h-[80px] w-full" />
        </div>
    );
}
