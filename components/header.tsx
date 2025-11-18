"use client";

import Link from "next/link";

import AppLogo from "./logo";

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

export default function Header() {

    return (
        <header className="bg-white/95 backdrop-blur-md shadow-lg shadow-purple-500/10 fixed w-full top-0 z-50 border-b border-purple-100 transition-all duration-300">
            <nav className="container px-6 mx-auto">
                <div className="flex items-center justify-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link className="block group transition-all duration-300 hover:scale-105 hover:opacity-90" href="/">
                            <AppLogo size={220} />
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
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