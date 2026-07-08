import React from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import { Logo } from './Logo';
import { CONTACT, buildWhatsAppUrl } from '../lib/config';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'À propos', path: '/a-propos' },
      { label: 'Comment ça marche', path: '/comment-ca-marche' },
      { label: 'FAQ', path: '/faq' },
      { label: 'Contact', path: '/contact' },
    ],
    customer: [
      { label: 'Mon compte', path: '/profil' },
      { label: 'Mes commandes', path: '/mes-commandes' },
      { label: 'Demande spéciale', path: '/demande-speciale' },
      { label: 'Panier', path: '/panier' },
    ],
    legal: [
      { label: 'Conditions générales', path: '/conditions' },
      { label: 'Politique de confidentialité', path: '/politique-confidentialite' },
    ],
  };

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/erols',
      color: 'hover:text-blue-600',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/erols',
      color: 'hover:text-pink-600',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com/erols',
      color: 'hover:text-blue-400',
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center bg-white rounded-lg p-2">
              <Logo className="h-8 w-auto" />
            </Link>
            <p className="text-sm text-gray-400">
              Votre destination pour des produits chinois de qualité à Bafoussam.
              Commandez facilement et recevez en quelques heures.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 transition-colors ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-orange-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Service Client</h3>
            <ul className="space-y-2">
              {footerLinks.customer.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-orange-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  {CONTACT.address}
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <a
                  href={`tel:${CONTACT.phoneNumber.replace(/\s/g, '')}`}
                  className="text-sm hover:text-orange-500 transition-colors"
                >
                  {CONTACT.phoneNumber}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MessageCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <a
                  href={buildWhatsAppUrl(CONTACT.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-green-500 transition-colors"
                >
                  {CONTACT.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="hover:text-orange-500 transition-colors block"
                  >
                    {CONTACT.email}
                  </a>
                  <a
                    href={`mailto:${CONTACT.supportEmail}`}
                    className="hover:text-orange-500 transition-colors block mt-1"
                  >
                    {CONTACT.supportEmail}
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-white font-semibold mb-2">
              Restez informé de nos offres
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Inscrivez-vous à notre newsletter pour recevoir nos dernières offres
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p className="text-sm text-gray-400">
                &copy; {currentYear} EROLS. Tous droits réservés.
              </p>
              <span className="hidden md:inline text-gray-600">|</span>
             <p className="text-sm text-gray-500">
                Développé par{" "}
                <a
                  href="https://visiontech.vision"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 font-semibold hover:underline"
                >
                  VISIONTECH
                </a>
              </p>

            </div>
            <div className="flex items-center space-x-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}