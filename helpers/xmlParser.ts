// lib/xmlParser.ts

export function parseXmlValue(xml: string, tag: string): string | null {
    const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, 's');
    const match = xml.match(regex);
    return match ? match[1].trim() : null;
}

export function parseLead2PResponse(xml: string) {
    const status = parseXmlValue(xml, 'status');
    const error = parseXmlValue(xml, 'error');
    const leadId = parseXmlValue(xml, 'lead_id');
    const companyName = parseXmlValue(xml, 'company_name');

    return { status, error, leadId, companyName };
}
