import { Search, ShoppingCart, Plane, Package, CreditCard, Home } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="w-12 h-12" />,
      title: '1. Parcourez le catalogue',
      description: 'Explorez notre large sélection de produits chinois de qualité ou faites une demande spéciale si vous ne trouvez pas ce que vous cherchez.',
    },
    {
      icon: <ShoppingCart className="w-12 h-12" />,
      title: '2. Ajoutez au panier',
      description: 'Sélectionnez les produits qui vous intéressent, choisissez les quantités et ajoutez-les à votre panier.',
    },
    {
      icon: <Package className="w-12 h-12" />,
      title: '3. Passez commande',
      description: 'Validez votre panier, renseignez vos informations de livraison et confirmez votre commande en quelques clics.',
    },
    {
      icon: <Plane className="w-12 h-12" />,
      title: '4. Nous achetons et expédions',
      description: 'Nous achetons vos produits en Chine, gérons les formalités douanières et organisons le transport vers le Cameroun.',
    },
    {
      icon: <Home className="w-12 h-12" />,
      title: '5. Livraison à domicile',
      description: 'Recevez vos produits directement à votre adresse au Cameroun en 2 à 4 semaines.',
    },
    {
      icon: <CreditCard className="w-12 h-12" />,
      title: '6. Payez à la réception',
      description: 'Payez en espèces lors de la livraison ou au retrait en point relais. Aucun paiement en ligne requis.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Comment ça marche ?</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          6 étapes simples pour recevoir vos produits chinois
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
              <div className="text-orange-500 mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Questions fréquentes</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Combien de temps prend la livraison ?</h3>
              <p className="text-gray-600">
                En moyenne, comptez entre 2 et 4 semaines à partir de la validation de votre commande. Ce délai inclut l'achat en Chine, le transport maritime/aérien et les formalités douanières.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Dois-je payer en ligne ?</h3>
              <p className="text-gray-600">
                Non ! Vous payez uniquement à la livraison (cash on delivery) ou au retrait en point relais. Aucun paiement en ligne n'est requis.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Les frais de douane sont-ils inclus ?</h3>
              <p className="text-gray-600">
                Oui, nous gérons toutes les formalités douanières pour vous. Les prix affichés incluent tous les frais.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Puis-je commander un produit non listé ?</h3>
              <p className="text-gray-600">
                Absolument ! Utilisez notre fonctionnalité "Demande spéciale" pour nous indiquer quel produit vous recherchez. Nous nous occuperons de le trouver et de l'importer pour vous.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-blue-600 rounded-xl shadow-md p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Prêt à commencer ?</h2>
          <p className="text-lg mb-6">
            Découvrez notre catalogue et trouvez les produits qui vous intéressent
          </p>
          <a
            href="/produits"
            className="inline-block px-8 py-3 bg-white text-orange-500 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Voir le catalogue
          </a>
        </div>
      </div>
    </div>
  );
};
