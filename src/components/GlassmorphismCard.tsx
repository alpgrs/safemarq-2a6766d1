import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassmorphismCardProps {
  children: ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  delay?: number;
}

const intensityStyles = {
  low: 'backdrop-blur-sm bg-white/5 border border-white/10',
  medium: 'backdrop-blur-md bg-white/10 border border-white/20',
  high: 'backdrop-blur-lg bg-white/15 border border-white/30',
};

export const GlassmorphismCard = ({
  children,
  className = '',
  intensity = 'medium',
  delay = 0,
}: GlassmorphismCardProps) => {
  return (
    <motion.div
      className={`rounded-2xl ${intensityStyles[intensity]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.2, 0, 0, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default GlassmorphismCard;
