/**
 * Google Tag Manager Configuration
 * 
 * Environment Variables:
 * - NEXT_PUBLIC_GTM_ID: Your GTM Container ID (default: GTM-564XGL85)
 * - NEXT_PUBLIC_GTM_ENABLED: Force enable GTM in development (default: false)
 * 
 * By default, GTM is only enabled in production environment.
 */

export const gtmConfig = {
    id: process.env.NEXT_PUBLIC_GTM_ID || "",
    enabled: process.env.NEXT_PUBLIC_GTM_ENABLED === "true",
};

/**
 * Get GTM configuration for the current environment
 */
export const getGTMConfig = () => {
    return {
        id: gtmConfig.id,
        enabled: gtmConfig.enabled,
        isProduction: process.env.NODE_ENV === "production",
        isDevelopment: process.env.NODE_ENV === "development",
    };
};

/**
 * Check if GTM should be loaded
 */
export const shouldLoadGTM = (): boolean => {
    return gtmConfig.enabled && !!gtmConfig.id;
};

/**
 * GTM Events helper functions
 */
export const gtmEvents = {
    /**
     * Push a custom event to GTM dataLayer
     */
    pushEvent: (event: string, data?: Record<string, any>) => {
        if (typeof window !== "undefined" && window.dataLayer) {
            window.dataLayer.push({
                event,
                ...data,
            });
        }
    },

    /**
     * Track page view
     */
    pageView: (url: string, title?: string) => {
        gtmEvents.pushEvent("page_view", {
            page_url: url,
            page_title: title || document.title,
        });
    },

    /**
     * Track custom conversion
     */
    conversion: (conversionId: string, value?: number, currency?: string) => {
        gtmEvents.pushEvent("conversion", {
            conversion_id: conversionId,
            value,
            currency: currency || "USD",
        });
    },
};

// Extend the Window interface to include dataLayer
declare global {
    interface Window {
        dataLayer?: Array<Record<string, any>>;
    }
} 