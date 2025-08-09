import { MapPin, Heart } from "lucide-react";
import type { MosqueWithDonations } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MosquePreviewCardProps {
  mosque: MosqueWithDonations;
  onViewProfile: () => void;
  onClose: () => void;
}

export default function MosquePreviewCard({ mosque, onViewProfile, onClose }: MosquePreviewCardProps) {
  return (
    <Card className="w-80 bg-white shadow-lg border-mosque-green-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-mosque-green-700 text-lg leading-tight">
            {mosque.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin className="w-4 h-4 ml-1" />
          <span>{mosque.city}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500 flex items-center">
            <Heart className="text-mosque-gold-600 w-4 h-4 ml-1" />
            <span>{mosque.donationsCount} مشاريع تبرعات</span>
          </div>
          <span className="text-xs bg-mosque-green-100 text-mosque-green-700 px-2 py-1 rounded">
            مسجد {mosque.size}
          </span>
        </div>

        <Button 
          onClick={onViewProfile}
          className="w-full bg-mosque-green-600 hover:bg-mosque-green-700 text-white"
          size="sm"
        >
          عرض تفاصيل المسجد
        </Button>
      </CardContent>
    </Card>
  );
}