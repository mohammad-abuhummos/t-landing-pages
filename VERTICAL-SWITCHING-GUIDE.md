# How to Switch Between Verticals (Lead Types)

## Overview
The landing page supports 4 different verticals:
- **Windows** (default)
- **Bathroom**
- **Roofing**
- **Flooring**

The vertical is controlled by an **environment variable** called `NEXT_PUBLIC_LEAD_VERTICAL`.

---

## How It Works

### 1. **Main Page Logic** (`app/page.tsx`)

The main page checks the environment variable and renders the appropriate vertical:

```typescript
export default function HomePage() {
  const renderPage = () => {
    if (process.env.NEXT_PUBLIC_LEAD_VERTICAL === "bathroom") {
      return <BathroomPage />;
    } else if (process.env.NEXT_PUBLIC_LEAD_VERTICAL === "roofing") {
      return <RoofingPage />;
    } else if (process.env.NEXT_PUBLIC_LEAD_VERTICAL === "flooring") {
      return <FlooringPage />;
    } else {
      return <WindowsPage />; // Default
    }
  }
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        {renderPage()}
      </Suspense>
    </div>
  );
}
```

### 2. **Dynamic Metadata** (`app/layout.tsx`)

The page title and description also change based on the vertical:

```typescript
const getMetadata = (): Metadata => {
  const vertical = process.env.NEXT_PUBLIC_LEAD_VERTICAL;

  switch (vertical) {
    case "bathroom":
      return {
        title: "Premium Bathroom Remodeling",
        description: "Transform your bathroom...",
      };
    case "roofing":
      return {
        title: "Premium Roofing Solutions",
        description: "Protect your home...",
      };
    case "flooring":
      return {
        title: "Premium Flooring Solutions",
        description: "Transform your home...",
      };
    default:
      return {
        title: "Premium Window Solutions",
        description: "Transform your home...",
      };
  }
};
```

---

## How to Switch Verticals

### Method 1: Using Environment Variables (Recommended)

1. **Create or Edit `.env.local` file** in the project root:

```bash
# In L2P-Landing directory
touch .env.local
```

2. **Add the vertical setting:**

```env
# For Windows (default)
NEXT_PUBLIC_LEAD_VERTICAL=windows

# OR for Bathroom
NEXT_PUBLIC_LEAD_VERTICAL=bathroom

# OR for Roofing
NEXT_PUBLIC_LEAD_VERTICAL=roofing

# OR for Flooring
NEXT_PUBLIC_LEAD_VERTICAL=flooring
```

3. **Restart the development server:**

```bash
npm run dev
```

**Important:** You must restart the dev server after changing environment variables!

---

### Method 2: Production Deployment

When deploying to production (Vercel, Netlify, etc.), set the environment variable in your hosting platform:

#### **Vercel**
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add: 
   - **Name:** `NEXT_PUBLIC_LEAD_VERTICAL`
   - **Value:** `bathroom` (or `windows`, `roofing`, `flooring`)
4. Redeploy your application

#### **Netlify**
1. Go to Site Settings → Build & Deploy → Environment
2. Add environment variable:
   - **Key:** `NEXT_PUBLIC_LEAD_VERTICAL`
   - **Value:** `bathroom` (or `windows`, `roofing`, `flooring`)
3. Trigger a new deploy

---

## Valid Values

| Value | Vertical | API Route | Form Component |
|-------|----------|-----------|----------------|
| `windows` (or empty) | Windows | `/api/submit-windows-lead` | `WindowsLeadForm` |
| `bathroom` | Bathroom | `/api/submit-bath-lead` | `BathLeadForm` |
| `roofing` | Roofing | `/api/submit-roofing-lead` | `RoofingLeadForm` |
| `flooring` | Flooring | `/api/submit-flooring-lead` | `FlooringLeadForm` |

---

## Example .env.local File

```env
# Lead Vertical Configuration
# Options: windows, bathroom, roofing, flooring
NEXT_PUBLIC_LEAD_VERTICAL=bathroom

# Other environment variables...
# Add any other configuration here
```

---

## Testing Different Verticals Locally

### Quick Test Script

Create a test script to quickly switch between verticals:

**switch-vertical.sh** (for Mac/Linux):
```bash
#!/bin/bash

echo "Which vertical do you want to test?"
echo "1) Windows"
echo "2) Bathroom"
echo "3) Roofing"
echo "4) Flooring"
read -p "Enter choice (1-4): " choice

case $choice in
  1) echo "NEXT_PUBLIC_LEAD_VERTICAL=windows" > .env.local ;;
  2) echo "NEXT_PUBLIC_LEAD_VERTICAL=bathroom" > .env.local ;;
  3) echo "NEXT_PUBLIC_LEAD_VERTICAL=roofing" > .env.local ;;
  4) echo "NEXT_PUBLIC_LEAD_VERTICAL=flooring" > .env.local ;;
  *) echo "Invalid choice"; exit 1 ;;
esac

echo "Switched to vertical. Please restart your dev server!"
```

**Make it executable:**
```bash
chmod +x switch-vertical.sh
./switch-vertical.sh
```

---

## Multiple Deployments (Different Domains)

If you want to deploy each vertical to a different domain:

### Option A: Separate Branches
1. Create separate branches for each vertical
2. Each branch has its own `.env.local` with different `NEXT_PUBLIC_LEAD_VERTICAL`
3. Deploy each branch to a different domain

### Option B: Multiple Projects
1. Deploy the same codebase multiple times
2. Set different environment variables for each deployment
3. Example:
   - `windows.yoursite.com` → `NEXT_PUBLIC_LEAD_VERTICAL=windows`
   - `bathroom.yoursite.com` → `NEXT_PUBLIC_LEAD_VERTICAL=bathroom`
   - `roofing.yoursite.com` → `NEXT_PUBLIC_LEAD_VERTICAL=roofing`
   - `flooring.yoursite.com` → `NEXT_PUBLIC_LEAD_VERTICAL=flooring`

---

## Troubleshooting

### Issue: Changes not reflecting
**Solution:** Remember to restart your dev server after changing `.env.local`

```bash
# Stop the server (Ctrl+C), then:
npm run dev
```

### Issue: Environment variable is undefined
**Solution:** Make sure the variable starts with `NEXT_PUBLIC_` (this makes it available to the browser)

### Issue: Wrong form showing up
**Solution:** Check the exact spelling of your environment variable value (it's case-sensitive)

---

## Form Submission Endpoints

Each vertical submits to a different API endpoint:

| Vertical | API Endpoint |
|----------|-------------|
| Windows | `/api/submit-windows-lead` |
| Bathroom | `/api/submit-bath-lead` |
| Roofing | `/api/submit-roofing-lead` |
| Flooring | `/api/submit-flooring-lead` |

These are automatically configured in each form component.

---

## Quick Reference Commands

```bash
# Switch to Windows vertical
echo "NEXT_PUBLIC_LEAD_VERTICAL=windows" > .env.local
npm run dev

# Switch to Bathroom vertical
echo "NEXT_PUBLIC_LEAD_VERTICAL=bathroom" > .env.local
npm run dev

# Switch to Roofing vertical
echo "NEXT_PUBLIC_LEAD_VERTICAL=roofing" > .env.local
npm run dev

# Switch to Flooring vertical
echo "NEXT_PUBLIC_LEAD_VERTICAL=flooring" > .env.local
npm run dev
```

---

## Summary

✅ **Environment Variable:** `NEXT_PUBLIC_LEAD_VERTICAL`  
✅ **Valid Values:** `windows`, `bathroom`, `roofing`, `flooring`  
✅ **Location:** `.env.local` file in project root  
✅ **Important:** Must restart dev server after changes  
✅ **Default:** If not set, defaults to `windows`  

The system automatically handles:
- Page rendering
- Form component selection
- API endpoint routing
- Page metadata (title, description)
- Form labels and content

