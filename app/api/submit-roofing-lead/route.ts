import { NextRequest, NextResponse } from 'next/server';

const LEADPROSPER_ROOFING_CONFIG = {
    campaignId: process.env.LEADPROSPER_ROOFING_CAMPAIGN_ID ?? '31310',
    supplierId: process.env.LEADPROSPER_ROOFING_SUPPLIER_ID ?? '97776',
    key: process.env.LEADPROSPER_ROOFING_KEY ?? '6l5ocd0xougqje',
    action: process.env.LEADPROSPER_ROOFING_ACTION ?? '',
    defaultSubId1: process.env.LEADPROSPER_ROOFING_SUBID1 ?? 'default',
    defaultSubId2: process.env.LEADPROSPER_ROOFING_SUBID2 ?? '',
};

const ALLOWED_PROJECT_TYPES = new Set(['Installation', 'Replacement', 'Repair']);
const ALLOWED_ROOF_MATERIALS = new Set([
    'Asphalt Shingles',
    'Metal',
    'Tile',
    'Wood Shake',
    'Composite',
    'Natural Slate',
]);
const ALLOWED_HOMEOWNER_VALUES = new Set(['Yes', 'No']);

const sanitizeSubId = (value: unknown, fallback: string) => {
    const subId = (value ?? '').toString().trim();
    return (subId || fallback).slice(0, 75);
};

const normalizePhone = (value: string) => value.replace(/\D/g, '');

const mapProjectType = (projectType: string) => {
    if (ALLOWED_PROJECT_TYPES.has(projectType)) {
        return projectType;
    }
    const normalized = (projectType || '').toLowerCase();
    if (normalized.includes('install')) return 'Installation';
    if (normalized.includes('repair')) return 'Repair';
    return 'Replacement';
};

const mapRoofMaterial = (value: string) => {
    if (ALLOWED_ROOF_MATERIALS.has(value)) {
        return value;
    }
    const normalized = (value || '').toLowerCase();
    if (normalized.includes('asphalt')) return 'Asphalt Shingles';
    if (normalized.includes('metal')) return 'Metal';
    if (normalized.includes('tile')) return 'Tile';
    if (normalized.includes('shake') || normalized.includes('wood')) return 'Wood Shake';
    if (normalized.includes('composite') || normalized.includes('synthetic')) return 'Composite';
    if (normalized.includes('slate')) return 'Natural Slate';
    return 'Asphalt Shingles';
};

const mapHomeowner = (value: string) => (ALLOWED_HOMEOWNER_VALUES.has(value) ? value : 'No');

const detectClientIp = (request: NextRequest) =>
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || request.headers.get('cf-connecting-ip')
    || request.headers.get('x-client-ip')
    || request.headers.get('fastly-client-ip')
    || request.headers.get('remote-addr')
    || '0.0.0.0';

const detectUserAgent = (request: NextRequest) =>
    request.headers.get('user-agent')
    || request.headers.get('User-Agent')
    || 'unknown';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const requiredFields = [
            'firstName',
            'lastName',
            'phone',
            'email',
            'zipCode',
            'state',
            'homeOwnership',
            'projectType',
            'roofType',
            'address',
            'city',
        ];

        const missingFields = requiredFields.filter(field => !body[field]);
        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 },
            );
        }

        if (!body.tcpaConsent) {
            return NextResponse.json(
                { error: 'TCPA consent is required' },
                { status: 400 },
            );
        }

        const tcpaText = process.env.NEXT_PUBLIC_TCPA;
        if (!tcpaText) {
            return NextResponse.json(
                { error: 'TCPA text is not configured on the server' },
                { status: 500 },
            );
        }

        const trustedFormToken = body.trustedFormToken || '';
        if (!trustedFormToken) {
            return NextResponse.json(
                { error: 'TrustedForm certificate URL is required' },
                { status: 400 },
            );
        }

        const jornayaLeadId = body.leadidToken || '';
        if (!jornayaLeadId) {
            return NextResponse.json(
                { error: 'Jornaya LeadID token is required' },
                { status: 400 },
            );
        }

        const landingPageUrl = body.landingPage || request.headers.get('referer') || '';
        if (!landingPageUrl) {
            return NextResponse.json(
                { error: 'Landing page URL is required' },
                { status: 400 },
            );
        }

        const zipCode = (body.zipCode ?? '').toString().trim();
        if (!/^\d{5}$/.test(zipCode)) {
            return NextResponse.json(
                { error: 'ZIP code must be a 5-digit value' },
                { status: 400 },
            );
        }

        const normalizedPhone = normalizePhone(body.phone || '');
        if (normalizedPhone.length < 10) {
            return NextResponse.json(
                { error: 'Phone number must contain at least 10 digits' },
                { status: 400 },
            );
        }
        const formattedPhone = normalizedPhone.slice(-10);

        const state = (body.state || '').toString().trim().toUpperCase();
        if (!/^[A-Z]{2}$/.test(state)) {
            return NextResponse.json(
                { error: 'State must be a valid 2-letter abbreviation' },
                { status: 400 },
            );
        }

        const lpSubId1 = sanitizeSubId(body.s1 ?? body.lp_subid1, LEADPROSPER_ROOFING_CONFIG.defaultSubId1);
        const lpSubId2 = sanitizeSubId(body.s2 ?? body.lp_subid2 ?? body.s3, LEADPROSPER_ROOFING_CONFIG.defaultSubId2);
        const lpAction = (body.lp_action ?? LEADPROSPER_ROOFING_CONFIG.action).toString().trim();

        const payload: Record<string, string> = {
            lp_campaign_id: LEADPROSPER_ROOFING_CONFIG.campaignId,
            lp_supplier_id: LEADPROSPER_ROOFING_CONFIG.supplierId,
            lp_key: LEADPROSPER_ROOFING_CONFIG.key,
            lp_subid1: lpSubId1,
            first_name: body.firstName.toString().trim(),
            last_name: body.lastName.toString().trim(),
            email: body.email.toString().trim(),
            phone: formattedPhone,
            address: body.address.toString().trim(),
            city: body.city.toString().trim(),
            state,
            zip_code: zipCode,
            ip_address: detectClientIp(request),
            user_agent: detectUserAgent(request),
            landing_page_url: landingPageUrl,
            jornaya_leadid: jornayaLeadId,
            trustedform_cert_url: trustedFormToken,
            tcpa_text: tcpaText,
            type_of_project: mapProjectType(body.projectType),
            roof_material: mapRoofMaterial(body.roofType),
            homeowner: mapHomeowner(body.homeOwnership),
        };

        if (lpAction) {
            payload.lp_action = lpAction;
        }

        if (lpSubId2) {
            payload.lp_subid2 = lpSubId2;
        }

        if (body.ip_address) {
            payload.ip_address = body.ip_address.toString();
        }

        if (body.user_agent) {
            payload.user_agent = body.user_agent.toString();
        }

        const response = await fetch('https://api.leadprosper.io/direct_post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const responseText = await response.text();
        try {
            const json = JSON.parse(responseText);
            return NextResponse.json(json, { status: response.status });
        } catch {
            return new NextResponse(responseText, {
                status: response.status,
                headers: { 'Content-Type': 'text/plain' },
            });
        }
    } catch (error) {
        console.error('LeadProsper roofing submission failed:', error);
        return NextResponse.json(
            { error: 'Failed to submit lead' },
            { status: 500 },
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Roofing LeadProsper endpoint is online',
        timestamp: new Date().toISOString(),
    });
}