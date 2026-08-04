import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const slides = [
  {
    id: 1,
    title: "Next-Gen Security Without Compromise",
    subtitle: "Equip your enterprise and home with world-class CCTV systems. Crystal clear 4K resolution, AI motion detection, and seamless smart home integration.",
    badge: "New: AI-Powered 4K Bullet Cameras",
    image: "/slide1_cctv_1785241009321.png",
    cta1: "Shop Systems",
    cta2: "Book Installation",
    link1: "/products",
    link2: "/services",
  },
  {
    id: 2,
    title: "Smart Home Integration & Live App",
    subtitle: "Control your security from anywhere in the world. Our systems integrate perfectly with Alexa, Google Home, and Apple HomeKit.",
    badge: "Smart Living",
    image: "/slide2_smart_1785241043457.png",
    cta1: "Explore Smart Tech",
    cta2: "View Demo",
    link1: "/products",
    link2: "/contact",
  },
  {
    id: 3,
    title: "Professional Installation Services",
    subtitle: "Don't leave your security to chance. Our certified engineers ensure perfect placement, optimal coverage, and seamless setup.",
    badge: "Expert Service",
    image: "/slide3_install_1785241055034.png",
    cta1: "Book an Expert",
    cta2: "Pricing Plans",
    link1: "/services",
    link2: "/contact",
  },
  {
    id: 4,
    title: "24/7 Enterprise Monitoring Systems",
    subtitle: "Protect your business with our active monitoring solutions. Instant threat detection and immediate response capabilities.",
    badge: "Business Solutions",
    image: "/slide4_monitor_1785241068395.png",
    cta1: "Enterprise Plans",
    cta2: "Contact Sales",
    link1: "/services",
    link2: "/contact",
  }
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Autoplay functionality
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="relative w-full h-[450px] md:h-[550px] overflow-hidden bg-slate-950 text-white group">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {slides.map((slide, index) => (
            <div key={slide.id} className="flex-[0_0_100%] min-w-0 h-full relative">
              {/* Dark Gradient Overlay for optimal text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40 z-10" />
              
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-10000"
                style={{ 
                  backgroundImage: `url(${slide.image})`,
                  transform: selectedIndex === index ? 'scale(1.05)' : 'scale(1)'
                }} 
              />

              {/* Content Container */}
              <div className="container relative z-20 h-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                <AnimatePresence mode="wait">
                  {selectedIndex === index && (
                    <motion.div
                      key={`content-${index}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="max-w-2xl space-y-4"
                    >

                      {/* Main Title Heading with Bright Brand Red Highlight */}
                      <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-md">
                        {slide.title.split(' ').map((word, i) => {
                          const totalWords = slide.title.split(' ').length;
                          const isHighlighted = i >= totalWords - 2;
                          return (
                            <span 
                              key={i} 
                              className={
                                isHighlighted 
                                  ? "text-[#ff3b30] font-black drop-shadow-lg" 
                                  : "text-white"
                              }
                            >
                              {word}{" "}
                            </span>
                          );
                        })}
                      </h1>

                      {/* Subtitle */}
                      <p className="text-sm md:text-base lg:text-lg text-gray-200 leading-relaxed max-w-xl font-normal">
                        {slide.subtitle}
                      </p>

                      {/* Call-to-Action Buttons */}
                      <div className="flex flex-wrap gap-4 pt-2">
                        <Button 
                          asChild
                          size="lg" 
                          className="h-11 px-6 text-xs sm:text-sm font-black uppercase tracking-wider bg-[#ff3b30] hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-all hover:-translate-y-0.5 rounded-xl"
                        >
                          <Link to={slide.link1}>
                            <span>{slide.cta1}</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          asChild
                          size="lg" 
                          variant="outline" 
                          className="h-11 px-6 text-xs sm:text-sm font-bold bg-white/10 border-white/30 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:-translate-y-0.5 rounded-xl"
                        >
                          <Link to={slide.link2}>
                            <span>{slide.cta2}</span>
                          </Link>
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrow Buttons */}
      <button 
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 border border-white/20 text-white backdrop-blur-md transition-all hover:bg-black/80 hover:scale-110 opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button 
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 border border-white/20 text-white backdrop-blur-md transition-all hover:bg-black/80 hover:scale-110 opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              selectedIndex === index ? "w-8 bg-[#ff3b30]" : "w-2.5 bg-white/40 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
