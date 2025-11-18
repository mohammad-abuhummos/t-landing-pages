# Analytics Configuration

This project includes global analytics configuration for both Google Tag Manager (GTM) and Smartlook that can be easily managed through environment variables and centralized configuration.

## Configuration

### Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Google Tag Manager Configuration
NEXT_PUBLIC_GTM_ID=GTM-564XGL85
NEXT_PUBLIC_GTM_ENABLED=true

# Smartlook Configuration
NEXT_PUBLIC_SMARTLOOK_KEY=1de90e5707a69e749691832d4ae645e2e192e773
NEXT_PUBLIC_SMARTLOOK_ENABLED=true
NEXT_PUBLIC_SMARTLOOK_REGION=eu
```

### Default Configuration

**Google Tag Manager:**

- **GTM ID**: `GTM-564XGL85`
- **Environment**: Only enabled in production by default
- **Development**: Can be enabled by setting `NEXT_PUBLIC_GTM_ENABLED=true`

**Smartlook:**

- **Project Key**: `1de90e5707a69e749691832d4ae645e2e192e773`
- **Region**: `eu`
- **Environment**: Only enabled in production by default
- **Development**: Can be enabled by setting `NEXT_PUBLIC_SMARTLOOK_ENABLED=true`

## Usage

### 1. Basic Integration (Already Set Up)

The GTM scripts are automatically included in your app layout:

```tsx
// Already integrated in app/layout.tsx
import { GTMScript, GTMNoscript } from "@/components/gtm";
import SmartlookScript from "@/components/smartlook";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <GTMScript />
        <SmartlookScript />
      </head>
      <body>
        <GTMNoscript />
        {children}
      </body>
    </html>
  );
}
```

### 2. Using Analytics Hooks in Components

**GTM Hook:**

```tsx
import { useGTM } from "@/hooks/use-gtm";

export default function MyComponent() {
  const gtm = useGTM();

  const handleButtonClick = () => {
    gtm.trackButtonClick("hero_cta", {
      section: "hero",
      campaign: "winter_sale",
    });
  };

  const handleFormSubmit = () => {
    gtm.trackFormSubmit("contact_form", {
      form_type: "lead_generation",
    });
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Track This Click</button>
      <form onSubmit={handleFormSubmit}>{/* form fields */}</form>
    </div>
  );
}
```

**Smartlook Hook:**

```tsx
import { useSmartlook } from "@/hooks/use-smartlook";

export default function MyComponent() {
  const smartlook = useSmartlook();

  const handleUserInteraction = () => {
    smartlook.trackPageInteraction("button_click", "hero-cta");
  };

  const handleFormFocus = () => {
    smartlook.trackFormInteraction("contact_form", "focus");
  };

  const identifyUser = (userId: string) => {
    smartlook.identifyUser(userId, {
      email: "user@example.com",
      plan: "premium",
    });
  };

  return (
    <div>
      <button onClick={handleUserInteraction}>Track Interaction</button>
      <input onFocus={handleFormFocus} placeholder="Email" />
    </div>
  );
}
```

### 3. Manual Event Tracking

**GTM Events:**

```tsx
import { gtmEvents } from "@/config/gtm";

// Custom event
gtmEvents.pushEvent("custom_event", {
  category: "engagement",
  action: "scroll",
  value: 75,
});

// Page view (useful for SPAs)
gtmEvents.pageView("/custom-page", "Custom Page Title");

// Conversion tracking
gtmEvents.conversion("purchase", 299.99, "USD");
```

**Smartlook Events:**

```tsx
import { smartlookAPI } from "@/config/smartlook";

// Track custom event
smartlookAPI.track("user_action", {
  action: "scroll_to_bottom",
  page: "homepage",
});

// Identify user
smartlookAPI.identify("user123", {
  email: "user@example.com",
  subscription: "premium",
});

// Control recording
smartlookAPI.pauseRecording();
smartlookAPI.resumeRecording();
smartlookAPI.stopRecording();

// Mark sensitive data
smartlookAPI.sensitive("#password-field");
```

### 4. Configuration Checking

**GTM Configuration:**

```tsx
import { getGTMConfig, shouldLoadGTM } from "@/config/gtm";

const gtmConfig = getGTMConfig();
console.log("GTM enabled:", gtmConfig.enabled);
console.log("GTM ID:", gtmConfig.id);
console.log(
  "Environment:",
  gtmConfig.isProduction ? "production" : "development"
);

if (shouldLoadGTM()) {
  // GTM is available and enabled
}
```

**Smartlook Configuration:**

```tsx
import { getSmartlookConfig, shouldLoadSmartlook } from "@/config/smartlook";

const smartlookConfig = getSmartlookConfig();
console.log("Smartlook enabled:", smartlookConfig.enabled);
console.log("Smartlook key:", smartlookConfig.key);
console.log("Smartlook region:", smartlookConfig.region);

if (shouldLoadSmartlook()) {
  // Smartlook is available and enabled
}
```

## Features

- ✅ **Environment-based configuration**: Automatic production detection for both GTM and Smartlook
- ✅ **Development override**: Force enable analytics in development
- ✅ **TypeScript support**: Full type safety for all analytics tools
- ✅ **React hooks**: Easy component integration (`useGTM`, `useSmartlook`)
- ✅ **Event tracking helpers**: Pre-built common event functions
- ✅ **Session recording**: Complete user interaction recording with Smartlook
- ✅ **Privacy controls**: Mark sensitive data, pause/resume recording
- ✅ **Server-side rendering**: Compatible with Next.js SSR
- ✅ **Performance optimized**: Uses Next.js Script component with proper loading strategy
- ✅ **Multi-region support**: Configurable Smartlook regions (EU, US)

## Development vs Production

- **Production**: Both GTM and Smartlook automatically load when `NODE_ENV=production`
- **Development**: Both tools are disabled by default to avoid polluting analytics and recordings
- **Override**:
  - Set `NEXT_PUBLIC_GTM_ENABLED=true` to enable GTM in development
  - Set `NEXT_PUBLIC_SMARTLOOK_ENABLED=true` to enable Smartlook in development

## Customization

To use different analytics configurations for different environments:

```env
# Production
NEXT_PUBLIC_GTM_ID=GTM-PROD123
NEXT_PUBLIC_SMARTLOOK_KEY=production_key_here
NEXT_PUBLIC_SMARTLOOK_REGION=eu

# Staging
NEXT_PUBLIC_GTM_ID=GTM-STAGING456
NEXT_PUBLIC_SMARTLOOK_KEY=staging_key_here
NEXT_PUBLIC_SMARTLOOK_REGION=eu

# Development
NEXT_PUBLIC_GTM_ID=GTM-DEV789
NEXT_PUBLIC_GTM_ENABLED=true
NEXT_PUBLIC_SMARTLOOK_KEY=dev_key_here
NEXT_PUBLIC_SMARTLOOK_ENABLED=true
NEXT_PUBLIC_SMARTLOOK_REGION=eu
```

### Privacy and Sensitive Data

For GDPR compliance and user privacy, you can control Smartlook recording:

```tsx
import { useSmartlook } from "@/hooks/use-smartlook";

export default function PrivacyAwareComponent() {
  const smartlook = useSmartlook();

  // Mark sensitive fields
  useEffect(() => {
    smartlook.markSensitive("#credit-card");
    smartlook.markSensitive("#password");
  }, []);

  // Pause recording for sensitive operations
  const handleSensitiveAction = () => {
    smartlook.pauseRecording();
    // Perform sensitive operation
    setTimeout(() => smartlook.resumeRecording(), 5000);
  };

  return <div>{/* component content */}</div>;
}
```
