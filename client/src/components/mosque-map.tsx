import { useEffect, useRef } from "react";
import type { MosqueWithDonations } from "@shared/schema";

declare global {
  interface Window {
    L: any;
  }
}

interface MosqueMapProps {
  mosques: MosqueWithDonations[];
  onMosqueClick?: (mosque: MosqueWithDonations) => void;
}

export default function MosqueMap({ mosques, onMosqueClick }: MosqueMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = window.L.map(mapRef.current).setView([35.0, 38.0], 7);
      
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer instanceof window.L.Marker) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Add mosque markers
    mosques.forEach(mosque => {
      const marker = window.L.marker([mosque.latitude, mosque.longitude])
        .bindPopup(`
          <div class="text-right font-arabic" dir="rtl" style="font-family: 'Tajawal', Arial, sans-serif;">
            <h3 class="font-bold text-lg mb-2" style="color: #047857;">${mosque.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${mosque.address}</p>
            <p class="text-sm mb-3">${mosque.donationsCount} مشاريع تبرعات</p>
            <button onclick="window.viewMosqueDetails('${mosque.id}')" 
                    style="background-color: #059669; color: white; padding: 4px 12px; border-radius: 4px; border: none; font-size: 12px; cursor: pointer;">
              عرض التفاصيل
            </button>
          </div>
        `)
        .addTo(mapInstanceRef.current);

      marker.on('click', () => {
        if (onMosqueClick) onMosqueClick(mosque);
      });
    });

    // Global function for popup buttons
    window.viewMosqueDetails = (mosqueId: string) => {
      const mosque = mosques.find(m => m.id === mosqueId);
      if (mosque && onMosqueClick) {
        onMosqueClick(mosque);
      }
    };

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mosques, onMosqueClick]);

  return <div ref={mapRef} className="h-96 lg:h-[600px] w-full" />;
}
