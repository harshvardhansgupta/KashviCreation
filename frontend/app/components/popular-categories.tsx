import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Traditional", image: "https://res.cloudinary.com/diujpbja7/image/upload/v1739209801/19591-7_ybplnl.png" },
  { name: "Bridal", image: "https://res.cloudinary.com/diujpbja7/image/upload/v1739209826/19635-2_airf6b.png" },
  { name: "Festive", image: "https://res.cloudinary.com/diujpbja7/image/upload/v1739209805/19593-4_qjomfv.png" },
  { name: "Casual", image: "https://res.cloudinary.com/diujpbja7/image/upload/v1739209841/24341-4_xuiw47.jpg" },
];

export function PopularCategories() {
  return (
    <div className="relative bg-gradient-to-b from-rose-50 to-[#FDF7F3] px-4 py-5 sm:px-6 sm:py-8 md:px-8 lg:px-12 xl:px-16 2xl:px-32">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#8B1D3F" className="hidden sm:block">
            <path d="M12 0C8.5 0 6.5 2.5 6.5 5.5c0 2 1.5 4 3.5 5.5-2-1.5-3.5-3.5-3.5-5.5C6.5 2.5 8.5 0 12 0z" />
          </svg>
          <h2
            className="font-serif text-2xl sm:text-3xl tracking-wide relative"
            style={{ fontFamily: "Tenor Sans, serif" }}
          >
            Popular Categories
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-[#8B1D3F]"></div>
          </h2>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#8B1D3F" className="hidden sm:block transform scale-x-[-1]">
            <path d="M12 0C8.5 0 6.5 2.5 6.5 5.5c0 2 1.5 4 3.5 5.5-2-1.5-3.5-3.5-3.5-5.5C6.5 2.5 8.5 0 12 0z" />
          </svg>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 xl:gap-10">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={`/collections?category=${encodeURIComponent(category.name)}`}
            className="group relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <Image
              src={category.image}
              alt={category.name}
              width={500}
              height={750}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
              <h3 className="text-white font-medium text-xl sm:text-2xl transition-transform duration-300 group-hover:scale-110">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}