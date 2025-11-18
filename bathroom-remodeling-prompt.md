# Bathroom Home Remodeling Landing Page - Complete Clone Prompt

## Project Overview
Create a complete bathroom home remodeling landing page identical to the provided structure with the same functionality, design, and technology stack.

## Technology Stack
- **Framework**: Next.js 15.3.1 with App Router
- **Frontend**: React 18.3.1, TypeScript 5.6.3
- **Styling**: Tailwind CSS 3.4.16
- **Icons**: Heroicons 2.2.0 (React)
- **Animations**: Framer Motion 11.13.1
- **Additional UI Components**: HeroUI (NextUI) components

## Project Structure

### 1. Main Landing Page (`app/bathroom/page.tsx`)
```typescript
// Create a new Next.js page at app/bathroom/page.tsx
// This should be the main bathroom remodeling landing page
```

**Requirements:**
- Hero section with gradient background (`bg-gradient-to-br from-blue-50 via-white to-blue-50/30`)
- Two-column layout (form on left, content on right for desktop)
- Responsive design with mobile-first approach
- Page title: "Transform Your Bathroom with Stunning New Features"
- Hero image: `/assets/bathroom.webp` (800x600px)
- Trust indicators showing:
  - "300+ Bathrooms Remodeled"
  - "4.9★ Customer Rating"
  - "24/7 Support Available"

### 2. Lead Generation Form (`components/forms/bathroom-lead-form.tsx`)
```typescript
// Create a comprehensive multi-step lead form component
```

**Requirements:**
- **Step 1**: ZIP Code entry (5-digit validation, auto-detect state)
- **Step 2**: Home ownership selection (Yes/No/Authorized to make changes)
- **Step 3**: Project type selection (Full Bathroom Remodeling, Bath, Shower, Flooring, Sinks, Toilets, Cabinets, Counter Tops)
- **Step 4**: Contact information (First Name, Last Name, Phone, Email, Street Address, City, State)
- **TCPA Consent**: Checkbox with proper compliance text
- **Form Validation**: Real-time validation with error messages
- **Progress Indicator**: Visual step indicator (1-4)
- **Auto-advance**: Auto-advance between steps 2-3 after selection
- **Enter Key Handling**: Smart Enter key behavior for form progression
- **Responsive Design**: Mobile-optimized form layout

**Form Features:**
- Gradient backgrounds and modern styling
- Smooth animations and transitions
- Error handling with visual feedback
- Form state management with React hooks
- Integration with tracking systems (TrustedForm, LeadID)

### 3. API Route (`app/api/submit-bathroom-lead/route.ts`)
```typescript
// Create API route for lead submission
```

**Requirements:**
- **Method**: POST endpoint at `/api/submit-bathroom-lead`
- **Validation**: Required fields validation
- **IP Detection**: Extract client IP from headers
- **trafficom.co Integration**: Send leads to trafficom.co API
- **Data Mapping**: Map form data to trafficom.co format
- **Error Handling**: Proper error responses
- **Response**: Success/error JSON responses

**Integration Details:**
- trafficom.co API endpoint: `https://trafficom.leadportal.com/apiJSON.php`
- Environment variables for API credentials
- TrustedForm token handling
- LeadID (Jornaya) integration
- URL parameter tracking (s1, s2, s3)

### 4. TCPA Component (`components/tcpa.tsx`)
```typescript
// Create reusable TCPA compliance component
```

**Requirements:**
- Environment variable integration (`NEXT_PUBLIC_TCPA`)
- Link processing for Privacy Policy and Terms & Conditions
- Proper styling and responsive design
- Configurable link enabling

### 5. Supporting Files & Configuration

#### Package Dependencies
```json
{
  "dependencies": {
    "@heroicons/react": "^2.2.0",
    "next": "15.3.1",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "framer-motion": "11.13.1",
    // Add other required dependencies
  }
}
```

#### TypeScript Configuration
```typescript
// Standard Next.js TypeScript config with proper paths
```

#### Tailwind Configuration
```javascript
// Standard Tailwind config with custom colors and gradients
```

### 6. Styling Requirements

#### Color Scheme
- Primary: Blue gradient (`from-[#0062FF] to-blue-600`)
- Background: Light blue gradient (`from-blue-50 via-white to-blue-50/30`)
- Text: Gray scale with proper contrast
- Error: Red accent colors
- Success: Green accent colors

#### Responsive Breakpoints
- Mobile: Single column layout
- Tablet: Adjusted spacing and sizing
- Desktop: Two-column layout (form left, content right)

#### Animations & Effects
- Hover effects on buttons and cards
- Smooth transitions (300ms duration)
- Scale effects on interactive elements
- Gradient backgrounds with proper opacity

### 7. Content & Copy

#### Page Content
- **Headline**: "Transform Your Bathroom with Stunning New Features"
- **Subtitle**: "Experience the luxury of a beautifully remodeled bathroom with professional installation. Enhance your bathroom's beauty, comfort, and value."
- **Benefits Section**:
  - "Luxurious Design" - Upgrade your bathroom with high-quality, luxurious designs
  - "Expert Remodeling" - Certified professionals provide expert remodeling services
  - "Comprehensive Warranty" - Peace of mind with comprehensive warranty coverage

#### Form Copy
- **Step 1**: "Where's Your Project?" - "We'll connect you with certified bathroom remodeling experts nearby"
- **Step 2**: "About Your Property" - "Help us match you with the right professionals for your needs"
- **Step 3**: "Your Dream Bathroom" - "Tell us what bathroom upgrade you have in mind"
- **Step 4**: "Final Step!" - "Enter your contact info to receive free quotes from top-rated pros"

### 8. Integration Requirements

#### Lead Tracking
- **TrustedForm**: Script integration for lead certification
- **LeadID/Jornaya**: Lead validation and fraud prevention
- **URL Parameters**: Track marketing campaign parameters (s1, s2, s3)
- **Landing Page Tracking**: Capture full URL for attribution

#### Data Collection
- Personal information (name, phone, email)
- Location data (address, city, state, ZIP)
- Project details (type, home ownership)
- Compliance data (TCPA consent, trusted form tokens)

### 9. Assets Required

#### Images
- Hero image: `/public/assets/bathroom.webp` (800x600px)
- Logo files: `/public/logos/` directory
- Icon: `/public/Leadsology-icon-svg.svg`

#### Static Files
- US ZIP codes data: `us_zip_codes_states.json`
- US area codes: `us_area_codes_states.json`

### 10. Environment Variables
```bash
# trafficom.co API Configuration
LEAD_API_KEY=your_api_key
LEAD_API_MODE=your_mode
LEAD_API_ACTION=your_action
LEAD_API_TYPE=your_type
LEAD_API_SRC=your_src

# TCPA Text
NEXT_PUBLIC_TCPA=your_tcpa_text

# Testing Mode
NEXT_PUBLIC_API_IS_TESTING=true/false
```

### 11. Deployment Considerations
- **Build Commands**: Standard Next.js build process
- **Environment Setup**: Proper environment variable configuration
- **Static Generation**: Ensure proper static asset handling
- **SEO Optimization**: Meta tags and structured data

## Success Criteria
✅ Complete Next.js application with all components
✅ Responsive design working on all device sizes
✅ Form validation and submission working
✅ Lead tracking integration functional
✅ Styling matches the original design
✅ All animations and interactions working
✅ Proper error handling and user feedback
✅ TCPA compliance properly implemented
✅ Mobile-first responsive design
✅ TypeScript strict mode compliance

## Deliverables
1. Complete Next.js project structure
2. All required components and pages
3. API routes and integrations
4. Configuration files
5. Asset files and data
6. Environment variable template
7. Build and deployment instructions

This prompt provides everything needed to build an exact clone of the bathroom remodeling landing page with all functionality, styling, and integrations intact.
