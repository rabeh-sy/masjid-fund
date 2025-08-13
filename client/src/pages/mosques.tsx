import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, List, Map } from "lucide-react";
import { api } from "@/lib/api";
import type { MosqueWithDonations } from "@shared/schema";
import MosqueCard from "@/components/mosque-card";
import MosqueMap from "@/components/mosque-map";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";

// Session storage keys
const STORAGE_KEYS = {
  viewMode: 'mosques_view_mode',
  searchQuery: 'mosques_search_query',
  selectedCity: 'mosques_selected_city',
  selectedSize: 'mosques_selected_size',
};

export default function MosquesPage() {
  const [, setLocation] = useLocation();
  
  // Initialize state from session storage - default to list view
  const [viewMode, setViewMode] = useState<'map' | 'list'>(() => {
    const stored = sessionStorage.getItem(STORAGE_KEYS.viewMode);
    return (stored as 'map' | 'list') || 'list';
  });
  
  const [searchQuery, setSearchQuery] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEYS.searchQuery) || '';
  });
  
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    return sessionStorage.getItem(STORAGE_KEYS.selectedCity) || '';
  });
  
  const [selectedSize, setSelectedSize] = useState<string>(() => {
    return sessionStorage.getItem(STORAGE_KEYS.selectedSize) || '';
  });

  // Save to session storage whenever state changes
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.viewMode, viewMode);
  }, [viewMode]);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.searchQuery, searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.selectedCity, selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.selectedSize, selectedSize);
  }, [selectedSize]);

  const { data: mosques = [], isLoading, error } = useQuery({
    queryKey: ['/api/mosques', searchQuery, selectedCity, selectedSize],
    queryFn: () => api.mosques.getAll({
      search: searchQuery || undefined,
      city: selectedCity || undefined,
      size: selectedSize || undefined
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleMosqueClick = (mosque: MosqueWithDonations) => {
    setLocation(`/mosque/${mosque.id}`);
  };

  const cities = [ { value: "0", label: "حلب" }, { value: "1", label: "دمشق" } ];
  const sizes = [ { value: "0", label: "صغيرة" }, { value: "1", label: "متوسطة" }, { value: "2", label: "كبيرة" } ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Search and Filter Controls */}
      <Card className="bg-white rounded-lg shadow-sm mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Input */}
            <div className="flex-1 max-w-md relative">
              <Input
                type="text"
                placeholder="البحث عن مسجد..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 text-right"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mosque-green-600 focus:border-mosque-green-600 text-right"
              >
                <option value="">جميع المدن</option>
                {cities.map(city => (
                  <option key={city.value} value={city.value}>{city.label}</option>
                ))}
              </select>
              
              <select 
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mosque-green-600 focus:border-mosque-green-600 text-right"
              >
                <option value="">جميع الأحجام</option>
                {sizes.map(size => (
                  <option key={size.value} value={size.value}>{size.label}</option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                  viewMode === 'map' 
                    ? 'bg-mosque-green-600 text-white' 
                    : 'text-gray-600 hover:text-mosque-green-600'
                }`}
              >
                <Map className="w-4 h-4 ml-2" />
                خريطة
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-mosque-green-600 text-white' 
                    : 'text-gray-600 hover:text-mosque-green-600'
                }`}
              >
                <List className="w-4 h-4 ml-2" />
                قائمة
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="bg-red-50 border-red-200 mb-6">
          <CardContent className="p-6">
            <p className="text-red-600 text-center">
              عذراً، حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6">
          {viewMode === 'map' ? (
            <Skeleton className="h-96 lg:h-[600px] w-full rounded-lg" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="aspect-video" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 mb-2" />
                    <Skeleton className="h-4 mb-3 w-2/3" />
                    <Skeleton className="h-16 mb-4" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      {!isLoading && !error && (
        <>
          {viewMode === 'map' ? (
            <Card className="bg-white rounded-lg shadow-sm overflow-hidden">
              <MosqueMap 
                mosques={mosques} 
                onMosqueClick={handleMosqueClick} 
                selectedCity={selectedCity}
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mosques.length > 0 ? (
                mosques.map(mosque => (
                  <MosqueCard key={mosque.id} mosque={mosque} />
                ))
              ) : (
                <Card className="col-span-full">
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">لا توجد مساجد تطابق معايير البحث.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
