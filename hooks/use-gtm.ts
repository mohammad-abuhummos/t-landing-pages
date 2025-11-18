import { useEffect } from "react";
import { gtmEvents, getGTMConfig, shouldLoadGTM } from "@/config/gtm";

/**
 * Custom hook for Google Tag Manager integration
 */
export const useGTM = () => {
    const config = getGTMConfig();

    useEffect(() => {
        // Initialize dataLayer if it doesn't exist
        if (typeof window !== "undefined" && shouldLoadGTM()) {
            window.dataLayer = window.dataLayer || [];
        }
    }, []);

    return {
        ...gtmEvents,
        config,
        isEnabled: shouldLoadGTM(),

        /**
         * Track page view automatically on route change
         */
        trackPageView: (url?: string, title?: string) => {
            if (!shouldLoadGTM()) return;

            const currentUrl = url || window.location.pathname + window.location.search;
            const pageTitle = title || document.title;

            gtmEvents.pageView(currentUrl, pageTitle);
        },

        /**
         * Track button clicks
         */
        trackButtonClick: (buttonName: string, additionalData?: Record<string, any>) => {
            if (!shouldLoadGTM()) return;

            gtmEvents.pushEvent("button_click", {
                button_name: buttonName,
                ...additionalData,
            });
        },

        /**
         * Track form submissions
         */
        trackFormSubmit: (formName: string, additionalData?: Record<string, any>) => {
            if (!shouldLoadGTM()) return;

            gtmEvents.pushEvent("form_submit", {
                form_name: formName,
                ...additionalData,
            });
        },
    };
}; 