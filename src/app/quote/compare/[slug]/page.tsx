"use client";

import { Suspense, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuoteData } from "@/types/quote";
import { QuotePreview } from "@/components/QuotePreview";
import { Loader2, Table as TableIcon, X, Video, Camera, Layers, Check, Clock, LogOut, Zap } from "lucide-react";
import Image from "next/image";
import { ADD_ONS } from "@/types/quote";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";

function PackageDetailModal({ quote, onClose }: { quote: QuoteData; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Sheet */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl max-h-[88vh] flex flex-col animate-in slide-in-from-bottom duration-300" onClick={(e) => e.stopPropagation()}>
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-zinc-300" />
        </div>

        {/* Dark header */}
        <div className="mx-4 mt-2 mb-4 rounded-2xl bg-zinc-950 p-5 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-1">RestoRefine</p>
              <h2 className="text-lg font-black text-white leading-tight">{quote.packageName}</h2>
              {quote.subtitle && <p className="text-xs text-zinc-400 font-medium mt-0.5">{quote.subtitle}</p>}
            </div>
            <button onClick={onClose} className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-800 flex items-baseline gap-1.5">
            <span className="text-4xl font-black text-red-500">£{quote.price}</span>
            <span className="text-sm text-zinc-500 font-medium">/ month</span>
          </div>
          {quote.priceSubtext && <p className="text-xs text-zinc-500 mt-0.5">{quote.priceSubtext}</p>}
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-4 pb-8 space-y-3">
          {/* Deliverables */}
          <div className="bg-zinc-50 rounded-2xl p-4 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">What&apos;s Included</p>
            {quote.showVideos && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-700">
                  <Video className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-semibold">Short-Form Videos</span>
                </div>
                <span className="text-xl font-black text-red-500">{quote.videoCount}</span>
              </div>
            )}
            {quote.showPhotos && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-700">
                  <Camera className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-semibold">Professional Photos</span>
                </div>
                <span className="text-xl font-black text-red-500">{quote.photoCount}</span>
              </div>
            )}
            {quote.showManagement !== false && (
              <div className="flex items-center gap-2 text-zinc-700">
                <Layers className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold">Platform Management</span>
                <span className="ml-auto text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">Included</span>
              </div>
            )}
          </div>

          {/* Platforms */}
          {quote.platforms.length > 0 && (
            <div className="bg-zinc-50 rounded-2xl p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Platforms</p>
              <div className="flex flex-wrap gap-2">
                {quote.platforms.map((p, i) => (
                  <span key={p + i} className="px-3 py-1.5 bg-zinc-950 text-white rounded-full text-xs font-black uppercase tracking-wide">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons */}
          {quote.addOns.length > 0 && (
            <div className="bg-zinc-50 rounded-2xl p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Add-Ons</p>
              <div className="space-y-2">
                {ADD_ONS.map((addon) => {
                  const included = quote.addOns.includes(addon);
                  return (
                    <div key={addon} className={`flex items-center gap-3 py-1.5 ${!included ? "opacity-25" : ""}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${included ? "bg-red-500" : "bg-zinc-200"}`}>{included ? <Check className="w-3 h-3 text-white" /> : <span className="text-zinc-400 text-xs font-bold">–</span>}</div>
                      <span className="text-sm font-medium text-zinc-800">{addon}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Terms */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-50 rounded-2xl p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-red-500" />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{quote.initialTermLabel || "Initial Term"}</p>
              </div>
              <p className="text-base font-black text-zinc-900">{quote.initialTerm || "3 Months"}</p>
            </div>
            <div className="bg-zinc-50 rounded-2xl p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <LogOut className="w-3.5 h-3.5 text-red-500" />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{quote.exitNoticeLabel || "Exit Notice"}</p>
              </div>
              <p className="text-base font-black text-zinc-900">{quote.exitNotice || "30 Days"}</p>
            </div>
          </div>

          {/* CTA */}
          {quote.showCTA && quote.ctaText && (
            <div className="rounded-2xl bg-zinc-950 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-red-500" />
                <p className="text-sm font-black text-red-500">{quote.ctaTitle}</p>
              </div>
              <p className="text-sm text-zinc-300">{quote.ctaText}</p>
              {quote.ctaFooter && <p className="text-xs text-zinc-500 mt-2">{quote.ctaFooter}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedQuote, setSelectedQuote] = useState<{ quote: QuoteData; idx: number } | null>(null);

  const {
    data: quotes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["quotes", "compare-slug", slug],
    queryFn: async () => {
      // 1. Resolve slug → quoteIds
      const linkRes = await fetch(`/api/compare-links/${slug}`);
      if (!linkRes.ok) throw new Error("Compare link not found");
      const { quoteIds } = await linkRes.json();

      // 2. Fetch each quote
      const responses = await Promise.all((quoteIds as string[]).map((id: string) => fetch(`/api/quotes/${id}`)));
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
    enabled: !!slug,
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

      {/* Swiper Cards */}
      <div className="flex flex-col items-center py-8">
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

        {selectedQuote && <PackageDetailModal quote={selectedQuote.quote} onClose={() => setSelectedQuote(null)} />}

        {/* Expand button — mobile only */}
        <button className="md:hidden mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-500 text-white rounded-full text-sm font-bold shadow-md transition-colors" onClick={() => setSelectedQuote({ quote: quotes[activeIndex], idx: activeIndex })}>
          <Layers className="w-4 h-4" />
          Expand
        </button>

        <p className="mt-4 text-lg font-bold text-slate-700">
          {quotes[activeIndex]?.packageName}
          <span className="text-slate-400 font-medium ml-2">
            ({activeIndex + 1} of {quotes.length})
          </span>
        </p>
      </div>

      {/* Comparison */}
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 pb-16">
        <div className="bg-white rounded-3xl p-5 md:p-8 shadow-xl">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 md:mb-8 flex items-center gap-3">
            <TableIcon className="text-red-500" />
            Detailed Package Comparison
          </h3>

          {/* Mobile */}
          <div className="md:hidden">
            <div className="flex gap-3 mb-5">
              {quotes.map((q, idx) => (
                <div key={q.id || idx} className="flex items-start gap-1.5 flex-1 min-w-0">
                  <div className={`w-3 h-3 rounded-full shrink-0 mt-0.5 ${idx === 0 ? "bg-red-500" : idx === 1 ? "bg-blue-500" : idx === 2 ? "bg-amber-500" : "bg-emerald-500"}`} />
                  <span className="text-xs font-bold text-slate-700 leading-tight">{q.packageName}</span>
                </div>
              ))}
            </div>

            <div className="divide-y divide-slate-200">
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

              <div className="py-4">
                <p className="sm:text-2xl font-black uppercase tracking-widest text-slate-400 mb-2">Platforms</p>
                <div className="flex gap-3">
                  {quotes.map((q, idx) => (
                    <div key={q.id || idx} className="flex-1">
                      <div className="flex flex-wrap gap-1">
                        {q.platforms.map((p, pIdx) => (
                          <span key={p + pIdx} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[15px] font-bold uppercase">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="py-4">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Platform Management</p>
                <div className="flex gap-3">
                  {quotes.map((q, idx) => (
                    <div key={q.id || idx} className="flex-1 text-center">
                      <span className={`text-sm font-bold ${q.showManagement !== false ? "text-emerald-500" : "text-slate-300"}`}>{q.showManagement !== false ? "Included" : "—"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {ADD_ONS.map((addon) => (
                <div key={addon} className="py-4">
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">{addon}</p>
                  <div className="flex gap-3">
                    {quotes.map((q, idx) => (
                      <div key={q.id || idx} className="flex-1 text-center">
                        {q.addOns.includes(addon) ? <span className="inline-flex w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full items-center justify-center text-xs">✓</span> : <span className="text-slate-300 font-bold">—</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

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

          {/* Desktop table */}
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

        <div className="text-center mt-12 text-slate-400 text-sm">
          <p>Powered by RestoRefine Studios</p>
        </div>
      </div>
    </div>
  );
}

export default function SlugComparisonPage() {
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
