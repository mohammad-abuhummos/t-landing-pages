"use client";

export default function AppLogo({ size = 40 }: { size?: number }) {
    const getLogoPath = () => {
        const vertical = process.env.NEXT_PUBLIC_LEAD_VERTICAL;

        // Map verticals to their logo files
        const logoMap: Record<string, string> = {
            "bathroom": "/logos/bathroom.png",
            "new-bathroom": "/logos/bathroom.png",
            "flooring": "/logos/flooring.png",
            "new-flooring": "/logo.svg",
            "roofing": "/logos/roofing.png",
            "new-roofing": "/logo.svg",
            "windows": "/logos/windows.png",
            "new-windows": "/logos/windows.png",
            "solar": "/logos/solar.png",
            "new-solar": "/logos/solar.png",
        };

        // Return specific logo if vertical matches, otherwise default logo
        return logoMap[vertical || ""] || "/trafficom-icon-svg.svg";
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