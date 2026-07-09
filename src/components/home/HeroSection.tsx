import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, MessageCircle, ShieldCheck, Truck, Wallet } from 'lucide-react';
import { ProductImage } from '../ProductImage';
import { buildWhatsAppUrl, CONTACT, formatPrice } from '../../lib/config';
import type { Product } from '../../types';

interface HeroSectionProps {
  products: Product[];
}

const TRUST_BADGES = [
  { icon: Truck, label: 'Livraison rapide à Bafoussam' },
  { icon: Wallet, label: 'Paiement à la livraison' },
  { icon: ShieldCheck, label: 'Produits garantis authentiques' },
];

const ADVANTAGE_CARDS = [
  { icon: Truck, label: 'Livraison express' },
  { icon: Wallet, label: 'Paiement à la livraison' },
  { icon: ShieldCheck, label: 'Produits authentiques' },
];

export function HeroSection({ products }: HeroSectionProps) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const showcase = products.slice(0, 5);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (showcase.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % showcase.length), 4000);
    return () => clearInterval(timer);
  }, [showcase.length]);

  const current = showcase[index];

  return (
    <section className="relative bg-gray-950">
      {/* Ambient gradient glow — animated, keeps the hero from reading flat/black */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-orange-600/20 blur-3xl"
          animate={prefersReducedMotion ? undefined : { opacity: [0.6, 1, 0.6], scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl"
          animate={prefersReducedMotion ? undefined : { opacity: [0.5, 0.9, 0.5], scale: [1, 1.1, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-400/10 blur-3xl"
          animate={prefersReducedMotion ? undefined : { opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
      </div>

      {/* Mobile hero — near full first screen, CTAs immediately visible */}
      <div className="lg:hidden relative px-4 pt-8 pb-6">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-orange-300 backdrop-blur-sm"
        >
          EROLS EasyBuy · Bafoussam
        </motion.span>

        {/* Partial product visual — peeking from the top-right corner */}
        {current && (
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              className="absolute -right-4 top-6 h-32 w-32 rotate-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-2xl backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 6, y: prefersReducedMotion ? 0 : [0, -6, 0] }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                opacity: { duration: 0.4 },
                scale: { duration: 0.4 },
                y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              <ProductImage
                src={current.image_url}
                webpSrc={current.image_url_webp}
                alt={current.name}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 max-w-[72%] text-[2.15rem] font-black leading-[1.05] text-white text-balance"
        >
          Vos produits préférés,
          <span className="block text-orange-500">livrés chez vous.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mt-3 max-w-[88%] text-sm text-white/70 font-medium"
        >
          Commandez en quelques clics, payez seulement à la réception.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.26 }}
          className="mt-6 flex flex-col gap-3"
        >
          <button
            onClick={() => navigate('/produits')}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/30 transition-all active:scale-[0.98]"
          >
            Découvrir les produits
            <ArrowRight className="h-5 w-5 transition-transform group-active:translate-x-1" />
          </button>
          <a
            href={buildWhatsAppUrl(CONTACT.whatsappNumber, "Bonjour, j'ai une question sur vos produits.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-4 text-base font-bold text-white backdrop-blur-sm transition-all active:scale-[0.98]"
          >
            <MessageCircle className="h-5 w-5" />
            Parler sur WhatsApp
          </a>
        </motion.div>
      </div>

      {/* Floating advantage cards — overlap the hero's bottom edge */}
      <div className="lg:hidden relative z-10 -mb-6 px-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {ADVANTAGE_CARDS.map(({ icon: Icon, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
              className="flex shrink-0 items-center gap-2.5 rounded-2xl border border-white/60 bg-white/90 px-4 py-3.5 shadow-xl backdrop-blur-md"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100">
                <Icon className="h-4 w-4 text-orange-600" />
              </div>
              <span className="whitespace-nowrap text-xs font-bold text-gray-800">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Desktop hero — unchanged rich layout */}
      <div className="hidden lg:grid relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-24 lg:grid-cols-2 gap-12 items-center">
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
          className="relative"
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
                      webpSrc={current.image_url_webp}
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
                      {formatPrice(current.price)} <span className="text-sm font-bold text-gray-500">FCFA</span>
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
