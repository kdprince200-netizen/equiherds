"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TopSection from "../components/topSection";
import HorseMarketList from "../components/services/horseMarket";
import MarketPlaceList from "../components/services/marketPlace";

function MarketContent() {
  const searchParams = useSearchParams();
  const type = (searchParams.get("type") || "horse").toLowerCase();

  return (
    <div className="font-sans bg-white">
      <TopSection title="Market" bgImage="/slider/1.jpeg" />
      <section className="mx-auto max-w-6xl px-4 py-10 text-brand">
        <div>
          {type === "marketplace" ? <MarketPlaceList /> : <HorseMarketList />}
        </div>
      </section>
    </div>
  );
}

export default function MarketPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <MarketContent />
    </Suspense>
  );
}

