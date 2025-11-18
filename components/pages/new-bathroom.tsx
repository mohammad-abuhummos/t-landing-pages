"use client";

import React from "react";

import BathLeadForm from "../forms/bath-lead-form";
import LandingPageLayout from "../shared/landing-page-layout";
import { SparklesIcon, StarIcon, SupportIcon } from "../shared/icons";

export default function NewBathroomPage() {
    const trustIndicators = [
        {
            icon: <SparklesIcon />,
            value: "300+",
            label: "Bathrooms Remodeled",
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
            defaultHeroImage="/assets/bathroom.webp"
            heroKey="new-bathroom"
            heroSubtitle="Elevate your home with a bathroom that combines luxury and functionality. Our expert team delivers exceptional craftsmanship and personalized designs to create your dream space."
            heroTitle="Transform Your Bathroom with Stunning New Features"
            trustIndicators={trustIndicators}
        >
            <BathLeadForm />
        </LandingPageLayout>
    );
}
