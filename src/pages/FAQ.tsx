import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Commande',
      questions: [
        {
          q: 'Comment passer une commande ?',
          a: 'Parcourez notre catalogue, ajoutez les produits à votre panier, puis cliquez sur "Commander". Renseignez vos informations de livraison et confirmez.',
        },
        {
          q: 'Puis-je modifier ma commande après validation ?',
          a: 'Vous pouvez annuler votre commande tant qu\'elle n\'a pas été confirmée par notre équipe. Contactez-nous rapidement via WhatsApp.',
        },
        {
          q: 'Comment suivre ma commande ?',
          a: 'Connectez-vous à votre compte et consultez la section "Mes commandes". Vous verrez le statut en temps réel de chaque commande.',
        },
      ],
    },
    {
      category: 'Livraison',
      questions: [
        {
          q: 'Quels sont les délais de livraison ?',
          a: 'Comptez entre 2 et 4 semaines après validation de votre commande. Ce délai inclut l\'achat, le transport et la douane.',
        },
        {
          q: 'Livrez-vous partout au Cameroun ?',
          a: 'Oui, nous livrons dans toutes les grandes villes du Cameroun : Douala, Yaoundé, Bafoussam, Garoua, etc.',
        },
        {
          q: 'Quels sont les frais de livraison ?',
          a: 'Les frais de livraison sont calculés en fonction de votre ville et du poids de votre commande. Ils vous seront communiqués avant validation.',
        },
      ],
    },
    {
      category: 'Paiement',
      questions: [
        {
          q: 'Quels modes de paiement acceptez-vous ?',
          a: 'Nous acceptons le paiement à la livraison (cash on delivery) et le paiement au retrait en point relais. Aucun paiement en ligne n\'est requis.',
        },
        {
          q: 'Est-ce sécurisé de payer à la livraison ?',
          a: 'Oui, c\'est totalement sécurisé. Vous payez uniquement lorsque vous recevez votre colis et vérifiez son contenu.',
        },
        {
          q: 'Acceptez-vous Mobile Money ?',
          a: 'Actuellement, nous acceptons uniquement le paiement en espèces. Le paiement Mobile Money sera disponible prochainement.',
        },
      ],
    },
    {
      category: 'Produits',
      questions: [
        {
          q: 'Les produits sont-ils authentiques ?',
          a: 'Oui, nous travaillons avec des fournisseurs vérifiés en Chine. Tous les produits sont contrôlés avant expédition.',
        },
        {
          q: 'Puis-je retourner un produit ?',
          a: 'Oui, vous avez 7 jours pour retourner un produit défectueux ou non conforme. Contactez notre service client.',
        },
        {
          q: 'Comment demander un produit non listé ?',
          a: 'Utilisez notre fonctionnalité "Demande spéciale" dans votre espace client. Indiquez le produit recherché avec description ou lien.',
        },
      ],
    },
    {
      category: 'Compte',
      questions: [
        {
          q: 'Comment créer un compte ?',
          a: 'Cliquez sur "Inscription" en haut de la page, remplissez le formulaire et validez. C\'est gratuit et rapide.',
        },
        {
          q: 'Quelle est la différence entre Client et Revendeur ?',
          a: 'Les revendeurs bénéficient de prix de gros pour commander en grande quantité et revendre. Les clients commandent pour usage personnel.',
        },
        {
          q: 'J\'ai oublié mon mot de passe, que faire ?',
          a: 'Contactez notre service client via WhatsApp avec votre email. Nous vous aiderons à réinitialiser votre mot de passe.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Foire Aux Questions (FAQ)
        </h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Trouvez rapidement les réponses à vos questions
        </p>

        <div className="space-y-8">
          {faqs.map((category, catIndex) => (
            <div key={catIndex} className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{category.category}</h2>
              <div className="space-y-3">
                {category.questions.map((faq, qIndex) => {
                  const index = catIndex * 100 + qIndex;
                  const isOpen = openIndex === index;

                  return (
                    <div key={qIndex} className="border-b last:border-b-0 pb-3 last:pb-0">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        className="w-full flex items-start justify-between text-left py-2 hover:text-orange-500 transition-colors"
                      >
                        <span className="font-semibold text-gray-800 pr-4">{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-orange-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <p className="text-gray-600 mt-2 pl-0 pr-8">{faq.a}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-orange-500 to-blue-600 rounded-xl shadow-md p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Vous ne trouvez pas votre réponse ?</h2>
          <p className="text-lg mb-6">
            Notre équipe est disponible pour vous aider via WhatsApp
          </p>
          <a
            href="https://wa.me/237600000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-white text-orange-500 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contactez-nous sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
