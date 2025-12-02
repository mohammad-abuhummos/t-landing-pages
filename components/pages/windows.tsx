"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import WindowsLeadForm from "../forms/windows-lead-form";

export default function WindowsPage() {
    return (
        <motion.div
            animate={{ opacity: 1 }}
            className="overflow-hidden relative min-h-screen"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
        >
            <div className="absolute inset-0">
                <Image
                    fill
                    priority
                    alt="Windows installation background"
                    className="object-cover"
                    src="/assets/hero.webp"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-900/80" />
            </div>

            <div className="flex relative z-10 flex-col justify-center items-center px-4 py-10 min-h-screen sm:px-6 lg:px-8">
                <motion.div
                    className="mb-8 max-w-2xl text-center"
                    initial={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.3 }}
                    whileInView={{ opacity: 1, y: 0 }}
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
                        quick match
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                        Get a fast, no-pressure windows quote
                    </h1>
                    <p className="mt-2 text-base text-white/85">
                        Answer a handful of guided questions and we’ll connect you with the right local pros—no scroll needed.
                    </p>
                </motion.div>

                <motion.div
                    className="w-full max-w-2xl"
                    initial={{ opacity: 0, y: 24 }}
                    transition={{ duration: 0.35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                >
                    <div className="overflow-hidden rounded-[32px] border border-white/15 bg-white/95 shadow-[0_30px_70px_rgba(2,6,23,0.6)] backdrop-blur">
                        <div className="px-6 py-7 text-center text-white bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500">
                            <p className="text-xs uppercase tracking-[0.4em] text-white/70">step 1</p>
                            <h2 className="mt-2 text-2xl font-semibold">Tell us what you need</h2>
                            <p className="text-sm text-white/80">
                                Just the guided form below—no extra content, no distractions.
                            </p>
                        </div>
                        <div className="px-6 py-6 sm:px-8 sm:py-8">
                            <WindowsLeadForm />
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
