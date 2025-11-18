"use client";

import React from "react";

import FlooringLeadForm from "../forms/flooring-lead-form";
import LandingPageLayout from "../shared/landing-page-layout";
import { SparklesIcon, StarIcon, SupportIcon } from "../shared/icons";

export default function NewFlooringPage() {
    const trustIndicators = [
        {
            icon: <SparklesIcon />,
            value: "600+",
            label: "Floors Installed",
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
            defaultHeroImage="/assets/flooring.webp"
            heroKey="new-flooring"
            heroSubtitle="Experience the beauty and durability of professionally installed flooring with expert craftsmanship. Elevate your home's comfort, value, and style."
            heroTitle="Transform Your Home with Premium Flooring Solutions"
            trustIndicators={trustIndicators}
        >
            <FlooringLeadForm />
        </LandingPageLayout>
    );
}
