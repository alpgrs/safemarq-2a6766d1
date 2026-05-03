import { motion, MotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedCardProps extends MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hoverScale?: number;
}

export const AnimatedCard = ({
  children,
  className = '',
  delay = 0,
  hoverScale = 1.02,
  ...motionProps
}: AnimatedCardProps) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: hoverScale }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.2, 0, 0, 1],
      }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
