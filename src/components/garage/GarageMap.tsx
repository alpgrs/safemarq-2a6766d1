import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import LeafletMapView, { garageMarkerIcon } from '@/components/maps/LeafletMapView';

interface GarageMapProps {
  address: string;
  coords: { lat: number; lng: number };
}

const escapeHtml = (value: string) =>
  value
    .split('&').join('&amp;')
    .split('<').join('&lt;')
    .split('>').join('&gt;')
    .split('"').join('&quot;')
    .split("'").join('&#39;');

const GarageMap = ({ address, coords }: GarageMapProps) => {
  const markers = [
    {
      id: 'garage-location',
      position: coords,
      icon: garageMarkerIcon,
      popupHtml: `<span style="font-size:12px;font-weight:600">${escapeHtml(address)}</span>`,
    },
  ];

  return (
    <motion.div
      className="surface-card overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.2, 0, 0, 1] }}
    >
      <div className="relative aspect-[16/9] z-0">
        <LeafletMapView
          center={[coords.lat, coords.lng]}
          zoom={15}
          markers={markers}
          fitPoints={[[coords.lat, coords.lng]]}
          className="w-full h-full"
          style={{ background: 'hsl(217 33% 17%)' }}
          maxFitZoom={15}
          scrollWheelZoom={false}
        />
      </div>

      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span>{address}</span>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary font-semibold hover:text-primary/80 transition-colors"
        >
          Itinéraire →
        </a>
      </div>
    </motion.div>
  );
};

export default GarageMap;
