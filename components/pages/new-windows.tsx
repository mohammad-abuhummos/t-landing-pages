"use client";

import React from "react";

import WindowsLeadForm from "../forms/windows-lead-form";
import LandingPageLayout from "../shared/landing-page-layout";
import { SparklesIcon, StarIcon, SupportIcon } from "../shared/icons";

export default function NewWindowsPage() {
    const trustIndicators = [
        {
            icon: <SparklesIcon />,
            value: "500+",
            label: "Projects Completed",
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
            defaultHeroImage="/assets/hero.webp"
            heroKey="new-windows"
            heroSubtitle="Experience the comfort of energy-efficient windows with professional installation. Elevate your home's beauty, comfort, and value."
            heroTitle="Transform Your Home with Beautiful New Windows"
            trustIndicators={trustIndicators}
        >
            <WindowsLeadForm />
        </LandingPageLayout>
    );
}
