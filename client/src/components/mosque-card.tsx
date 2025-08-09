import { Link } from "wouter";
import { Heart, MapPin } from "lucide-react";
import type { MosqueWithDonations } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";

interface MosqueCardProps {
  mosque: MosqueWithDonations;
}

export default function MosqueCard({ mosque }: MosqueCardProps) {
  return (
    <Card className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video overflow-hidden">
        <img 
          src={mosque.mainImage} 
          alt={mosque.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-mosque-green-700 mb-2">
          {mosque.name}
        </h3>
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin className="w-4 h-4 ml-1" />
          <span>{mosque.address}</span>
        </div>
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {mosque.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 flex items-center">
            <Heart className="text-mosque-gold-600 w-4 h-4 ml-1" />
            <span>{mosque.donationsCount} مشاريع تبرعات</span>
          </div>
          
          <Link href={`/mosque/${mosque.id}`}>
            <button className="bg-mosque-green-600 hover:bg-mosque-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              عرض التفاصيل
            </button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
