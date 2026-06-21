'use client';

import { useEffect, useRef } from 'react';
import { ADSENSE_CLIENT_ID } from '@/utils/adsense';

interface AdSenseProps {
    adSlot: string;
    adFormat?: string;
    fullWidthResponsive?: boolean;
    className?: string;
}

export default function AdSense({
    adSlot,
    adFormat = 'auto',
    fullWidthResponsive = true,
    className = '',
}: AdSenseProps) {
    const isLoaded = useRef(false);
    const isDev = process.env.NODE_ENV === 'development';

    useEffect(() => {
        // Prevent calling push multiple times on the same render lifecycle
        if (isLoaded.current) return;

        try {
            (window as any).adsbygoogle = (window as any).adsbygoogle || [];
            (window as any).adsbygoogle.push({});
            isLoaded.current = true;
        } catch (err) {
            // Suppress error logs in development mode to keep console clean
            if (!isDev) {
                console.error('AdSense initialization failed:', err);
            }
        }
    }, [isDev]);

    return (
        <div className={`w-full overflow-hidden min-h-[100px] flex flex-col justify-center items-center ${className}`}>
            {isDev && (
                <div className="w-full py-[30px] px-[16px] bg-[#F9FAFB] dark:bg-[#1F2937] border border-dashed border-[#D1D5DB] dark:border-[#4B5563] rounded-[12px] flex flex-col items-center justify-center text-center select-none my-[10px]">
                    <span className="text-[14px] font-bold text-[#4B5563] dark:text-[#9CA3AF] mb-[4px]">📢 Google AdSense Slot (Test Mode)</span>
                    <span className="text-[11px] text-[#9CA3AF] dark:text-[#6B7280]">Slot: {adSlot} | Client: {ADSENSE_CLIENT_ID}</span>
                </div>
            )}
            <ins
                className="adsbygoogle"
                style={{ display: isDev ? 'none' : 'block', width: '100%' }}
                data-ad-client={ADSENSE_CLIENT_ID}
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
            />
        </div>
    );
}

