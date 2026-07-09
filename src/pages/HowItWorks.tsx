import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  ShoppingCart,
  MessageCircle,
  Truck,
  Shield,
  Package,
  ChevronDown,
} from 'lucide-react';

const STEPS = [
  {
    icon: Eye,
    title: 'Naviguez et choisissez',
    short: 'Parcourez le catalogue par catégorie et repérez vos produits.',
    long: 'Parcourez notre catalogue de produits chinois de qualité. Explorez par catégories et sélectionnez ce qui vous intéresse.',
    color: 'orange',
  },
  {
    icon: ShoppingCart,
    title: 'Ajoutez au panier',
    short: 'Choisissez vos quantités et ajoutez au panier.',
    long: 'Sélectionnez un ou plusieurs produits, personnalisez les quantités selon vos besoins et ajoutez-les à votre panier.',
    color: 'orange',
  },
  {
    icon: MessageCircle,
    title: 'Commandez via WhatsApp',
    short: '"Acheter" ouvre WhatsApp avec votre commande déjà prête.',
    long: 'Cliquez sur "Acheter" : WhatsApp s\'ouvre directement avec un message pré-rempli contenant votre commande. Finalisez avec notre équipe.',
    color: 'orange',
  },
  {
    icon: Truck,
    title: 'Recevez et payez',
    short: 'Livraison en 10 min à 1h. Payez à la réception.',
    long: 'Recevez vos produits disponibles en stock en 10 minutes à 1h max et payez à la livraison à domicile ou dans un point de retrait.',
    color: 'green',
  },
];

const BENEFITS = [
  {
    icon: Package,
    title: 'Livraison express locale',
    short: 'Déjà à Bafoussam : reçu en 10 min à 1h.',
    long: "Tous nos produits sont déjà disponibles à Bafoussam. Pas d'attente, pas d'import : commandez et recevez en 10 minutes à 1h max dans votre quartier.",
    color: 'orange',
  },
  {
    icon: Shield,
    title: 'Zéro risque financier',
    short: 'Vous payez uniquement à la réception.',
    long: 'Payez uniquement à la réception de vos produits. Aucun paiement en ligne requis. Vous ne payez que lorsque vous êtes satisfait.',
    color: 'green',
  },
  {
    icon: MessageCircle,
    title: 'Support personnalisé',
    short: 'Une équipe disponible sur WhatsApp à chaque étape.',
    long: 'Notre équipe vous accompagne via WhatsApp à chaque étape. Questions, suivi de commande, tout se fait simplement par message.',
    color: 'blue',
  },
];

const FAQ = [
  {
    q: 'Combien de temps prend la livraison ?',
    a: (
      <>
        Pour les produits en stock à Bafoussam : livraison ultra-rapide en{' '}
        <strong className="text-orange-600">10 minutes à 1h maximum</strong> après
        validation de votre commande sur WhatsApp.
      </>
    ),
  },
  {
    q: 'Dois-je payer en ligne ?',
    a: "Non ! Vous payez uniquement à la livraison ou au retrait en point relais. Aucun paiement en ligne n'est requis.",
  },
  {
    q: 'Les frais de douane sont-ils inclus ?',
    a: 'Oui. Nous gérons toutes les formalités douanières. Les prix affichés incluent tous les frais (achat, transport, douane, livraison).',
  },
  {
    q: 'Puis-je commander un produit non listé sur le site ?',
    a: 'Absolument ! Contactez-nous via WhatsApp avec une photo ou un lien du produit recherché. Nous le trouvons, négocions le prix et l\'importons pour vous.',
  },
  {
    q: 'Comment suivre ma commande ?',
    a: "Après validation sur WhatsApp, notre équipe vous informe de chaque étape : achat confirmé, expédition, arrivée à Bafoussam, livraison. Tout se passe sur WhatsApp.",
  },
];

const colorMap = {
  orange: { bg: 'from-orange-100 to-orange-200', icon: 'text-orange-600', ring: 'ring-orange-100', grad: 'from-orange-500 to-orange-600' },
  green: { bg: 'from-green-100 to-green-200', icon: 'text-green-600', ring: 'ring-green-100', grad: 'from-green-500 to-green-600' },
  blue: { bg: 'from-blue-100 to-blue-200', icon: 'text-blue-600', ring: 'ring-blue-100', grad: 'from-blue-500 to-blue-600' },
} as const;

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export const HowItWorks = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero — compact on mobile, rich on desktop */}
      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 py-8 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl lg:text-6xl font-black text-white mb-3 lg:mb-6 leading-tight">
            Comment ça marche ?
          </h1>
          <p className="text-sm lg:text-2xl text-white/90 max-w-3xl mx-auto font-medium">
            <span className="lg:hidden">Commandez, recevez en moins d'1h, payez à la livraison.</span>
            <span className="hidden lg:inline">
              Achetez vos produits disponibles à Bafoussam en 4 étapes simples.
              Commandez et recevez en 10 minutes à 1h max avec paiement à la livraison.
            </span>
          </p>
        </div>
      </section>

      {/* Steps — vertical timeline on mobile, roadmap grid on desktop */}
      <section className="py-8 lg:py-24 bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-8xl mx-auto px-4">

          {/* Mobile: vertical timeline */}
          <div className="lg:hidden relative pl-2">
            <div className="absolute left-[31px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-orange-300 via-orange-400 to-green-400" />
            <div className="space-y-6">
              {STEPS.map((step, i) => {
                const c = colorMap[step.color as keyof typeof colorMap];
                const Icon = step.icon;
                return (
                  <Reveal key={step.title} delay={i * 0.08}>
                    <div className="flex gap-4">
                      <div
                        className={`relative z-10 shrink-0 w-16 h-16 bg-gradient-to-br ${c.grad} rounded-2xl flex items-center justify-center shadow-lg ring-4 ${c.ring}`}
                      >
                        <Icon className="text-white" size={26} />
                      </div>
                      <div className="flex-1 bg-white rounded-2xl p-4 shadow-md border border-gray-100 min-h-16 flex flex-col justify-center">
                        <h3 className="font-black text-base text-gray-900 mb-1">
                          {i + 1}. {step.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-snug">{step.short}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Desktop: original roadmap grid */}
          <div className="hidden lg:block relative">
            <div
              className="absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-orange-200 via-orange-400 to-green-400 mx-auto"
              style={{ width: 'calc(100% - 200px)', marginLeft: '100px' }}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {STEPS.map((step, i) => {
                const c = colorMap[step.color as keyof typeof colorMap];
                const Icon = step.icon;
                return (
                  <div key={step.title} className="relative flex flex-col items-center">
                    <div
                      className={`relative z-10 w-24 h-24 bg-gradient-to-br ${c.grad} rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-2xl mb-6 ring-4 ${c.ring} transform hover:scale-105 transition-transform`}
                    >
                      {i + 1}
                    </div>
                    <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-orange-100 hover:border-orange-400 hover:shadow-2xl transition-all h-full w-full">
                      <div className={`w-16 h-16 bg-gradient-to-br ${c.bg} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                        <Icon className={c.icon} size={32} />
                      </div>
                      <h3 className="font-black text-xl text-gray-900 mb-3 text-center">{step.title}</h3>
                      <p className="text-gray-600 text-center leading-relaxed">{step.long}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badge sécurité */}
          <Reveal delay={0.2}>
            <div className="mt-10 lg:mt-16 text-center">
              <div className="inline-flex items-center gap-2 lg:gap-3 bg-white px-5 py-3 lg:px-8 lg:py-4 rounded-2xl shadow-xl border-2 border-green-200">
                <Shield className="text-green-600 shrink-0" size={22} />
                <span className="font-black text-gray-900 text-sm lg:text-lg">
                  Paiement 100% sécurisé à la livraison
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-8 lg:py-16 bg-white">
        <div className="max-w-8xl mx-auto px-4">
          <h2 className="text-xl lg:text-4xl font-black text-gray-900 text-center mb-6 lg:mb-12">
            Pourquoi nous choisir ?
          </h2>

          {/* Mobile: compact cards */}
          <div className="lg:hidden grid grid-cols-1 gap-3">
            {BENEFITS.map((b, i) => {
              const c = colorMap[b.color as keyof typeof colorMap];
              const Icon = b.icon;
              return (
                <Reveal key={b.title} delay={i * 0.06}>
                  <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className={`shrink-0 w-12 h-12 bg-gradient-to-br ${c.bg} rounded-xl flex items-center justify-center`}>
                      <Icon className={c.icon} size={22} />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-gray-900">{b.title}</h3>
                      <p className="text-xs text-gray-600 leading-snug mt-0.5">{b.short}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Desktop: original rich cards */}
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-8">
            {BENEFITS.map((b) => {
              const c = colorMap[b.color as keyof typeof colorMap];
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className={`bg-gradient-to-br ${c.bg.replace('100', '50').replace('200', 'white')} rounded-3xl p-8 border-2 border-orange-100 hover:border-orange-300 transition-all`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${c.bg} rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon className={c.icon} size={32} />
                  </div>
                  <h3 className="font-black text-xl text-gray-900 mb-3">{b.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{b.long}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ — accordion on mobile, always-expanded on desktop */}
      <section className="py-8 lg:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl lg:text-4xl font-black text-gray-900 text-center mb-6 lg:mb-12">
            Questions fréquentes
          </h2>

          {/* Mobile: accordion */}
          <div className="lg:hidden space-y-2">
            {FAQ.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={item.q} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
                  >
                    <span className="font-bold text-sm text-gray-900">{item.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0"
                    >
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Desktop: original expanded cards */}
          <div className="hidden lg:block space-y-6">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-orange-200 transition-all"
              >
                <h3 className="font-black text-xl text-gray-900 mb-3">{item.q}</h3>
                <p className="text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-8 lg:py-16 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl lg:text-5xl font-black text-white mb-3 lg:mb-6">Prêt à commencer ?</h2>
          <p className="hidden lg:block text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Découvrez nos produits disponibles en stock local avec livraison express en moins d'1 heure
          </p>
          <a
            href="/produits"
            className="inline-flex items-center gap-2 lg:gap-3 px-6 py-3.5 lg:px-10 lg:py-5 bg-white text-orange-600 rounded-2xl font-black text-sm lg:text-lg hover:bg-gray-50 active:scale-95 transition-all shadow-2xl lg:hover:scale-105 transform"
          >
            <ShoppingCart size={20} />
            Voir le catalogue
          </a>
        </div>
      </section>
    </div>
  );
};
