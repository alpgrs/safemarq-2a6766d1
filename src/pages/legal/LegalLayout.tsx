import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';
import Seo from '@/components/Seo';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';

interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

const LegalLayout = ({ title, description, children }: Props) => (
  <div className="min-h-screen bg-background">
    <Seo title={title} description={description} />
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </Link>
      </div>
    </header>
    <main className="pt-20 pb-12 max-w-3xl mx-auto px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{title}</h1>
      <p className="text-sm text-muted-foreground mb-6">Dernière mise à jour : {new Date().toLocaleDateString('fr-BE')}</p>
      <article className="prose prose-invert prose-sm max-w-none space-y-4 text-sm text-foreground/80 leading-relaxed [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-6 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_a]:text-primary [&_a]:underline">
        {children}
      </article>
    </main>
    <Footer />
    <BottomNav />
  </div>
);

export default LegalLayout;
