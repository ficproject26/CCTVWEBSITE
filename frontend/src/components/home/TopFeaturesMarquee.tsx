import {
  Globe,
  Maximize2,
  Sun,
  Tablet,
  Volume2,
  Tv,
  Cpu,
  Smartphone,
} from "lucide-react";

const featureCards = [
  {
    title: "Remote Access",
    icon: Globe,
  },
  {
    title: "178° Viewing Angle",
    icon: Maximize2,
  },
  {
    title: "450 nits Brightness",
    icon: Sun,
  },
  {
    title: "40 Point Multi Touch",
    icon: Tablet,
  },
  {
    title: "2 x 20W Speakers",
    icon: Volume2,
  },
  {
    title: "Ultra HD Display",
    icon: Tv,
  },
  {
    title: "Upto 8 GB Ram",
    icon: Cpu,
  },
  {
    title: "Android 13",
    icon: Smartphone,
  },
];

export default function TopFeaturesMarquee() {
  // Duplicate 3x for seamless infinite right-to-left marquee scroll
  const marqueeItems = [...featureCards, ...featureCards, ...featureCards];

  return (
    <section className="py-14 bg-[#f8f9fa] border-b border-gray-200 overflow-hidden">
      {/* Centered Large Title matching Screenshot #1 */}
      <div className="container max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <h2 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-slate-900">
          TOP FEATURES OF ALL IN ONE COMPUTER
        </h2>
      </div>

      {/* Infinite Scrolling Marquee Track (Right to Left) */}
      <div className="relative w-full overflow-hidden py-3">
        {/* Left & Right Gradient Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#f8f9fa] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#f8f9fa] to-transparent z-10 pointer-events-none"></div>

        <div className="animate-marquee gap-6 items-center px-4">
          {marqueeItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="w-28 h-28 sm:w-48 sm:h-44 bg-white border border-gray-200/90 rounded-xl sm:rounded-2xl p-2 sm:p-5 shadow-sm hover:shadow-md hover:border-gray-300 flex flex-col items-center justify-center text-center gap-2 sm:gap-3.5 shrink-0 transition-all duration-300 group cursor-pointer"
              >
                <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gray-50 flex items-center justify-center text-slate-800 group-hover:bg-black group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  <IconComponent className="h-4 w-4 sm:h-6 sm:w-6 stroke-[1.8]" />
                </div>
                <span className="text-[9px] sm:text-xs font-extrabold text-slate-800 leading-tight group-hover:text-black">
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
