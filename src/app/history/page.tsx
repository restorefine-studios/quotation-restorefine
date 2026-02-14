"use client";

import { useRouter } from "next/navigation";
import { QuoteData } from "@/types/quote";
import { QuoteHistoryCard } from "@/components/QuoteHistoryCard";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Package, Calendar, User } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Helper to group quotes by client and date
interface GroupedQuotes {
  [clientName: string]: {
    [date: string]: QuoteData[];
  };
}

function groupQuotesByClientAndDate(quotes: QuoteData[]): GroupedQuotes {
  return quotes.reduce((acc, quote) => {
    const clientName = quote.clientName || "Unnamed Client";
    const date = quote.createdAt
      ? new Date(quote.createdAt).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Unknown Date";

    if (!acc[clientName]) {
      acc[clientName] = {};
    }
    if (!acc[clientName][date]) {
      acc[clientName][date] = [];
    }
    acc[clientName][date].push(quote);
    return acc;
  }, {} as GroupedQuotes);
}

function HistoryPageContent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch quotes using TanStack Query
  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      const response = await fetch("/api/quotes");
      if (!response.ok) throw new Error("Failed to fetch quotes");
      const data = await response.json();
      return data.quotes as QuoteData[];
    },
  });

  const handleView = (quote: QuoteData) => {
    // Navigate back to dashboard - in the future, we could pass the quote ID
    router.push("/");
  };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/quotes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete quote");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      toast.success("Quote deleted successfully");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("Failed to delete quote");
    },
  });

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this quote?")) {
      return;
    }
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="relative flex flex-col items-center justify-center h-screen w-screen bg-slate-900 text-white gap-6 overflow-hidden">
        {/* Content */}
        <div className="relative z-10">
          <Image src="/r-logo.png" alt="RestoRefine Logo" width={64} height={64} className="rounded-2xl shadow-2xl animate-bounce mx-auto" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-2">
          <p className="text-sm font-black uppercase tracking-[0.4em] text-red-500">RestoRefine</p>
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-bold italic">Loading History...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-slate-400 hover:text-white">
              <ArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Package className="text-red-500" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-wider">Quote History</h1>
              <p className="text-slate-400 text-sm font-medium">View and manage all your created quotes</p>
            </div>
          </div>
        </div>

        {/* Quotes Grid - Grouped by Client and Date */}
        {quotes.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 text-center border border-white/10">
            <Package className="mx-auto mb-4 text-slate-500" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">No quotes yet</h3>
            <p className="text-slate-400 mb-6">Create your first quote to see it here</p>
            <Link href="/">
              <Button className="bg-red-500 hover:bg-red-600 text-white font-bold">Create Quote</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupQuotesByClientAndDate(quotes)).map(([clientName, dateGroups]) => (
              <div key={clientName} className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10 hover:bg-white/10 hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                {/* Client Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <User className="text-red-500" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-wide">{clientName}</h2>
                    <p className="text-slate-400 text-xs font-medium">
                      {Object.values(dateGroups).flat().length} package{Object.values(dateGroups).flat().length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Date Groups */}
                {Object.entries(dateGroups).map(([date, quotesForDate]) => (
                  <div key={date} className="mb-6 last:mb-0">
                    {/* Date Header */}
                    <div className="flex items-center gap-2 mb-4 ml-2">
                      <Calendar className="text-slate-500" size={14} />
                      <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">{date}</span>
                      <span className="text-slate-600 text-xs">({quotesForDate.length})</span>
                    </div>

                    {/* Quotes for this date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-6">
                      {quotesForDate.map((quote) => (
                        <QuoteHistoryCard key={quote.id} quote={quote} onView={handleView} onDelete={handleDelete} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {quotes.length > 0 && (
          <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Quotes</div>
                <div className="text-white font-black text-2xl">{quotes.length}</div>
              </div>
              <div className="text-center">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Unique Clients</div>
                <div className="text-white font-black text-2xl">{Object.keys(groupQuotesByClientAndDate(quotes)).length}</div>
              </div>
              <div className="text-center">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">This Month</div>
                <div className="text-white font-black text-2xl">
                  {
                    quotes.filter((q) => {
                      if (!q.createdAt) return false;
                      const quoteDate = new Date(q.createdAt);
                      const now = new Date();
                      return quoteDate.getMonth() === now.getMonth() && quoteDate.getFullYear() === now.getFullYear();
                    }).length
                  }
                </div>
              </div>
              <div className="text-center">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">This Week</div>
                <div className="text-white font-black text-2xl">
                  {
                    quotes.filter((q) => {
                      if (!q.createdAt) return false;
                      const quoteDate = new Date(q.createdAt);
                      const now = new Date();
                      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                      return quoteDate >= weekAgo;
                    }).length
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <AuthGuard>
      <HistoryPageContent />
    </AuthGuard>
  );
}
