import { NextRequest, NextResponse } from 'next/server';

import { getCollection } from '@/lib/mongo';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const requiredFields = [
            'firstName', 'lastName', 'phone', 'email', 'zipCode', 'state',
            'homeOwnership', 'projectType',
        ];

        const missingFields = requiredFields.filter(field => !body[field]);

        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        // Validate TCPA consent
        if (!body.tcpaConsent) {
            return NextResponse.json(
                { error: 'TCPA consent is required' },
                { status: 400 }
            );
        }

        // Capture client IP address from request headers
        const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            request.headers.get('x-real-ip') ||
            request.headers.get('cf-connecting-ip') || // Cloudflare
            request.headers.get('x-client-ip') ||
            'unknown';

        console.log('Client IP detected:', clientIP);

        // Prepare lead data
        const leadData = {
            // Personal Information
            firstName: body.firstName,
            lastName: body.lastName,
            phone: body.phone,
            email: body.email,

            // Location
            zipCode: body.zipCode,
            state: body.state,
            city: body.city || null,
            address: body.address || null,
            // Project Details
            homeOwnership: body.homeOwnership,
            projectType: body.projectType,
            // counterTops: body.counterTops,

            // Compliance
            tcpaConsent: process.env.NEXT_PUBLIC_TCPA,
            trustedFormToken: body.trustedFormToken || '',
            jornayaLeadId: body.leadidToken || '',

            landingPage: body.landingPage,
            // URL Parameters
            s1: body.s1 || '',
            s2: body.s2 || '',
            s3: body.s3 || '',
            // Metadata
            submittedAt: body.submittedAt || new Date().toISOString(),
            source: 'bathroom_landing_page',
            userAgent: request.headers.get('user-agent') || '',
            ipAddress: clientIP,
        };

        // Log the lead (in production, you'd save to database or send to CRM)
        // console.log('New lead submitted:', leadData);

        // Here you would typically:
        // 1. Save to your database
        // 2. Send to your CRM system  
        // 3. Send email notifications
        // 4. Integrate with other marketing tools

        // Example: Send to external CRM or lead management system
        // await sendToCRM(leadData);

        // Prepare trafficom.co API data
        console.log('Client IP detected:', clientIP);
        // Resolve SRC from s1 mapping (bathroom vertical), fallback to env
        const s1Value = (leadData.s1 || '').toString();
        const configs = await getCollection<{ _id: string; data: Record<string, any> }>('configs');
        const srcDoc = await configs.findOne({ _id: 'srcMap' });
        const runtimeSrcMap = (srcDoc?.data || {}) as Record<string, any>;
        const mappedSrc = (runtimeSrcMap as any).bathroom?.[s1Value] || (runtimeSrcMap as any).global?.[s1Value] || process.env.LEAD_API_SRC;
        const leadApiData = {
            Request: {
                Key: body.Key || process.env.LEAD_API_KEY,
                API_Action: body.API_Action || 'pingPostLead',
                Mode: body.Mode || 'full',
                TYPE: body.TYPE || process.env.LEAD_API_TYPE,
                SRC: body.SRC || mappedSrc,
                Address: leadData.address,
                City: leadData.city,
                IP_Address: clientIP,
                Email: leadData.email,
                First_Name: leadData.firstName,
                Landing_Page: leadData.landingPage,
                Last_Name: leadData.lastName,
                Homeowner: leadData.homeOwnership,
                Primary_Phone: leadData.phone,
                Project_Type: leadData.projectType,
                State: leadData.state,
                Zip: leadData.zipCode,
                TCPA_Language: leadData.tcpaConsent,
                Trusted_Form_URL: leadData.trustedFormToken,
                LeadiD_Token: body.leadidToken || leadData.jornayaLeadId,
                User_Agent: leadData.userAgent,
            }
        };

        const leadApiResponse = await fetch("https://trafficom.leadportal.com/apiJSON.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(leadApiData),
        });

        const responseText = await leadApiResponse.text();
        try {
            const json = JSON.parse(responseText);
            return NextResponse.json(json, { status: leadApiResponse.status });
        } catch {
            return new NextResponse(responseText, {
                status: leadApiResponse.status,
                headers: { "Content-Type": "text/plain" },
            });
        }

    } catch (error) {
        console.error("Server error:", error);

        return NextResponse.json(
            { error: "Failed to submit lead" },
            { status: 500 }
        );
    }
}

// Optional: Add GET method for testing
export async function GET() {
    return NextResponse.json({
        message: 'Bath lead submission endpoint is working',
        timestamp: new Date().toISOString()
    });
}