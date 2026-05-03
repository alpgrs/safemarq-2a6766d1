import { CSSProperties, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface LeafletMarker {
  id: string;
  position: { lat: number; lng: number };
  popupHtml?: string;
  icon?: L.Icon<L.IconOptions> | L.DivIcon;
}

interface LeafletMapViewProps {
  center: [number, number];
  zoom: number;
  markers: LeafletMarker[];
  fitPoints?: [number, number][];
  className?: string;
  style?: CSSProperties;
  maxFitZoom?: number;
  scrollWheelZoom?: boolean;
}

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTRIBUTION = '&copy; <a href="https://carto.com/">CARTO</a>';
const FIT_PADDING: L.PointExpression = [30, 30];

export const garageMarkerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const userLocationIcon = L.divIcon({
  html: '<div style="width:16px;height:16px;background:hsl(217 91% 60%);border:3px solid white;border-radius:50%;box-shadow:0 0 8px rgba(59,130,246,0.6)"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  className: '',
});

const LeafletMapView = ({
  center,
  zoom,
  markers,
  fitPoints,
  className,
  style,
  maxFitZoom = zoom,
  scrollWheelZoom = false,
}: LeafletMapViewProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom,
    });

    L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION }).addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => map.invalidateSize())
      : null;

    resizeObserver?.observe(containerRef.current);

    return () => {
      resizeObserver?.disconnect();
      markersLayerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [scrollWheelZoom]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    markers.forEach(({ position, popupHtml, icon }) => {
      const marker = L.marker([position.lat, position.lng], icon ? { icon } : undefined);
      if (popupHtml) marker.bindPopup(popupHtml);
      marker.addTo(layer);
    });
  }, [markers]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (fitPoints?.length) {
      if (fitPoints.length > 1) {
        map.fitBounds(L.latLngBounds(fitPoints), { padding: FIT_PADDING, maxZoom: maxFitZoom });
      } else {
        map.setView(fitPoints[0], maxFitZoom);
      }
    } else {
      map.setView(center, zoom);
    }

    requestAnimationFrame(() => map.invalidateSize());
  }, [center, zoom, fitPoints, maxFitZoom]);

  return <div ref={containerRef} className={className} style={style} />;
};

export default LeafletMapView;
