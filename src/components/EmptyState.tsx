import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const EmptyState = ({ icon: Icon, title, description, action, className = '' }: Props) => (
  <div className={`flex flex-col items-center justify-center text-center py-10 px-4 ${className}`}>
    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
      <Icon className="w-7 h-7 text-primary" />
    </div>
    <h3 className="text-sm font-bold text-foreground mb-1">{title}</h3>
    {description && <p className="text-xs text-muted-foreground max-w-xs">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
