import LegalLayout from './LegalLayout';

const Mentions = () => (
  <LegalLayout title="Mentions légales" description="Mentions légales de Trustmarq.">
    <h2>Éditeur du site</h2>
    <p>
      <strong>Trustmarq</strong><br />
      Plateforme de comparaison de garages automobiles<br />
      Namur, Belgique<br />
      Email : contact@trustmarq.be
    </p>

    <h2>Hébergement</h2>
    <p>Le site est hébergé via Lovable Cloud (infrastructure Supabase, Union Européenne).</p>

    <h2>Directeur de la publication</h2>
    <p>Le représentant légal de Trustmarq.</p>

    <h2>Propriété intellectuelle</h2>
    <p>L'ensemble du contenu (textes, graphismes, logos, code) est la propriété exclusive de Trustmarq, sauf mention contraire. Toute reproduction est interdite sans autorisation préalable.</p>

    <h2>Crédits</h2>
    <ul>
      <li>Cartographie : © OpenStreetMap contributors</li>
      <li>Icônes : Lucide</li>
    </ul>

    <h2>Contact</h2>
    <p>Pour toute question : <a href="mailto:contact@trustmarq.be">contact@trustmarq.be</a></p>
  </LegalLayout>
);

export default Mentions;
