"use client";

import React, { useRef, useEffect } from "react";

const Utterances = () => {
    const utterancesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let isMounted = true;

        const timer = setTimeout(() => {
            if (!isMounted) return;

            if (utterancesRef.current && utterancesRef.current.children.length === 0) {
                const utterances = document.createElement("script");
                utterances.setAttribute("src", "https://utteranc.es/client.js");
                utterances.setAttribute("async", "true");
                utterances.setAttribute("crossorigin", "anonymous");
                utterances.setAttribute("repo", "yymin1022/UsefulBlog_Comments");
                utterances.setAttribute("theme", "github-light");
                utterances.setAttribute("issue-term", "pathname");
                utterancesRef.current.appendChild(utterances);
            }
        }, 50);

        return () => {
            isMounted = false;
            clearTimeout(timer);
            if (utterancesRef.current) {
                utterancesRef.current.innerHTML = "";
            }
        };
    }, []);

    return <div ref={utterancesRef} className="w-full"></div>;
};

export default Utterances;
