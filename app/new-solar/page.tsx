import NewSolarPage from "@/components/pages/new-solar";
import { Suspense } from "react";

export const metadata = {
  title: "Solar Panel Installation | Get Free Quotes",
  description: "Transform your home with professional solar panel installation. Save on energy bills and increase your property value with clean, renewable solar energy.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewSolarPage />
    </Suspense>
  );
}

