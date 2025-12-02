"use client";

export default function AppLogo({ size = 40 }: { size?: number }) {
    const getLogoPath = () => {
        const vertical = process.env.NEXT_PUBLIC_LEAD_VERTICAL;

        // Map verticals to their logo files
        const logoMap: Record<string, string> = {
            "bathroom": "/logos/logo.png",
            "new-bathroom": "/logos/logo.png",
            "flooring": "/logos/logo.png",
            "new-flooring": "/logos/logo.png",
            "roofing": "/logos/logo.png",
            "new-roofing": "/logos/logo.png",
            "windows": "/logos/logo.png",
            "new-windows": "/logos/logo.png",
            "solar": "/logos/logo.png",
            "new-solar": "/logos/logo.png",
        };

        // Return specific logo if vertical matches, otherwise default logo
        return logoMap[vertical || ""] || "/logos/logo.png";
    };

    const getLogoAlt = () => {
        const vertical = process.env.NEXT_PUBLIC_LEAD_VERTICAL;

        const altMap: Record<string, string> = {
            "bathroom": "Bathroom Remodeling",
            "new-bathroom": "Bathroom Remodeling",
            "flooring": "Flooring Services",
            "new-flooring": "Flooring Services",
            "roofing": "Roofing Services",
            "new-roofing": "Roofing Services",
            "windows": "Windows Installation",
            "new-windows": "Windows Installation",
            "solar": "Solar Services",
            "new-solar": "Solar Services",
        };

        return altMap[vertical || ""] || "trafficom.co";
    };

    return (
        <img
            alt={getLogoAlt()}
            className="object-contain rounded-md"
            height={size}
            src={getLogoPath()}
            width={size}
        />
    );
}