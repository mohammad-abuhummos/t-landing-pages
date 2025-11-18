"use client";

import Link from "next/link";


function getDomainName() {
    const vertical = process.env.NEXT_PUBLIC_LEAD_VERTICAL;

    const domainMap: Record<string, string> = {
        "roofing": "myhomeroof.net",
        "new-roofing": "myhomeroof.net",
        "bathroom": "bathroompros.co",
        "new-bathroom": "bathroompros.co",
        "flooring": "theflooringpros.co",
        "new-flooring": "theflooringpros.co",
        "solar": "myhomesolar.co",
        "windows": "myhomewindows.net",
        "new-windows": "myhomewindows.net",
    };

    return domainMap[vertical || ""] || "trafficom.co";
}

export default function Footer() {
    return (
        <footer className="text-white bg-gradient-to-b from-slate-900 via-slate-950 to-black border-t border-slate-800/50">
            <div className="container px-4 py-12 mx-auto">
                {/* Company Logo and Partners Link */}
                <div className="flex flex-col items-center mb-10">
                    <Link className="flex flex-col items-center gap-3 mb-6 group transition-transform duration-200 hover:scale-105" href="/">
                        {/* <AppLogo size={80} /> */}
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-900 via-purple-500 to-purple-300 bg-clip-text text-transparent">
                            {getDomainName()}
                        </span>
                    </Link>
                    <Link
                        className="text-sm text-gray-400 transition-colors duration-200 hover:text-purple-300"
                        href="/partners"
                    >
                        View Our Partners
                    </Link>
                </div>

                {/* Legal Links */}
                <div className="flex flex-wrap gap-6 justify-center mb-8">
                    <Link className="text-sm text-gray-400 hover:text-purple-300 transition-colors duration-200" href="/privacy-policy">
                        Privacy Policy
                    </Link>
                    <Link className="text-sm text-gray-400 hover:text-purple-300 transition-colors duration-200" href="/terms-and-conditions">
                        Terms of Service
                    </Link>
                </div>

                {/* Copyright */}
                <div className="text-center">
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} trafficom.co. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

// Logo Component
function LogoIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M3 12H21M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12M21 12L17 8M21 12L17 16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
} 