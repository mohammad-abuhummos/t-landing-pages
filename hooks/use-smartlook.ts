import { useEffect, useCallback } from "react";
import { smartlookAPI, getSmartlookConfig, shouldLoadSmartlook } from "@/config/smartlook";

/**
 * Custom hook for Smartlook integration
 */
export const useSmartlook = () => {
    const config = getSmartlookConfig();

    useEffect(() => {
        // Ensure Smartlook is properly initialized
        if (typeof window !== "undefined" && shouldLoadSmartlook()) {
            // Wait for Smartlook to be loaded
            const checkSmartlook = () => {
                if (window.smartlook) {
                    return true;
                }
                return false;
            };

            if (!checkSmartlook()) {
                // If not loaded yet, set up a check interval
                const interval = setInterval(() => {
                    if (checkSmartlook()) {
                        clearInterval(interval);
                    }
                }, 100);

                // Clean up interval after 10 seconds
                setTimeout(() => clearInterval(interval), 10000);
            }
        }
    }, []);

    const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
        if (!shouldLoadSmartlook()) return;
        smartlookAPI.track(eventName, properties);
    }, []);

    const identifyUser = useCallback((userId: string, properties?: Record<string, any>) => {
        if (!shouldLoadSmartlook()) return;
        smartlookAPI.identify(userId, properties);
    }, []);

    const markSensitive = useCallback((element: HTMLElement | string) => {
        if (!shouldLoadSmartlook()) return;
        smartlookAPI.sensitive(element);
    }, []);

    return {
        ...smartlookAPI,
        config,
        isEnabled: shouldLoadSmartlook(),

        /**
         * Track custom events with easy-to-use interface
         */
        trackEvent,

        /**
         * Identify user with properties
         */
        identifyUser,

        /**
         * Mark element as sensitive (will be hidden in recordings)
         */
        markSensitive,

        /**
         * Track page interactions
         */
        trackPageInteraction: (interactionType: string, elementId?: string, additionalData?: Record<string, any>) => {
            trackEvent("page_interaction", {
                interaction_type: interactionType,
                element_id: elementId,
                timestamp: new Date().toISOString(),
                ...additionalData,
            });
        },

        /**
         * Track form interactions
         */
        trackFormInteraction: (formName: string, action: "focus" | "blur" | "submit" | "error", additionalData?: Record<string, any>) => {
            trackEvent("form_interaction", {
                form_name: formName,
                action,
                timestamp: new Date().toISOString(),
                ...additionalData,
            });
        },

        /**
         * Track user journey milestones
         */
        trackMilestone: (milestone: string, additionalData?: Record<string, any>) => {
            trackEvent("user_milestone", {
                milestone,
                timestamp: new Date().toISOString(),
                ...additionalData,
            });
        },
    };
}; 