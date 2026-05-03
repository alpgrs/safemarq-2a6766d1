import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full surface-card p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7 text-destructive" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-lg font-bold text-foreground">Une erreur est survenue</h1>
            <p className="text-sm text-muted-foreground">
              Désolé, quelque chose s'est mal passé. Vous pouvez réessayer ou revenir à l'accueil.
            </p>
          </div>
          {this.state.error?.message && (
            <p className="text-[10px] font-mono text-muted-foreground/70 bg-secondary/40 rounded-lg p-2 break-all">
              {this.state.error.message}
            </p>
          )}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={this.handleReset}>
              <RefreshCw className="w-4 h-4" /> Réessayer
            </Button>
            <Button className="flex-1" onClick={() => (window.location.href = '/')}>
              <Home className="w-4 h-4" /> Accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
