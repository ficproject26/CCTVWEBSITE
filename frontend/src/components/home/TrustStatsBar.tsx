import { Award, Users, Headphones, ShieldCheck, Wrench, Tag } from "lucide-react";

const stats = [
  {
    value: "10+ Years",
    label: "Of Experience",
    icon: Award,
  },
  {
    value: "5000+",
    label: "Happy Customers",
    icon: Users,
  },
  {
    value: "24/7 Support",
    label: "Always Available",
    icon: Headphones,
  },
  {
    value: "Certified Engineers",
    label: "Expert Installation",
    icon: Wrench,
  },
  {
    value: "1 Year Warranty",
    label: "On All Products",
    icon: ShieldCheck,
  },
  {
    value: "Best Price",
    label: "Guaranteed",
    icon: Tag,
  },
];

export default function TrustStatsBar() {
  return (
    <section className="py-6 bg-white border-t border-b border-gray-200">
      <div className="container max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200/80">
                <stat.icon className="h-5 w-5 text-gray-800" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 leading-tight">
                  {stat.value}
                </h4>
                <p className="text-[11px] text-gray-500 font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
