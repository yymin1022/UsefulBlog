import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import LinkCard from "./LinkCard";

interface MDRenderProps {
    content: string;
    postURL: string;
    postType: string;
}

const MDRender: React.FC<MDRenderProps> = ({ content, postURL, postType }) => {
    const components = {
        // ── Headings ──────────────────────────────────────────────────────────
        h1: ({ children, ...props }: any) => (
            <h1
                className="text-[24px] lg:text-[28px] font-black text-primary-blog_blue mt-[48px] mb-[16px] pb-[10px] border-b border-[#E5E7EB] leading-tight font-nanum-b"
                {...props}
            >
                {children}
            </h1>
        ),
        h2: ({ children, ...props }: any) => (
            <h2
                className="text-[20px] lg:text-[24px] font-black text-[#1F2937] mt-[36px] mb-[12px] leading-snug font-nanum-b"
                {...props}
            >
                {children}
            </h2>
        ),
        h3: ({ children, ...props }: any) => (
            <h3
                className="text-[17px] lg:text-[20px] font-black text-[#374151] mt-[28px] mb-[10px] leading-snug font-nanum-b"
                {...props}
            >
                {children}
            </h3>
        ),
        h4: ({ children, ...props }: any) => (
            <h4
                className="text-[15px] lg:text-[17px] font-black text-[#4B5563] mt-[20px] mb-[8px] font-nanum-b"
                {...props}
            >
                {children}
            </h4>
        ),
        h5: ({ children, ...props }: any) => (
            <h5
                className="text-[14px] font-black text-[#6B7280] mt-[16px] mb-[6px] font-nanum-b"
                {...props}
            >
                {children}
            </h5>
        ),
        h6: ({ children, ...props }: any) => (
            <h6
                className="text-[13px] font-black text-[#9CA3AF] mt-[14px] mb-[6px] font-nanum-b"
                {...props}
            >
                {children}
            </h6>
        ),

        // ── Paragraph ─────────────────────────────────────────────────────────
        p: ({ children, ...props }: any) => (
            <div
                className="my-[14px] leading-[1.85] text-primary-blog_black text-[15px] lg:text-[16px] font-nanum-r break-words"
                {...props}
            >
                {children}
            </div>
        ),

        // ── Blockquote ────────────────────────────────────────────────────────
        blockquote: ({ children, ...props }: any) => (
            <blockquote
                className="border-l-[3px] border-primary-blog_blue bg-[#F8FAFC] text-[#4B5563] pl-[18px] pr-[12px] py-[12px] my-[20px] rounded-r-[6px] italic text-[15px] font-nanum-r"
                {...props}
            >
                {children}
            </blockquote>
        ),

        // ── Lists ─────────────────────────────────────────────────────────────
        ul: ({ children, ...props }: any) => (
            <ul
                className="list-disc pl-[22px] my-[14px] space-y-[6px] font-nanum-r text-[15px] lg:text-[16px] text-primary-blog_black"
                {...props}
            >
                {children}
            </ul>
        ),
        ol: ({ children, ...props }: any) => (
            <ol
                className="list-decimal pl-[22px] my-[14px] space-y-[6px] font-nanum-r text-[15px] lg:text-[16px] text-primary-blog_black"
                {...props}
            >
                {children}
            </ol>
        ),
        li: ({ children, ...props }: any) => (
            <li className="leading-[1.75]" {...props}>
                {children}
            </li>
        ),

        // ── Table ─────────────────────────────────────────────────────────────
        table: ({ children, ...props }: any) => (
            <div className="w-full my-[24px] overflow-x-auto rounded-[10px] border border-[#E5E7EB] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                <table className="w-full border-collapse text-[14px] text-left" {...props}>
                    {children}
                </table>
            </div>
        ),
        thead: ({ children, ...props }: any) => (
            <thead className="bg-[#F9FAFB] text-[#374151] font-bold border-b border-[#E5E7EB] font-nanum-b" {...props}>
                {children}
            </thead>
        ),
        tbody: ({ children, ...props }: any) => (
            <tbody className="bg-primary-blog_white divide-y divide-[#E5E7EB] font-nanum-r" {...props}>
                {children}
            </tbody>
        ),
        tr: ({ children, ...props }: any) => (
            <tr className="hover:bg-[#F9FAFB] transition-colors" {...props}>
                {children}
            </tr>
        ),
        th: ({ children, ...props }: any) => (
            <th className="px-[14px] py-[10px] font-bold border-r border-[#E5E7EB] last:border-r-0" {...props}>
                {children}
            </th>
        ),
        td: ({ children, ...props }: any) => (
            <td className="px-[14px] py-[10px] border-r border-[#E5E7EB] last:border-r-0 text-[#4B5563]" {...props}>
                {children}
            </td>
        ),

        // ── Code / Codeblocks ─────────────────────────────────────────────────
        code: ({ className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const inline = !match;
            return !inline ? (
                <div className="w-full my-[20px] text-left rounded-[10px] border border-[#E5E7EB]/40 overflow-hidden text-[13px] bg-[#1E1E1E] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                    {/* macOS window bar */}
                    <div className="flex items-center justify-between px-[14px] py-[8px] bg-[#2D3035] border-b border-[#1E1E1E] select-none">
                        <div className="flex items-center gap-[6px]">
                            <span className="w-[10px] h-[10px] rounded-full bg-[#FF5F56] block" />
                            <span className="w-[10px] h-[10px] rounded-full bg-[#FFBD2E] block" />
                            <span className="w-[10px] h-[10px] rounded-full bg-[#27C93F] block" />
                        </div>
                        {match[1] && (
                            <span className="text-[#A0AEC0] text-[11px] font-mono uppercase tracking-wider font-semibold">
                                {match[1]}
                            </span>
                        )}
                    </div>
                    <SyntaxHighlighter
                        style={darcula}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                            margin: 0,
                            padding: "16px",
                            background: "#1E1E1E",
                            fontSize: "13px",
                            lineHeight: "1.65",
                        }}
                        {...props}
                    >
                        {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                </div>
            ) : (
                <code
                    className="bg-[#F3F4F6] text-[#D6336C] px-[5px] py-[2px] rounded-[4px] font-mono text-[13px] border border-[#E5E7EB] break-words"
                    {...props}
                >
                    {children}
                </code>
            );
        },

        // ── Links ─────────────────────────────────────────────────────────────
        a: ({ children, href, ...props }: any) => {
            if (postType !== "about") {
                return <LinkCard href={href}>{children}</LinkCard>;
            } else {
                return (
                    <a
                        target="_blank"
                        href={href}
                        rel="noopener noreferrer"
                        className="text-primary-blog_blue font-black no-underline transition-colors duration-300 hover:text-[#0b2b5e] hover:underline font-nanum-b"
                        {...props}
                    >
                        {children}
                    </a>
                );
            }
        },

        // ── Images ────────────────────────────────────────────────────────────
        img: ({ src, width, ...props }: any) => {
            const imageSrc = `/getPostImage?postType=${postType}&postID=${postURL}&srcID=${src}`;
            return (
                <div className="flex justify-center my-[24px]">
                    <img
                        src={imageSrc}
                        width={width}
                        alt="Post Image"
                        className="max-w-full h-auto rounded-[8px] shadow-sm"
                        {...props}
                    />
                </div>
            );
        },

        // ── HR ────────────────────────────────────────────────────────────────
        hr: ({ ...props }: any) => (
            <hr className="w-full border-0 bg-[#E5E7EB] h-[1px] my-[32px]" {...props} />
        ),

        // ── Inline text styles ────────────────────────────────────────────────
        strong: ({ children, ...props }: any) => (
            <strong className="text-primary-blog_blue font-black font-nanum-b" {...props}>
                {children}
            </strong>
        ),
        em: ({ children, ...props }: any) => (
            <em className="italic text-primary-blog_gray font-nanum-r" {...props}>
                {children}
            </em>
        ),
        del: ({ children, ...props }: any) => (
            <del className="line-through text-primary-blog_lightgray_1 font-nanum-r" {...props}>
                {children}
            </del>
        ),
    };

    return (
        <ReactMarkdown
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            remarkPlugins={[remarkGfm]}
            components={components}
        >
            {content}
        </ReactMarkdown>
    );
};

export default MDRender;
