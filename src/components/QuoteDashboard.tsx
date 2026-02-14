import { QuoteData, PLATFORMS, ADD_ONS, DEFAULT_QUOTE } from "../types/quote";
import { QuotePreview } from "./QuotePreview";
import { QuoteEditor } from "./QuoteEditor";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Download, Table as TableIcon, Trash2, Loader2, ZoomIn, ZoomOut, History, LogOut, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";

export function QuoteDashboard() {
  const { logout } = useAuth();
  const [activeQuotes, setActiveQuotes] = useState<QuoteData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("0");
  const [showComparison, setShowComparison] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [zoom, setZoom] = useState(0.65);
  const exportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Fetch quotes using TanStack Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      const response = await fetch("/api/quotes");
      if (!response.ok) throw new Error("Failed to fetch quotes");
      const data = await response.json();
      return data.quotes as QuoteData[];
    },
  });

  // Update local state when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      setActiveQuotes(data);
    } else if (!isLoading && (!data || data.length === 0)) {
      setActiveQuotes([{ ...DEFAULT_QUOTE }]);
    }
  }, [data, isLoading]);

  // Show error toast if fetch fails
  useEffect(() => {
    if (error) {
      toast.error("Failed to load quotes");
      setActiveQuotes([{ ...DEFAULT_QUOTE }]);
    }
  }, [error]);

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

  const handleRemoveCard = (idOrIdx: string | number) => {
    if (activeQuotes.length <= 1) {
      toast.error("At least one package is required");
      return;
    }
    let newQuotes;
    if (typeof idOrIdx === "number") {
      newQuotes = activeQuotes.filter((_, idx) => idx !== idOrIdx);
    } else {
      newQuotes = activeQuotes.filter((q, idx) => (q.id ? q.id !== idOrIdx : idx !== Number(idOrIdx)));
    }
    setActiveQuotes(newQuotes);
    setActiveTab("0");
    toast.success("Package removed");
  };

  const handleQuoteChange = (index: number, updatedQuote: QuoteData) => {
    const newQuotes = [...activeQuotes];
    newQuotes[index] = updatedQuote;
    setActiveQuotes(newQuotes);
    // Manual save only - no auto-save
  };

  const handleManualSave = async () => {
    setIsSaving(true);
    try {
      // Save all quotes
      for (let i = 0; i < activeQuotes.length; i++) {
        const quote = activeQuotes[i];
        if (quote.id) {
          // Update existing quote
          await fetch(`/api/quotes/${quote.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quote),
          });
        } else {
          // Create new quote
          const response = await fetch("/api/quotes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quote),
          });
          if (response.ok) {
            const data = await response.json();
            // Update local state with the created quote (now has an ID)
            setActiveQuotes((prev) => {
              const newQuotes = [...prev];
              newQuotes[i] = data.quote;
              return newQuotes;
            });
          }
        }
      }
      toast.success("All quotes saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save quotes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareLink = () => {
    // Check if all quotes are saved
    const unsavedQuotes = activeQuotes.filter(q => !q.id);
    if (unsavedQuotes.length > 0) {
      toast.error("Please save all quotes first before sharing");
      return;
    }

    // Get all quote IDs and create comparison URL
    const quoteIds = activeQuotes.map(q => q.id).join(',');
    const shareUrl = `${window.location.origin}/quote/compare?ids=${quoteIds}`;

    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        toast.success(`Share link copied! Includes ${activeQuotes.length} package${activeQuotes.length > 1 ? 's' : ''}`);
      },
      () => {
        toast.error("Failed to copy link");
      }
    );
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.2));
  };

  const handleResetZoom = () => {
    setZoom(0.45);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        setZoom((prev) => Math.min(Math.max(prev + delta, 0.2), 2));
      }
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, []);

  const exportAsImage = async () => {
    if (!exportRef.current) return;
    const node = exportRef.current as HTMLElement;

    // Find all scaled elements including cards container - same as PDF
    const cardsContainer = node.querySelector(".flex.gap-2") as HTMLElement | null;
    const cardElements = cardsContainer ? (Array.from(cardsContainer.children) as HTMLElement[]) : [];
    const parentContainer = node.querySelector(".flex.flex-col.gap-8") as HTMLElement | null;

    // Save original styles
    const originalStyles = {
      nodeTransform: node.style.transform,
      nodeWidth: node.style.width,
      nodeHeight: node.style.height,
      nodeMinWidth: node.style.minWidth,
      nodeVisibility: node.style.visibility,
      containerGap: cardsContainer?.style.gap || "",
      containerMargin: cardsContainer?.style.marginBottom || "",
      parentGap: parentContainer?.style.gap || "",
      cardStyles: cardElements.map((el) => ({
        transform: el.style.transform,
        marginBottom: el.style.marginBottom,
      })),
    };

    try {
      toast.loading("Generating High-Res PNG...");

      // Hide from view to prevent zoom flash
      node.style.visibility = "hidden";

      // Disable transitions for clean export
      node.style.transition = "none";
      node.style.pointerEvents = "none";

      // Remove all scale transforms and negative margins for export
      node.style.transform = "none";
      node.style.minWidth = "auto";

      // Apply same spacing as PDF for consistent, professional output
      if (cardsContainer) {
        cardsContainer.style.gap = "6rem"; // Same as PDF
        cardsContainer.style.marginBottom = "8rem"; // Add space below cards
      }

      // Increase gap between cards section and comparison table
      if (parentContainer) {
        parentContainer.style.gap = "12rem"; // Same as PDF
      }

      cardElements.forEach((el) => {
        el.style.transition = "none";
        el.style.transform = "none";
        el.style.marginBottom = "0";
      });

      // Force reflow to get accurate measurements
      node.getBoundingClientRect();

      // Measure actual content size after removing transforms
      await new Promise((resolve) => setTimeout(resolve, 100));
      const measuredWidth = Math.ceil(node.scrollWidth);
      const measuredHeight = Math.ceil(node.scrollHeight);

      // Add padding to ensure nothing is clipped
      const exportWidth = measuredWidth + 100;
      const exportHeight = measuredHeight + 100;

      node.style.width = `${exportWidth}px`;
      node.style.height = `${exportHeight}px`;

      // Make visible for capture
      node.style.visibility = "visible";

      const dataUrl = await toPng(node, {
        backgroundColor: "#ffffff",
        pixelRatio: 4,
        quality: 1,
        width: exportWidth,
        height: exportHeight,
      });

      // Restore original styles
      node.style.transform = originalStyles.nodeTransform;
      node.style.width = originalStyles.nodeWidth;
      node.style.height = originalStyles.nodeHeight;
      node.style.minWidth = originalStyles.nodeMinWidth;
      node.style.visibility = originalStyles.nodeVisibility;
      node.style.transition = "";
      node.style.pointerEvents = "";

      if (cardsContainer) {
        cardsContainer.style.gap = originalStyles.containerGap;
        cardsContainer.style.marginBottom = originalStyles.containerMargin;
      }

      if (parentContainer) {
        parentContainer.style.gap = originalStyles.parentGap;
      }

      cardElements.forEach((el, idx) => {
        el.style.transition = "";
        el.style.transform = originalStyles.cardStyles[idx].transform;
        el.style.marginBottom = originalStyles.cardStyles[idx].marginBottom;
      });

      const link = document.createElement("a");
      link.download = `RestoRefine-Quote-${new Date().toISOString().split("T")[0]}.png`;
      link.href = dataUrl;
      link.click();
      toast.dismiss();
      toast.success("Downloading PNG...");
    } catch (err) {
      console.error("Export error:", err);
      toast.dismiss();
      toast.error("Export failed");

      // Restore on error too
      node.style.transform = originalStyles.nodeTransform;
      node.style.width = originalStyles.nodeWidth;
      node.style.height = originalStyles.nodeHeight;
      node.style.minWidth = originalStyles.nodeMinWidth;
      node.style.visibility = originalStyles.nodeVisibility;
      node.style.transition = "";
      node.style.pointerEvents = "";

      if (cardsContainer) {
        cardsContainer.style.gap = originalStyles.containerGap;
        cardsContainer.style.marginBottom = originalStyles.containerMargin;
      }

      if (parentContainer) {
        parentContainer.style.gap = originalStyles.parentGap;
      }

      cardElements.forEach((el, idx) => {
        el.style.transition = "";
        el.style.transform = originalStyles.cardStyles[idx].transform;
        el.style.marginBottom = originalStyles.cardStyles[idx].marginBottom;
      });
    }
  };

  const exportAsPDF = async (pdfFormat?: string) => {
    // If no format provided, ask user to choose
    if (!pdfFormat || typeof pdfFormat !== "string") {
      const formatChoice = await new Promise<string>((resolve) => {
        const options = [
          { value: "a4-landscape", label: "A4 Landscape (Recommended)" },
          { value: "a4-portrait", label: "A4 Portrait" },
          { value: "letter-landscape", label: "Letter Landscape" },
          { value: "letter-portrait", label: "Letter Portrait" },
        ];

        // Create a simple dialog
        const dialog = document.createElement("div");
        dialog.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:2rem;border-radius:1rem;box-shadow:0 20px 60px rgba(0,0,0,0.3);z-index:9999;max-width:400px;";

        const title = document.createElement("h3");
        title.textContent = "Choose PDF Format";
        title.style.cssText = "margin:0 0 1rem 0;font-size:1.25rem;font-weight:bold;color:#0f172a;";
        dialog.appendChild(title);

        const buttonContainer = document.createElement("div");
        buttonContainer.style.cssText = "display:flex;flex-direction:column;gap:0.5rem;";

        options.forEach((option) => {
          const btn = document.createElement("button");
          btn.textContent = option.label;
          btn.style.cssText = "padding:0.75rem 1rem;background:#0f172a;color:white;border:none;border-radius:0.5rem;cursor:pointer;font-weight:600;transition:background 0.2s;";
          btn.onmouseover = () => {
            btn.style.background = "#1e293b";
          };
          btn.onmouseout = () => {
            btn.style.background = "#0f172a";
          };
          btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
              document.body.removeChild(dialog);
              document.body.removeChild(overlay);
            } catch (err) {
              console.error("Error removing dialog:", err);
            }
            resolve(option.value);
          };
          buttonContainer.appendChild(btn);
        });

        dialog.appendChild(buttonContainer);

        const overlay = document.createElement("div");
        overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9998;";
        overlay.onclick = (e) => {
          e.preventDefault();
          try {
            document.body.removeChild(dialog);
            document.body.removeChild(overlay);
          } catch (err) {
            console.error("Error removing dialog:", err);
          }
          resolve("a4-landscape"); // Default if user clicks outside
        };

        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
      });

      // Call recursively with the chosen format
      return exportAsPDF(formatChoice);
    }

    if (!exportRef.current) return;
    const node = exportRef.current as HTMLElement;

    // Find all scaled elements including cards container
    const cardsContainer = node.querySelector(".flex.gap-2") as HTMLElement | null;
    const cardElements = cardsContainer ? (Array.from(cardsContainer.children) as HTMLElement[]) : [];
    const parentContainer = node.querySelector(".flex.flex-col.gap-8") as HTMLElement | null;

    // Save original styles
    const originalStyles = {
      nodeTransform: node.style.transform,
      nodeWidth: node.style.width,
      nodeHeight: node.style.height,
      nodeMinWidth: node.style.minWidth,
      nodeVisibility: node.style.visibility,
      containerGap: cardsContainer?.style.gap || "",
      containerMargin: cardsContainer?.style.marginBottom || "",
      parentGap: parentContainer?.style.gap || "",
      cardStyles: cardElements.map((el) => ({
        transform: el.style.transform,
        marginBottom: el.style.marginBottom,
      })),
    };

    try {
      toast.loading("Generating Premium PDF...");

      // Hide from view to prevent zoom flash
      node.style.visibility = "hidden";

      // Disable transitions for clean export
      node.style.transition = "none";
      node.style.pointerEvents = "none";

      // Remove all scale transforms and negative margins for export
      node.style.transform = "none";
      node.style.minWidth = "auto";

      // Increase gap significantly between cards for PDF to prevent congestion
      if (cardsContainer) {
        cardsContainer.style.gap = "6rem"; // Much larger gap for PDF spacing
        cardsContainer.style.marginBottom = "8rem"; // Add space below cards to prevent table overlap
      }

      // Increase gap between cards section and comparison table
      if (parentContainer) {
        parentContainer.style.gap = "12rem"; // Much larger gap to prevent overlap
      }

      // Reset card transforms and margins - critical for PDF spacing
      cardElements.forEach((el) => {
        el.style.transition = "none";
        el.style.transform = "none"; // Completely remove transform
        el.style.marginBottom = "0"; // Remove negative margins
      });

      // Force reflow to get accurate measurements
      node.getBoundingClientRect();

      // Measure actual content size after removing transforms
      await new Promise((resolve) => setTimeout(resolve, 150));
      const measuredWidth = Math.ceil(node.scrollWidth);
      const measuredHeight = Math.ceil(node.scrollHeight);

      // Add more padding for PDF to ensure proper spacing
      const exportWidth = measuredWidth + 200;
      const exportHeight = measuredHeight + 200;

      node.style.width = `${exportWidth}px`;
      node.style.height = `${exportHeight}px`;

      // Make visible for capture
      node.style.visibility = "visible";

      const dataUrl = await toPng(node, {
        backgroundColor: "#ffffff",
        pixelRatio: 3,
        quality: 1,
        width: exportWidth,
        height: exportHeight,
      });

      // Restore original styles before PDF generation
      node.style.transform = originalStyles.nodeTransform;
      node.style.width = originalStyles.nodeWidth;
      node.style.height = originalStyles.nodeHeight;
      node.style.minWidth = originalStyles.nodeMinWidth;
      node.style.visibility = originalStyles.nodeVisibility;
      node.style.transition = "";
      node.style.pointerEvents = "";

      if (cardsContainer) {
        cardsContainer.style.gap = originalStyles.containerGap;
        cardsContainer.style.marginBottom = originalStyles.containerMargin;
      }

      if (parentContainer) {
        parentContainer.style.gap = originalStyles.parentGap;
      }

      cardElements.forEach((el, idx) => {
        el.style.transition = "";
        el.style.transform = originalStyles.cardStyles[idx].transform;
        el.style.marginBottom = originalStyles.cardStyles[idx].marginBottom;
      });

      // Parse format choice
      const parts = pdfFormat.split("-");
      const format = parts[0] as "a4" | "letter";
      const orientation = parts[1] as "landscape" | "portrait";

      // Create PDF with chosen format
      const pdf = new jsPDF({
        orientation: orientation,
        unit: "mm",
        format: format,
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Add margins to PDF content
      const marginMM = 10;
      const availableWidth = pdfWidth - 2 * marginMM;
      const availableHeight = pdfHeight - 2 * marginMM;

      const ratio = Math.min(availableWidth / imgProps.width, availableHeight / imgProps.height);

      const imgWidth = imgProps.width * ratio;
      const imgHeight = imgProps.height * ratio;

      // Center the image with margins
      const xPos = (pdfWidth - imgWidth) / 2;
      const yPos = (pdfHeight - imgHeight) / 2;

      pdf.addImage(dataUrl, "PNG", xPos, yPos, imgWidth, imgHeight);
      pdf.save(`RestoRefine-Proposal-${format.toUpperCase()}-${orientation}-${new Date().toISOString().split("T")[0]}.pdf`);

      toast.dismiss();
      toast.success("Professional PDF generated");
    } catch (err) {
      console.error("PDF export error:", err);
      toast.dismiss();
      toast.error("PDF generation failed");

      // Restore on error too
      node.style.transform = originalStyles.nodeTransform;
      node.style.width = originalStyles.nodeWidth;
      node.style.height = originalStyles.nodeHeight;
      node.style.minWidth = originalStyles.nodeMinWidth;
      node.style.visibility = originalStyles.nodeVisibility;
      node.style.transition = "";
      node.style.pointerEvents = "";

      if (cardsContainer) {
        cardsContainer.style.gap = originalStyles.containerGap;
        cardsContainer.style.marginBottom = originalStyles.containerMargin;
      }

      if (parentContainer) {
        parentContainer.style.gap = originalStyles.parentGap;
      }

      cardElements.forEach((el, idx) => {
        el.style.transition = "";
        el.style.transform = originalStyles.cardStyles[idx].transform;
        el.style.marginBottom = originalStyles.cardStyles[idx].marginBottom;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-black text-white gap-6">
        {/* Subtle red blur effect */}
        <div className="absolute inset-0 bg-gradient-radial from-red-500/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[100px]" />
        <Image src="/r-logo.png" alt="RestoRefine Logo" width={64} height={64} className=" shadow-2xl animate-bounce" />
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
      <aside className="w-64 bg-gray-950 text-slate-400 flex flex-col h-full border-r border-slate-800 shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <Image src="/r-logo.png" alt="RestoRefine Logo" width={32} height={32} className="object-contain" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {/* Navigation Buttons */}
          <div className="mb-6 space-y-2">
            <Link href="/history">
              <Button variant="ghost" className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-800">
                <History size={18} />
                <span>Quote History</span>
              </Button>
            </Link>
            <Button
              onClick={handleManualSave}
              disabled={isSaving}
              className="w-full justify-start gap-3 bg-red-500 hover:bg-red-600 text-white font-bold"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span>Save All Quotes</span>
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Packages</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleAddCard} className="h-6 w-6 text-slate-400 hover:text-white">
              <Plus size={16} />
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="space-y-2">
            <TabsList className="flex flex-col h-auto bg-transparent gap-2 w-full">
              {activeQuotes.map((q, idx) => (
                <TabsTrigger key={q.id || idx} value={idx.toString()} className="w-full justify-start gap-3 p-3 rounded-xl transition-all data-[state=active]:bg-accent data-[state=active]:text-white hover:bg-slate-800 hover:text-slate-200 border-none group">
                  <div className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center text-[10px] shrink-0">{idx + 0}</div>
                  <span className="truncate flex-1 text-left">{q.packageName}</span>
                  {activeQuotes.length > 1 && (
                    <span
                      role="button"
                      tabIndex={0}
                      className="h-6 w-6 flex items-center justify-center text-white hover:bg-white hover:rounded-sm hover:text-red-400  cursor-pointer ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCard(q.id ?? idx);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.stopPropagation();
                          handleRemoveCard(q.id ?? idx);
                        }
                      }}
                      aria-label="Delete card"
                    >
                      <Trash2 size={16} />
                    </span>
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
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Zoom Controls</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button onClick={handleZoomOut} variant="outline" className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white border-none h-10">
                  <ZoomOut size={16} />
                </Button>
                <Button onClick={handleResetZoom} variant="outline" className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white border-none h-10 text-xs">
                  {Math.round(zoom * 100)}%
                </Button>
                <Button onClick={handleZoomIn} variant="outline" className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white border-none h-10">
                  <ZoomIn size={16} />
                </Button>
              </div>
              <p className="text-[10px] text-slate-500 italic text-center">Ctrl+Scroll to zoom</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={exportAsImage} variant="outline" className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white border-none h-12">
                  <Download size={18} className="mr-2" /> PNG
                </Button>
                <Button onClick={() => exportAsPDF()} variant="outline" className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white border-none h-12">
                  <Download size={18} className="mr-2" /> PDF
                </Button>
              </div>
              <Button
                onClick={handleShareLink}
                variant="outline"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white border-none h-12 font-bold"
              >
                <Share2 size={18} className="mr-2" /> Share Link
              </Button>
            </div>
          </div>
        </div>

        {/* Footer with Logout */}
        <div className="p-4 border-t border-slate-800">
          <Button
            onClick={logout}
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-400 hover:text-red-500 hover:bg-slate-800"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Button>
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
          <div ref={canvasRef} className="flex max-h-screen overflow-auto bg-slate-100 p-8 max-w-full custom-scrollbar relative">
            <div ref={exportRef} className="p-12 bg-slate-50 mx-auto rounded-2xl transition-transform duration-200" style={{ width: "fit-content", minWidth: 3000, overflow: "visible", transform: `scale(${zoom})` }}>
              <div className="flex flex-col gap-8 items-center">
                {/* Package Cards View */}
                <div className="flex gap-2 justify-center items-start">
                  {activeQuotes.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      className="shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-500"
                      style={{
                        animationDelay: `${idx * 80}ms`,
                        transform: "scale(0.62)",
                        transformOrigin: "top center",
                        marginBottom: "-320px",
                      }}
                    >
                      <QuotePreview quote={q} />
                    </div>
                  ))}
                </div>

                {/* Comparison Table */}
                {showComparison && (
                  <div className="bg-white w-full rounded-3xl p-8 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                      <TableIcon className="text-accent" />
                      Detailed Package Comparison
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="text-left py-4 px-6 bg-slate-50 rounded-tl-2xl border-b border-slate-200 text-slate-500 font-bold  uppercase tracking-wider text-xl">Feature</th>
                            {activeQuotes.map((q, idx) => (
                              <th key={q.id || idx} className="text-center py-4 px-6 bg-slate-50 border-b border-slate-200 text-slate-900 font-bold min-w-[200px] text-xl">
                                {q.packageName}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="py-4 px-6 text-xl font-medium text-slate-700">Short-Form Videos</td>
                            {activeQuotes.map((q, idx) => (
                              <td key={q.id || idx} className="py-4 px-6 text-center font-bold text-accent text-2xl">
                                {q.showVideos ? q.videoCount : <span className="text-slate-300">—</span>}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-4 px-6 text-xl font-medium text-slate-700">Professional Photos</td>
                            {activeQuotes.map((q, idx) => (
                              <td key={q.id || idx} className="py-4 px-6 text-center font-bold text-accent text-2xl">
                                {q.showPhotos ? q.photoCount : <span className="text-slate-300">—</span>}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-4 px-6 text-xl font-medium text-slate-700">Platforms</td>
                            {activeQuotes.map((q, idx) => (
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
                            <td className="py-4 px-6 text-xl font-medium text-slate-700">Platform Management</td>
                            {activeQuotes.map((q, idx) => (
                              <td key={q.id || idx} className="py-4 px-6 text-center text-xl text-emerald-500">
                                Included
                              </td>
                            ))}
                          </tr>
                          {ADD_ONS.map((addon) => (
                            <tr key={addon}>
                              <td className="py-4 px-6 text-xl font-medium text-slate-700">{addon}</td>
                              {activeQuotes.map((q, idx) => (
                                <td key={q.id || idx} className="py-4 px-6 text-center">
                                  {q.addOns.includes(addon) ? <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl">✓</span> : <span className="text-slate-300 text-xl">—</span>}
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
