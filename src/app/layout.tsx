import type { Metadata } from "next";
import localFont from "next/font/local";
import SideMenu from "@/app/_component/SideMenu/SideMenu";
import "./globals.css";
import { SITE_URL } from "@/utils/PostDataUtil";
import { Suspense } from "react";
import FirebaseAnalytics from "@/app/_component/FirebaseAnalytics/FirebaseAnalytics";
import Script from "next/script";
import { ADSENSE_CLIENT_ID } from "@/utils/adsense";


const nanumSquareL = localFont({
    src: "../fonts/NanumSquareL.otf",
    variable: "--font-nanum-l-next",
});
const nanumSquareR = localFont({
    src: "../fonts/NanumSquareR.otf",
    variable: "--font-nanum-r-next",
});
const nanumSquareB = localFont({
    src: "../fonts/NanumSquareB.otf",
    variable: "--font-nanum-b-next",
});

const pretendardL = localFont({
    src: "../fonts/PretendardL.otf",
    variable: "--font-pretendard-l-next",
});
const pretendardR = localFont({
    src: "../fonts/PretendardR.otf",
    variable: "--font-pretendard-r-next",
});
const pretendardB = localFont({
    src: "../fonts/PretendardB.otf",
    variable: "--font-pretendard-b-next",
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "Useful Blog",
        template: "%s - Useful Blog",
    },
    description: "1인개발자 Useful의 IT블로그",
    openGraph: {
        title: "Useful Blog",
        description: "1인개발자 Useful의 IT블로그",
        url: SITE_URL,
        siteName: "Useful Blog",
        locale: "ko_KR",
        type: "website",
        images: [
            {
                url: "/logo.png",
                width: 512,
                height: 512,
                alt: "Useful Blog Logo",
            },
        ],
    },
    twitter: {
        card: "summary",
        title: "Useful Blog",
        description: "1인개발자 Useful의 IT블로그",
        images: ["/logo.png"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Read runtime environment variables (injected when the container is created)
    const firebaseConfig = {
        apiKey: process.env.FB_API_KEY,
        authDomain: process.env.FB_AUTH_DOMAIN,
        projectId: process.env.FB_PROJECT_ID,
        appId: process.env.FB_APP_ID,
        measurementId: process.env.FB_MEASUREMENT_ID,
    };

    return (
        <html 
            lang="ko"
            className={`${nanumSquareL.variable} ${nanumSquareR.variable} ${nanumSquareB.variable} ${pretendardL.variable} ${pretendardR.variable} ${pretendardB.variable}`}
        >
            <body>
                <Script
                    async
                    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
                <Suspense fallback={null}>
                    <FirebaseAnalytics config={firebaseConfig} />
                </Suspense>
                <div className="w-full flex flex-col lg:flex-row">
                    <SideMenu/>
                    <div className="w-full pt-[65px] lg:pt-0 lg:pl-[400px]">
                        {children}
                    </div>
                </div>
            </body>
        </html>
    );
}
