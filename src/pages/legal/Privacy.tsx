import LegalLayout from './LegalLayout';

const Privacy = () => (
  <LegalLayout title="Politique de Confidentialité" description="Politique de protection des données personnelles de Trustmarq, conforme au RGPD.">
    <p>Trustmarq accorde une importance fondamentale à la protection de vos données personnelles, conformément au Règlement Général sur la Protection des Données (RGPD - UE 2016/679).</p>

    <h2>1. Responsable du traitement</h2>
    <p>Trustmarq, basé à Namur, Belgique. Contact : privacy@trustmarq.be</p>

    <h2>2. Données collectées</h2>
    <ul>
      <li><strong>Compte</strong> : email, nom d'affichage, mot de passe (chiffré).</li>
      <li><strong>Profil véhicule</strong> : marque, modèle, plaque, kilométrage (optionnel).</li>
      <li><strong>Avis et devis</strong> : contenu publié, garage concerné, factures uploadées.</li>
      <li><strong>Technique</strong> : adresse IP, navigateur, géolocalisation (avec consentement).</li>
    </ul>

    <h2>3. Finalités</h2>
    <ul>
      <li>Permettre l'accès au service et la gestion du compte.</li>
      <li>Vérifier l'authenticité des avis.</li>
      <li>Mettre en relation utilisateurs et garagistes.</li>
      <li>Améliorer la plateforme (statistiques anonymisées).</li>
    </ul>

    <h2>4. Base légale</h2>
    <p>Exécution du contrat (CGU), intérêt légitime (sécurité, lutte contre la fraude), consentement (cookies analytiques, géolocalisation).</p>

    <h2>5. Conservation</h2>
    <p>Les données de compte sont conservées tant que le compte est actif. Les avis publiés restent visibles tant que le garage est référencé. Les données techniques sont conservées 13 mois maximum.</p>

    <h2>6. Vos droits</h2>
    <p>Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, de portabilité et d'opposition. Pour exercer ces droits : <a href="mailto:privacy@trustmarq.be">privacy@trustmarq.be</a>.</p>
    <p>Vous pouvez introduire une réclamation auprès de l'<a href="https://www.autoriteprotectiondonnees.be" target="_blank" rel="noreferrer">Autorité de Protection des Données belge</a>.</p>

    <h2>7. Sous-traitants</h2>
    <p>Trustmarq utilise des prestataires européens pour l'hébergement (Lovable Cloud / Supabase, UE) et la cartographie (OpenStreetMap). Aucune donnée n'est transférée hors UE sans garanties appropriées.</p>

    <h2>8. Sécurité</h2>
    <p>Mots de passe chiffrés, communications HTTPS, contrôle d'accès via Row-Level Security au niveau base de données.</p>
  </LegalLayout>
);

export default Privacy;
