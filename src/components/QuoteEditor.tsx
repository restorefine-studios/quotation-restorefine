import { QuoteData, PLATFORMS, ADD_ONS } from '../types/quote'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { CheckCircle2, Plus, Minus, X, Zap } from 'lucide-react'
import { Switch } from './ui/switch'
import { useState } from 'react'

interface QuoteEditorProps {
  quote: QuoteData
  onChange: (quote: QuoteData) => void
  onSave: (quote: QuoteData) => void
}

export function QuoteEditor({ quote, onChange, onSave }: QuoteEditorProps) {
  const [customAddon, setCustomAddon] = useState('')
  const [customPlatform, setCustomPlatform] = useState('')

  const handleChange = (field: keyof QuoteData, value: any) => {
    onChange({ ...quote, [field]: value })
  }

  const togglePlatform = (platform: string) => {
    const newPlatforms = quote.platforms.includes(platform)
      ? quote.platforms.filter(p => p !== platform)
      : [...quote.platforms, platform]
    handleChange('platforms', newPlatforms)
  }

  const addCustomPlatform = () => {
    if (!customPlatform.trim()) return
    if (!quote.platforms.includes(customPlatform.trim())) {
      handleChange('platforms', [...quote.platforms, customPlatform.trim()])
    }
    setCustomPlatform('')
  }

  const removePlatform = (platform: string) => {
    handleChange('platforms', quote.platforms.filter(p => p !== platform))
  }

  const toggleAddOn = (addon: string) => {
    const newAddOns = quote.addOns.includes(addon)
      ? quote.addOns.filter(a => a !== addon)
      : [...quote.addOns, addon]
    handleChange('addOns', newAddOns)
  }

  const addCustomAddon = () => {
    if (!customAddon.trim()) return
    if (!quote.addOns.includes(customAddon.trim())) {
      handleChange('addOns', [...quote.addOns, customAddon.trim()])
    }
    setCustomAddon('')
  }

  const removeAddOn = (addon: string) => {
    handleChange('addOns', quote.addOns.filter(a => a !== addon))
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Client Name</Label>
            <Input 
              value={quote.clientName} 
              onChange={(e) => handleChange('clientName', e.target.value)}
              placeholder="e.target.value"
              className="input-standard"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Package Title</Label>
            <Input 
              value={quote.packageName} 
              onChange={(e) => handleChange('packageName', e.target.value)}
              className="input-standard font-bold"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subtitle</Label>
            <Input 
              value={quote.subtitle} 
              onChange={(e) => handleChange('subtitle', e.target.value)}
              className="input-standard text-accent font-medium"
            />
          </div>
        </div>

        <div className="w-full h-px bg-slate-100" />

        {/* Deliverables */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            <div className="space-y-0.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Section Visibility</Label>
              <p className="text-[10px] text-slate-500 font-medium">Toggle Video/Photo sections</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Videos</span>
                <Switch 
                  checked={quote.showVideos} 
                  onCheckedChange={(checked) => handleChange('showVideos', checked)} 
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Photos</span>
                <Switch 
                  checked={quote.showPhotos} 
                  onCheckedChange={(checked) => handleChange('showPhotos', checked)} 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`space-y-1.5 transition-opacity ${!quote.showVideos ? 'opacity-30 pointer-events-none' : ''}`}>
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Videos</Label>
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1">
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-md hover:bg-white" onClick={() => handleChange('videoCount', Math.max(0, quote.videoCount - 1))}>
                  <Minus size={14} />
                </Button>
                <span className="flex-1 text-center font-bold">{quote.videoCount}</span>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-md hover:bg-white" onClick={() => handleChange('videoCount', quote.videoCount + 1)}>
                  <Plus size={14} />
                </Button>
              </div>
            </div>
            <div className={`space-y-1.5 transition-opacity ${!quote.showPhotos ? 'opacity-30 pointer-events-none' : ''}`}>
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Photos</Label>
               <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1">
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-md hover:bg-white" onClick={() => handleChange('photoCount', Math.max(0, quote.photoCount - 1))}>
                  <Minus size={14} />
                </Button>
                <span className="flex-1 text-center font-bold">{quote.photoCount}</span>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-md hover:bg-white" onClick={() => handleChange('photoCount', quote.photoCount + 1)}>
                  <Plus size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-slate-100" />

        {/* Platforms */}
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Platforms</Label>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${quote.platforms.includes(p) ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                >
                  {p}
                </button>
              ))}
              {quote.platforms.filter(p => !PLATFORMS.includes(p)).map(p => (
                <div key={p} className="flex items-center gap-1 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-md shadow-black/10">
                  <span>{p}</span>
                  <button onClick={() => removePlatform(p)} className="ml-1 hover:text-red-400">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input 
                value={customPlatform}
                onChange={(e) => setCustomPlatform(e.target.value)}
                placeholder="Add platform (e.g. YouTube)..."
                className="input-standard h-9 text-[11px]"
                onKeyDown={(e) => e.key === 'Enter' && addCustomPlatform()}
              />
              <Button size="sm" onClick={addCustomPlatform} className="btn-primary h-9 px-3">
                <Plus size={14} />
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-slate-100" />

        {/* Add-ons */}
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Add-ons</Label>
          <div className="space-y-2">
            {ADD_ONS.map(addon => (
              <div 
                key={addon} 
                onClick={() => toggleAddOn(addon)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${quote.addOns.includes(addon) ? 'bg-red-50 border-red-200 text-slate-900' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${quote.addOns.includes(addon) ? 'bg-accent text-white' : 'bg-slate-100'}`}>
                  {quote.addOns.includes(addon) && <CheckCircle2 size={12} />}
                </div>
                <span className="text-[11px] font-bold">{addon}</span>
              </div>
            ))}
            
            {/* Custom Add-ons display */}
            {quote.addOns.filter(a => !ADD_ONS.includes(a)).map(addon => (
              <div 
                key={addon} 
                className="flex items-center gap-3 p-3 rounded-xl border bg-red-50 border-red-200 text-slate-900"
              >
                <div className="w-5 h-5 rounded-md flex items-center justify-center bg-accent text-white">
                  <CheckCircle2 size={12} />
                </div>
                <span className="text-[11px] font-bold flex-1">{addon}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-500" onClick={() => removeAddOn(addon)}>
                  <X size={14} />
                </Button>
              </div>
            ))}

            {/* Custom Add-on input */}
            <div className="flex gap-2 pt-2">
              <Input 
                value={customAddon}
                onChange={(e) => setCustomAddon(e.target.value)}
                placeholder="Custom add-on..."
                className="input-standard h-9 text-[11px]"
                onKeyDown={(e) => e.key === 'Enter' && addCustomAddon()}
              />
              <Button size="sm" onClick={addCustomAddon} className="btn-primary h-9 px-3">
                <Plus size={14} />
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-slate-100" />

        {/* Pricing */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Investment (£)</Label>
          <Input 
            value={quote.price} 
            onChange={(e) => handleChange('price', e.target.value)}
            className="input-standard text-2xl font-black text-slate-900"
            type="number"
          />
        </div>

        <div className="w-full h-px bg-slate-100" />

        {/* CTA Editing */}
        <div className="bg-slate-900 rounded-[2rem] p-6 text-white space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest leading-tight">CTA Configuration</h3>
              <p className="text-[10px] text-slate-400 font-bold tracking-wider">Final conversion block</p>
            </div>
          </div>
          
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Section Title (Small Pulse)</Label>
              <Input 
                value={quote.ctaTitle} 
                onChange={(e) => handleChange('ctaTitle', e.target.value)}
                placeholder="READY TO START?"
                className="bg-white/5 border-white/10 text-white focus:border-red-600 focus:ring-red-600/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Main Call-to-Action Text</Label>
              <Input 
                value={quote.ctaText} 
                onChange={(e) => handleChange('ctaText', e.target.value)}
                placeholder="Reply GO to activate"
                className="bg-white/5 border-white/10 text-white focus:border-red-600 focus:ring-red-600/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Word to Highlight</Label>
                <Input 
                  value={quote.ctaHighlight} 
                  onChange={(e) => handleChange('ctaHighlight', e.target.value)}
                  placeholder="GO"
                  className="bg-white/5 border-white/10 text-white font-black uppercase focus:border-red-600 focus:ring-red-600/20"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Highlight Color</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color"
                    value={quote.ctaHighlightColor} 
                    onChange={(e) => handleChange('ctaHighlightColor', e.target.value)}
                    className="w-10 h-10 p-0 rounded-md border-none cursor-pointer bg-transparent"
                  />
                  <Input 
                    value={quote.ctaHighlightColor} 
                    onChange={(e) => handleChange('ctaHighlightColor', e.target.value)}
                    className="bg-white/5 border-white/10 text-white font-mono uppercase text-[10px] flex-1 focus:border-red-600 focus:ring-red-600/20 h-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="space-y-0.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Show Underline</Label>
                <p className="text-[9px] text-slate-500 font-bold italic">Adds a stylized underline to highlighted text</p>
              </div>
              <Switch 
                checked={quote.ctaHighlightUnderline} 
                onCheckedChange={(checked) => handleChange('ctaHighlightUnderline', checked)} 
                className="data-[state=checked]:bg-red-600"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Footer Note (Trust Badge)</Label>
              <Input 
                value={quote.ctaFooter} 
                onChange={(e) => handleChange('ctaFooter', e.target.value)}
                placeholder="Premium Content Quality Guaranteed"
                className="bg-white/5 border-white/10 text-white focus:border-red-600 focus:ring-red-600/20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
