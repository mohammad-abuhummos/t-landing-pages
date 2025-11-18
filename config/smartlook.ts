/**
 * Smartlook Configuration
 * 
 * Environment Variables:
 * - NEXT_PUBLIC_SMARTLOOK_KEY: Your Smartlook project key (default: 3ce5e585444ca04ac6206f08d008668432f429cd)
 * - NEXT_PUBLIC_SMARTLOOK_ENABLED: Enable Smartlook outside production or override defaults (set to "true" or "false")
 * - NEXT_PUBLIC_SMARTLOOK_REGION: Smartlook region (default: eu)
 * 
 * By default, Smartlook is only enabled in production environment.
 */

const envEnabled = process.env.NEXT_PUBLIC_SMARTLOOK_ENABLED;

export const smartlookConfig = {
    key: process.env.NEXT_PUBLIC_SMARTLOOK_KEY || "3ce5e585444ca04ac6206f08d008668432f429cd",
    region: process.env.NEXT_PUBLIC_SMARTLOOK_REGION || "eu",
    enabled: envEnabled !== undefined ? envEnabled === "true" : process.env.NODE_ENV === "production",
};

/**
 * Get Smartlook configuration for the current environment
 */
export const getSmartlookConfig = () => {
    return {
        key: smartlookConfig.key,
        region: smartlookConfig.region,
        enabled: smartlookConfig.enabled,
        isProduction: process.env.NODE_ENV === "production",
        isDevelopment: process.env.NODE_ENV === "development",
    };
};

/**
 * Check if Smartlook should be loaded
 */
export const shouldLoadSmartlook = (): boolean => {
    return smartlookConfig.enabled && !!smartlookConfig.key;
};

/**
 * Smartlook API helper functions
 */
export const smartlookAPI = {
    /**
     * Track a custom event
     */
    track: (eventName: string, properties?: Record<string, any>) => {
        if (typeof window !== "undefined" && window.smartlook) {
            window.smartlook("track", eventName, properties);
        }
    },

    /**
     * Identify a user
     */
    identify: (userId: string, properties?: Record<string, any>) => {
        if (typeof window !== "undefined" && window.smartlook) {
            window.smartlook("identify", userId, properties);
        }
    },

    /**
     * Start recording
     */
    startRecording: () => {
        if (typeof window !== "undefined" && window.smartlook) {
            window.smartlook("start");
        }
    },

    /**
     * Stop recording
     */
    stopRecording: () => {
        if (typeof window !== "undefined" && window.smartlook) {
            window.smartlook("stop");
        }
    },

    /**
     * Pause recording
     */
    pauseRecording: () => {
        if (typeof window !== "undefined" && window.smartlook) {
            window.smartlook("pause");
        }
    },

    /**
     * Resume recording
     */
    resumeRecording: () => {
        if (typeof window !== "undefined" && window.smartlook) {
            window.smartlook("resume");
        }
    },

    /**
     * Mark sensitive information (will be hidden in recordings)
     */
    sensitive: (element: HTMLElement | string) => {
        if (typeof window !== "undefined" && window.smartlook) {
            window.smartlook("sensitive", element);
        }
    },
};

// Extend the Window interface to include smartlook
declare global {
    interface Window {
        smartlook?: {
            (command: string, ...args: any[]): void;
            api?: Array<any>;
        };
    }
} 