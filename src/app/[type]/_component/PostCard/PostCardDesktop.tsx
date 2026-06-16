import React from "react";
import Link from "next/link";
import { PostData } from "@/utils/PostDataUtil";

interface PostCardDesktopProps {
    post: PostData;
    postType: string;
}

const PostCardDesktop: React.FC<PostCardDesktopProps> = ({ post, postType }) => {
    const { postDate, postID, postIsPinned, postTag, postTitle, postURL } = post;

    let thumbFile = "thumb.png";
    if (postType === "solving") {
        if (postIsPinned) {
            thumbFile = "thumb_boj.png";
        } else {
            thumbFile = "thumb_programmers.png";
        }
    }

    const imageSrc = `/getPostImage?postType=${postType}&postID=${postURL}&srcID=${thumbFile}`;
    const postLink = `/${postType}/${postID}`;

    return (
        <Link href={postLink} className="block group w-full my-[10px]">
            <div className="w-full h-[155px] flex flex-row bg-primary-blog_white border border-[#EEF2F6] hover:border-primary-blog_blue/10 rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(22,78,171,0.06)] hover:-translate-y-[2px] transition-all duration-300 ease-out overflow-hidden relative">
                
                {/* Polaroid Inset Image Container */}
                <div className="p-[12px] pr-0 w-[142px] h-[155px] flex-shrink-0">
                    <div className="w-full h-full rounded-[10px] overflow-hidden relative">
                        <img
                            src={imageSrc}
                            alt={postTitle}
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            loading="lazy"
                        />
                    </div>
                </div>

                {/* Text Container */}
                <div className="flex-1 h-[155px] flex flex-col justify-between px-[20px] py-[18px] min-w-0">
                    <div className="flex flex-col text-left">
                        <h2 className="text-[16px] sm:text-[17px] font-black text-primary-blog_blue leading-[1.3] line-clamp-2 transition-colors duration-300 group-hover:text-[#1D4ED8] font-nanum-b">
                            {postTitle}
                        </h2>
                        <p className="text-[13px] text-primary-blog_gray mt-[6px] font-nanum-r">
                            {postDate}
                        </p>
                    </div>
                    {/* Tags List */}
                    <div className="flex flex-row flex-wrap gap-[6px] mt-auto">
                        {postTag.slice(0, 2).map((tag: string, idx: number) => (
                            <span
                                key={`${tag}-${idx}`}
                                className="inline-block px-[8px] py-[2px] bg-[#EEF2FF] text-primary-blog_blue text-[11px] font-medium rounded-full font-nanum-r"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PostCardDesktop;