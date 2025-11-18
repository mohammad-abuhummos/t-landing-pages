"use client";

import { useMemo } from 'react';

interface TCPAProps {
    className?: string;
    enableLinks?: boolean;
}

export default function TCPA({ className = "", enableLinks = false }: TCPAProps) {
    const tcpaText = process.env.NEXT_PUBLIC_TCPA || '';

    const processedText = useMemo(() => {
        if (!tcpaText) return null;

        // Define text-to-link mappings
        const linkMappings = [
            { text: 'Privacy Policy', href: '/privacy-policy' },
            { text: 'Terms And Conditions', href: '/terms-and-conditions' },
            { text: 'Terms and Conditions', href: '/terms-and-conditions' },
            { text: 'California Residents Privacy Notice', href: '/privacy-policy#california' },
        ];

        // Create a regex pattern that matches all the link texts
        const linkTexts = linkMappings.map(mapping => mapping.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const linkRegex = new RegExp(`(${linkTexts.join('|')})`, 'gi');

        // Split text by link phrases
        const parts = tcpaText.split(linkRegex);

        return parts.map((part, index) => {
            // Check if this part matches any of our link mappings
            const linkMapping = linkMappings.find(mapping =>
                mapping.text.toLowerCase() === part.toLowerCase()
            );

            if (linkMapping && enableLinks) {
                return (
                    <a
                        key={index}
                        className="text-blue-600 transition-colors duration-200 hover:text-blue-800 hover:underline"
                        href={linkMapping.href}
                    >
                        {part}
                    </a>
                );
            }

            // Regular text - convert line breaks to <br> tags
            return part.split('\n').map((line, lineIndex, lines) => (
                <span key={`${index}-${lineIndex}`}>
                    {line}
                    {lineIndex < lines.length - 1 && <br />}
                </span>
            ));
        });
    }, [tcpaText]);

    if (!tcpaText) {
        return (
            <div className={`text-sm italic text-gray-500 ${className}`} id="tcpa">
                TCPA text not configured
            </div>
        );
    }

    return (
        <div className={`leading-relaxed text-gray-700 text-[11px] transition-all duration-200 ${className}`}>
            {enableLinks ? processedText : tcpaText}
        </div>
    );
}













