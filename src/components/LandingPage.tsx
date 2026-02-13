import { Button } from './ui/button'
import { UtensilsCrossed, Zap, Smartphone, Share2 } from 'lucide-react'

export function LandingPage({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen bg-white selection:bg-accent/30 selection:text-accent">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-accent/20">R</div>
          <span className="text-2xl font-extrabold tracking-tight text-primary">RestoRefine</span>
        </div>
        <Button onClick={onLogin} variant="outline" className="rounded-full px-8 hover:bg-accent hover:text-white border-accent text-accent transition-all duration-300">
          Sign In
        </Button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-semibold text-sm">
              <Zap size={16} />
              <span>Quotes in Seconds, Not Hours</span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-primary">
              The <span className="text-accent">Visual Quote</span> For Modern Creators.
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed">
              Ditch the 10-page proposals. RestoRefine transforms your service packages into sleek, mobile-first infographic quotes that clients actually read.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button onClick={onLogin} size="lg" className="btn-primary h-14 px-10 text-lg rounded-2xl">
                Start Creating Free
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Smartphone size={18} className="text-accent" />
                  <span>WhatsApp Ready</span>
                </div>
                <p className="text-slate-500 text-sm">Perfectly sized for mobile sharing and scannability.</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Share2 size={18} className="text-accent" />
                  <span>Instant Export</span>
                </div>
                <p className="text-slate-500 text-sm">Download as PNG or PDF with a single click.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-accent/5 rounded-[2.5rem] blur-2xl -z-10" />
            <div className="card-premium p-4 bg-slate-50 border-8 border-white shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bbbda546697a?q=80&w=2070&auto=format&fit=crop" 
                alt="App Interface" 
                className="rounded-xl w-full object-cover aspect-[4/5]"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center p-8 text-center">
                <div className="space-y-4">
                   <div className="w-16 h-16 bg-accent rounded-full mx-auto flex items-center justify-center text-white shadow-xl">
                    <UtensilsCrossed size={32} />
                   </div>
                   <h3 className="text-white font-bold text-xl drop-shadow-md">Beautiful Quotes for Gastro Brands</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-12 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400 text-sm font-medium">
          © {new Date().getFullYear()} RestoRefine. Built for the next generation of marketing agencies.
        </div>
      </footer>
    </div>
  )
}
