"use client";

import { getCategoryNameEn, PostCategory } from "@/utils/CategoryUtil";
import { UrlData } from "@/utils/UrlData";
import Link from "next/link";
import React, { useState } from "react";
import { FaBars, FaFacebook, FaGithub, FaGooglePlay, FaInstagram, FaLinkedin, FaXmark } from "react-icons/fa6";

const SideMenuMobile = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <div className="relative">
            {/* Top Bar Header */}
            <div className="fixed top-0 left-0 w-full h-[65px] bg-gradient-to-r from-[#1E5FC1] to-[#103D88] shadow-[0_2px_12px_rgba(0,0,0,0.1)] flex items-center justify-between px-[20px] z-50 select-none">
                <Link href="/" onClick={closeMenu} className="flex items-center gap-[6px]">
                    <span className="font-nanum-l text-[20px] text-white">Useful한</span>
                    <span className="font-nanum-b font-black text-[20px] text-white">IT블로그</span>
                </Link>

                <button 
                    onClick={toggleMenu}
                    className="text-white hover:opacity-85 transition-opacity p-[4px] focus:outline-none"
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <FaXmark size="1.8em" /> : <FaBars size="1.8em" />}
                </button>
            </div>

            {/* Backdrop Blur Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/45 backdrop-blur-sm z-40"
                    onClick={closeMenu}
                />
            )}

            {/* Sliding Mobile Drawer Panel */}
            {isOpen && (
                <div className="fixed top-[65px] left-0 w-full bg-gradient-to-b from-[#1E5FC1] to-[#103D88] shadow-[0_15px_30px_rgba(0,0,0,0.2)] border-t border-white/10 p-[24px] z-50 select-none animate-fade-in-up flex flex-col gap-[24px]">
                    {/* Navigation Items */}
                    <div className="flex flex-col gap-[16px] font-nanum-r text-lg text-white/90">
                        {NAV_ITEMS.map(({ href, text, hasBorder }) => (
                            <Link 
                                key={href}
                                href={href} 
                                onClick={closeMenu}
                                className={`py-[8px] ${hasBorder ? "border-b border-white/10" : ""} active:opacity-70 transition-opacity`}
                            >
                                {text}
                            </Link>
                        ))}
                    </div>

                    {/* Social Media Link Icons */}
                    <div className="flex flex-row justify-center gap-[24px] mt-[10px] pb-[10px] border-t border-white/10 pt-[24px]">
                        {SOCIAL_LINKS.map(({ url, icon, label }) => (
                            <MobileSocialButton key={url} url={url} icon={icon} label={label} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const NAV_ITEMS = [
    { href: `/${PostCategory.BLOG}`, text: getCategoryNameEn(PostCategory.BLOG), hasBorder: true },
    { href: `/${PostCategory.PROJECT}`, text: getCategoryNameEn(PostCategory.PROJECT), hasBorder: true },
    { href: `/${PostCategory.SOLVING}`, text: getCategoryNameEn(PostCategory.SOLVING), hasBorder: true },
    { href: `/${PostCategory.ABOUT}`, text: getCategoryNameEn(PostCategory.ABOUT), hasBorder: false },
];

const SOCIAL_LINKS = [
    { url: UrlData.facebook, icon: <FaFacebook size="1.8em" />, label: "Facebook" },
    { url: UrlData.github, icon: <FaGithub size="1.8em" />, label: "GitHub" },
    { url: UrlData.googleplay, icon: <FaGooglePlay size="1.8em" />, label: "Google Play" },
    { url: UrlData.instagram, icon: <FaInstagram size="1.8em" />, label: "Instagram" },
    { url: UrlData.linkedin, icon: <FaLinkedin size="1.8em" />, label: "LinkedIn" },
];

const MobileSocialButton = ({ url, icon, label }: { url: UrlData; icon: React.ReactNode; label: string }) => {
    return (
        <Link 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label={label}
            className="text-white/80 active:opacity-75 transition-opacity"
        >
            {icon}
        </Link>
    );
};

export default SideMenuMobile;
