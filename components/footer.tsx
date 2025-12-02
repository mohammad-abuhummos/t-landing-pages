"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/button";

import { siteConfig } from "@/config/site";

export default function Footer() {

    return (
        <footer className="bg-gradient-to-b from-white to-white border-t via-blue-50/40 border-slate-200 text-slate-900">
            <div className="container px-4 py-16 mx-auto space-y-12">
                <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
                    <div className="overflow-hidden relative p-8 rounded-3xl border shadow-xl border-white/70 bg-white/80 shadow-blue-100">
                        <div className="flex flex-wrap gap-4 items-center">
                            <span className="flex justify-center items-center w-20 h-20 bg-white rounded-2xl border border-blue-100">
                                <Image
                                    alt="Full Home Remodeling logo"
                                    className="object-contain w-16 h-16"
                                    height={64}
                                    src="/logos/logo.png"
                                    width={64}
                                />
                            </span>
                            <div>
                                <Link className="text-2xl font-semibold text-slate-900" href="/">
                                    fullhomeremodeling.us
                                </Link>
                                <p className="text-sm text-slate-500">
                                    Premier marketplace for vetted home renovation partners nationwide.
                                </p>
                            </div>
                        </div>
                        <p className="mt-6 text-lg text-slate-700">
                            Work with regional leaders in windows, roofing, bathroom, solar, and flooring upgrades built to elevate modern living.
                        </p>
                        <div className="flex flex-wrap gap-4 items-center mt-8">
                            <Button
                                as={Link}
                                className="text-sm font-semibold text-white shadow-lg shadow-blue-400/40"
                                color="primary"
                                href="/partners"
                                radius="full"
                                variant="solid"
                            >
                                View our partners
                            </Button>
                            <span className="text-sm text-slate-500">
                                Curated network • Nationwide coverage
                            </span>
                        </div>
                        <div className="grid gap-3 mt-10 text-sm text-slate-600 sm:grid-cols-2">
                            <div className="flex gap-2 items-center px-4 py-3 rounded-2xl border border-slate-200/70 bg-white/70">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                                Average install timelines under 30 days
                            </div>
                            <div className="flex gap-2 items-center px-4 py-3 rounded-2xl border border-slate-200/70 bg-white/70">
                                <span className="w-2 h-2 bg-blue-400 rounded-full" />
                                Financing & warranty support included
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-y-0 right-[-40%] hidden rotate-6 rounded-full bg-blue-100/60 blur-3xl lg:block" />
                    </div>

                    <div className="grid gap-10 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                Services
                            </p>
                            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                                {siteConfig.navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        className="px-4 py-3 font-medium rounded-xl transition-colors bg-white/60 text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                                        href={item.href}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl border shadow-sm border-slate-200 bg-white/80">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                Contact
                            </p>
                            <div className="mt-4 space-y-2 text-sm text-slate-600">
                                <Link className="text-base font-semibold text-slate-800 hover:text-blue-600" href="mailto:hello@fullhomeremodeling.us">
                                    hello@fullhomeremodeling.us
                                </Link>
                                <p>Mon – Fri · 9am to 6pm ET</p>
                                <p className="text-slate-500">
                                    1580 Market Street, Suite 300
                                    <br />
                                    San Francisco, CA 94102
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 pt-6 text-sm border-t border-slate-200 text-slate-500 md:flex-row md:items-center md:justify-between">
                    <div>© {new Date().getFullYear()} fullhomeremodeling.us · All rights reserved.</div>
                    <div className="flex flex-wrap gap-4">
                        <Link className="transition-colors hover:text-blue-600" href="/privacy-policy">
                            Privacy Policy
                        </Link>
                        <Link className="transition-colors hover:text-blue-600" href="/terms-and-conditions">
                            Terms & Conditions
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}