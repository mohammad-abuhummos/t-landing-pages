"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface HeroSectionProps {
    defaultImage: string;
    heroKey: string;
    subtitle: string;
    title: string;
}

const uploaderBase = (process.env.NEXT_PUBLIC_UPLOADER_URL || "").trim().replace(/\/+$/, "");

function resolveImageSource(raw: string): string {
    const value = (raw || "").trim();

    if (!value) return "";
    if (/^https?:\/\//i.test(value)) return value;
    if (value.startsWith("/")) return value;
    if (!uploaderBase) return value;
    const normalized = value.replace(/^\/+/, "").replace(/^files\//i, "");

    return `${uploaderBase}/files/${normalized}`;
}

export default function HeroSection({ defaultImage, heroKey, subtitle, title }: HeroSectionProps) {
    const [heroes, setHeroes] = useState<Record<string, string>>({});
    const [resolvedUrl, setResolvedUrl] = useState<string>("");
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        let cancelled = false;

        fetch("/api/admin/heroes")
            .then((r) => r.json())
            .then((data) => {
                if (!cancelled) {
                    setHeroes(data || {});
                }
            })
            .catch(() => {
                // Ignore fetch errors; fallback image logic below will handle visuals
            });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        let cancelled = false;
        const fallbackUrl = resolveImageSource(defaultImage);
        const candidateUrl = resolveImageSource(heroes[heroKey] || "");

        const loadImageWithFallback = (primary: string, fallback?: string) => {
            if (!primary) {
                if (fallback && fallback !== primary) {
                    loadImageWithFallback(fallback);
                } else if (!cancelled) {
                    setResolvedUrl("");
                    setLoaded(false);
                }

                return;
            }

            const img = new Image();

            img.onload = () => {
                if (!cancelled) {
                    setResolvedUrl(primary);
                    setLoaded(true);
                }
            };
            img.onerror = () => {
                if (fallback && fallback !== primary) {
                    loadImageWithFallback(fallback);
                } else if (!cancelled) {
                    setResolvedUrl("");
                    setLoaded(false);
                }
            };
            img.src = primary;
        };

        setResolvedUrl("");
        setLoaded(false);
        const fallbackCandidate = fallbackUrl !== candidateUrl ? fallbackUrl : undefined;

        if (candidateUrl) {
            loadImageWithFallback(candidateUrl, fallbackCandidate);
        } else if (fallbackUrl) {
            loadImageWithFallback(fallbackUrl);
        } else {
            setResolvedUrl("");
            setLoaded(false);
        }

        return () => {
            cancelled = true;
        };
    }, [heroKey, heroes, defaultImage]);

    return (
        <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={loaded && resolvedUrl ? { backgroundImage: `url('${resolvedUrl}')` } : { backgroundImage: "none", backgroundColor: "#f3e8ff" }}
        >
            {/* Modern overlay with radial gradient and subtle purple tint */}
            <motion.div
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-black/50 via-purple-900/40 to-black/70"
                initial={{ opacity: 0 }}
                style={{
                    background: `
                        radial-gradient(circle at 50% 40%, rgba(147, 51, 234, 0.2) 0%, transparent 50%),
                        linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.8) 100%)
                    `
                }}
                transition={{ duration: 0.8 }}
            />
        </div>
    );
}
