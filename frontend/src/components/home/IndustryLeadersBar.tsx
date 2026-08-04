import { useState } from "react";

// Official SVG Brand Logos matching user reference screenshot
function HikvisionLogo() {
  return (
    <svg className="h-7 w-auto" viewBox="0 0 160 36" fill="none">
      <text x="2" y="26" fill="#e53935" fontFamily="sans-serif" fontWeight="900" fontStyle="italic" fontSize="24" letterSpacing="1">
        HIK
      </text>
      <text x="56" y="26" fill="#475569" fontFamily="sans-serif" fontWeight="800" fontStyle="italic" fontSize="24" letterSpacing="1">
        VISION
      </text>
    </svg>
  );
}

function DahuaLogo() {
  return (
    <svg className="h-7 w-auto" viewBox="0 0 140 36" fill="none">
      <ellipse cx="18" cy="18" rx="14" ry="14" fill="#d32f2f" />
      <text x="12" y="25" fill="#ffffff" fontFamily="sans-serif" fontWeight="900" fontStyle="italic" fontSize="20">
        a
      </text>
      <text x="36" y="26" fill="#0f172a" fontFamily="sans-serif" fontWeight="900" fontStyle="italic" fontSize="22" letterSpacing="0">
        lhua
      </text>
    </svg>
  );
}

function CpPlusLogo() {
  return (
    <svg className="h-8 w-auto" viewBox="0 0 160 40" fill="none">
      <path d="M4 12 L18 24 L4 36 Z" fill="#d32f2f" />
      <path d="M18 12 L4 24 L18 36 Z" fill="#d32f2f" />
      <text x="24" y="24" fill="#d32f2f" fontFamily="sans-serif" fontWeight="900" fontSize="18" letterSpacing="0.5">
        CP PLUS
      </text>
      <text x="24" y="34" fill="#334155" fontFamily="sans-serif" fontWeight="600" fontSize="8" letterSpacing="1">
        enhancing vision
      </text>
    </svg>
  );
}

function UnvLogo() {
  return (
    <svg className="h-7 w-auto" viewBox="0 0 110 36" fill="none">
      <path d="M8 8 C14 2 24 2 30 8" stroke="#d32f2f" strokeWidth="3.5" strokeLinecap="round" />
      <text x="4" y="28" fill="#0f172a" fontFamily="sans-serif" fontWeight="900" fontSize="26" letterSpacing="-1">
        unv
      </text>
    </svg>
  );
}

function HoneywellLogo() {
  return (
    <svg className="h-7 w-auto" viewBox="0 0 150 36" fill="none">
      <text x="2" y="26" fill="#ee2c2c" fontFamily="sans-serif" fontWeight="900" fontSize="24" letterSpacing="-0.5">
        Honeywell
      </text>
    </svg>
  );
}

function ImouLogo() {
  return (
    <svg className="h-7 w-auto" viewBox="0 0 120 36" fill="none">
      <text x="2" y="26" fill="#ff7a00" fontFamily="sans-serif" fontWeight="900" fontSize="26" letterSpacing="-1">
        Imou
      </text>
      <circle cx="102" cy="12" r="3" fill="#ff7a00" />
    </svg>
  );
}

function TpLinkLogo() {
  return (
    <svg className="h-7 w-auto" viewBox="0 0 140 36" fill="none">
      <path d="M8 12 H22 V20 H16 V28 H8 Z" fill="#00b4d8" />
      <circle cx="26" cy="16" r="4" fill="#00b4d8" />
      <text x="36" y="25" fill="#1e293b" fontFamily="sans-serif" fontWeight="800" fontSize="20">
        tp-link
      </text>
    </svg>
  );
}

function EzvizLogo() {
  return (
    <svg className="h-8 w-auto" viewBox="0 0 150 40" fill="none">
      <circle cx="10" cy="14" r="5" fill="#00b4d8" />
      <circle cx="20" cy="14" r="5" fill="#e52592" />
      <circle cx="10" cy="24" r="5" fill="#ffb703" />
      <circle cx="20" cy="24" r="5" fill="#80b918" />
      <text x="30" y="26" fill="#475569" fontFamily="sans-serif" fontWeight="800" fontSize="22" letterSpacing="1">
        EZVIZ
      </text>
    </svg>
  );
}

const brandLogos = [
  { name: "HIKVISION", logo: HikvisionLogo },
  { name: "Dahua", logo: DahuaLogo },
  { name: "CP PLUS", logo: CpPlusLogo },
  { name: "UNV", logo: UnvLogo },
  { name: "Honeywell", logo: HoneywellLogo },
  { name: "Imou", logo: ImouLogo },
  { name: "tp-link", logo: TpLinkLogo },
  { name: "EZVIZ", logo: EzvizLogo },
];

export default function IndustryLeadersBar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Duplicate 3x for seamless infinite right-to-left marquee scroll
  const marqueeLogos = [...brandLogos, ...brandLogos, ...brandLogos];

  return (
    <section className="py-8 bg-white border-b border-gray-100 overflow-hidden">
      <div className="container max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Centered Header Tag with Subtle Line Accents */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 text-xs font-black tracking-widest text-[#ff3b30] uppercase">
            <span className="h-0.5 w-10 bg-gradient-to-r from-transparent to-[#ff3b30] rounded-full"></span>
            <span className="text-slate-900 font-extrabold text-sm sm:text-base tracking-wider">
              TRUSTED BY LEADING BRANDS
            </span>
            <span className="h-0.5 w-10 bg-gradient-to-l from-transparent to-[#ff3b30] rounded-full"></span>
          </div>
        </div>

        {/* Seamless Marquee Track with Vertical Dividers & Touch/Hover Transition */}
        <div
          className="relative py-3 flex items-center overflow-hidden group"
          onMouseLeave={() => setHoveredIndex(null)}
          onTouchCancel={() => setHoveredIndex(null)}
        >
          {/* Left & Right Gradient Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

          {/* Marquee Track (Pauses on hover for easy touch/interaction) */}
          <div className="animate-marquee items-center group-hover:[animation-play-state:paused]">
            {marqueeLogos.map((item, index) => {
              const LogoComponent = item.logo;
              const isTouched = hoveredIndex === index;
              const isOtherTouched = hoveredIndex !== null && !isTouched;

              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onTouchStart={() => setHoveredIndex(index)}
                  onTouchEnd={() => setHoveredIndex(null)}
                  className="flex items-center shrink-0 border-r border-gray-200/90 pr-8 mr-8 cursor-pointer select-none"
                >
                  <div
                    style={{ transition: "all 200ms ease-in-out" }}
                    className={`transition-all duration-200 ${
                      isTouched
                        ? "scale-110 filter-none opacity-100"
                        : isOtherTouched
                        ? "brightness-0 opacity-100 scale-95"
                        : "filter-none opacity-100 scale-100"
                    }`}
                  >
                    <LogoComponent />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
