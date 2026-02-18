"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { QuoteData } from "@/types/quote";
import { QuotePreview } from "@/components/QuotePreview";
import { Loader2, Table as TableIcon } from "lucide-react";
import Image from "next/image";
import { ADD_ONS } from "@/types/quote";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";

// QuotePreview is 900x1850. We scale it down to fit.
// Mobile: 300px wide → scale = 300/900 = 0.333, height = 1850*0.333 ≈ 616
// Desktop: 400px wide → scale = 400/900 = 0.444, height = 1850*0.444 ≈ 821

function QuoteCard({ quote }: { quote: QuoteData }) {
  return (
    <div className="w-[300px] h-[616px] bg-none md:w-[400px] md:h-[821px] relative overflow-hidden rounded-b-[1.5rem]">
      <div className="absolute top-0 left-0 origin-top-left scale-[0.333] md:scale-[0.444]" style={{ width: 900, height: 1850 }}>
        <QuotePreview quote={quote} />
      </div>
    </div>
  );
}

function ComparisonPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idsParam = searchParams.get("ids");
  const [activeIndex, setActiveIndex] = useState(0);

  const {
    data: quotes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["quotes", "compare", idsParam],
    queryFn: async () => {
      if (!idsParam) throw new Error("No quote IDs provided");
      const ids = idsParam.split(",");
      const responses = await Promise.all(ids.map((id) => fetch(`/api/quotes/${id}`)));
      const fetchedQuotes: QuoteData[] = [];
      for (const response of responses) {
        if (response.ok) {
          const data = await response.json();
          fetchedQuotes.push(data.quote);
        }
      }
      if (fetchedQuotes.length === 0) throw new Error("No quotes found");
      return fetchedQuotes;
    },
    enabled: !!idsParam,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="relative flex flex-col items-center justify-center h-screen w-screen bg-slate-900 text-white gap-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-red-500/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[100px]" />
        <div className="relative z-10">
          <Image src="/r-logo.png" alt="RestoRefine Logo" width={64} height={64} className="shadow-2xl animate-bounce mx-auto" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-2">
          <p className="text-sm font-black uppercase tracking-[0.4em] text-red-500">RestoRefine</p>
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-bold italic">Loading Packages...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !quotes || quotes.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Packages Not Found</h1>
          <p className="text-slate-400 mb-8">These packages don&apos;t exist or have been removed.</p>
          <button onClick={() => router.push("/")} className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-bold">
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 overflow-x-hidden">
      {/* Header */}
      <div className="text-center pt-12 pb-8">
        <Image src="/r-logo-black.png" alt="RestoRefine Logo" width={48} height={48} className="mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-black mb-2">Package Comparison</h1>
        <p className="text-slate-400">Compare our packages and choose what works best for you</p>
      </div>

      {/* Swiper Cards — same pattern as reels.tsx */}
      <div className="flex flex-col items-center py-8">
        {/* Slide indicator */}
        <div className="flex items-center gap-2 mb-6">
          {quotes.map((_, idx) => (
            <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${idx === activeIndex ? "w-8 bg-red-500" : "w-2 bg-slate-300"}`} />
          ))}
        </div>

        <Swiper effect={"cards"} grabCursor={true} modules={[EffectCards]} className="w-[300px] md:w-[400px]" onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}>
          {quotes.map((quote, idx) => (
            <SwiperSlide key={quote.id || idx}>
              <QuoteCard quote={quote} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Package name label */}
        <p className="mt-6 text-lg font-bold text-slate-700">
          {quotes[activeIndex]?.packageName}
          <span className="text-slate-400 font-medium ml-2">
            ({activeIndex + 1} of {quotes.length})
          </span>
        </p>
      </div>

      {/* Comparison — Mobile: stacked cards per package, Desktop: table */}
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 pb-16">
        <div className="bg-white rounded-3xl p-5 md:p-8 shadow-xl">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 md:mb-8 flex items-center gap-3">
            <TableIcon className="text-red-500" />
            Detailed Package Comparison
          </h3>

          {/* Mobile: Feature-by-feature comparison */}
          <div className="md:hidden">
            {/* Package name legend */}
            <div className="flex gap-3 mb-5">
              {quotes.map((q, idx) => (
                <div key={q.id || idx} className="flex items-start gap-1.5 flex-1 min-w-0">
                  <div className={`w-3 h-3 rounded-full shrink-0 mt-0.5 ${idx === 0 ? "bg-red-500" : idx === 1 ? "bg-blue-500" : idx === 2 ? "bg-amber-500" : "bg-emerald-500"}`} />
                  <span className="text-xs font-bold text-slate-700 leading-tight">{q.packageName}</span>
                </div>
              ))}
            </div>

            <div className="divide-y divide-slate-200">
              {/* Short-Form Videos */}
              <div className="py-4">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Short-Form Videos</p>
                <div className="flex gap-3">
                  {quotes.map((q, idx) => (
                    <div key={q.id || idx} className="flex-1 text-center">
                      <span className="text-2xl font-black text-red-500">{q.showVideos ? q.videoCount : "—"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Photos */}
              <div className="py-4">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Professional Photos</p>
                <div className="flex gap-3">
                  {quotes.map((q, idx) => (
                    <div key={q.id || idx} className="flex-1 text-center">
                      <span className="text-2xl font-black text-red-500">{q.showPhotos ? q.photoCount : "—"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platforms */}
              <div className="py-4">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Platforms</p>
                <div className="flex gap-3">
                  {quotes.map((q, idx) => (
                    <div key={q.id || idx} className="flex-1">
                      <div className="flex flex-wrap gap-1">
                        {q.platforms.map((p, pIdx) => (
                          <span key={p + pIdx} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform Management */}
              <div className="py-4">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Platform Management</p>
                <div className="flex gap-3">
                  {quotes.map((q, idx) => (
                    <div key={q.id || idx} className="flex-1 text-center">
                      <span className={`text-sm font-bold ${q.showManagement !== false ? "text-emerald-500" : "text-slate-300"}`}>
                        {q.showManagement !== false ? "Included" : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              {ADD_ONS.map((addon) => (
                <div key={addon} className="py-4">
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">{addon}</p>
                  <div className="flex gap-3">
                    {quotes.map((q, idx) => (
                      <div key={q.id || idx} className="flex-1 text-center">
                        {q.addOns.includes(addon) ? (
                          <span className="inline-flex w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full items-center justify-center text-xs">✓</span>
                        ) : (
                          <span className="text-slate-300 font-bold">—</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Initial Term */}
              <div className="py-4">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Initial Term</p>
                <div className="flex gap-3">
                  {quotes.map((q, idx) => (
                    <div key={q.id || idx} className="flex-1 text-center">
                      <span className="text-sm font-bold text-slate-900">{q.initialTerm || "3 Months"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exit Notice */}
              <div className="py-4">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Exit Notice</p>
                <div className="flex gap-3">
                  {quotes.map((q, idx) => (
                    <div key={q.id || idx} className="flex-1 text-center">
                      <span className="text-sm font-bold text-slate-900">{q.exitNotice || "30 Days"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Investment */}
              <div className="py-5 bg-slate-50/50 -mx-5 px-5 rounded-xl mt-2">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Monthly Investment</p>
                <div className="flex gap-3">
                  {quotes.map((q, idx) => (
                    <div key={q.id || idx} className="flex-1 text-center">
                      <span className="text-2xl font-black text-red-500">£{q.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Full comparison table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-4 px-6 bg-slate-50 rounded-tl-2xl border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">Feature</th>
                  {quotes.map((q, idx) => (
                    <th key={q.id || idx} className="text-center py-4 px-6 bg-slate-50 border-b border-slate-200 text-slate-900 font-bold min-w-[200px]">
                      {q.packageName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-700">Short-Form Videos</td>
                  {quotes.map((q, idx) => (
                    <td key={q.id || idx} className="py-4 px-6 text-center font-bold text-red-500 text-xl">
                      {q.showVideos ? q.videoCount : <span className="text-slate-300">—</span>}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-700">Professional Photos</td>
                  {quotes.map((q, idx) => (
                    <td key={q.id || idx} className="py-4 px-6 text-center font-bold text-red-500 text-xl">
                      {q.showPhotos ? q.photoCount : <span className="text-slate-300">—</span>}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-700">Platforms</td>
                  {quotes.map((q, idx) => (
                    <td key={q.id || idx} className="py-4 px-6 text-center">
                      <div className="flex flex-wrap justify-center gap-1">
                        {q.platforms.map((p, pIdx) => (
                          <span key={p + pIdx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase">
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-700">Platform Management</td>
                  {quotes.map((q, idx) => (
                    <td key={q.id || idx} className={`py-4 px-6 text-center ${q.showManagement !== false ? "text-emerald-500" : "text-slate-300"}`}>
                      {q.showManagement !== false ? "Included" : "Not included"}
                    </td>
                  ))}
                </tr>
                {ADD_ONS.map((addon) => (
                  <tr key={addon}>
                    <td className="py-4 px-6 font-medium text-slate-700">{addon}</td>
                    {quotes.map((q, idx) => (
                      <td key={q.id || idx} className="py-4 px-6 text-center">
                        {q.addOns.includes(addon) ? <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">✓</span> : <span className="text-slate-300">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-700">Initial Term</td>
                  {quotes.map((q, idx) => (
                    <td key={q.id || idx} className="py-4 px-6 text-center font-bold text-slate-900">
                      {q.initialTerm || "3 Months"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-700">Exit Notice</td>
                  {quotes.map((q, idx) => (
                    <td key={q.id || idx} className="py-4 px-6 text-center font-bold text-slate-900">
                      {q.exitNotice || "30 Days"}
                    </td>
                  ))}
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="py-6 px-6 font-bold text-slate-900">Monthly Investment</td>
                  {quotes.map((q, idx) => (
                    <td key={q.id || idx} className="py-6 px-6 text-center font-black text-2xl text-red-500">
                      £{q.price}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-slate-400 text-sm">
          <p>Powered by RestoRefine Studios</p>
        </div>
      </div>
    </div>
  );
}

export default function PublicComparisonPage() {
  return (
    <Suspense
      fallback={
        <div className="relative flex flex-col items-center justify-center h-screen w-screen bg-slate-900 text-white gap-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-red-500/10 via-transparent to-transparent blur-3xl" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[100px]" />
          <div className="relative z-10">
            <Image src="/r-logo.png" alt="RestoRefine Logo" width={64} height={64} className="rounded-2xl shadow-2xl animate-bounce mx-auto" />
          </div>
          <div className="relative z-10 flex flex-col items-center gap-2">
            <p className="text-sm font-black uppercase tracking-[0.4em] text-red-500">RestoRefine</p>
            <div className="flex items-center gap-2 text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs font-bold italic">Loading Packages...</span>
            </div>
          </div>
        </div>
      }
    >
      <ComparisonPageContent />
    </Suspense>
  );
}
