"use client";

import Script from "next/script";

import { gtmConfig, shouldLoadGTM } from "@/config/gtm";

interface GTMProps {
    gtmId?: string;
}

export function GTMScript({ gtmId = gtmConfig.id }: GTMProps) {
    if (!shouldLoadGTM() || !gtmId) {
        return null;
    }

    return (
        <>
            {/* Google Tag Manager Script */}
            <Script
                dangerouslySetInnerHTML={{
                    __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
                }}
                id="gtm-script"
                strategy="afterInteractive"
            />
        </>
    );
}

export function GTMNoscript({ gtmId = gtmConfig.id }: GTMProps) {
    if (!shouldLoadGTM() || !gtmId) {
        return null;
    }

    return (
        <noscript>
            <iframe
                height="0"
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                style={{ display: "none", visibility: "hidden" }}
                title="Google Tag Manager"
                width="0"
            />
        </noscript>
    );
}

// Combined component for easy usage
export function GTM({ gtmId }: GTMProps) {
    return (
        <>
            <GTMScript gtmId={gtmId} />
            <GTMNoscript gtmId={gtmId} />
        </>
    );
}

export default GTM; 