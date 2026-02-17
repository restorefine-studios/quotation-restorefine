"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { QuoteData } from "@/types/quote";
import { QuotePreview } from "@/components/QuotePreview";
import { Loader2, Table as TableIcon } from "lucide-react";
import Image from "next/image";
import { ADD_ONS } from "@/types/quote";
import { useQuery } from "@tanstack/react-query";

function ComparisonPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idsParam = searchParams.get("ids");

  // Fetch quotes using TanStack Query
  const {
    data: quotes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["quotes", "compare", idsParam],
    queryFn: async () => {
      if (!idsParam) throw new Error("No quote IDs provided");

      const ids = idsParam.split(",");
      const fetchedQuotes: QuoteData[] = [];

      // Fetch all quotes in parallel
      const responses = await Promise.all(
        ids.map((id) => fetch(`/api/quotes/${id}`))
      );

      for (const response of responses) {
        if (response.ok) {
          const data = await response.json();
          fetchedQuotes.push(data.quote);
        }
      }

      if (fetchedQuotes.length === 0) {
        throw new Error("No quotes found");
      }

      return fetchedQuotes;
    },
    enabled: !!idsParam, // Only run query if we have IDs
    retry: 1,
  });

  if (isLoading) {
    return (
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
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="text-center mt-12 mb-12">
          <Image src="/r-logo.png" alt="RestoRefine Logo" width={48} height={48} className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-black mb-2">Package Comparison</h1>
          <p className="text-slate-400">Compare our packages and choose what works best for you</p>
        </div>

        {/* Package Cards */}
        <div className="flex mt-24 flex-cols gap-0 justify-center items-start mb-16">
          {quotes.map((quote, idx) => (
            <div
              key={quote.id || idx}
              className="shrink-0"
              style={{
                transform: "scale(0.55)",
                transformOrigin: "top center",
                marginBottom: "-680px",
              }}
            >
              <QuotePreview quote={quote} />
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <TableIcon className="text-red-500" />
            Detailed Package Comparison
          </h3>

          <div className="overflow-x-auto">
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
                    <td key={q.id || idx} className={`py-4 px-6 text-center ${q.showManagement !== false ? 'text-emerald-500' : 'text-slate-300'}`}>
                      {q.showManagement !== false ? 'Included' : 'Not included'}
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
