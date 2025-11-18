"use client";

import { motion } from "framer-motion";
import { HomeIcon, WrenchScrewdriverIcon, StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

import BathLeadForm from "../forms/bath-lead-form";

export default function BathroomPage() {
    return (
        <motion.div
            animate={{ opacity: 1 }}
            className="pt-20 min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50/30"
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
                        Transform Your Bathroom with Stunning New Features
                    </motion.h1>
                </div>

                {/* Main Grid - Form Left, Content Right */}
                <div className="grid grid-cols-1 gap-8 items-start lg:grid-cols-2 lg:gap-12">
                    {/* LEFT SIDE - FORM */}
                    <div className="order-2 lg:order-1">
                        <div className="sticky top-24 scroll-mt-20" id="quote">
                            <motion.div
                                className="overflow-hidden bg-white/80 backdrop-blur-lg rounded-3xl border border-purple-100 shadow-2xl shadow-purple-500/20"
                                initial={{ y: 16, opacity: 0 }}
                                transition={{ duration: 0.35 }}
                                viewport={{ once: true, amount: 0.2 }}
                                whileInView={{ y: 0, opacity: 1 }}
                            >
                                <div className="bg-gradient-to-br from-purple-900 to-purple-800 p-6">
                                    <h2 className="text-2xl font-bold text-center text-white sm:text-3xl">
                                        Get Your Free Quote
                                    </h2>
                                    <p className="mt-2 text-sm text-center text-purple-50">
                                        Connect with local bathroom specialists today
                                    </p>
                                </div>
                                <div className="p-6 sm:p-8">
                                    <BathLeadForm />
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* RIGHT SIDE - CONTENT */}
                    <div className="space-y-8 order-1 lg:order-2">
                        <div className="space-y-6">
                            <motion.p
                                className="text-lg leading-relaxed text-gray-600 sm:text-xl"
                                initial={{ opacity: 0, y: 8 }}
                                transition={{ duration: 0.3 }}
                                viewport={{ once: true, amount: 0.4 }}
                                whileInView={{ opacity: 1, y: 0 }}
                            >
                                Experience the luxury of a beautifully remodeled bathroom with professional installation.
                                Elevate your bathroom&#39;s beauty, comfort, and value.
                            </motion.p>
                        </div>

                        {/* Hero Image */}
                        <motion.div className="relative group" initial={{ opacity: 0 }} transition={{ duration: 0.4 }} viewport={{ once: true }} whileInView={{ opacity: 1 }}>
                            <div className="overflow-hidden rounded-2xl border-2 border-purple-100 shadow-xl shadow-purple-500/10 transition-all duration-150 group-hover:shadow-2xl">
                                <Image
                                    alt="Beautiful modern bathroom renovation with luxury fixtures and elegant design"
                                    className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-105"
                                    height={600}
                                    src="/assets/bathroom.webp"
                                    width={800}
                                />
                            </div>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            className="grid grid-cols-3 gap-4 py-6 border-y border-gray-200"
                            initial="hidden"
                            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { staggerChildren: 0.06 } } }}
                            viewport={{ once: true, amount: 0.3 }}
                            whileInView="show"
                        >
                            <motion.div className="text-center" variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                                <div className="text-2xl font-bold text-[#0062FF] sm:text-3xl">300+</div>
                                <div className="mt-1 text-xs text-gray-600 sm:text-sm">Bathrooms Remodeled</div>
                            </motion.div>
                            <motion.div className="text-center border-x border-gray-200" variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                                <div className="text-2xl font-bold text-[#0062FF] sm:text-3xl">4.9/5.0</div>
                                <div className="mt-1 text-xs text-gray-600 sm:text-sm">Customer Rating</div>
                            </motion.div>
                            <motion.div className="text-center" variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                                <div className="text-2xl font-bold text-[#0062FF] sm:text-3xl">24/7</div>
                                <div className="mt-1 text-xs text-gray-600 sm:text-sm">Support Available</div>
                            </motion.div>
                        </motion.div>
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
                        className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-lg transition-all duration-150 group hover:shadow-xl hover:-translate-y-1"
                        variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                    >
                        <div className="p-8">
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-gradient-to-br from-purple-900 to-purple-800 rounded-2xl shadow-lg transition-all duration-150 group-hover:shadow-xl group-hover:scale-110">
                                    <HomeIcon className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-center text-gray-900">Luxurious Design</h3>
                            <p className="text-center leading-relaxed text-gray-600">
                                Upgrade your bathroom with our high-quality, luxurious designs that offer both style and functionality
                            </p>
                        </div>
                        <div className="h-1 w-full bg-gradient-to-r from-purple-900 to-purple-800 transform scale-x-0 transition-transform duration-150 group-hover:scale-x-100" />
                    </motion.div>

                    <motion.div
                        className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-lg transition-all duration-150 group hover:shadow-xl hover:-translate-y-1"
                        variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                    >
                        <div className="p-8">
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-gradient-to-br from-purple-900 to-purple-800 rounded-2xl shadow-lg transition-all duration-150 group-hover:shadow-xl group-hover:scale-110">
                                    <WrenchScrewdriverIcon className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-center text-gray-900">Expert Remodeling</h3>
                            <p className="text-center leading-relaxed text-gray-600">
                                Our certified professionals provide expert remodeling services to transform your bathroom into a personal oasis
                            </p>
                        </div>
                        <div className="h-1 w-full bg-gradient-to-r from-purple-900 to-purple-800 transform scale-x-0 transition-transform duration-150 group-hover:scale-x-100" />
                    </motion.div>

                    <motion.div
                        className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-lg transition-all duration-150 group hover:shadow-xl hover:-translate-y-1 sm:col-span-2 lg:col-span-1"
                        variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                    >
                        <div className="p-8">
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-gradient-to-br from-purple-900 to-purple-800 rounded-2xl shadow-lg transition-all duration-150 group-hover:shadow-xl group-hover:scale-110">
                                    <StarIcon className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-center text-gray-900">Comprehensive Warranty</h3>
                            <p className="text-center leading-relaxed text-gray-600">
                                Enjoy peace of mind with our comprehensive warranty coverage and dedicated support for your bathroom remodel
                            </p>
                        </div>
                        <div className="h-1 w-full bg-gradient-to-r from-purple-900 to-purple-800 transform scale-x-0 transition-transform duration-150 group-hover:scale-x-100" />
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}

