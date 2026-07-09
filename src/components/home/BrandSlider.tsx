import { motion } from 'framer-motion';
import type { Brand } from '../../types';

interface BrandSliderProps {
  brands: Brand[];
}

export function BrandSlider({ brands }: BrandSliderProps) {
  if (brands.length === 0) return null;

  // Duplicate the list so the marquee loops seamlessly.
  const loop = [...brands, ...brands];

  return (
    <section className="py-8 lg:py-20 bg-white border-y border-gray-100 overflow-hidden">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center text-sm font-bold uppercase tracking-wider text-gray-400 mb-8"
      >
        Les marques disponibles sur EROLS
      </motion.p>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-16 lg:w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-16 lg:w-32 bg-gradient-to-l from-white to-transparent z-10" />

        <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-4">
          {loop.map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex items-center gap-2 shrink-0 rounded-xl border border-gray-100 bg-gray-50 px-6 py-4"
            >
              <span className="text-lg font-black tracking-tight text-gray-800">
                {brand.name.toUpperCase()}
              </span>
              <span className="text-xs font-semibold text-gray-400">
                ({brand.product_count})
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
