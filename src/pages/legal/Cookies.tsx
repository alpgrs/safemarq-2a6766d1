import LegalLayout from './LegalLayout';

const Cookies = () => (
  <LegalLayout title="Politique Cookies" description="Utilisation des cookies sur Trustmarq.">
    <h2>Qu'est-ce qu'un cookie ?</h2>
    <p>Un cookie est un petit fichier texte stocké sur votre appareil lors de votre visite, permettant à un site de mémoriser certaines informations.</p>

    <h2>Cookies utilisés par Trustmarq</h2>
    <h2 className="text-sm">Cookies essentiels (sans consentement)</h2>
    <ul>
      <li><strong>Session d'authentification</strong> : pour maintenir votre connexion.</li>
      <li><strong>Préférences</strong> : thème (clair/sombre), consentement cookies.</li>
    </ul>

    <h2 className="text-sm">Cookies de mesure d'audience (avec consentement)</h2>
    <ul>
      <li>Statistiques anonymisées de visites (pages vues, temps passé) pour améliorer le service.</li>
    </ul>

    <h2>Gérer vos préférences</h2>
    <p>Vous pouvez à tout moment effacer les cookies via les paramètres de votre navigateur. Refuser les cookies analytiques n'affecte pas le fonctionnement du service.</p>

    <h2>Géolocalisation</h2>
    <p>La géolocalisation n'est activée qu'avec votre consentement explicite via votre navigateur, pour proposer les garages les plus proches.</p>
  </LegalLayout>
);

export default Cookies;
