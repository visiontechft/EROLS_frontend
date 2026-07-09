import { motion } from 'framer-motion';
import { Truck, Wallet, ShieldCheck, MessageCircle } from 'lucide-react';

const BENEFITS = [
  {
    icon: Truck,
    title: 'Livraison rapide',
    description: 'Livré chez vous à Bafoussam, en général en moins d\'une heure.',
  },
  {
    icon: Wallet,
    title: 'Paiement à la livraison',
    description: 'Vous payez seulement quand vous recevez votre commande, en toute confiance.',
  },
  {
    icon: ShieldCheck,
    title: 'Produits authentiques',
    description: 'Chaque article est vérifié avant expédition, conforme à la description.',
  },
  {
    icon: MessageCircle,
    title: 'Support WhatsApp',
    description: 'Une question ? Notre équipe vous répond directement sur WhatsApp.',
  },
];

export function BenefitsSection() {
  return (
    <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <p className="text-sm font-bold uppercase tracking-wider text-orange-600 mb-2">
          EROLS EasyBuy
        </p>
        <h2 className="text-3xl lg:text-4xl font-black text-gray-900">Pourquoi nous choisir</h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {BENEFITS.map(({ icon: Icon, title, description }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group text-center p-8 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="mx-auto mb-5 h-16 w-16 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300">
              <Icon className="h-7 w-7 text-orange-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
