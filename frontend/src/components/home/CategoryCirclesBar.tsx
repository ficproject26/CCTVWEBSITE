import { Link } from "react-router-dom";

const categories = [
  {
    name: "CCTV Cameras",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80",
    link: "/products?category=cctv",
  },
  {
    name: "IP Cameras",
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&q=80",
    link: "/products?category=ip",
  },
  {
    name: "WiFi Cameras",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80",
    link: "/products?category=wifi",
  },
  {
    name: "DVR",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80",
    link: "/products?category=dvr",
  },
  {
    name: "NVR",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80",
    link: "/products?category=nvr",
  },
  {
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
    link: "/products?category=accessories",
  },
  {
    name: "Video Door Phone",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&q=80",
    link: "/products?category=vdp",
  },
  {
    name: "Alarm Systems",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=400&q=80",
    link: "/products?category=alarm",
  },
];

export default function CategoryCirclesBar() {
  return (
    <section className="py-8 bg-white border-b border-gray-100">
      <div className="container max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-5">
          <h2 className="text-sm font-extrabold tracking-wider uppercase text-gray-900">
            EXPLORE BY CATEGORY
          </h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-4 sm:gap-6 justify-items-center">
          {categories.map((cat, index) => (
            <Link
              key={index}
              to={cat.link}
              className="flex flex-col items-center gap-2.5 group cursor-pointer text-center"
            >
              {/* Circular Container with Real Product Photo */}
              <div className="h-20 w-20 rounded-full bg-[#f4f6f9] border border-gray-200/70 p-1.5 flex items-center justify-center overflow-hidden group-hover:bg-white group-hover:border-gray-300 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-[11px] font-semibold text-gray-700 group-hover:text-black transition-colors leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}

          {/* View All Circle Icon */}
          <Link
            to="/products"
            className="flex flex-col items-center gap-2.5 group cursor-pointer text-center"
          >
            <div className="h-20 w-20 rounded-full bg-[#eef2ff] border border-blue-100 p-2 flex items-center justify-center group-hover:bg-white group-hover:border-blue-500 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <div className="grid grid-cols-2 gap-1.5">
                <span className="h-3.5 w-3.5 rounded-full bg-[#2563eb]"></span>
                <span className="h-3.5 w-3.5 rounded-full bg-[#2563eb]"></span>
                <span className="h-3.5 w-3.5 rounded-full bg-[#2563eb]"></span>
                <span className="h-3.5 w-3.5 rounded-full bg-[#2563eb]"></span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#2563eb] group-hover:text-blue-700 transition-colors leading-tight">
              View All
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
