import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites, useToggleFavorite } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  garageId: string;
  size?: 'sm' | 'icon';
  className?: string;
}

const FavoriteButton = ({ garageId, size = 'icon', className = '' }: FavoriteButtonProps) => {
  const { user } = useAuth();
  const { data: favorites = [] } = useFavorites();
  const toggleFavorite = useToggleFavorite();
  const navigate = useNavigate();

  const isFavorite = favorites.includes(garageId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.info('Connectez-vous pour sauvegarder des garages');
      navigate('/auth');
      return;
    }
    toggleFavorite.mutate(
      { garageId, isFavorite },
      {
        onSuccess: () => {
          toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
        },
      }
    );
  };

  return (
    <Button
      variant="ghost"
      size={size}
      className={`${className} transition-colors`}
      onClick={handleClick}
      disabled={toggleFavorite.isPending}
    >
      <Heart
        className={`w-4 h-4 transition-all ${
          isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
        }`}
      />
    </Button>
  );
};

export default FavoriteButton;
