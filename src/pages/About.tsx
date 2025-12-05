import { Package, Users, Globe, Award } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">À propos d'EROLS EasyBuy</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Le marché chinois à votre porte
        </p>

        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Notre Mission</h2>
          <p className="text-gray-600 mb-4">
            EROLS EasyBuy est une plateforme e-commerce innovante qui révolutionne l'importation de produits chinois au Cameroun. Notre mission est de rendre accessible à tous les Camerounais des produits de qualité à des prix imbattables, directement depuis la Chine.
          </p>
          <p className="text-gray-600">
            Nous croyons que chaque Camerounais mérite d'avoir accès aux mêmes produits et aux mêmes prix que partout dans le monde, sans les contraintes et complications de l'importation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <Package className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Large Catalogue</h3>
            <p className="text-gray-600">
              Des milliers de produits dans toutes les catégories : électronique, mode, maison, et bien plus.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <Users className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Service Client</h3>
            <p className="text-gray-600">
              Une équipe dédiée disponible via WhatsApp pour vous accompagner à chaque étape.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <Globe className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Import Simplifié</h3>
            <p className="text-gray-600">
              Nous gérons tout : achat en Chine, douane, transport. Vous n'avez qu'à commander et recevoir.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <Award className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Qualité Garantie</h3>
            <p className="text-gray-600">
              Tous nos produits sont vérifiés avant expédition pour garantir votre satisfaction.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-blue-600 rounded-xl shadow-md p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Rejoignez-nous !</h2>
          <p className="text-lg mb-6">
            Des milliers de Camerounais ont déjà fait confiance à EROLS EasyBuy. Et vous ?
          </p>
        </div>
      </div>
    </div>
  );
};
