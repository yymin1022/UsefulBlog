import { getCategoryNameEn, PostCategory } from "@/utils/CategoryUtil";
import Link from "next/link";

const HomePageDesktop = () => {
    return(
        <div className="flex flex-col mt-[100px] lg:mt-[200px] mx-[30px] sm:mx-[60px] lg:mx-[100px] select-none">
            <HomePageDesktopTitle isBlue={false} text={"안녕하세요"} delay="0ms" />
            <HomePageDesktopTitle isBlue={true} text={"1인개발자"} delay="100ms" />
            <HomePageDesktopTitle isBlue={false} text={"Useful입니다."} delay="200ms" />
            <div className="h-[30px] lg:h-[50px]" />
            <HomePageDesktopNav path={`/${PostCategory.BLOG}`} text={getCategoryNameEn(PostCategory.BLOG)} delay="400ms" />
            <HomePageDesktopNav path={`/${PostCategory.PROJECT}`} text={getCategoryNameEn(PostCategory.PROJECT)} delay="500ms" />
            <HomePageDesktopNav path={`/${PostCategory.SOLVING}`} text={getCategoryNameEn(PostCategory.SOLVING)} delay="600ms" />
            <HomePageDesktopNav path={`/${PostCategory.ABOUT}`} text={getCategoryNameEn(PostCategory.ABOUT)} delay="700ms" />
        </div>
    );
}

const HomePageDesktopNav = ({path, text, delay}: {path: string, text: string, delay: string}) => {
    return(
        <Link 
            href={path} 
            className="group w-fit block animate-fade-in-up"
            style={{ animationDelay: delay }}
        >
            <div className="flex items-center gap-[8px] ms-[10px] my-[6px] lg:my-[8px] font-nanum-r text-lg lg:text-xl text-primary-blog_black transition-all duration-300 group-hover:translate-x-2 group-hover:text-primary-blog_blue">
                <span className="w-[6px] h-[6px] rounded-full bg-[#DDDDDD] transition-all duration-300 group-hover:bg-primary-blog_blue group-hover:scale-125" />
                <span>{text}</span>
            </div>
        </Link>
    );
}

const HomePageDesktopTitle = ({isBlue, text, delay}: {isBlue: boolean, text: string, delay: string}) => {
    const TITLE_STYLE_BLACK = "my-[4px] lg:my-[8px] font-nanum-r text-[36px] sm:text-[48px] lg:text-[72px] text-primary-blog_black tracking-tight leading-tight block animate-fade-in-up";
    const TITLE_STYLE_BLUE = "my-[4px] lg:my-[8px] font-nanum-b text-[36px] sm:text-[48px] lg:text-[72px] text-primary-blog_blue tracking-tight leading-tight block font-black animate-fade-in-up";
    return(
        <span 
            className={isBlue ? TITLE_STYLE_BLUE : TITLE_STYLE_BLACK}
            style={{ animationDelay: delay }}
        >
            {text}
        </span>
    );
}

export default HomePageDesktop;