"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import TCPA from "../tcpa";

interface FormData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    zipCode: string;
    city: string;
    state: string;
    homeOwnership: string;
    projectType: string;
    propertyType: string;
    roofType: string;
    tcpaConsent: boolean;
}

export default function RoofingLeadForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        address: "",
        zipCode: "",
        city: "",
        state: "",
        homeOwnership: "Yes",
        projectType: "",
        propertyType: "Single Family Home",
        roofType: "",
        tcpaConsent: false,
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [landingPage, setLandingPage] = useState("");
    const [clientIP, setClientIP] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [urlParams, setUrlParams] = useState({ s1: "", s2: "", s3: "" });

    const formRef = useRef<HTMLFormElement>(null);
    const continueButtonRef = useRef<HTMLButtonElement>(null);
    const submitButtonRef = useRef<HTMLButtonElement>(null);
    const [backupLedID, setBackupLedID] = useState<null | string>(null);

    useEffect(() => {
        setTimeout(() => {
            const leadidToken = document.querySelector('input[name="leadid_token"]') as HTMLInputElement;

            if (!!leadidToken && leadidToken.value !== "") {
                setBackupLedID(leadidToken.value);
            }
        }, 2000);
    }, []);

    // Initialize TrustedForm and LeadID tracking
    useEffect(() => {
        // Parse URL parameters s1, s2, s3
        const s1 = searchParams.get('s1') || '';
        const s2 = searchParams.get('s2') || '';
        const s3 = searchParams.get('s3') || '';

        setUrlParams({ s1, s2, s3 });
        console.log('URL Parameters captured:', { s1, s2, s3 });

        // Capture landing page URL
        setLandingPage(window.location.href);

        // Try to get client IP (optional - server will also detect it)
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => setClientIP(data.ip))
            .catch(() => {
                // Fallback - server will detect IP from headers
                console.log('Could not fetch client IP, server will detect it');
            });

        // TrustedForm integration
        const script1 = document.createElement("script");

        script1.src = "https://api.trustedform.com/trustedform.js";
        script1.async = true;
        document.head.appendChild(script1);

        // LeadID integration
        const leadIdScript = document.createElement("script");

        leadIdScript.id = "LeadiDscript";
        leadIdScript.type = "text/javascript";
        leadIdScript.innerHTML = `
            (function() {
                var s = document.createElement('script');
                s.id = 'LeadiDscript_campaign';
                s.type = 'text/javascript';
                s.async = true;
                s.src = '//create.lidstatic.com/campaign/50d18610-e85e-48ee-997c-962aefbd3d9a.js?snippet_version=2';
                var LeadiDscript = document.getElementById('LeadiDscript');
                LeadiDscript.parentNode.insertBefore(s, LeadiDscript);
            })();
        `;
        document.head.appendChild(leadIdScript);

        // Add noscript fallback for LeadID
        const noscriptImg = document.createElement("noscript");

        noscriptImg.innerHTML = `<img src='//create.leadid.com/noscript.gif?lac=1C241B31-584F-248C-DC76-CD7B7B3A6912&lck=50d18610-e85e-48ee-997c-962aefbd3d9a&snippet_version=2' />`;
        document.body.appendChild(noscriptImg);

        return () => {
            // Cleanup scripts on unmount
            const scripts = document.querySelectorAll(
                'script[src*="trustedform"], script[id="LeadiDscript"], script[id="LeadiDscript_campaign"]',
            );

            scripts.forEach((script) => script.remove());

            // Cleanup noscript elements
            const noscripts = document.querySelectorAll('noscript');

            noscripts.forEach((noscript) => {
                if (noscript.innerHTML.includes('create.leadid.com')) {
                    noscript.remove();
                }
            });
        };
    }, []);

    // Handle Enter key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (currentStep === 5) {
                    // Last step - trigger submit
                    if (submitButtonRef.current && canSubmit() && !isSubmitting) {
                        submitButtonRef.current.click();
                    }
                } else {
                    // Other steps - focus continue button
                    if (continueButtonRef.current) {
                        continueButtonRef.current.focus();
                        if ((currentStep === 1 && canProceedStep1()) ||
                            (currentStep === 2 && canProceedStep2()) ||
                            (currentStep === 3 && canProceedStep3()) ||
                            (currentStep === 4 && canProceedStep4())) {
                            continueButtonRef.current.click();
                        }
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [currentStep, formData, isSubmitting]);

    const scrollToError = (errors: Record<string, string>) => {
        // Define the order of fields to check for errors
        const fieldOrder = ['firstName', 'lastName', 'phone', 'email', 'address', 'city', 'state', 'tcpaConsent'];

        // Find the first field with an error
        const firstErrorField = fieldOrder.find(field => errors[field]);

        if (firstErrorField) {
            // Try to find the input element first, then the error message
            const inputElement = document.getElementById(firstErrorField) ||
                document.querySelector(`[name="${firstErrorField}"]`) ||
                document.querySelector(`#${firstErrorField}`);

            if (inputElement) {
                inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Focus the input if it's focusable
                if (inputElement instanceof HTMLInputElement || inputElement instanceof HTMLSelectElement) {
                    setTimeout(() => inputElement.focus(), 300);
                }
            } else {
                // Fallback to error message
                const errorElement = document.querySelector('.error-message');

                if (errorElement) {
                    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
    };

    const validateStep = (step: number): Record<string, string> => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!formData.zipCode || formData.zipCode.length !== 5) {
                newErrors.zipCode = 'Please enter a valid 5-digit ZIP code';
            }
        } else if (step === 2) {
            if (!formData.homeOwnership) {
                newErrors.homeOwnership = 'Please select home ownership status';
            }
        } else if (step === 3) {
            if (!formData.projectType) {
                newErrors.projectType = 'Please select project type';
            }
        } else if (step === 4) {
            if (!formData.roofType) {
                newErrors.roofType = 'Please select roof type';
            }
        } else if (step === 5) {
            if (!formData.firstName.trim()) {
                newErrors.firstName = 'First name is required';
            }
            if (!formData.lastName.trim()) {
                newErrors.lastName = 'Last name is required';
            }
            if (!formData.phone.trim()) {
                newErrors.phone = 'Phone number is required';
            }
            if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Valid email is required';
            }
            if (!formData.address.trim()) {
                newErrors.address = 'Street address is required';
            }
            if (!formData.city.trim()) {
                newErrors.city = 'City is required';
            }
            if (!formData.state) {
                newErrors.state = 'State is required';
            }
            if (!formData.tcpaConsent) {
                newErrors.tcpaConsent = 'Please agree to the terms and conditions to proceed';
            }
        }

        return newErrors;
    };

    const nextStep = () => {
        const stepErrors = validateStep(currentStep);

        setErrors(stepErrors);

        if (Object.keys(stepErrors).length === 0 && currentStep < 5) {
            setCurrentStep(currentStep + 1);
        } else if (Object.keys(stepErrors).length > 0) {
            setTimeout(() => scrollToError(stepErrors), 100);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setErrors({});
        }
    };

    const canProceedStep1 = () => {
        return formData.zipCode.length === 5;
    };

    const canProceedStep2 = () => {
        return formData.homeOwnership;
    };

    const canProceedStep3 = () => {
        return formData.projectType;
    };

    const canProceedStep4 = () => {
        return formData.roofType;
    };

    const canSubmit = () => {
        return formData.firstName && formData.lastName && formData.phone &&
            formData.email && formData.address && formData.city && formData.state && formData.tcpaConsent;
    };

    const handleInputChange = (
        field: keyof FormData,
        value: string | boolean,
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }

        // Real-time validation for ZIP code
        if (field === 'zipCode' && typeof value === 'string') {
            if (value.length > 0 && value.length < 5) {
                setErrors(prev => ({
                    ...prev,
                    zipCode: 'ZIP code must be 5 digits'
                }));
            } else if (value.length === 5) {
                setErrors(prev => ({
                    ...prev,
                    zipCode: ''
                }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const stepErrors = validateStep(5);

        setErrors(stepErrors);

        if (Object.keys(stepErrors).length > 0) {
            setTimeout(() => scrollToError(stepErrors), 100);

            return;
        }

        setIsSubmitting(true);

        const trustedFormToken = document.querySelector('input[name="xxTrustedFormCertUrl"]') as HTMLInputElement;
        const leadidToken = document.querySelector('input[name="leadid_token"]') as HTMLInputElement;

        const submissionData = {
            ...formData,
            trustedFormToken: trustedFormToken?.value || '',
            leadidToken: leadidToken?.value || backupLedID || '',
            landingPage,
            clientIP: clientIP, // Optional - server will also detect IP
            submittedAt: new Date().toISOString(),
            // Include URL parameters
            s1: urlParams.s1,
            s2: urlParams.s2,
            s3: urlParams.s3,
        };

        try {
            const response = await fetch("/api/submit-roofing-lead", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submissionData),
            });

            console.log(response)
            if (response.status == 200) {
                // Redirect to thank you page
                router.push('/thank-you');
            } else {
                throw new Error("Submission failed");
            }
        } catch (error) {
            console.error("Form submission error:", error);
            const submitError = { submit: "There was an error submitting your request. Please try again." };

            setErrors(submitError);
            setTimeout(() => scrollToError(submitError), 100);
        } finally {
            setIsSubmitting(false);
        }
    };

    const ErrorMessage = ({ message }: { message: string }) => (
        <div className="px-3 py-2 mt-1 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200 error-message">
            {message}
        </div>
    );

    const homeOwnershipOptions = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
        { value: "Authorized to make changes", label: "Authorized to make changes" },
    ];

    const projectTypeOptions = [
        { value: "Installation", label: "Installation" },
        { value: "Replacement", label: "Replacement" },
        { value: "Repair", label: "Repair" },
    ];

    const propertyTypeOptions = [
        { value: "Single Family Home", label: "Single Family Home" },
    ];

    const roofTypeOptions = [
        { value: "Asphalt Shingles", label: "Asphalt Shingles" },
        { value: "Metal", label: "Metal" },
        { value: "Tile", label: "Tile" },
        { value: "Cedar Shake", label: "Cedar Shake" },
        { value: "Natural Slate", label: "Natural Slate" },
    ];

    const usStates = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
    ];

    // Enhanced step indicator with modern UI
    const renderStepIndicator = () => (
        <div className="mb-2">
            <div className="mt-2">
                <div className="overflow-hidden mx-auto max-w-md h-2 bg-gray-200 rounded-full">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-900 transition-all duration-500 ease-out"
                        style={{ width: `${(currentStep / 5) * 100}%` }}
                    />
                    <p className="mt-3 text-sm font-medium text-center text-gray-500">
                        Step {currentStep} of 5
                    </p>
                </div>
            </div>
        </div>
    );

    // Step 1: Location (Zip Code) - Enhanced UI
    const renderStep1 = () => (
        <div className="mx-auto space-y-8 max-w-sm text-center animate-fadeIn">
            <div className="space-y-3">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-purple-800 transition-all duration-300">
                    Where&#39;s Your Roofing Project?
                </h3>
                <p className="text-base text-gray-600 transition-all duration-300">
                    Connect with licensed roofing experts in your local area
                </p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700" htmlFor="zipCodeInput">
                        ZIP Code *
                    </label>
                    <input
                        className={`px-6 py-4 w-full text-2xl font-bold text-center rounded-2xl shadow-sm backdrop-blur-sm transition-all duration-300 outline-none border-3 focus:ring-4 hover:shadow-md bg-white/80 ${errors.zipCode
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                            : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100 hover:border-purple-300'
                            }`}
                        id="zipCodeInput"
                        maxLength={5}
                        placeholder="12345"
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value.replace(/\D/g, ''))}
                    />
                    {errors.zipCode && <ErrorMessage message={errors.zipCode} />}
                </div>

                <button
                    ref={continueButtonRef}
                    className={`w-full py-4 px-6 text-lg font-bold rounded-2xl transition-all duration-300 transform ${canProceedStep1()
                        ? 'text-white bg-gradient-to-r from-purple-500 to-purple-900 shadow-lg hover:from-purple-700 hover:to-purple-800 hover:shadow-xl hover:scale-105 active:scale-95'
                        : 'text-gray-400 bg-gray-200 cursor-not-allowed opacity-60'
                        }`}
                    disabled={!canProceedStep1()}
                    type="button"
                    onClick={nextStep}
                >
                    Continue →
                </button>
            </div>
        </div>
    );

    // Step 2: Home Ownership
    const renderStep2 = () => (
        <div className="mx-auto space-y-8 max-w-md text-center animate-fadeIn">
            <div className="space-y-3">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-purple-800 transition-all duration-300">
                    Are you a Homeowner?
                </h3>
                <p className="text-base text-gray-600 transition-all duration-300">
                    This helps us match you with the right roofing professionals
                </p>
            </div>

            <div className="space-y-4">
                {homeOwnershipOptions.map((option) => (
                    <button
                        key={option.value}
                        className={`p-5 w-full text-left rounded-2xl border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 active:scale-95 ${formData.homeOwnership === option.value
                            ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-purple-50 text-purple-700 shadow-lg ring-2 ring-purple-200'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-purple-50/30'
                            }`}
                        type="button"
                        onClick={() => {
                            handleInputChange("homeOwnership", option.value);
                            // Auto-advance to next step
                            setTimeout(() => setCurrentStep(3), 200);
                        }}
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-medium">{option.label}</span>
                            {formData.homeOwnership === option.value && (
                                <div className="flex justify-center items-center w-6 h-6 bg-purple-500 rounded-full">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>
            {errors.homeOwnership && <ErrorMessage message={errors.homeOwnership} />}

            <div className="flex justify-start pt-4">
                <button
                    className="px-6 py-3 text-lg font-semibold text-gray-600 bg-gray-100 rounded-2xl transition-all duration-300 hover:bg-gray-200 hover:shadow-md active:scale-95"
                    type="button"
                    onClick={prevStep}
                >
                    ← Back
                </button>
            </div>
        </div>
    );

    // Step 3: Project Type
    const renderStep3 = () => (
        <div className="mx-auto space-y-8 max-w-md text-center animate-fadeIn">
            <div className="space-y-3">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-purple-800 transition-all duration-300">
                    What Type of Roofing Work?
                </h3>
                <p className="text-base text-gray-600 transition-all duration-300">
                    Let us know what service you&#39;re looking for
                </p>
            </div>

            <div className="space-y-4">
                {projectTypeOptions.map((option) => (
                    <button
                        key={option.value}
                        className={`p-5 w-full text-left rounded-2xl border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 active:scale-95 ${formData.projectType === option.value
                            ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-purple-50 text-purple-700 shadow-lg ring-2 ring-purple-200'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-purple-50/30'
                            }`}
                        type="button"
                        onClick={() => {
                            handleInputChange("projectType", option.value);
                            // Auto-advance to next step
                            setTimeout(() => setCurrentStep(4), 200);
                        }}
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-medium">{option.label}</span>
                            {formData.projectType === option.value && (
                                <div className="flex justify-center items-center w-6 h-6 bg-purple-500 rounded-full">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>
            {errors.projectType && <ErrorMessage message={errors.projectType} />}

            <div className="flex justify-start pt-4">
                <button
                    className="px-6 py-3 text-lg font-semibold text-gray-600 bg-gray-100 rounded-2xl transition-all duration-300 hover:bg-gray-200 hover:shadow-md active:scale-95"
                    type="button"
                    onClick={prevStep}
                >
                    ← Back
                </button>
            </div>
        </div>
    );

    // Step 4: Roof Type
    const renderStep4 = () => (
        <div className="mx-auto space-y-8 max-w-md text-center animate-fadeIn">
            <div className="space-y-3">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-purple-800 transition-all duration-300">
                    What&#39;s Your Current Roof Material?
                </h3>
                <p className="text-base text-gray-600 transition-all duration-300">
                    Select your existing roof type for accurate estimates
                </p>
            </div>

            <div className="space-y-4">
                {roofTypeOptions.map((option) => (
                    <button
                        key={option.value}
                        className={`p-5 w-full text-left rounded-2xl border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 active:scale-95 ${formData.roofType === option.value
                            ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-purple-50 text-purple-700 shadow-lg ring-2 ring-purple-200'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-purple-50/30'
                            }`}
                        type="button"
                        onClick={() => {
                            handleInputChange("roofType", option.value);
                            // Auto-advance to next step
                            setTimeout(() => setCurrentStep(5), 200);
                        }}
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-medium">{option.label}</span>
                            {formData.roofType === option.value && (
                                <div className="flex justify-center items-center w-6 h-6 bg-purple-500 rounded-full">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>
            {errors.roofType && <ErrorMessage message={errors.roofType} />}

            <div className="flex justify-start pt-4">
                <button
                    className="px-6 py-3 text-lg font-semibold text-gray-600 bg-gray-100 rounded-2xl transition-all duration-300 hover:bg-gray-200 hover:shadow-md active:scale-95"
                    type="button"
                    onClick={prevStep}
                >
                    ← Back
                </button>
            </div>
        </div>
    );

    // Step 5: Contact Information - Enhanced UI
    const renderStep5 = () => (
        <div className="mx-auto space-y-8 max-w-lg animate-fadeIn">
            <div className="space-y-3 text-center">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-purple-800 transition-all duration-300">
                    You&#39;re Almost There!
                </h3>
                <p className="text-base text-gray-600 transition-all duration-300">
                    Share your details to receive competitive roofing quotes
                </p>
            </div>

            {errors.submit && <ErrorMessage message={errors.submit} />}

            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700" htmlFor="firstName">
                            First Name *
                        </label>
                        <input
                            className={`px-4 py-3 w-full rounded-2xl border-2 shadow-sm backdrop-blur-sm transition-all duration-300 outline-none focus:ring-4 hover:shadow-md bg-white/80 ${errors.firstName
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100 hover:border-purple-300'
                                }`}
                            id="firstName"
                            placeholder="John"
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                        />
                        {errors.firstName && <ErrorMessage message={errors.firstName} />}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700" htmlFor="lastName">
                            Last Name *
                        </label>
                        <input
                            className={`px-4 py-3 w-full rounded-2xl border-2 shadow-sm backdrop-blur-sm transition-all duration-300 outline-none focus:ring-4 hover:shadow-md bg-white/80 ${errors.lastName
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100 hover:border-purple-300'
                                }`}
                            id="lastName"
                            placeholder="Smith"
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                        />
                        {errors.lastName && <ErrorMessage message={errors.lastName} />}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700" htmlFor="phone">
                            Phone *
                        </label>
                        <input
                            className={`px-4 py-3 w-full rounded-2xl border-2 shadow-sm backdrop-blur-sm transition-all duration-300 outline-none focus:ring-4 hover:shadow-md bg-white/80 ${errors.phone
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100 hover:border-purple-300'
                                }`}
                            id="phone"
                            placeholder="(555) 123-4567"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                        {errors.phone && <ErrorMessage message={errors.phone} />}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700" htmlFor="email">
                            Email *
                        </label>
                        <input
                            className={`px-4 py-3 w-full rounded-2xl border-2 shadow-sm backdrop-blur-sm transition-all duration-300 outline-none focus:ring-4 hover:shadow-md bg-white/80 ${errors.email
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100 hover:border-purple-300'
                                }`}
                            id="email"
                            placeholder="john@email.com"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                        {errors.email && <ErrorMessage message={errors.email} />}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700" htmlFor="address">
                        Street Address *
                    </label>
                    <input
                        className={`px-4 py-3 w-full rounded-2xl border-2 shadow-sm backdrop-blur-sm transition-all duration-300 outline-none focus:ring-4 hover:shadow-md bg-white/80 ${errors.address
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                            : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100 hover:border-purple-300'
                            }`}
                        id="address"
                        placeholder="123 Main Street"
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                    />
                    {errors.address && <ErrorMessage message={errors.address} />}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700" htmlFor="city">
                            City *
                        </label>
                        <input
                            className={`px-4 py-3 w-full rounded-2xl border-2 shadow-sm backdrop-blur-sm transition-all duration-300 outline-none focus:ring-4 hover:shadow-md bg-white/80 ${errors.city
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100 hover:border-purple-300'
                                }`}
                            id="city"
                            placeholder="Your city"
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                        />
                        {errors.city && <ErrorMessage message={errors.city} />}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700" htmlFor="state">
                            State *
                        </label>
                        <select
                            className={`px-4 py-3 w-full rounded-2xl border-2 shadow-sm backdrop-blur-sm transition-all duration-300 outline-none focus:ring-4 hover:shadow-md bg-white/80 ${errors.state
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100 hover:border-purple-300'
                                }`}
                            id="state"
                            value={formData.state}
                            onChange={(e) => handleInputChange("state", e.target.value)}
                        >
                            <option value="">Select state</option>
                            {usStates.map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                        {errors.state && <ErrorMessage message={errors.state} />}
                    </div>
                </div>

                {/* Enhanced TCPA Consent */}
                <div className={`p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-2xl border-2 shadow-md transition-all duration-300 hover:shadow-lg ${errors.tcpaConsent ? 'border-red-300 ring-2 ring-red-100' : 'border-blue-200/60'
                    }`}>
                    <label className="flex gap-4 items-start cursor-pointer group" htmlFor="tcpaConsent" id="leadid_tcpa_disclosure">
                        <span className="sr-only">I agree to the TCPA terms and consent to be contacted</span>
                        <div className="relative flex-shrink-0">
                            <input
                                checked={formData.tcpaConsent}
                                className={`mt-1 w-5 h-5 text-purple-900 rounded-md border-2 focus:ring-4 transition-all duration-300 cursor-pointer ${errors.tcpaConsent
                                    ? 'border-red-300 focus:ring-red-100'
                                    : 'border-gray-300 focus:ring-purple-500 group-hover:border-purple-400'
                                    }`}
                                id="tcpaConsent"
                                type="checkbox"
                                onChange={(e) => handleInputChange("tcpaConsent", e.target.checked)}
                            />
                        </div>
                        <div className="flex-1">
                            <div className="text-[8px] leading-relaxed text-gray-600">
                                <TCPA />
                            </div>
                        </div>
                    </label>
                    {errors.tcpaConsent && <ErrorMessage message={errors.tcpaConsent} />}
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    className="flex-1 px-4 py-4 text-lg font-semibold text-gray-600 bg-gray-100 rounded-2xl transition-all duration-300 hover:bg-gray-200 hover:shadow-md active:scale-95"
                    type="button"
                    onClick={prevStep}
                >
                    ← Back
                </button>
                <button
                    ref={submitButtonRef}
                    className={`flex-1 py-4 px-4 text-lg font-bold rounded-2xl transition-all duration-300 transform ${!isSubmitting
                        ? 'text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg hover:from-green-600 hover:to-emerald-700 hover:shadow-xl hover:scale-105 active:scale-95'
                        : 'text-gray-400 bg-gray-200 cursor-not-allowed opacity-60'
                        }`}
                    disabled={isSubmitting}
                    id="marketing-theme-submit"
                    type="submit"
                >
                    {isSubmitting ? 'Submitting...' : 'Get My Quote →'}
                </button>
            </div>

            <div className="flex gap-2 justify-center items-center text-sm text-center text-gray-500 transition-all duration-300">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
                <span className="font-medium">Your information is 100% secure and confidential</span>
            </div>
        </div>
    );

    return (
        <div className="py-6">
            {renderStepIndicator()}
            <form ref={formRef} className="" onSubmit={handleSubmit}>
                <input id="leadid_token" name="leadid_token" type="hidden" value="" />

                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
                {currentStep === 5 && renderStep5()}
            </form>
        </div>
    );
}

