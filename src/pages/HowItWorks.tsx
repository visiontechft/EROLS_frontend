import { Eye, ShoppingCart, MessageCircle, Truck, Shield, Package } from 'lucide-react';

export const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Comment ça marche ?
          </h1>
          <p className="text-lg lg:text-2xl text-white/90 max-w-3xl mx-auto font-medium">
            Achetez vos produits disponibles à Bafoussam en 4 étapes simples.
            Commandez et recevez en 10 minutes à 1h max avec paiement à la livraison.
          </p>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Timeline */}
          <div className="relative">
            {/* Ligne de connexion - cachée sur mobile */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-orange-200 via-orange-400 to-green-400 mx-auto" style={{width: 'calc(100% - 200px)', marginLeft: '100px'}}></div>
            
            {/* Étapes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              
              {/* Étape 1 */}
              <div className="relative flex flex-col items-center">
                <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-2xl mb-6 ring-4 ring-orange-100 transform hover:scale-105 transition-transform">
                  1
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-orange-100 hover:border-orange-400 hover:shadow-2xl transition-all h-full w-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <Eye className="text-orange-600" size={32} />
                  </div>
                  <h3 className="font-black text-xl text-gray-900 mb-3 text-center">
                    Naviguez et choisissez
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Parcourez notre catalogue de produits chinois de qualité. Explorez par catégories et sélectionnez ce qui vous intéresse.
                  </p>
                </div>
              </div>

              {/* Étape 2 */}
              <div className="relative flex flex-col items-center">
                <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-2xl mb-6 ring-4 ring-orange-100 transform hover:scale-105 transition-transform">
                  2
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-orange-100 hover:border-orange-400 hover:shadow-2xl transition-all h-full w-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <ShoppingCart className="text-orange-600" size={32} />
                  </div>
                  <h3 className="font-black text-xl text-gray-900 mb-3 text-center">
                    Ajoutez au panier
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Sélectionnez un ou plusieurs produits, personnalisez les quantités selon vos besoins et ajoutez-les à votre panier.
                  </p>
                </div>
              </div>

              {/* Étape 3 */}
              <div className="relative flex flex-col items-center">
                <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-2xl mb-6 ring-4 ring-orange-100 transform hover:scale-105 transition-transform">
                  3
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-orange-100 hover:border-orange-400 hover:shadow-2xl transition-all h-full w-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <MessageCircle className="text-orange-600" size={32} />
                  </div>
                  <h3 className="font-black text-xl text-gray-900 mb-3 text-center">
                    Commandez via WhatsApp
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Cliquez sur "Commander", sélectionnez votre ville et finalisez votre commande directement sur WhatsApp avec notre équipe.
                  </p>
                </div>
              </div>

              {/* Étape 4 */}
              <div className="relative flex flex-col items-center">
                <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-2xl mb-6 ring-4 ring-green-100 transform hover:scale-105 transition-transform">
                  4
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-green-100 hover:border-green-400 hover:shadow-2xl transition-all h-full w-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <Truck className="text-green-600" size={32} />
                  </div>
                  <h3 className="font-black text-xl text-gray-900 mb-3 text-center">
                    Recevez et payez
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Recevez vos produits disponibles en stock en 10 minutes à 1h max et payez à la livraison à domicile ou dans un point de retrait.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Badge sécurité */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-2xl shadow-xl border-2 border-green-200">
              <Shield className="text-green-600" size={28} />
              <span className="font-black text-gray-900 text-lg">Paiement 100% sécurisé à la livraison</span>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 text-center mb-12">
            Pourquoi nous choisir ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-3xl p-8 border-2 border-orange-100 hover:border-orange-300 transition-all">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <Package className="text-orange-600" size={32} />
              </div>
              <h3 className="font-black text-xl text-gray-900 mb-3">
                Livraison express locale
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Tous nos produits sont déjà disponibles à Bafoussam. Pas d'attente, pas d'import : commandez et recevez en 10 minutes à 1h max dans votre quartier.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-3xl p-8 border-2 border-green-100 hover:border-green-300 transition-all">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="text-green-600" size={32} />
              </div>
              <h3 className="font-black text-xl text-gray-900 mb-3">
                Zéro risque financier
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Payez uniquement à la réception de vos produits. Aucun paiement en ligne requis. Vous ne payez que lorsque vous êtes satisfait.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 border-2 border-blue-100 hover:border-blue-300 transition-all">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <MessageCircle className="text-blue-600" size={32} />
              </div>
              <h3 className="font-black text-xl text-gray-900 mb-3">
                Support personnalisé
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Notre équipe vous accompagne via WhatsApp à chaque étape. Questions, suivi de commande, tout se fait simplement par message.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 text-center mb-12">
            Questions fréquentes
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-orange-200 transition-all">
              <h3 className="font-black text-xl text-gray-900 mb-3">
                Combien de temps prend la livraison ?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Pour les produits en stock à Bafoussam : livraison ultra-rapide en <strong className="text-orange-600">10 minutes à 1h maximum</strong> après validation de votre commande sur WhatsApp. C'est l'un de nos plus grands avantages !
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-orange-200 transition-all">
              <h3 className="font-black text-xl text-gray-900 mb-3">
                Dois-je payer en ligne ?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Non ! Vous payez uniquement à la livraison (paiement à la réception) ou au retrait en point relais. Aucun paiement en ligne n'est requis. C'est plus sûr pour vous.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-orange-200 transition-all">
              <h3 className="font-black text-xl text-gray-900 mb-3">
                Les frais de douane sont-ils inclus ?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Oui, absolument ! Nous gérons toutes les formalités douanières pour vous. Les prix affichés sur le site incluent tous les frais (achat, transport, douane, livraison). Aucun frais caché.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-orange-200 transition-all">
              <h3 className="font-black text-xl text-gray-900 mb-3">
                Puis-je commander un produit non listé sur le site ?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Absolument ! Contactez-nous via WhatsApp avec une photo ou un lien du produit que vous recherchez. Nous nous occupons de le trouver en Chine, de négocier le prix et de l'importer pour vous.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-orange-200 transition-all">
              <h3 className="font-black text-xl text-gray-900 mb-3">
                Comment suivre ma commande ?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Après validation sur WhatsApp, notre équipe vous tient informé régulièrement de l'avancement : achat confirmé, produit expédié, arrivée à Bafoussam, et livraison programmée dans votre quartier. Tout se passe sur WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Découvrez nos produits disponibles en stock local avec livraison express en moins d'1 heure
          </p>
          <a
            href="/produits"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-orange-600 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all shadow-2xl hover:scale-105 transform"
          >
            <ShoppingCart size={24} />
            Voir le catalogue
          </a>
        </div>
      </section>
    </div>
  );
};