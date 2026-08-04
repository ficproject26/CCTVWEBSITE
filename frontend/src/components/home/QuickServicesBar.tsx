import { MapPin, Wrench, Settings, FileText, ShieldCheck, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const quickServices = [
  {
    title: "Free Site Visit",
    subtitle: "Book a free site visit",
    icon: MapPin,
    bg: "bg-teal-50 text-teal-600",
    link: "/contact",
  },
  {
    title: "Installation Service",
    subtitle: "Professional installation",
    icon: Wrench,
    bg: "bg-purple-50 text-purple-600",
    link: "/services",
  },
  {
    title: "Repair & Maintenance",
    subtitle: "Quick repair service",
    icon: Settings,
    bg: "bg-blue-50 text-blue-600",
    link: "/services",
  },
  {
    title: "AMC Plans",
    subtitle: "Save more with AMC",
    icon: FileText,
    bg: "bg-orange-50 text-orange-600",
    link: "/services",
  },
  {
    title: "Warranty Check",
    subtitle: "Check your warranty",
    icon: ShieldCheck,
    bg: "bg-rose-50 text-rose-600",
    link: "/contact",
  },
  {
    title: "Live Chat",
    subtitle: "Chat with our expert",
    icon: MessageCircle,
    bg: "bg-emerald-50 text-emerald-600",
    link: "/contact",
  },
];

export default function QuickServicesBar() {
  return (
    <section className="py-6 bg-white border-b border-gray-200">
      <div className="container max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickServices.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-white group"
            >
              <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${item.bg}`}>
                <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-gray-900 group-hover:text-black truncate">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-500 truncate mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
