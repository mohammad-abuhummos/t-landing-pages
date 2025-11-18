"use client";

import { motion } from "framer-motion";
import { HomeIcon, WrenchScrewdriverIcon, StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

import FlooringLeadForm from "../forms/flooring-lead-form";


export default function FlooringPage() {
    return (
        <motion.div
            animate={{ opacity: 1 }}
            className="pt-20 mt-20 min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50/30"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
        >
            {/* Hero Section with Form on Left */}
            <div className="container px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                {/* Page Title - Top */}
                <div className="mb-8 text-center">
                    <motion.h1
                        animate={{ y: 0, opacity: 1 }}
                        className="text-2xl font-bold text-gray-800 sm:text-3xl"
                        initial={{ y: -12, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                        Transform Your Home with Premium Flooring Solutions
                    </motion.h1>
                </div>

                {/* Main Grid - Form Left, Content Right */}
                <div className="grid grid-cols-1 gap-8 items-start lg:grid-cols-2 lg:gap-12">
                    {/* LEFT SIDE - FORM */}
                    <div className="order-2 lg:order-1">
                        <div className="sticky top-24 scroll-mt-20" id="quote">
                            <motion.div
                                className="overflow-hidden rounded-3xl border border-purple-100 shadow-2xl backdrop-blur-lg bg-white/80 shadow-purple-500/20"
                                initial={{ y: 16, opacity: 0 }}
                                transition={{ duration: 0.35 }}
                                viewport={{ once: true, amount: 0.2 }}
                                whileInView={{ y: 0, opacity: 1 }}
                            >
                                <div className="p-6 bg-gradient-to-br from-purple-900 to-purple-800">
                                    <h2 className="text-2xl font-bold text-center text-white sm:text-3xl">
                                        Get Your Free Quote
                                    </h2>
                                    <p className="mt-2 text-sm text-center text-purple-50">
                                        Connect with local flooring specialists today
                                    </p>
                                </div>
                                <div className="p-6 sm:p-8">
                                    <FlooringLeadForm />
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* RIGHT SIDE - CONTENT */}
                    <div className="order-1 space-y-8 lg:order-2">
                        <div className="space-y-6">
                            <motion.p
                                className="text-lg leading-relaxed text-gray-600 sm:text-xl"
                                initial={{ opacity: 0, y: 8 }}
                                transition={{ duration: 0.3 }}
                                viewport={{ once: true, amount: 0.4 }}
                                whileInView={{ opacity: 1, y: 0 }}
                            >
                                Experience the beauty and durability of professionally installed flooring with expert craftsmanship.
                                Elevate your home&#39;s comfort, value, and style.
                            </motion.p>
                        </div>

                        {/* Hero Image */}
                        <motion.div className="relative group" initial={{ opacity: 0 }} transition={{ duration: 0.4 }} viewport={{ once: true }} whileInView={{ opacity: 1 }}>
                            <div className="overflow-hidden rounded-2xl border-2 border-purple-100 shadow-xl transition-all duration-150 shadow-purple-500/10 group-hover:shadow-2xl">
                                <Image
                                    alt="Flooring service illustration"
                                    className="object-cover w-full h-auto transition-transform duration-150 group-hover:scale-105"
                                    height={600}
                                    src="/assets/flooring.webp"
                                    width={800}
                                />
                            </div>
                        </motion.div>

                        {/* Trust Indicators */}
                        <div className="grid grid-cols-3 gap-4 py-6 border-gray-200 border-y">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#0062FF] sm:text-3xl">600+</div>
                                <div className="mt-1 text-xs text-gray-600 sm:text-sm">Floors Installed</div>
                            </div>
                            <div className="text-center border-gray-200 border-x">
                                <div className="text-2xl font-bold text-[#0062FF] sm:text-3xl">4.9/5.0</div>
                                <div className="mt-1 text-xs text-gray-600 sm:text-sm">Customer Rating</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#0062FF] sm:text-3xl">24/7</div>
                                <div className="mt-1 text-xs text-gray-600 sm:text-sm">Support Available</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <motion.div
                    className="grid grid-cols-1 gap-6 mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
                    initial="hidden"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
                    viewport={{ once: true, amount: 0.2 }}
                    whileInView="show"
                >
                    <motion.div
                        className="overflow-hidden relative bg-white rounded-2xl border border-gray-100 shadow-lg transition-all duration-150 group hover:shadow-xl hover:-translate-y-1"
                        variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                    >
                        <div className="p-8">
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-gradient-to-br from-purple-900 to-purple-800 rounded-2xl shadow-lg transition-all duration-150 group-hover:shadow-xl group-hover:scale-110">
                                    <HomeIcon className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-center text-gray-900">Premium Materials</h3>
                            <p className="leading-relaxed text-center text-gray-600">
                                Transform your floors with our high-quality, durable flooring materials that offer both beauty and long-lasting performance
                            </p>
                        </div>
                        <div className="w-full h-1 bg-gradient-to-r from-purple-900 to-purple-800 transition-transform duration-150 transform scale-x-0 group-hover:scale-x-100" />
                    </motion.div>

                    <motion.div
                        className="overflow-hidden relative bg-white rounded-2xl border border-gray-100 shadow-lg transition-all duration-150 group hover:shadow-xl hover:-translate-y-1"
                        variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                    >
                        <div className="p-8">
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-gradient-to-br from-purple-900 to-purple-800 rounded-2xl shadow-lg transition-all duration-150 group-hover:shadow-xl group-hover:scale-110">
                                    <WrenchScrewdriverIcon className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-center text-gray-900">Expert Installation</h3>
                            <p className="leading-relaxed text-center text-gray-600">
                                Our certified professionals provide expert flooring installation services with precision craftsmanship and attention to detail
                            </p>
                        </div>
                        <div className="w-full h-1 bg-gradient-to-r from-purple-900 to-purple-800 transition-transform duration-150 transform scale-x-0 group-hover:scale-x-100" />
                    </motion.div>

                    <motion.div
                        className="overflow-hidden relative bg-white rounded-2xl border border-gray-100 shadow-lg transition-all duration-150 group hover:shadow-xl hover:-translate-y-1 sm:col-span-2 lg:col-span-1"
                        variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                    >
                        <div className="p-8">
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-gradient-to-br from-purple-900 to-purple-800 rounded-2xl shadow-lg transition-all duration-150 group-hover:shadow-xl group-hover:scale-110">
                                    <StarIcon className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-center text-gray-900">Comprehensive Warranty</h3>
                            <p className="leading-relaxed text-center text-gray-600">
                                Enjoy peace of mind with our comprehensive warranty coverage and dedicated support for your flooring project
                            </p>
                        </div>
                        <div className="w-full h-1 bg-gradient-to-r from-purple-900 to-purple-800 transition-transform duration-150 transform scale-x-0 group-hover:scale-x-100" />
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}


