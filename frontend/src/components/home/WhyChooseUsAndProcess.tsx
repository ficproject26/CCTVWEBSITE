import { Link } from "react-router-dom";
import {
  Award,
  Users,
  Wrench,
  Headphones,
  ShieldCheck,
  Tag,
  CalendarCheck,
  Search,
  FileText,
  CheckCircle2,
  ArrowRight,
  Headset,
  Shield,
  Clock,
  Check,
  PhoneCall,
  Sparkles,
} from "lucide-react";

const whyChooseCards = [
  {
    title: "10+ Years",
    subtitle: "Of Experience",
    desc: "A decade of experience in delivering trusted security solutions.",
    icon: Award,
    iconDiscBg: "bg-red-500/10 text-red-500 border border-red-500/20",
  },
  {
    title: "5000+",
    subtitle: "Happy Customers",
    desc: "Thousands of satisfied customers who trust our services.",
    icon: Users,
    iconDiscBg: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  },
  {
    title: "Certified",
    subtitle: "Engineers",
    desc: "Highly trained and certified professionals ensuring quality installation.",
    icon: Wrench,
    iconDiscBg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  },
  {
    title: "24/7",
    subtitle: "Support",
    desc: "Round-the-clock support whenever you need us, always.",
    icon: Headphones,
    iconDiscBg: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  },
  {
    title: "1 Year",
    subtitle: "Warranty",
    desc: "Comprehensive warranty for complete peace of mind.",
    icon: ShieldCheck,
    iconDiscBg: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  },
  {
    title: "Best Price",
    subtitle: "Guaranteed",
    desc: "Top-quality products and services at the most competitive prices.",
    icon: Tag,
    iconDiscBg: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  },
];

const installationStepsDetailed = [
  {
    num: "1",
    title: "Book Site Visit",
    icon: CalendarCheck,
    iconBg: "bg-red-500/10 text-red-400 border-red-500/30",
    timePill: "bg-red-500/10 text-red-400 border-red-500/30",
    time: "5 Minutes",
    accentBorder: "hover:border-red-500/60",
    points: [
      "Choose convenient date",
      "Online / Call / WhatsApp",
      "Instant confirmation",
    ],
  },
  {
    num: "2",
    title: "Free Survey",
    icon: Search,
    iconBg: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    timePill: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    time: "30 - 60 Minutes",
    accentBorder: "hover:border-sky-500/60",
    points: [
      "Inspect your property",
      "Plan camera placement",
      "Check network & power",
    ],
  },
  {
    num: "3",
    title: "Get Quotation",
    icon: FileText,
    iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    timePill: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    time: "30 Minutes",
    accentBorder: "hover:border-emerald-500/60",
    points: [
      "Best products for you",
      "Transparent pricing",
      "AMC & warranty details",
    ],
  },
  {
    num: "4",
    title: "Professional Installation",
    icon: Wrench,
    iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    timePill: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    time: "2 - 4 Hours",
    accentBorder: "hover:border-amber-500/60",
    points: [
      "Camera & device setup",
      "Neat cable management",
      "System configuration",
    ],
  },
  {
    num: "5",
    title: "Testing & Training",
    icon: ShieldCheck,
    iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    timePill: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    time: "30 - 45 Minutes",
    accentBorder: "hover:border-blue-500/60",
    points: [
      "Camera functionality test",
      "Live view on mobile",
      "Customer training",
    ],
  },
  {
    num: "6",
    title: "Support & AMC",
    icon: Headset,
    iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    timePill: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    time: "Ongoing",
    accentBorder: "hover:border-purple-500/60",
    points: [
      "24/7 customer support",
      "Annual maintenance",
      "Remote assistance",
    ],
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-16 bg-[#070b14] text-white relative overflow-hidden border-b border-slate-800/80">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-7 bg-[#ff3b30]"></span>
              <span className="text-xs font-bold tracking-widest text-[#ff3b30] uppercase flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-[#ff3b30]" /> WHY CHOOSE US
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none text-white">
              WHY CHOOSE <br />
              <span className="text-[#ff3b30]">SK TECHNOLOGY?</span>
            </h2>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-normal">
              We provide advanced, reliable, and user-friendly CCTV security systems backed by exceptional customer service. Protect what's yours with absolute confidence.
            </p>

            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group bg-[#0d1322]">
              <img
                src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80"
                alt="CCTV Security Camera Array"
                className="w-full h-36 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/20 to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 z-10">
                <div className="bg-[#070b14]/80 backdrop-blur-md border border-slate-700/80 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl flex items-center gap-1.5 sm:gap-2 shadow-xl">
                  <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#ff3b30]" />
                  <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">
                    PRO SURVEILLANCE SYSTEMS
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ff3b30] hover:bg-[#e03126] text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>GET A FREE QUOTE</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: 6 KPI Glassmorphism Cards */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {whyChooseCards.map((card, idx) => {
                const IconComponent = card.icon;
                return (
                  <div
                    key={idx}
                    className="bg-[#0d1322] border border-slate-800/90 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-3 hover:border-slate-700 hover:shadow-2xl transition-all duration-300 group min-h-[190px]"
                  >
                    <div
                      className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shrink-0 ${card.iconDiscBg}`}
                    >
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2]" />
                    </div>

                    <div>
                      <h3 className="text-sm sm:text-lg font-black text-white leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-slate-300 font-medium">
                        {card.subtitle}
                      </p>
                    </div>

                    <span className="h-0.5 w-6 bg-[#ff3b30] rounded-full"></span>

                    <p className="text-[10px] sm:text-[11px] text-slate-400 font-normal leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export function InstallationProcessSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-[#090d16] via-[#0d1322] to-[#090d16] text-white relative overflow-hidden border-b border-slate-800/80">
      {/* Background Neon Ambient Glows */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header Tag & Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#ff3b30] uppercase tracking-widest bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-full shadow-lg shadow-red-500/5">
            <Sparkles className="h-3.5 w-3.5 text-[#ff3b30]" />
            <span>OUR INSTALLATION PROCESS</span>
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Professional CCTV Installation in <span className="text-[#ff3b30]">6 Simple Steps</span>
          </h2>
          
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            From site inspection to installation and after-sales support, our certified engineers ensure a smooth experience.
          </p>
        </div>

        {/* 6 Step Timeline Bar + Glassmorphism Cards */}
        <div className="relative">
          {/* Horizontal Timeline Bar for Large Screens */}
          <div className="hidden lg:flex items-center justify-between mb-8 px-12 relative z-10">
            {installationStepsDetailed.map((step, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#ff3b30] to-rose-600 text-white font-black text-sm flex items-center justify-center shadow-lg shadow-red-500/30 border border-red-400/40">
                  {step.num}
                </div>
                {idx < installationStepsDetailed.length - 1 && (
                  <div className="flex-1 flex items-center justify-center mx-2 text-red-500/50">
                    <span className="text-xs font-bold tracking-widest text-red-500/40">--»--</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 6 High-Tech Dark Glass Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {installationStepsDetailed.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className={`bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl hover:shadow-2xl transition-all duration-300 group ${item.accentBorder} hover:-translate-y-1`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="lg:hidden h-7 w-7 rounded-full bg-[#ff3b30] text-white text-xs font-extrabold flex items-center justify-center shadow-md">
                      {item.num}
                    </div>

                    <div
                      className={`h-14 w-14 rounded-2xl flex items-center justify-center border shadow-inner group-hover:scale-110 transition-transform ${item.iconBg}`}
                    >
                      <IconComponent className="h-7 w-7 stroke-[1.8]" />
                    </div>

                    <h3 className="font-extrabold text-sm text-white leading-tight">
                      {item.title}
                    </h3>
                  </div>

                  <ul className="space-y-2 text-left pt-3 border-t border-slate-800/80">
                    {item.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1.5 text-[11px] text-slate-300 font-medium">
                        <Check className="h-3.5 w-3.5 text-[#ff3b30] shrink-0 mt-0.5" />
                        <span className="leading-tight">{pt}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${item.timePill}`}
                    >
                      <Clock className="h-3 w-3" />
                      <span>{item.time}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Dark CTA Banner ("Ready to Secure Your Space?") */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0d1329] to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-[#ff3b30] shrink-0">
              <ShieldCheck className="h-8 w-8 text-[#ff3b30]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Ready to Secure Your Space?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Book a free site visit today and get expert advice from our security professionals.
              </p>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-6 text-xs text-slate-300 border-x border-slate-800 px-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#ff3b30]" />
              <span className="font-semibold">100% Satisfaction</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#ff3b30]" />
              <span className="font-semibold">Certified Engineers</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-[#ff3b30]" />
              <span className="font-semibold">Best Quality Products</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
            <Link
              to="/contact"
              className="w-full sm:w-auto bg-[#ff3b30] hover:bg-[#e03126] text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all text-center flex items-center justify-center gap-2"
            >
              <CalendarCheck className="h-4 w-4" />
              <span>Book Free Site Visit →</span>
            </Link>

            <a
              href="tel:+919876543210"
              className="w-full sm:w-auto border border-slate-700 hover:bg-slate-800/80 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all text-center flex items-center justify-center gap-2"
            >
              <PhoneCall className="h-4 w-4 text-emerald-400" />
              <span>Call Now: +91 98765 43210</span>
            </a>
          </div>
        </div>

        {/* Footer Info Highlights Line */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-400 pt-2 text-center">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#ff3b30]" />
            <span>Our average installation time: <strong className="text-white">2 - 4 Hours</strong></span>
          </div>
          <span className="hidden sm:inline text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#ff3b30]" />
            <span>Service available in major cities</span>
          </div>
          <span className="hidden sm:inline text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#ff3b30]" />
            <span>Emergency support available <strong className="text-white">24/7</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function WhyChooseUsAndProcess() {
  return (
    <>
      <WhyChooseUsSection />
      <InstallationProcessSection />
    </>
  );
}
