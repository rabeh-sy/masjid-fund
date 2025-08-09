import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Users, Calendar, Phone, Mail, ArrowRight, Target, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export default function MosqueProfilePage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: mosque, isLoading, error } = useQuery({
    queryKey: ['/api/mosques', id],
    queryFn: () => api.mosques.getById(id!),
    enabled: !!id,
  });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 mb-4">حدث خطأ في تحميل بيانات المسجد</p>
            <Button onClick={() => setLocation('/')} variant="outline">
              العودة للرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="aspect-[3/1] mb-6" />
        <div className="space-y-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-48" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!mosque) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">المسجد غير موجود</p>
            <Button onClick={() => setLocation('/')} variant="outline">
              العودة للرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عاجل': return 'bg-red-100 text-red-800';
      case 'مستمر': return 'bg-blue-100 text-blue-800';
      case 'جديد': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-mosque-green-700">{mosque.name}</h1>
        <Button 
          onClick={() => setLocation('/')}
          variant="outline"
          size="sm"
          className="flex items-center"
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          العودة
        </Button>
      </div>

      {/* Cover Photo */}
      <div className="aspect-[3/1] overflow-hidden rounded-lg mb-8">
        <img 
          src={mosque.coverImage} 
          alt="صورة غلاف المسجد" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Basic Info */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">معلومات المسجد</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <MapPin className="text-mosque-green-600 w-5 h-5 ml-3" />
              <span>{mosque.address}</span>
            </div>
            <div className="flex items-center">
              <span className="text-mosque-green-600 ml-3">📐</span>
              <span>مسجد {mosque.size} الحجم</span>
            </div>
            {mosque.capacity && (
              <div className="flex items-center">
                <Users className="text-mosque-green-600 w-5 h-5 ml-3" />
                <span>يتسع لـ {mosque.capacity} مصلي</span>
              </div>
            )}
            {mosque.establishedYear && (
              <div className="flex items-center">
                <Calendar className="text-mosque-green-600 w-5 h-5 ml-3" />
                <span>تأسس عام {mosque.establishedYear}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">نبذة عن المسجد</h2>
          <p className="text-gray-700 leading-relaxed">{mosque.description}</p>
        </CardContent>
      </Card>

      {/* Photo Gallery */}
      {mosque.gallery && mosque.gallery.length > 0 && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">معرض الصور</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {mosque.gallery.map((image, index) => (
                <div key={index} className="aspect-[4/3] overflow-hidden rounded-lg">
                  <img 
                    src={image} 
                    alt={`صورة ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Open Donations */}
      {mosque.donations && mosque.donations.length > 0 && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">مشاريع التبرعات المفتوحة</h2>
            <div className="space-y-6">
              {mosque.donations.map((donation) => {
                const progress = donation.targetAmount > 0 
                  ? Math.round((donation.currentAmount / donation.targetAmount) * 100) 
                  : 0;

                return (
                  <Card key={donation.id} className="border border-gray-200 hover:border-mosque-green-300 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-bold text-mosque-green-700 text-xl">{donation.title}</h3>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getPriorityColor(donation.priority)}`}>
                          {donation.priority}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-6">{donation.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center text-mosque-gold-600">
                            <Target className="w-4 h-4 ml-1" />
                            <span>المبلغ المطلوب: {donation.targetAmount.toLocaleString('ar-SA')} ل.س</span>
                          </div>
                          <div className="flex items-center text-green-600">
                            <TrendingUp className="w-4 h-4 ml-1" />
                            <span>تم جمع: {donation.currentAmount.toLocaleString('ar-SA')} ل.س</span>
                          </div>
                        </div>
                        
                        <Button 
                          className="bg-mosque-gold-600 hover:bg-mosque-gold-600/90 text-white"
                          size="sm"
                        >
                          تفاصيل التبرع
                        </Button>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-2">
                          <span>التقدم: {progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Info */}
      {(mosque.phone || mosque.email) && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">معلومات الاتصال</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {mosque.phone && (
                <div className="flex items-center">
                  <Phone className="text-mosque-green-600 w-5 h-5 ml-3" />
                  <span>{mosque.phone}</span>
                </div>
              )}
              {mosque.email && (
                <div className="flex items-center">
                  <Mail className="text-mosque-green-600 w-5 h-5 ml-3" />
                  <span>{mosque.email}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
