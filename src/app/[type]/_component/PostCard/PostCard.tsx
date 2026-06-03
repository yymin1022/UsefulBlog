import React from "react";
import PostCardDesktop from "@/app/[type]/_component/PostCard/PostCardDesktop";
import { PostData } from "@/utils/PostDataUtil";

interface PostCardProps {
    post: PostData;
    postType: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, postType }) => {
    return <PostCardDesktop post={post} postType={postType} />;
};

export default PostCard;