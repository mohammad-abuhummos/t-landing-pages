"use client";

import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function ThankYou() {
    const phoneNumber = "(855) 123-4567"; // Replace with your actual phone number
    const phoneNumberDigits = "8551234567"; // Replace with actual digits

    return (
        <div className="mx-auto max-w-2xl text-center">
            {/* Success Icon */}
            <div className="mb-6">
                <CheckCircleIcon className="mx-auto w-16 h-16 text-green-500" />
            </div>

            {/* Thank You Message */}
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
                Thank You for Your Inquiry!
            </h1>

            <p className="mb-8 text-lg text-gray-600">
                We&apos;ve received your information and our team is reviewing your project details.
            </p>

            {/* Next Steps */}
            <div className="p-6 mb-8 bg-blue-50 rounded-lg">
                <h2 className="mb-4 text-xl font-semibold text-blue-900">
                    What Happens Next?
                </h2>
                <div className="space-y-3 text-left">
                    <div className="flex items-start space-x-3">
                        <div className="flex flex-shrink-0 justify-center items-center w-6 h-6 text-sm font-semibold text-white bg-blue-600 rounded-full">
                            1
                        </div>
                        <p className="text-gray-700">
                            A specialist will contact you within 24 hours to discuss your project and provide a detailed, no-obligation quote.
                        </p>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="flex flex-shrink-0 justify-center items-center w-6 h-6 text-sm font-semibold text-white bg-blue-600 rounded-full">
                            2
                        </div>
                        <p className="text-gray-700">
                            If you choose to move forward, we&apos;ll schedule your service at a convenient time.
                        </p>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            {/* <div className="p-6 mb-8 bg-gray-50 rounded-lg">
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    Need Immediate Assistance?
                </h3>
                <p className="mb-4 text-gray-600">
                    Call our customer service team directly for immediate assistance
                </p>

                <a
                    href={`tel:${phoneNumberDigits}`}
                    className="inline-flex justify-center items-center px-6 py-3 space-x-2 font-semibold text-white bg-green-600 rounded-lg transition duration-200 hover:bg-green-700"
                >
                    <PhoneIcon className="w-5 h-5" />
                    <span className="text-lg">{phoneNumber}</span>
                </a>

                <p className="mt-2 text-sm text-gray-500">
                    Available Monday - Friday, 8 AM - 8 PM EST
                </p>
            </div> */}

            {/* Additional Information */}
            <div className="space-y-4 text-sm text-gray-600">
                <p>
                    <strong>Reference ID:</strong> {new Date().getTime().toString().slice(-6)}
                </p>
                <p>
                    We respect your privacy and will never sell your information to third parties.
                </p>
            </div>

            {/* Back to Home Button */}
            <div className="mt-8">
                <a
                    className="font-medium text-blue-600 underline hover:text-blue-800"
                    href="/"
                >
                    Submit Another Request
                </a>
            </div>
        </div>
    );
} 