import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MessageCircle, ShieldCheck, Truck, Wallet } from 'lucide-react';
import { ProductImage } from '../ProductImage';
import { buildWhatsAppUrl, CONTACT } from '../../lib/config';
import type { Product } from '../../types';

interface HeroSectionProps {
  products: Product[];
}

const TRUST_BADGES = [
  { icon: Truck, label: 'Livraison rapide à Bafoussam' },
  { icon: Wallet, label: 'Paiement à la livraison' },
  { icon: ShieldCheck, label: 'Produits garantis authentiques' },
];

export function HeroSection({ products }: HeroSectionProps) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const showcase = products.slice(0, 5);

  useEffect(() => {
    if (showcase.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % showcase.length), 4000);
    return () => clearInterval(timer);
  }, [showcase.length]);

  const current = showcase[index];

  return (
    <section className="relative overflow-hidden bg-gray-950">
      {/* Ambient gradient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-orange-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
      </div>

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: message */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-7"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-300 backdrop-blur-sm">
            EROLS EasyBuy · Bafoussam
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] text-white text-balance">
            Vos produits préférés,
            <span className="block text-orange-500">livrés chez vous.</span>
          </h1>

          <p className="max-w-lg text-lg text-white/70 font-medium">
            Électroménager, électronique, beauté et bien plus — commandez en
            quelques clics et payez seulement à la réception, où que vous soyez
            à Bafoussam.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => navigate('/produits')}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-400 hover:shadow-orange-500/50 active:scale-[0.98]"
            >
              Découvrir les produits
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href={buildWhatsAppUrl(CONTACT.whatsappNumber, "Bonjour, j'ai une question sur vos produits.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-[0.98]"
            >
              <MessageCircle className="h-5 w-5" />
              Parler sur WhatsApp
            </a>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 pt-4">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm font-medium text-white/60">
                <Icon className="h-4 w-4 text-orange-400" />
                {label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: real product showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          className="relative hidden lg:block"
        >
          <div className="relative h-[440px] rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
            <AnimatePresence mode="wait">
              {current && (
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute inset-0 flex flex-col"
                >
                  <div className="flex-1 flex items-center justify-center p-10 bg-white/5">
                    <ProductImage
                      src={current.image_url}
                      alt={current.name}
                      className="max-h-full max-w-full object-contain drop-shadow-2xl"
                    />
                  </div>
                  <div className="p-6 bg-white/95 backdrop-blur-md">
                    <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                      {current.category?.name || 'EROLS'}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-gray-900 line-clamp-1">
                      {current.name}
                    </h3>
                    <p className="mt-1 text-2xl font-black text-gray-900">
                      {current.price.toLocaleString('fr-FR')} <span className="text-sm font-bold text-gray-500">FCFA</span>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {showcase.length > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              {showcase.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setIndex(i)}
                  aria-label={`Voir produit ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? 'w-8 bg-orange-500' : 'w-1.5 bg-white/30'
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
