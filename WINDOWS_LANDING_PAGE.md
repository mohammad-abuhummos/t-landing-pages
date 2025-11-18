# Windows Landing Page Documentation

## Overview

This landing page is designed to collect leads for window installation, replacement, and repair services. It features a modern, responsive design with a comprehensive lead collection form that includes all necessary compliance features.

## Features

### Lead Collection Form

- Personal Information
  - First Name
  - Last Name
  - Phone Number
- Location Information
  - Zip Code
  - City
  - State
- Project Details
  - Home Ownership Status (Yes/No/Authorized)
  - Number of Windows (1/2/3-5/6-9/10+)
  - Project Type (Installation/Replacement/Repair)
- TCPA Compliance
  - Required consent checkbox
  - Clear disclosure text

### Compliance Integrations

- TrustedForm Integration
  - Captures form certificate for lead verification
  - Automatically initializes on page load
- Jornaya Integration
  - Captures lead ID for tracking
  - Automatically initializes on page load

### API Endpoint

The form submits to `/api/submit-lead` which:

- Validates all required fields
- Verifies TCPA consent
- Captures compliance tokens
- Logs lead data
- Returns success/error response

## Technical Implementation

### Components

1. `app/windows/page.tsx`

   - Main landing page component
   - Hero section with benefits
   - Lead form container
   - Benefits section

2. `components/windows-lead-form.tsx`

   - Form component with all fields
   - Form validation
   - Compliance integrations
   - Submission handling

3. `app/api/submit-lead/route.ts`
   - API endpoint for form submission
   - Data validation
   - Lead processing

### Dependencies

- Next.js 15.3.1
- React 18.3.1
- Tailwind CSS 3.4.16
- TypeScript 5.6.3

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Customization

### Form Fields

To modify form fields, edit the `FormData` interface and form fields in `components/windows-lead-form.tsx`.

### Styling

The page uses Tailwind CSS for styling. Customize colors, spacing, and layout by modifying the className properties.

### Compliance

- TrustedForm script: `https://api.trustedform.com/trustedform.js`
- Jornaya script: `https://snowplow.leadidcollector.azure.leadid.com/leadid-sdk/3/leadid-sdk.js`

## Production Considerations

1. **Lead Processing**

   - Implement database storage
   - Add CRM integration
   - Set up email notifications

2. **Security**

   - Add rate limiting
   - Implement CSRF protection
   - Add input sanitization

3. **Analytics**
   - Add conversion tracking
   - Implement event tracking
   - Set up error monitoring

## Support

For technical support or customization requests, please contact the development team.
