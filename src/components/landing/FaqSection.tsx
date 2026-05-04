import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'Comment SAFEMARQ choisit-il les garages référencés ?',
    a: "Tout garage automobile actif en Belgique peut apparaître sur SAFEMARQ. Nous agrégeons les données publiques (Google, Pages d'Or) et permettons aux garagistes de revendiquer et enrichir leur fiche gratuitement.",
  },
  {
    q: 'Comment vérifiez-vous les avis ?',
    a: "Les avis publiés directement sur SAFEMARQ peuvent être vérifiés via une preuve d'intervention (facture, ticket). Les avis vérifiés portent un badge distinctif. Nous modérons activement pour retirer les avis frauduleux ou diffamatoires.",
  },
  {
    q: "Est-ce que c'est gratuit ?",
    a: "Oui, totalement gratuit pour les automobilistes. Aucune inscription requise pour rechercher, comparer ou demander un devis.",
  },
  {
    q: 'Comment fonctionne le score SAFEMARQ ?',
    a: "Le score combine 60% de la note moyenne (qualité perçue) et 40% du volume d'avis (fiabilité statistique). Un garage très bien noté avec peu d'avis aura un score plus prudent qu'un garage bien noté avec des centaines d'avis.",
  },
  {
    q: 'Je suis garagiste, comment apparaître ?',
    a: "Rendez-vous sur la page Pour les garagistes pour revendiquer votre fiche en quelques minutes. Vous pourrez ensuite répondre aux avis, gérer vos horaires et recevoir des demandes de devis.",
  },
];

const FaqSection = () => (
  <section className="px-4 md:px-6 max-w-3xl mx-auto py-12 md:py-20">
    <div className="text-center mb-10 md:mb-14">
      <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-3">
        Questions fréquentes
      </p>
      <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
        Tout ce qu'on vous a pas demandé.
      </h2>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
    >
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="border border-border rounded-2xl px-5 md:px-6 bg-card data-[state=open]:border-primary/40 transition-colors"
          >
            <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-foreground hover:no-underline py-5">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm md:text-base text-muted-foreground leading-relaxed pb-5">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  </section>
);

export default FaqSection;
