import { Suspense } from "react";

import BathroomPage from "@/components/pages/bathroom";
import FlooringPage from "@/components/pages/flooring";
import RoofingPage from "@/components/pages/roofing";
import WindowsPage from "@/components/pages/windows";
import NewBathroomPage from "@/components/pages/new-bathroom";
import NewWindowsPage from "@/components/pages/new-windows";
import NewRoofingPage from "@/components/pages/new-roofing";
import NewFlooringPage from "@/components/pages/new-flooring";
import NewSolarPage from "@/components/pages/new-solar";

export default function HomePage() {
  const renderPage = () => {
    if (process.env.NEXT_PUBLIC_LEAD_VERTICAL === "bathroom") {
      return <BathroomPage />;
    } else if (process.env.NEXT_PUBLIC_LEAD_VERTICAL === "new-bathroom") {
      return <NewBathroomPage />;
    } else if (process.env.NEXT_PUBLIC_LEAD_VERTICAL === "roofing") {
      return <RoofingPage />;
    } else if (process.env.NEXT_PUBLIC_LEAD_VERTICAL === "flooring") {
      return <FlooringPage />;
    } else if (process.env.NEXT_PUBLIC_LEAD_VERTICAL === "new-windows") {
      return <NewWindowsPage />;
    } else if (process.env.NEXT_PUBLIC_LEAD_VERTICAL === "new-roofing") {
      return <NewRoofingPage />;
    } else if (process.env.NEXT_PUBLIC_LEAD_VERTICAL === "new-flooring") {
      return <NewFlooringPage />;
    } else if (process.env.NEXT_PUBLIC_LEAD_VERTICAL === "new-solar") {
      return <NewSolarPage />;
    } else {
      return <WindowsPage />;
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
