import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Users, Calendar, Phone, Mail, ArrowRight, Target, TrendingUp, ShieldCheck, QrCode } from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QRGenerator } from "@/components/qr-generator";
import { useState } from "react";

export default function MosqueProfilePage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [showQR, setShowQR] = useState(false);

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
      case 'عاجل': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'مستمر': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'جديد': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Update page title for SEO
  if (typeof document !== 'undefined') {
    document.title = `${mosque.name} - ${mosque.city} | مساجد سوريا`;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-primary">{mosque.name}</h1>
        <div className="flex items-center gap-2">
          <Dialog open={showQR} onOpenChange={setShowQR}>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <QrCode className="w-4 h-4 ml-2" />
                رمز QR
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>رمز QR للمسجد</DialogTitle>
              </DialogHeader>
              <QRGenerator mosqueId={id!} mosqueName={mosque.name} />
            </DialogContent>
          </Dialog>
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
      </div>

      {/* Cover Photo */}
      <div className="aspect-[3/1] overflow-hidden rounded-lg mb-8">
        <img 
          src={mosque.cover_image} 
          alt="صورة غلاف المسجد" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Basic Info */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-card-foreground mb-4">معلومات المسجد</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <MapPin className="text-primary w-5 h-5 ml-3" />
              <span>{mosque.address}</span>
            </div>
            <div className="flex items-center">
              <span className="text-primary ml-3">📐</span>
              <span>مسجد {mosque.size} الحجم</span>
            </div>
            {mosque.capacity && (
              <div className="flex items-center">
                <Users className="text-primary w-5 h-5 ml-3" />
                <span>يتسع لـ {mosque.capacity} مصلي</span>
              </div>
            )}
            {mosque.establish_year && (
              <div className="flex items-center">
                <Calendar className="text-primary w-5 h-5 ml-3" />
                <span>تأسس عام {mosque.establish_year}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-card-foreground mb-4">نبذة عن المسجد</h2>
          <p className="text-muted-foreground leading-relaxed">{mosque.description}</p>
        </CardContent>
      </Card>

      {/* Photo Gallery */}
      {mosque.gallery && mosque.gallery.length > 0 && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-4">معرض الصور</h2>
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
            <h2 className="text-2xl font-bold text-card-foreground mb-6">مشاريع التبرعات المفتوحة</h2>
            <div className="space-y-6">
              {mosque.donations.map((donation) => {
                const progress = donation.target_amount > 0 
                  ? Math.round(((donation.current_amount || 0) / donation.target_amount) * 100) 
                  : 0;

                return (
                  <Card key={donation.id} className="border border-border hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-primary text-xl">{donation.title}</h3>
                          {donation.is_verified && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="cursor-help">
                                  <ShieldCheck className="w-5 h-5 text-green-600" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="text-sm font-arabic">تم التحقق من هذا التبرع من قبل فريقنا</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getPriorityColor(donation.priority)}`}>
                          {donation.priority}
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-4">{donation.description}</p>
                      
                      {/* Donation Images */}
                      {donation.images && donation.images.length > 0 && (
                        <div className="mb-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {donation.images.map((image, index) => (
                              <div key={index} className="aspect-[4/3] overflow-hidden rounded-md">
                                <img 
                                  src={image} 
                                  alt={`صورة ${donation.title} ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center text-amber-600 dark:text-amber-400">
                            <Target className="w-4 h-4 ml-1" />
                            <span>المبلغ المطلوب: {donation.target_amount.toLocaleString('ar-SA')} ل.س</span>
                          </div>
                          <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                            <TrendingUp className="w-4 h-4 ml-1" />
                            <span>تم جمع: {(donation.current_amount || 0).toLocaleString('ar-SA')} ل.س</span>
                          </div>
                        </div>
                        

                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-2">
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
            <h2 className="text-2xl font-bold text-card-foreground mb-4">معلومات الاتصال</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {mosque.phone && (
                <div className="flex items-center">
                  <Phone className="text-primary w-5 h-5 ml-3" />
                  <span>{mosque.phone}</span>
                </div>
              )}
              {mosque.email && (
                <div className="flex items-center">
                  <Mail className="text-primary w-5 h-5 ml-3" />
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
