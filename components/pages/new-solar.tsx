"use client";

import React from "react";

import SolarLeadForm from "../forms/solar-lead-form";
import LandingPageLayout from "../shared/landing-page-layout";
import { SparklesIcon, StarIcon, SupportIcon } from "../shared/icons";

export default function NewSolarPage() {
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
            defaultHeroImage="/uploads/solar.jpg"
            heroKey="new-solar"
            heroSubtitle="Harness the power of the sun and save on energy bills with professional solar panel installation. Increase your home's value and reduce your carbon footprint."
            heroTitle="Power Your Home with Clean Solar Energy"
            trustIndicators={trustIndicators}
        >
            <SolarLeadForm />
        </LandingPageLayout>
    );
}

