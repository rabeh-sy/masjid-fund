import { useEffect, useRef, useState } from "react";
import type { MosqueWithDonations } from "@shared/schema";
import MosquePreviewCard from "./mosque-preview-card";
import { createPortal } from "react-dom";
import { useLocation } from "wouter";

declare global {
  interface Window {
    L: any;
  }
}

interface MosqueMapProps {
  mosques: MosqueWithDonations[];
  onMosqueClick?: (mosque: MosqueWithDonations) => void;
  selectedCity?: string;
}

const CITY_COORDINATES = {
  "دمشق": { lat: 33.5138, lng: 36.2765, zoom: 11 },
  "حلب": { lat: 36.2021, lng: 37.1343, zoom: 11 },
  "حمص": { lat: 34.7394, lng: 36.7076, zoom: 11 },
  "اللاذقية": { lat: 35.5211, lng: 35.7834, zoom: 11 },
  "طرطوس": { lat: 34.8833, lng: 35.8833, zoom: 11 },
};

export default function MosqueMap({ mosques, onMosqueClick, selectedCity }: MosqueMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedMosque, setSelectedMosque] = useState<MosqueWithDonations | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number } | null>(null);
  const [, setLocation] = useLocation();

  // Initialize map only once
  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = window.L.map(mapRef.current).setView([35.0, 38.0], 7);
      
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when mosques change
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer instanceof window.L.Marker) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Create custom mosque icon
    const mosqueIcon = window.L.divIcon({
      html: `<div style="
        background: #047857;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      ">🕌</div>`,
      className: 'custom-mosque-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    // Add mosque markers
    mosques.forEach(mosque => {
      const marker = window.L.marker([mosque.latitude, mosque.longitude], { icon: mosqueIcon })
        .addTo(mapInstanceRef.current);

      marker.on('click', (e: any) => {
        const { containerPoint } = e;
        setPreviewPosition({ x: containerPoint.x, y: containerPoint.y });
        setSelectedMosque(mosque);
        if (onMosqueClick) onMosqueClick(mosque);
      });
    });
  }, [mosques, onMosqueClick]);

  // Auto-zoom to selected city (separate effect to avoid re-rendering)
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedCity || selectedCity === "جميع المدن") {
      // Reset to default view when no city selected
      if (mapInstanceRef.current && selectedCity === "") {
        mapInstanceRef.current.setView([35.0, 38.0], 7);
      }
      return;
    }
    
    const cityData = CITY_COORDINATES[selectedCity as keyof typeof CITY_COORDINATES];
    if (cityData) {
      mapInstanceRef.current.setView([cityData.lat, cityData.lng], cityData.zoom, {
        animate: true,
        duration: 1
      });
    }
  }, [selectedCity]);

  const handleViewProfile = () => {
    if (selectedMosque) {
      setLocation(`/mosque/${selectedMosque.id}`);
    }
  };

  const handleClosePreview = () => {
    setSelectedMosque(null);
    setPreviewPosition(null);
  };

  return (
    <div className="relative">
      <div ref={mapRef} className="h-96 lg:h-[600px] w-full" />
      
      {/* Preview Card Overlay */}
      {selectedMosque && previewPosition && (
        <div 
          className="absolute z-[1000] pointer-events-none"
          style={{ 
            left: previewPosition.x + 10, 
            top: previewPosition.y - 100,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="pointer-events-auto">
            <MosquePreviewCard
              mosque={selectedMosque}
              onViewProfile={handleViewProfile}
              onClose={handleClosePreview}
            />
          </div>
        </div>
      )}
    </div>
  );
}
