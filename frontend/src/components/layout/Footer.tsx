import { Link } from "react-router-dom";
import { Camera, MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import SKLogo from "./SKLogo";
import PushSubscriber from "../notifications/PushSubscriber";

function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#0b0f19] text-gray-200 border-t border-gray-800/80 mt-16 pt-12 pb-8">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Consolidated 4 Contact Touchpoints Row Bar */}
        <div className="bg-slate-900/90 border border-gray-800/90 rounded-2xl p-6 mb-12 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-black text-base uppercase tracking-tight flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#ff3b30] animate-pulse"></span>
                <span>GET IN TOUCH & CONNECT WITH US</span>
              </h4>
              <p className="text-gray-400 text-xs mt-1">
                Instant support available 24/7 across our official direct channels.
              </p>
            </div>

            {/* 4 Touchpoints Grouped Row: WhatsApp, Phone, Email, Instagram */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
              
              {/* 1. WhatsApp */}
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366] text-[#25D366] hover:text-white transition-all duration-200 group"
              >
                <MessageCircle className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-white/80">WhatsApp</span>
                  <span className="text-xs font-extrabold whitespace-nowrap">Chat Now</span>
                </div>
              </a>

              {/* 2. Phone */}
              <a
                href="tel:18001234567"
                aria-label="Call support phone number"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-600 text-blue-400 hover:text-white transition-all duration-200 group"
              >
                <Phone className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-white/80">Phone</span>
                  <span className="text-xs font-extrabold whitespace-nowrap">1800-123-4567</span>
                </div>
              </a>

              {/* 3. Email */}
              <a
                href="mailto:info@sktechnology.com"
                aria-label="Send us an email"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-[#ff3b30] text-red-400 hover:text-white transition-all duration-200 group"
              >
                <Mail className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-white/80">Email</span>
                  <span className="text-xs font-extrabold whitespace-nowrap">Email Us</span>
                </div>
              </a>

              {/* 4. Instagram */}
              <a
                href="https://instagram.com/sktechnology"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:bg-gradient-to-r hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 text-purple-400 hover:text-white transition-all duration-200 group"
              >
                <InstagramIcon className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-white/80">Instagram</span>
                  <span className="text-xs font-extrabold whitespace-nowrap">@sktechnology</span>
                </div>
              </a>

            </div>
          </div>
        </div>

        {/* Footer 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <SKLogo variant="horizontal" theme="light" iconClassName="h-14 w-auto" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Premium CCTV and smart home security solutions for modern enterprises and homes.
              Professional installation and 24/7 support.
            </p>
            <div className="pt-2">
              <PushSubscriber />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/products" className="hover:text-red-500 transition-colors">Shop CCTV</Link></li>
              <li><Link to="/services" className="hover:text-red-500 transition-colors">Book Installation</Link></li>
              <li><Link to="/about" className="hover:text-red-500 transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-red-500 transition-colors">Security Blog</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="font-semibold text-lg text-white mb-4">Customer Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/dashboard/orders" className="hover:text-red-500 transition-colors">Track Order</Link></li>
              <li><Link to="/dashboard/support" className="hover:text-red-500 transition-colors">Support Tickets</Link></li>
              <li><Link to="/warranty" className="hover:text-red-500 transition-colors">Warranty & AMC</Link></li>
              <li><Link to="/faq" className="hover:text-red-500 transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-semibold text-lg text-white mb-4">Head Office</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <span>123 Security Blvd, Tech District, NY 10001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-red-500 shrink-0" />
                <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-red-500 shrink-0" />
                <span>info@sktechnology.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} SKTechnology. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link to="/privacy" className="hover:text-red-500 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-red-500 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
