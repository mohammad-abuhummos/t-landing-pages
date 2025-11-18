import React from "react";

import HeroSection from "./hero-section";
import TrustIndicatorsGrid from "./trust-indicators-grid";

interface TrustIndicator {
    icon: React.ReactNode;
    label: string;
    value: string;
}

interface LandingPageLayoutProps {
    children: React.ReactNode;
    defaultHeroImage: string;
    heroKey: string;
    heroSubtitle: string;
    heroTitle: string;
    trustIndicators: TrustIndicator[];
}

export default function LandingPageLayout({
    children,
    defaultHeroImage,
    heroKey,
    heroSubtitle,
    heroTitle,
    trustIndicators,
}: LandingPageLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50/30">
            {/* Hero Section with Background Image and Centered Form */}
            <section className="flex relative justify-center items-center py-16 min-h-screen sm:py-20">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <HeroSection
                        defaultImage={defaultHeroImage}
                        heroKey={heroKey}
                        subtitle={heroSubtitle}
                        title={heroTitle}
                    />
                </div>

                {/* Centered Form Overlay */}
                <div className="relative z-10 px-4 mx-auto w-full max-w-2xl sm:px-6 lg:px-8">
                    <div className="scroll-mt-20" id="quote">
                        <div className="p-6 rounded-3xl border shadow-2xl backdrop-blur-md bg-white/95 sm:p-8 shadow-purple-500/20 border-purple-100/50">
                            <h2 className="mb-2 text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-purple-800">
                                Get a Free Quote Today!
                            </h2>
                            <p className="mb-6 text-center text-gray-600">Fill out the form below to get started</p>
                            {children}
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Indicators Section */}
            {/* <section className="pb-16 bg-gradient-to-br to-white from-purple-50/50 sm:pb-20">
                <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                    <TrustIndicatorsGrid indicators={trustIndicators} />
                </div>
            </section> */}
        </div>
    );
}

