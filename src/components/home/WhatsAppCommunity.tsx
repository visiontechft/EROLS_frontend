import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, CONTACT } from '../../lib/config';

/**
 * Stands in for a classic "email newsletter" block — EROLS doesn't run an email
 * list, but WhatsApp is the platform's real, always-on channel. Sending people
 * there is more honest than a signup form with nothing behind it.
 */
export function WhatsAppCommunity() {
  return (
    <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 px-8 py-14 lg:px-16 lg:py-16 text-center"
      >
        <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-black/5" />

        <div className="relative">
          <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-3">
            Restez informé sur WhatsApp
          </h2>
          <p className="text-white/90 max-w-lg mx-auto mb-8">
            Nouveaux produits, offres et suivi de commande — tout se passe sur
            WhatsApp. Rejoignez-nous en un clic.
          </p>
          <a
            href={buildWhatsAppUrl(CONTACT.whatsappNumber, 'Bonjour, je veux suivre vos nouveautés.')}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-orange-600 shadow-lg transition-transform hover:scale-105 active:scale-100"
          >
            <MessageCircle className="h-5 w-5" />
            Discuter sur WhatsApp
          </a>
        </div>
      </motion.div>
    </section>
  );
}
