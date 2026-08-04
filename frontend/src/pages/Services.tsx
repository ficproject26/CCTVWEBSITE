import { Link } from "react-router-dom";
import { Wrench, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    title: "CCTV Camera Installation",
    price: "Starts at $49",
    description: "Professional indoor & outdoor camera mounting, high-grade concealed wiring, power adapter setup, and mobile app configuration.",
    features: ["Cable Concealment", "DVR/NVR Configuration", "Live Mobile Feed Setup", "1-Year Installation Warranty"],
    badge: "Most Popular",
  },
  {
    title: "Annual Maintenance Contract (AMC)",
    price: "Starts at $149/yr",
    description: "Keep your CCTV systems running 24/7 with zero downtime. Quarterly lens cleaning, HDD checkups, and free replacement parts.",
    features: ["4 Preventive Maintenance Visits", "Priority Breakdown Support", "Free Spare Parts Coverage", "24/7 Hotline Access"],
    badge: "Enterprise Recommended",
  },
  {
    title: "Commercial Security System Design",
    price: "Custom Quote",
    description: "Tailored multi-camera surveillance architecture for offices, warehouses, retail stores, and manufacturing facilities.",
    features: ["On-Site Security Audit", "Biometric Access Integration", "Central Monitoring Setup", "Compliance & Storage Planning"],
    badge: "Corporate",
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Services List */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-card border border-border hover:border-red-500/40 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold px-3 py-1 bg-red-500/10 text-red-500 rounded-full">
                    {service.badge}
                  </span>
                  <Wrench className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{service.title}</h3>
                <p className="text-2xl font-extrabold text-red-500">{service.price}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                <div className="pt-2 space-y-2">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center text-xs font-medium text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-red-500 mr-2 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Link to="/contact">
                  <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold shadow">
                    Book Service Now
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
