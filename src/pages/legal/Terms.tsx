import LegalLayout from './LegalLayout';

const Terms = () => (
  <LegalLayout title="Conditions Générales d'Utilisation" description="CGU de la plateforme Trustmarq.">
    <h2>1. Objet</h2>
    <p>Trustmarq est une plateforme de mise en relation entre particuliers et garages automobiles en Belgique. Elle permet la consultation de fiches garages, la publication d'avis et la demande de devis.</p>

    <h2>2. Accès au service</h2>
    <p>L'accès en consultation est gratuit. Certaines fonctionnalités (avis, devis, favoris, espace pro) nécessitent la création d'un compte.</p>

    <h2>3. Compte utilisateur</h2>
    <ul>
      <li>L'utilisateur s'engage à fournir des informations exactes.</li>
      <li>Les identifiants sont strictement personnels.</li>
      <li>Trustmarq peut suspendre tout compte en cas d'usage frauduleux.</li>
    </ul>

    <h2>4. Avis et contenus</h2>
    <p>Les avis publiés doivent être sincères et basés sur une expérience réelle. La preuve d'achat (facture) peut être demandée pour certifier l'avis. Tout contenu diffamatoire, injurieux ou commercial sera retiré.</p>

    <h2>5. Demandes de devis</h2>
    <p>Les demandes de devis sont transmises au garagiste concerné. Trustmarq n'est pas partie au contrat conclu entre l'utilisateur et le garagiste.</p>

    <h2>6. Espace pro</h2>
    <p>Les garagistes peuvent revendiquer leur fiche pour gérer leurs avis et devis. La revendication est validée automatiquement si l'email professionnel correspond au domaine du site, sinon manuellement.</p>

    <h2>7. Responsabilité</h2>
    <p>Trustmarq fournit une plateforme d'information. Nous ne garantissons pas l'exactitude exhaustive des données et déclinons toute responsabilité quant aux prestations réalisées par les garagistes.</p>

    <h2>8. Propriété intellectuelle</h2>
    <p>L'ensemble des éléments de la plateforme (marque, design, code) sont protégés par le droit d'auteur belge et international.</p>

    <h2>9. Modification des CGU</h2>
    <p>Trustmarq se réserve le droit de modifier ces CGU à tout moment. Les utilisateurs seront informés des modifications substantielles.</p>

    <h2>10. Droit applicable</h2>
    <p>Les présentes CGU sont régies par le droit belge. Tout litige relève de la compétence des tribunaux de Namur.</p>
  </LegalLayout>
);

export default Terms;
