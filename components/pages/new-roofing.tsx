"use client";

import React from "react";

import RoofingLeadForm from "../forms/roofing-lead-form";
import LandingPageLayout from "../shared/landing-page-layout";
import { SparklesIcon, StarIcon, SupportIcon } from "../shared/icons";

export default function NewRoofingPage() {
    const trustIndicators = [
        {
            icon: <SparklesIcon />,
            value: "400+",
            label: "Roofs Installed",
        },
        {
            icon: <StarIcon />,
            value: "4.9/5.0",
            label: "Customer Rating",
        },
        {
            icon: <SupportIcon />,
            value: "24/7",
            label: "Support Available",
        },
    ];

    return (
        <LandingPageLayout
            defaultHeroImage="/assets/roofing.webp"
            heroKey="new-roofing"
            heroSubtitle="Experience the security of a professionally installed roof with expert craftsmanship. Elevate your home's protection, value, and curb appeal."
            heroTitle="Protect Your Home with Premium Roofing Solutions"
            trustIndicators={trustIndicators}
        >
            <RoofingLeadForm />
        </LandingPageLayout>
    );
}
