import { QuoteData, PLATFORMS, ADD_ONS } from '../types/quote'
import { Video, Camera, Instagram, Send, Calendar, CheckCircle2, Zap, ArrowRight, ShieldCheck } from 'lucide-react'
import { forwardRef } from 'react'

interface QuotePreviewProps {
  quote: QuoteData
}

export const QuotePreview = forwardRef<HTMLDivElement, QuotePreviewProps>(({ quote }, ref) => {
  return (
    <div 
      ref={ref}
      className="w-full aspect-[1/1.414] mx-auto bg-white text-slate-900 shadow-2xl font-sans flex flex-col overflow-hidden relative"
      style={{ minHeight: '842px' }} // A4 approx height for a fixed width
    >
      {/* Texture Overlay for Premium Feel */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

      {/* 1. Header Section */}
      <div className="bg-[#0F172A] p-12 pb-24 relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-12">
             <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-red-600/40 rotate-3">R</div>
              <div>
                <h4 className="text-white font-black tracking-tighter text-2xl leading-tight">RestoRefine</h4>
                <p className="text-red-500 text-xs font-black uppercase tracking-[0.3em]">Restaurant Growth</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Prepared For</p>
              <h2 className="text-white text-2xl font-black tracking-tight underline decoration-red-600/30 underline-offset-8">{quote.clientName || 'Valued Partner'}</h2>
            </div>
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-2">
               <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
               <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Growth Proposal • {new Date().toLocaleDateString('en-GB')}</span>
            </div>
            <h1 className="text-white text-6xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase max-w-[80%]">
              {quote.packageName || 'Growth Package'}
            </h1>
            <p className="text-slate-400 text-xl font-medium tracking-wide border-l-4 border-red-600 pl-4 py-1">
              {quote.subtitle || 'Dominate your local market with premium content'}
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-12 py-12 space-y-12 relative -mt-12 bg-white rounded-t-[4rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.2)] flex flex-col">
        
        {/* 2. Deliverables Section */}
        <div className={`grid ${quote.showVideos && quote.showPhotos ? 'grid-cols-2' : 'grid-cols-1'} gap-8`}>
          {quote.showVideos && (
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Video size={80} />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/20">
                  <Video size={28} />
                </div>
                <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Video Production</span>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-black text-slate-900 tracking-tighter">{quote.videoCount}</span>
                  <span className="text-2xl font-black text-red-600 uppercase italic">Reels</span>
                </div>
                <p className="text-slate-500 text-sm font-bold mt-1 tracking-tight">15-30s High-Engagement Vertical Video</p>
              </div>
            </div>
          )}

          {quote.showPhotos && (
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Camera size={80} />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/20">
                  <Camera size={28} />
                </div>
                <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Photography</span>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-black text-slate-900 tracking-tighter">{quote.photoCount}</span>
                  <span className="text-2xl font-black text-red-600 uppercase italic">Frames</span>
                </div>
                <p className="text-slate-500 text-sm font-bold mt-1 tracking-tight">Premium Food & Lifestyle Visuals</p>
              </div>
            </div>
          )}
        </div>

        {/* 3. Platforms & Management */}
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-slate-900 text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <div className="w-6 h-[2px] bg-red-600" />
              Platform Ecosystem
            </h3>
            <div className="flex flex-wrap gap-3">
              {quote.platforms.map(p => (
                <div key={p} className="flex items-center gap-2.5 bg-[#0F172A] text-white px-5 py-3 rounded-2xl text-xs font-black shadow-xl shadow-slate-900/10 hover:translate-y-[-2px] transition-transform">
                  {p === 'Instagram' ? <Instagram size={14} className="text-red-500" /> : <Zap size={14} className="text-red-500" />}
                  {p}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-slate-900 text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <div className="w-6 h-[2px] bg-red-600" />
              Fully Managed Services
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-xs text-slate-700 font-black italic">
                <div className="w-6 h-6 bg-red-50 rounded-lg flex items-center justify-center"><CheckCircle2 size={14} className="text-red-600" /></div> Posting
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-700 font-black italic">
                <div className="w-6 h-6 bg-red-50 rounded-lg flex items-center justify-center"><CheckCircle2 size={14} className="text-red-600" /></div> Captions
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-700 font-black italic">
                <div className="w-6 h-6 bg-red-50 rounded-lg flex items-center justify-center"><CheckCircle2 size={14} className="text-red-600" /></div> Hashtags
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-700 font-black italic">
                <div className="w-6 h-6 bg-red-50 rounded-lg flex items-center justify-center"><CheckCircle2 size={14} className="text-red-600" /></div> Analytics
              </div>
            </div>
          </div>
        </div>

        {/* 4. Add-Ons Section */}
        {quote.addOns.length > 0 && (
          <div className="space-y-6">
             <h3 className="text-slate-900 text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <div className="w-6 h-[2px] bg-red-600" />
              Premium Add-ons Available
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {quote.addOns.map(addon => (
                <div key={addon} className="flex items-center gap-3 bg-red-50/30 p-4 rounded-2xl border border-red-100/50 hover:bg-red-50 transition-colors">
                   <Zap size={14} className="text-red-600 shrink-0" />
                   <span className="text-slate-800 text-[11px] font-black uppercase tracking-tight">{addon}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1" />

        {/* 5 & 6. Pricing & Terms */}
        <div className="bg-[#0F172A] text-white rounded-[4rem] p-12 relative overflow-hidden group shadow-3xl shadow-red-900/20 mt-auto">
          <div className="absolute bottom-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
            <Zap size={250} className="text-white" />
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
            <div>
              <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.4em] mb-3">Your Monthly Investment</p>
              <div className="flex items-baseline gap-3">
                <span className="text-8xl font-black text-white tracking-tighter drop-shadow-lg">£{quote.price}</span>
                <span className="text-slate-400 text-2xl font-black italic">/ month</span>
              </div>
              <p className="text-slate-500 text-sm font-black mt-2 tracking-widest uppercase">Billed monthly in advance</p>
            </div>
            
            <div className="flex flex-col gap-5 bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 min-w-[280px]">
               <div className="flex items-center gap-3 text-xs text-red-500 font-black uppercase tracking-[0.2em]">
                <Calendar size={18} /> Partnership Terms
               </div>
               <div className="flex gap-10">
                  <div className="space-y-1">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Initial Term</p>
                    <p className="text-white text-2xl font-black">3 Months</p>
                  </div>
                  <div className="w-px h-12 bg-white/10" />
                  <div className="space-y-1">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Exit Notice</p>
                    <p className="text-white text-2xl font-black">30 Days</p>
                  </div>
               </div>
               <p className="text-[10px] text-slate-500 font-bold italic">Monthly rolling agreement thereafter.</p>
            </div>
          </div>
        </div>

        {/* 7. CTA Section */}
        <div className="pt-8 flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4">
            <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">
              {quote.ctaTitle || 'RESERVE YOUR PACKAGE'}
            </p>
            <div className="flex items-center gap-6 group cursor-pointer">
              <span className="text-4xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">
                {quote.ctaText?.split(new RegExp(`(${quote.ctaHighlight || 'GO'})`, 'g')).map((part, i) => (
                  <span key={i}>
                    {part === (quote.ctaHighlight || 'GO') ? (
                      <span 
                        className="relative px-1"
                        style={{ 
                          color: quote.ctaHighlightColor || '#EF4444',
                        }}
                      >
                        {part}
                        {quote.ctaHighlightUnderline && (
                          <div 
                            className="absolute -bottom-1.5 left-0 w-full h-2.5 opacity-20 -rotate-1 skew-x-12 rounded-full"
                            style={{ backgroundColor: quote.ctaHighlightColor || '#EF4444' }}
                          />
                        )}
                      </span>
                    ) : (
                      part
                    )}
                  </span>
                ))}
              </span>
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-red-600/30 group-hover:translate-x-3 transition-all duration-300">
                <ArrowRight size={32} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
             <ShieldCheck size={16} className="text-red-600" /> {quote.ctaFooter || 'Premium Content Quality Guaranteed'}
          </div>
        </div>
      </div>
    </div>
  )
})

QuotePreview.displayName = 'QuotePreview'
