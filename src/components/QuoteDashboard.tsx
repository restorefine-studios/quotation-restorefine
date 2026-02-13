import { QuoteData, PLATFORMS, ADD_ONS, DEFAULT_QUOTE } from "../types/quote";
import { QuotePreview } from "./QuotePreview";
import { QuoteEditor } from "./QuoteEditor";
import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Download, Table as TableIcon, Trash2, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
// ...existing code...
// ...existing code...
import debounce from "lodash.debounce";

const PUBLIC_USER_ID = "public-user";

export function QuoteDashboard() {
  const [activeQuotes, setActiveQuotes] = useState<QuoteData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("0");
  const [showComparison, setShowComparison] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // Fetch quotes on mount
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        // Set initial quote locally
        setActiveQuotes([{ ...DEFAULT_QUOTE }]);
      } catch (error) {
        console.error("Error fetching quotes:", error);
        toast.error("Failed to load quotes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  const debouncedSave = useCallback(
    debounce(async (quote: QuoteData) => {
      if (!quote.id) return;
      setIsSaving(true);
      // No db save, just local state
      setIsSaving(false);
    }, 1000),
    [],
  );

  const handleAddCard = async () => {
    if (activeQuotes.length >= 4) {
      toast.error("Maximum 4 packages allowed for comparison");
      return;
    }

    const newQuoteData = { ...DEFAULT_QUOTE, packageName: `Package ${activeQuotes.length + 1}` };
    setActiveQuotes([...activeQuotes, { ...newQuoteData }]);
    setActiveTab(activeQuotes.length.toString());
    toast.success("New package added");
  };

  const handleRemoveCard = async (id: string) => {
    if (activeQuotes.length <= 1) {
      toast.error("At least one package is required");
      return;
    }

    const newQuotes = activeQuotes.filter((q) => q.id !== id);
    setActiveQuotes(newQuotes);
    setActiveTab("0");
    toast.success("Package removed");
  };

  const handleQuoteChange = (index: number, updatedQuote: QuoteData) => {
    const newQuotes = [...activeQuotes];
    newQuotes[index] = updatedQuote;
    setActiveQuotes(newQuotes);
    debouncedSave(updatedQuote);
  };

  const exportAsImage = async () => {
    if (!exportRef.current) return;
    try {
      toast.loading("Generating High-Res PNG...");
      const dataUrl = await toPng(exportRef.current, {
        backgroundColor: "#f8fafc",
        pixelRatio: 3, // Higher resolution for professional print/share
        quality: 1,
      });
      const link = document.createElement("a");
      link.download = `RestoRefine-Quote-${new Date().toISOString().split("T")[0]}.png`;
      link.href = dataUrl;
      link.click();
      toast.dismiss();
      toast.success("Ready for WhatsApp sharing!");
    } catch (err) {
      toast.dismiss();
      toast.error("Export failed");
    }
  };

  const exportAsPDF = async () => {
    if (!exportRef.current) return;
    try {
      toast.loading("Generating Premium PDF...");
      const canvas = exportRef.current;
      const dataUrl = await toPng(canvas, {
        backgroundColor: "#ffffff",
        pixelRatio: 3,
        quality: 1,
      });

      // A4 dimensions in points (1pt = 1/72 inch)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);

      const imgWidth = imgProps.width * ratio;
      const imgHeight = imgProps.height * ratio;

      pdf.addImage(dataUrl, "PNG", (pdfWidth - imgWidth) / 2, 0, imgWidth, imgHeight);
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`RestoRefine-Proposal-${new Date().toISOString().split("T")[0]}.pdf`);

      toast.dismiss();
      toast.success("Professional PDF generated");
    } catch (err) {
      toast.dismiss();
      toast.error("PDF generation failed");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-slate-900 text-white gap-6">
        <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-2xl animate-bounce">R</div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-black uppercase tracking-[0.4em] text-red-500">RestoRefine</p>
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-bold italic">Initializing Proposal Engine...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-400 flex flex-col h-full border-r border-slate-800 shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-xl">R</div>
          <span className="text-white font-bold text-lg tracking-tight">RestoRefine</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Packages</span>
              {isSaving && (
                <div className="flex items-center gap-1.5">
                  <Loader2 className="w-2.5 h-2.5 animate-spin text-red-500" />
                  <span className="text-[10px] font-bold text-slate-400 italic">Syncing...</span>
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={handleAddCard} className="h-6 w-6 text-slate-400 hover:text-white">
              <Plus size={16} />
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="space-y-2">
            <TabsList className="flex flex-col h-auto bg-transparent gap-2 w-full">
              {activeQuotes.map((q, idx) => (
                <TabsTrigger key={q.id || idx} value={idx.toString()} className="w-full justify-start gap-3 p-3 rounded-xl transition-all data-[state=active]:bg-accent data-[state=active]:text-white hover:bg-slate-800 hover:text-slate-200 border-none">
                  <div className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center text-[10px] shrink-0">{idx + 1}</div>
                  <span className="truncate flex-1 text-left">{q.packageName}</span>
                  {activeQuotes.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCard(q.id!);
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="mt-8 border-t border-slate-800 pt-6 px-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-slate-200">Comparison Table</Label>
                <p className="text-xs text-slate-500">Show details below cards</p>
              </div>
              <Switch checked={showComparison} onCheckedChange={setShowComparison} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={exportAsImage} variant="outline" className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white border-none h-12">
                  <Download size={18} className="mr-2" /> PNG
                </Button>
                <Button onClick={exportAsPDF} variant="outline" className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white border-none h-12">
                  <Download size={18} className="mr-2" /> PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-100">
        <div className="flex flex-1 overflow-hidden">
          {/* Editor Sidebar (Conditional on selection) */}
          <div className="w-[400px] h-full overflow-y-auto border-r border-slate-200 bg-white shadow-sm p-6 shrink-0 custom-scrollbar">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Package Editor</h2>
              <p className="text-sm text-slate-500">Editing: {activeQuotes[parseInt(activeTab)]?.packageName}</p>
            </div>

            <QuoteEditor quote={activeQuotes[parseInt(activeTab)]} onSave={() => toast.success("Changes saved locally")} onChange={(updated) => handleQuoteChange(parseInt(activeTab), updated)} />
          </div>

          {/* Preview Canvas */}
          <div className="flex h-full overflow-auto bg-slate-50 p-4 custom-scrollbar">
            <div ref={exportRef} className="mx-auto min-w-fit max-w-full p-8 bg-slate-50 rounded-2xl">
              <div className="flex flex-col gap-4">
                {/* Package Cards View */}
                <div className="flex flex-cols justify-center -gap-10">
                  {activeQuotes.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      className="w-[510px] shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-500"
                      style={{
                        animationDelay: `${idx * 100}ms`,
                        transform: "scale(0.5)",
                        transformOrigin: "top center",
                        marginBottom: "-60px", // reduce extra space from scaling
                      }}
                    >
                      <QuotePreview quote={q} />
                    </div>
                  ))}
                </div>

                {/* Comparison Table */}
                {showComparison && (
                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                      <TableIcon className="text-accent" />
                      Detailed Package Comparison
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="text-left py-4 px-6 bg-slate-50 rounded-tl-2xl border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-xs">Feature</th>
                            {activeQuotes.map((q, idx) => (
                              <th key={q.id || idx} className="text-center py-4 px-6 bg-slate-50 border-b border-slate-200 text-slate-900 font-bold min-w-[200px]">
                                {q.packageName}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="py-4 px-6 font-medium text-slate-700">Short-Form Videos</td>
                            {activeQuotes.map((q, idx) => (
                              <td key={q.id || idx} className="py-4 px-6 text-center font-bold text-accent text-lg">
                                {q.showVideos ? q.videoCount : <span className="text-slate-300">—</span>}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-4 px-6 font-medium text-slate-700">Professional Photos</td>
                            {activeQuotes.map((q, idx) => (
                              <td key={q.id || idx} className="py-4 px-6 text-center font-bold text-accent text-lg">
                                {q.showPhotos ? q.photoCount : <span className="text-slate-300">—</span>}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-4 px-6 font-medium text-slate-700">Platforms</td>
                            {activeQuotes.map((q, idx) => (
                              <td key={q.id || idx} className="py-4 px-6 text-center">
                                <div className="flex flex-wrap justify-center gap-1">
                                  {q.platforms.map((p, pIdx) => (
                                    <span key={p + pIdx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase">
                                      {p}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-4 px-6 font-medium text-slate-700">Platform Management</td>
                            {activeQuotes.map((q, idx) => (
                              <td key={q.id || idx} className="py-4 px-6 text-center text-emerald-500">
                                Included
                              </td>
                            ))}
                          </tr>
                          {ADD_ONS.map((addon) => (
                            <tr key={addon}>
                              <td className="py-4 px-6 font-medium text-slate-700">{addon}</td>
                              {activeQuotes.map((q, idx) => (
                                <td key={q.id || idx} className="py-4 px-6 text-center">
                                  {q.addOns.includes(addon) ? <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">✓</span> : <span className="text-slate-300">—</span>}
                                </td>
                              ))}
                            </tr>
                          ))}
                          <tr className="bg-slate-50/50">
                            <td className="py-6 px-6 font-bold text-slate-900 text-lg">Monthly Investment</td>
                            {activeQuotes.map((q, idx) => (
                              <td key={q.id || idx} className="py-6 px-6 text-center font-black text-2xl text-accent">
                                £{q.price}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
