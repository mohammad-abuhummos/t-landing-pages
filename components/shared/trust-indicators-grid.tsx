"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface TrustIndicator {
    icon: React.ReactNode;
    label: string;
    value: string;
}

interface TrustIndicatorsGridProps {
    indicators: TrustIndicator[];
}

const trustedByLogos = [
    {
        src: "/trustedby/google.webp",
        alt: "Google",
        name: "Google Partner"
    },
    {
        src: "/trustedby/trustedform-logo.webp",
        alt: "TrustedForm",
        name: "TrustedForm Certified"
    },
    {
        src: "/trustedby/jornaya-logo.png",
        alt: "Jornaya",
        name: "Jornaya Verified"
    }
];

export default function TrustIndicatorsGrid({ indicators: _indicators }: TrustIndicatorsGridProps) {
    return (
        <div className="lg:col-span-1 space-y-6 lg:pt-8 order-1 sm:order-2">
            {/* Trusted By Section */}
            <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-white rounded-3xl shadow-2xl border border-gray-200"
                initial={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.6 }}
            >
                {/* Decorative gradient background */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-[#0661ea]/5 via-blue-50 to-transparent" />

                <div className="relative p-8">
                    {/* Badge */}
                    <motion.div
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 bg-[#0661ea]/10 text-[#0661ea] px-4 py-2 rounded-full text-sm font-semibold mb-6"
                        initial={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                        </svg>
                        Verified Partners
                    </motion.div>

                    <motion.h3
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-black text-gray-900 mb-2 tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        Trusted By
                    </motion.h3>
                    <motion.p
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gray-600 mb-8 text-sm"
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Industry-leading partnerships ensuring quality and reliability
                    </motion.p>

                    {/* Logo Grid */}
                    <div className="space-y-4">
                        {trustedByLogos.map((logo, index) => (
                            <motion.div
                                key={logo.alt}
                                animate={{ opacity: 1, x: 0 }}
                                className="group relative bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border-2 border-gray-100 hover:border-[#0661ea]/30 transition-all duration-300 overflow-hidden"
                                initial={{ opacity: 0, x: -30 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.5 + index * 0.1,
                                    ease: "easeOut"
                                }}
                                whileHover={{
                                    scale: 1.02,
                                    boxShadow: "0 10px 40px rgba(6, 97, 234, 0.1)",
                                    transition: { duration: 0.2 }
                                }}
                            >
                                {/* Hover effect overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[#0661ea]/0 to-[#0661ea]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative flex items-center justify-between">
                                    <div className="relative w-32 h-12 flex-shrink-0">
                                        <Image
                                            fill
                                            alt={logo.alt}
                                            className="object-contain object-left grayscale group-hover:grayscale-0 transition-all duration-300"
                                            src={logo.src}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 group-hover:text-[#0661ea] transition-colors duration-300">
                                        <span className="text-xs font-medium hidden sm:inline">{logo.name}</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                        </svg>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

