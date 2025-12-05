export const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Politique de Confidentialité</h1>
        <p className="text-gray-600 mb-8">Dernière mise à jour : Décembre 2024</p>

        <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
            <p className="text-gray-600">
              EROLS EasyBuy accorde une grande importance à la protection de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations personnelles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Données collectées</h2>
            <p className="text-gray-600 mb-2">Nous collectons les informations suivantes :</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Informations d'identification : nom, prénom, email, téléphone</li>
              <li>Informations de livraison : adresse, ville</li>
              <li>Informations de commande : produits commandés, montants, historique</li>
              <li>Données de navigation : pages visitées, durée de visite</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Utilisation des données</h2>
            <p className="text-gray-600 mb-2">Vos données sont utilisées pour :</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Traiter et gérer vos commandes</li>
              <li>Assurer la livraison de vos produits</li>
              <li>Vous contacter concernant vos commandes</li>
              <li>Améliorer nos services et notre plateforme</li>
              <li>Vous envoyer des informations promotionnelles (avec votre consentement)</li>
              <li>Prévenir la fraude et garantir la sécurité de la plateforme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Partage des données</h2>
            <p className="text-gray-600 mb-2">
              Nous ne vendons ni ne louons vos données personnelles à des tiers. Nous pouvons partager vos informations uniquement avec :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Nos partenaires logistiques pour assurer la livraison</li>
              <li>Nos prestataires de services techniques</li>
              <li>Les autorités compétentes si la loi l'exige</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Sécurité des données</h2>
            <p className="text-gray-600">
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte, destruction ou altération. Vos mots de passe sont cryptés et nous utilisons des connexions sécurisées (HTTPS).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Conservation des données</h2>
            <p className="text-gray-600">
              Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services et respecter nos obligations légales. Les données de commande sont conservées pendant 5 ans conformément aux obligations comptables.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Vos droits</h2>
            <p className="text-gray-600 mb-2">
              Conformément à la réglementation en vigueur, vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Droit d'accès à vos données personnelles</li>
              <li>Droit de rectification en cas d'inexactitude</li>
              <li>Droit à l'effacement de vos données</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit d'opposition au traitement</li>
              <li>Droit à la portabilité de vos données</li>
            </ul>
            <p className="text-gray-600 mt-2">
              Pour exercer ces droits, contactez-nous à : contact@erolseasybuy.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Cookies</h2>
            <p className="text-gray-600">
              Nous utilisons des cookies pour améliorer votre expérience sur notre plateforme. Les cookies nous aident à mémoriser vos préférences et à analyser l'utilisation de notre site. Vous pouvez configurer votre navigateur pour refuser les cookies, mais certaines fonctionnalités pourraient ne pas fonctionner correctement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Données des mineurs</h2>
            <p className="text-gray-600">
              Notre plateforme n'est pas destinée aux personnes de moins de 18 ans. Nous ne collectons pas sciemment de données personnelles auprès de mineurs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Modifications de la politique</h2>
            <p className="text-gray-600">
              Nous pouvons modifier cette politique de confidentialité à tout moment. Les modifications prendront effet dès leur publication sur cette page. Nous vous encourageons à consulter régulièrement cette page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Contact</h2>
            <p className="text-gray-600">
              Pour toute question concernant cette politique de confidentialité ou l'utilisation de vos données personnelles, contactez-nous :
            </p>
            <ul className="list-none text-gray-600 space-y-1 ml-4 mt-2">
              <li>Email : contact@erolseasybuy.com</li>
              <li>Téléphone : +237 6 00 00 00 00</li>
              <li>WhatsApp : +237 6 00 00 00 00</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};
