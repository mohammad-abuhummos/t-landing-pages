"use client";

import { useState, useMemo } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface Partner {
    name: string;
    url?: string;
}

interface PartnersListProps {
    partners: Partner[];
}

export default function PartnersList({ partners }: PartnersListProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPartners = useMemo(() => {
        if (!searchQuery.trim()) {
            return partners;
        }

        const query = searchQuery.toLowerCase();

        return partners.filter((partner) =>
            partner.name.toLowerCase().includes(query)
        );
    }, [partners, searchQuery]);

    return (
        <>
            {/* Search Section */}
            <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        className="block w-full pl-12 pr-12 py-4 text-base border border-gray-300 rounded-2xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                        placeholder="Search partners..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={() => setSearchQuery("")}
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>
                {searchQuery && (
                    <p className="mt-3 text-sm text-gray-600 text-center">
                        Found {filteredPartners.length} partner{filteredPartners.length !== 1 ? 's' : ''}
                    </p>
                )}
            </div>

            {/* Partners Grid */}
            <div className="max-w-6xl mx-auto mb-16">
                {filteredPartners.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredPartners.map(({ name, url }, index) => {
                            const raw = (url || "").trim();
                            const hasUrl = !!raw;
                            const href = hasUrl && !/^https?:\/\//i.test(raw) ? `https://${raw}` : raw;

                            return (
                                <div
                                    key={name}
                                    className="group relative animate-in fade-in slide-in-from-bottom-4"
                                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                                >
                                    {hasUrl ? (
                                        <a
                                            className="block relative overflow-hidden p-6 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300 hover:-translate-y-1"
                                            href={href}
                                            rel="noopener noreferrer"
                                            target="_blank"
                                        >
                                            <div className="relative z-10 flex items-center justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                                        {name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1">View website</p>
                                                </div>
                                                <div className="flex-shrink-0 relative text-blue-500 group-hover:text-blue-600 transition-colors duration-300 group-hover:scale-110">
                                                    <svg className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                                        </a>
                                    ) : (
                                        <div className="p-6 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                        {name}
                                                    </h3>
                                                    <p className="text-sm text-gray-400 mt-1">Partner</p>
                                                </div>
                                                <div className="flex-shrink-0 relative text-gray-400">
                                                    <svg className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No partners found</h3>
                        <p className="text-gray-600">
                            Try adjusting your search terms
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

