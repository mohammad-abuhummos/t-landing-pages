"use client";

import Script from "next/script";

import { smartlookConfig, shouldLoadSmartlook } from "@/config/smartlook";

interface SmartlookProps {
    projectKey?: string;
    region?: string;
}

export function SmartlookScript({
    projectKey = smartlookConfig.key,
    region = smartlookConfig.region
}: SmartlookProps) {
    if (!shouldLoadSmartlook() || !projectKey) {
        return null;
    }

    return (
        <Script
            dangerouslySetInnerHTML={{
                __html: `
          window.smartlook||(function(d) {
            var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName('head')[0];
            var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';
            c.charset='utf-8';c.src='https://web-sdk.smartlook.com/recorder.js';h.appendChild(c);
          })(document);
          smartlook('init', '${projectKey}', { region: '${region}' });
        `,
            }}
            id="smartlook-script"
            strategy="afterInteractive"
        />
    );
}

export default SmartlookScript; 