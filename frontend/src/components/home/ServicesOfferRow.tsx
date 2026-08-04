import { ArrowRight, ShieldCheck, Headphones, Wrench, Truck } from "lucide-react";
import { Link } from "react-router-dom";

export default function ServicesOfferRow() {
  return (
    <section className="py-7 bg-white border-b border-gray-100">
      <div className="container max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: FREE SITE VISIT */}
          <div className="relative bg-[#f2f6ff] border border-blue-100/80 rounded-2xl p-5 flex items-center justify-between overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group min-h-[140px]">
            <div className="space-y-1.5 z-10 max-w-[62%]">
              <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide">
                FREE SITE VISIT
              </h3>
              <p className="text-xs text-slate-600 font-normal leading-snug">
                Book a free site visit for your property.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-600 hover:text-blue-800 pt-1.5 group-hover:translate-x-1 transition-transform"
              >
                <span>Book Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            
            {/* Technician Van & Engineer Visual Badge */}
            <div className="relative z-10 shrink-0 group-hover:scale-105 transition-transform duration-300">
              <div className="h-20 w-24 relative flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80"
                  alt="Technician Service"
                  className="h-full w-full object-cover rounded-xl shadow-sm border border-blue-200/60"
                />
              </div>
            </div>
          </div>

          {/* Card 2: AMC PLANS */}
          <div className="relative bg-[#f0fdf4] border border-emerald-100/80 rounded-2xl p-5 flex items-center justify-between overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group min-h-[140px]">
            <div className="space-y-1.5 z-10 max-w-[62%]">
              <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide">
                AMC PLANS
              </h3>
              <p className="text-xs text-slate-600 font-normal leading-snug">
                Save more with our flexible AMC plans.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-600 hover:text-emerald-800 pt-1.5 group-hover:translate-x-1 transition-transform"
              >
                <span>Explore Plans</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* 3D Shield Security Badge Visual */}
            <div className="relative z-10 shrink-0 group-hover:scale-105 transition-transform duration-300">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white border border-emerald-400/50">
                <ShieldCheck className="h-11 w-11 stroke-[1.8] drop-shadow-md" />
              </div>
            </div>
          </div>

          {/* Card 3: INSTALLATION SERVICE */}
          <div className="relative bg-[#fff8f0] border border-orange-100/80 rounded-2xl p-5 flex items-center justify-between overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group min-h-[140px]">
            <div className="space-y-1.5 z-10 max-w-[62%]">
              <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide">
                INSTALLATION SERVICE
              </h3>
              <p className="text-xs text-slate-600 font-normal leading-snug">
                Professional installation by certified engineers.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-600 hover:text-blue-800 pt-1.5 group-hover:translate-x-1 transition-transform"
              >
                <span>Book Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* 3D Tools Wrench Visual */}
            <div className="relative z-10 shrink-0 group-hover:scale-105 transition-transform duration-300">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white border border-orange-300/50">
                <Wrench className="h-11 w-11 stroke-[1.8] drop-shadow-md" />
              </div>
            </div>
          </div>

          {/* Card 4: 24/7 SUPPORT */}
          <div className="relative bg-[#f0f8ff] border border-sky-100/80 rounded-2xl p-5 flex items-center justify-between overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group min-h-[140px]">
            <div className="space-y-1.5 z-10 max-w-[62%]">
              <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide">
                24/7 SUPPORT
              </h3>
              <p className="text-xs text-slate-600 font-normal leading-snug">
                We are always here to help you.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-600 hover:text-blue-800 pt-1.5 group-hover:translate-x-1 transition-transform"
              >
                <span>Contact Us</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* 3D Headset Support Visual */}
            <div className="relative z-10 shrink-0 group-hover:scale-105 transition-transform duration-300">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#090d16] to-slate-800 flex items-center justify-center shadow-lg shadow-slate-900/20 text-white border border-slate-700">
                <Headphones className="h-11 w-11 stroke-[1.8] text-blue-400 drop-shadow-md" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
