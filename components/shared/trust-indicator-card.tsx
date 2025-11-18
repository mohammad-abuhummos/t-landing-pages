import React from "react";

interface TrustIndicatorCardProps {
    icon: React.ReactNode;
    value: string;
    label: string;
}

export default function TrustIndicatorCard({ icon, label, value }: TrustIndicatorCardProps) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-4 border border-gray-100">
            <div className="bg-[#0661ea]/10 text-[#0661ea] p-3 rounded-full">
                {icon}
            </div>
            <div>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                <p className="text-base text-gray-600">{label}</p>
            </div>
        </div>
    );
}

