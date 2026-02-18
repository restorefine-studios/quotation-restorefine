import { QuoteData, PLATFORMS, ADD_ONS } from "../types/quote";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { CheckCircle2, Plus, Minus, X, Zap, Upload, Trash2, User, FileText, Video, Camera, Globe, DollarSign, Sparkles } from "lucide-react";
import { Switch } from "./ui/switch";
import { useState } from "react";
import Image from "next/image";

interface QuoteEditorProps {
  quote: QuoteData;
  onChange: (quote: QuoteData) => void;
  onSave: (quote: QuoteData) => void;
}

export function QuoteEditor({ quote, onChange, onSave }: QuoteEditorProps) {
  const [customAddon, setCustomAddon] = useState("");
  const [customPlatform, setCustomPlatform] = useState("");

  const handleChange = (field: keyof QuoteData, value: any) => {
    onChange({ ...quote, [field]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange("clientLogo", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeClientLogo = () => {
    handleChange("clientLogo", undefined);
  };

  const togglePlatform = (platform: string) => {
    const newPlatforms = quote.platforms.includes(platform) ? quote.platforms.filter((p) => p !== platform) : [...quote.platforms, platform];
    handleChange("platforms", newPlatforms);
  };

  const addCustomPlatform = () => {
    if (!customPlatform.trim()) return;
    if (!quote.platforms.includes(customPlatform.trim())) {
      handleChange("platforms", [...quote.platforms, customPlatform.trim()]);
    }
    setCustomPlatform("");
  };

  const removePlatform = (platform: string) => {
    handleChange(
      "platforms",
      quote.platforms.filter((p) => p !== platform),
    );
  };

  const toggleAddOn = (addon: string) => {
    const newAddOns = quote.addOns.includes(addon) ? quote.addOns.filter((a) => a !== addon) : [...quote.addOns, addon];
    handleChange("addOns", newAddOns);
  };

  const addCustomAddon = () => {
    if (!customAddon.trim()) return;
    if (!quote.addOns.includes(customAddon.trim())) {
      handleChange("addOns", [...quote.addOns, customAddon.trim()]);
    }
    setCustomAddon("");
  };

  const removeAddOn = (addon: string) => {
    handleChange(
      "addOns",
      quote.addOns.filter((a) => a !== addon),
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Client Information Section */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-5 border border-slate-200/50 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white">
            <User size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">Client Details</h3>
            <p className="text-[10px] text-slate-500 font-medium">Customer information</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Client Name</Label>
            <Input value={quote.clientName} onChange={(e) => handleChange("clientName", e.target.value)} placeholder="Enter client name" className="bg-white border-slate-200 focus:border-slate-900 focus:ring-slate-900/10 h-11" />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Client Logo (Optional)</Label>
            {quote.clientLogo ? (
              <div className="relative w-full p-4 bg-white rounded-xl border-2 border-slate-200 flex items-center gap-4 shadow-sm">
                <div className="w-24 h-16 relative bg-slate-50 rounded-lg overflow-hidden">
                  <Image src={quote.clientLogo} alt="Client Logo" fill className="object-contain p-2" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-700">Logo uploaded</p>
                  <p className="text-[10px] text-slate-500">Visible in proposal header</p>
                </div>
                <Button onClick={removeClientLogo} variant="outline" size="sm" className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300">
                  <Trash2 size={14} className="mr-1" /> Remove
                </Button>
              </div>
            ) : (
              <label className="relative w-full p-6 bg-white rounded-xl border-2 border-dashed border-slate-300 hover:border-slate-900 hover:bg-slate-50 cursor-pointer transition-all flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                  <Upload size={20} className="text-slate-600" />
                </div>
                <p className="text-xs font-semibold text-slate-700">Click to upload client logo</p>
                <p className="text-[10px] text-slate-500">PNG, JPG, SVG (max 2MB)</p>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Package Information Section */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-5 border border-slate-200/50 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white">
            <FileText size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">Package Info</h3>
            <p className="text-[10px] text-slate-500 font-medium">Proposal titles & description</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Package Title</Label>
            <Input value={quote.packageName} onChange={(e) => handleChange("packageName", e.target.value)} placeholder="e.g., Social Media Growth Package" className="bg-white border-slate-200 focus:border-slate-900 focus:ring-slate-900/10 h-11 font-semibold" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Subtitle</Label>
            <Input value={quote.subtitle} onChange={(e) => handleChange("subtitle", e.target.value)} placeholder="e.g., Premium Content Strategy" className="bg-white border-slate-200 focus:border-slate-900 focus:ring-slate-900/10 h-11" />
          </div>
        </div>
      </div>

      {/* Content Deliverables Section */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-5 border border-slate-200/50 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white">
            <Camera size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">Content Deliverables</h3>
            <p className="text-[10px] text-slate-500 font-medium">Videos & photos included</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div className="space-y-0.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Section Visibility</Label>
              <p className="text-[10px] text-slate-500 font-medium">Toggle Video/Photo sections</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-700 uppercase">Videos</span>
                <Switch checked={quote.showVideos} onCheckedChange={(checked) => handleChange("showVideos", checked)} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-700 uppercase">Photos</span>
                <Switch checked={quote.showPhotos} onCheckedChange={(checked) => handleChange("showPhotos", checked)} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`space-y-2 transition-opacity ${!quote.showVideos ? "opacity-30 pointer-events-none" : ""}`}>
              <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Video Count</Label>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm">
                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-lg hover:bg-slate-100" onClick={() => handleChange("videoCount", Math.max(0, quote.videoCount - 1))}>
                  <Minus size={16} />
                </Button>
                <span className="flex-1 text-center font-bold text-lg text-slate-900">{quote.videoCount}</span>
                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-lg hover:bg-slate-100" onClick={() => handleChange("videoCount", quote.videoCount + 1)}>
                  <Plus size={16} />
                </Button>
              </div>
            </div>
            <div className={`space-y-2 transition-opacity ${!quote.showPhotos ? "opacity-30 pointer-events-none" : ""}`}>
              <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Photo Count</Label>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm">
                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-lg hover:bg-slate-100" onClick={() => handleChange("photoCount", Math.max(0, quote.photoCount - 1))}>
                  <Minus size={16} />
                </Button>
                <span className="flex-1 text-center font-bold text-lg text-slate-900">{quote.photoCount}</span>
                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-lg hover:bg-slate-100" onClick={() => handleChange("photoCount", quote.photoCount + 1)}>
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platforms Section */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-5 border border-slate-200/50 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white">
            <Globe size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">Target Platforms</h3>
            <p className="text-[10px] text-slate-500 font-medium">Social media channels</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${quote.platforms.includes(p) ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20" : "bg-white text-slate-600 border-slate-200 hover:border-slate-900 hover:shadow-md"}`}
              >
                {p}
              </button>
            ))}
            {quote.platforms
              .filter((p) => !PLATFORMS.includes(p))
              .map((p) => (
                <div key={p} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-slate-900/20">
                  <span>{p}</span>
                  <button onClick={() => removePlatform(p)} className="hover:text-red-400 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={customPlatform}
              onChange={(e) => setCustomPlatform(e.target.value)}
              placeholder="Add custom platform (e.g., YouTube)..."
              className="bg-white border-slate-200 focus:border-slate-900 focus:ring-slate-900/10 h-11 text-sm"
              onKeyDown={(e) => e.key === "Enter" && addCustomPlatform()}
            />
            <Button size="sm" onClick={addCustomPlatform} className="bg-slate-900 hover:bg-slate-800 text-white h-11 px-4">
              <Plus size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Add-ons Section */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-5 border border-slate-200/50 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">Premium Add-ons</h3>
            <p className="text-[10px] text-slate-500 font-medium">Extra services & features</p>
          </div>
        </div>

        <div className="space-y-2">
          {ADD_ONS.map((addon) => (
            <div key={addon} onClick={() => toggleAddOn(addon)} className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${quote.addOns.includes(addon) ? "bg-red-50 border-red-200 shadow-sm" : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"}`}>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${quote.addOns.includes(addon) ? "bg-red-600 text-white scale-110" : "bg-slate-100 text-slate-400"}`}>{quote.addOns.includes(addon) && <CheckCircle2 size={14} />}</div>
              <span className={`text-sm font-bold ${quote.addOns.includes(addon) ? "text-slate-900" : "text-slate-600"}`}>{addon}</span>
            </div>
          ))}

          {/* Custom Add-ons display */}
          {quote.addOns
            .filter((a) => !ADD_ONS.includes(a))
            .map((addon) => (
              <div key={addon} className="flex items-center gap-3 p-3.5 rounded-xl border-2 bg-red-50 border-red-200 shadow-sm">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-red-600 text-white">
                  <CheckCircle2 size={14} />
                </div>
                <span className="text-sm font-bold text-slate-900 flex-1">{addon}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAddOn(addon);
                  }}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}

          {/* Custom Add-on input */}
          <div className="flex gap-2 pt-2">
            <Input value={customAddon} onChange={(e) => setCustomAddon(e.target.value)} placeholder="Add custom add-on..." className="bg-white border-slate-200 focus:border-slate-900 focus:ring-slate-900/10 h-11 text-sm" onKeyDown={(e) => e.key === "Enter" && addCustomAddon()} />
            <Button size="sm" onClick={addCustomAddon} className="bg-slate-900 hover:bg-slate-800 text-white h-11 px-4">
              <Plus size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-5 border border-slate-200/50 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white">
            <DollarSign size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">Pricing</h3>
            <p className="text-[10px] text-slate-500 font-medium">Monthly investment</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Price (£)</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-400">£</span>
            <Input value={quote.price} onChange={(e) => handleChange("price", e.target.value)} className="bg-white border-slate-200 focus:border-slate-900 focus:ring-slate-900/10 h-16 pl-12 text-3xl font-black text-slate-900" type="number" placeholder="995" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Price Subtext</Label>
            <Input value={quote.priceSubtext} onChange={(e) => handleChange("priceSubtext", e.target.value)} placeholder="Billed monthly in advance" className="bg-white border-slate-200 focus:border-slate-900 focus:ring-slate-900/10 h-11" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Term Label</Label>
            <Input value={quote.initialTermLabel} onChange={(e) => handleChange("initialTermLabel", e.target.value)} placeholder="Initial Term" className="bg-white border-slate-200 focus:border-slate-900 focus:ring-slate-900/10 h-11" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Term Value</Label>
            <Input value={quote.initialTerm} onChange={(e) => handleChange("initialTerm", e.target.value)} placeholder="3 Months" className="bg-white border-slate-200 focus:border-slate-900 focus:ring-slate-900/10 h-11" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Notice Label</Label>
            <Input value={quote.exitNoticeLabel} onChange={(e) => handleChange("exitNoticeLabel", e.target.value)} placeholder="Exit Notice" className="bg-white border-slate-200 focus:border-slate-900 focus:ring-slate-900/10 h-11" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Notice Value</Label>
            <Input value={quote.exitNotice} onChange={(e) => handleChange("exitNotice", e.target.value)} placeholder="30 Days" className="bg-white border-slate-200 focus:border-slate-900 focus:ring-slate-900/10 h-11" />
          </div>
        </div>

        <div className="flex mt-4 items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Managed Services</Label>
            <p className="text-[10px] text-slate-400">Include posting, captions, hashtags & analytics</p>
          </div>
          <Switch checked={quote.showManagement !== false} onCheckedChange={(checked) => handleChange("showManagement", checked)} />
        </div>
      </div>

      {/* CTA Editing */}
      <div className="bg-slate-900 rounded-[2rem] p-6 text-white space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest leading-tight">CTA Configuration</h3>
              <p className="text-[10px] text-slate-400 font-bold tracking-wider">Final conversion block</p>
            </div>
          </div>
          <Switch checked={quote.showCTA !== false} onCheckedChange={(checked) => handleChange("showCTA", checked)} className="data-[state=checked]:bg-red-600" />
        </div>

        <div className={`space-y-5 transition-opacity ${quote.showCTA === false ? "opacity-30 pointer-events-none" : ""}`}>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Section Title (Small Pulse)</Label>
            <Input value={quote.ctaTitle} onChange={(e) => handleChange("ctaTitle", e.target.value)} placeholder="READY TO START?" className="bg-white/5 border-white/10 text-white focus:border-red-600 focus:ring-red-600/20" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Main Call-to-Action Text</Label>
            <Input value={quote.ctaText} onChange={(e) => handleChange("ctaText", e.target.value)} placeholder="Reply GO to activate" className="bg-white/5 border-white/10 text-white focus:border-red-600 focus:ring-red-600/20" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Word to Highlight</Label>
              <Input value={quote.ctaHighlight} onChange={(e) => handleChange("ctaHighlight", e.target.value)} placeholder="GO" className="bg-white/5 border-white/10 text-white font-black uppercase focus:border-red-600 focus:ring-red-600/20" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Highlight Color</Label>
              <div className="flex gap-2">
                <Input type="color" value={quote.ctaHighlightColor} onChange={(e) => handleChange("ctaHighlightColor", e.target.value)} className="w-10 h-10 p-0 rounded-md border-none cursor-pointer bg-transparent" />
                <Input value={quote.ctaHighlightColor} onChange={(e) => handleChange("ctaHighlightColor", e.target.value)} className="bg-white/5 border-white/10 text-white font-mono uppercase text-[10px] flex-1 focus:border-red-600 focus:ring-red-600/20 h-10" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="space-y-0.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Show Underline</Label>
              <p className="text-[9px] text-slate-500 font-bold italic">Adds a stylized underline to highlighted text</p>
            </div>
            <Switch checked={quote.ctaHighlightUnderline} onCheckedChange={(checked) => handleChange("ctaHighlightUnderline", checked)} className="data-[state=checked]:bg-red-600" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Footer Note (Trust Badge)</Label>
            <Input value={quote.ctaFooter} onChange={(e) => handleChange("ctaFooter", e.target.value)} placeholder="Premium Content Quality Guaranteed" className="bg-white/5 border-white/10 text-white focus:border-red-600 focus:ring-red-600/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
