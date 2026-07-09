import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';

export function MobilePromoBanner() {
  return (
    <div className="lg:hidden px-4 pb-2">
      <Link to="/produits">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-red-500 to-orange-500 px-5 py-6 active:scale-[0.98] transition-transform"
        >
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-8 right-10 h-20 w-20 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xl font-black leading-tight text-white text-balance">
                PROMOS EXCEPTIONNELLES
              </p>
              <p className="text-sm font-bold text-yellow-200">tous les jours !</p>
            </div>
            <Gift className="h-14 w-14 shrink-0 text-white drop-shadow-lg" strokeWidth={1.5} />
          </div>
        </motion.div>
      </Link>
    </div>
  );
}
