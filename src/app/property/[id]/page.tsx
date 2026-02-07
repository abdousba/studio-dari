"use client";

import { use, useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { Bed, Bath, Maximize, MapPin, CheckCircle2, Phone, MessageSquare, Share2, Heart, Loader2, AlertCircle, Clock, CalendarCheck, Handshake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PROPERTY_TYPES, PROPERTY_STATUS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { sendNotification } from "@/ai/flows/send-notification";

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  const [notifying, setNotifying] = useState(false);
  
  const [currentUserType, setCurrentUserType] = useState<string | null>(null);

  const propertyRef = db ? doc(db, "properties", id) : null;
  const { data: property, loading, error } = useDoc(propertyRef);

  useEffect(() => {
    setMounted(true);
    const storedType = localStorage.getItem("dari_user_type");
    if (storedType) setCurrentUserType(storedType);
  }, []);

  const handleBookingRequest = async () => {
    if (!property) return;
    
    setNotifying(true);
    try {
      // محاكاة إرسال التنبيهات الحقيقية عبر Genkit
      const renterName = "مستخدم داري"; // يمكن جلبه من Auth لاحقاً
      
      // إرسال تنبيه SMS
      await sendNotification({
        type: 'sms',
        recipient: property.ownerPhone || "0550000000",
        propertyTitle: property.title,
        renterName: renterName
      });

      // إرسال تنبيه Email
      await sendNotification({
        type: 'email',
        recipient: property.ownerEmail || "contact@dari.dz",
        propertyTitle: property.title,
        renterName: renterName
      });

      toast({
        title: "تم إرسال طلب الحجز بنجاح!",
        description: "لقد تلقى المؤجر تنبيهاً فورياً عبر الهاتف والبريد الإلكتروني.",
      });
    } catch (e) {
      toast({
        title: "خطأ في التنبيه",
        description: "تعذر إرسال التنبيهات حالياً، يرجى الاتصال هاتفياً.",
        variant: "destructive"
      });
    } finally {
      setNotifying(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white" dir="rtl">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">جاري تحميل تفاصيل العقار من Firestore...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col bg-white" dir="rtl">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <AlertCircle className="w-16 h-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold">عذراً، تعذر العثور على العقار</h1>
          <p className="text-muted-foreground mt-2">قد يكون الإعلان قد حُذف أو الرابط غير صحيح.</p>
          <Button asChild className="mt-6 rounded-xl">
            <Link href="/properties">العودة للبحث</Link>
          </Button>
        </main>
      </div>
    );
  }

  const typeLabel = PROPERTY_TYPES.find(t => t.value === property.type)?.label || property.type;
  const statusInfo = PROPERTY_STATUS.find(s => s.value === property.status) || PROPERTY_STATUS[0];

  return (
    <div className="min-h-screen flex flex-col bg-white text-right" dir="rtl">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 h-[300px] md:h-[500px]">
          <div className="md:col-span-2 relative rounded-3xl overflow-hidden group shadow-lg">
            <Image 
              src={property.imageUrl || "https://picsum.photos/seed/dari/800/600"} 
              alt={property.title} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </div>
          <div className="hidden md:grid grid-rows-2 gap-4">
            <div className="relative rounded-3xl overflow-hidden shadow-md">
              <Image src="https://picsum.photos/seed/inner1/800/600" fill className="object-cover" alt="interior" />
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-md">
              <Image src="https://picsum.photos/seed/inner2/800/600" fill className="object-cover" alt="interior" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center">
                <Badge className="bg-primary/10 text-primary border-none text-sm px-4 py-1">{typeLabel}</Badge>
                <Badge variant="secondary" className="text-sm px-4 py-1">كراء {property.rentalPeriod === "12" ? "سنوي" : property.rentalPeriod + " أشهر"}</Badge>
                <div className={cn("text-white rounded-full px-5 py-1.5 text-sm font-bold shadow-md", statusInfo.color)}>
                  {property.status === "soon" && property.availabilityNote ? property.availabilityNote : statusInfo.label}
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-headline font-bold">{property.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground text-lg">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{property.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Card className={cn("rounded-2xl border-none shadow-sm", property.isPriceNegotiable ? "bg-green-50" : "bg-slate-50")}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={cn("p-3 rounded-xl", property.isPriceNegotiable ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-500")}>
                    <Handshake className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">قابلية تفاوض السعر</p>
                    <p className="font-bold text-sm">{property.isPriceNegotiable ? "السعر قابل للتفاوض" : "السعر ثابت"}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className={cn("rounded-2xl border-none shadow-sm", property.isDurationNegotiable ? "bg-blue-50" : "bg-slate-50")}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={cn("p-3 rounded-xl", property.isDurationNegotiable ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-500")}>
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">قابلية تفاوض المدة</p>
                    <p className="font-bold text-sm">{property.isDurationNegotiable ? "المدة قابلة للتفاوض" : "المدة ثابتة"}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-3 gap-4 p-6 bg-secondary/30 rounded-3xl">
              <div className="text-center space-y-1">
                <Bed className="w-6 h-6 mx-auto text-primary" />
                <p className="font-bold">{property.beds} غرف</p>
                <p className="text-xs text-muted-foreground">نوم</p>
              </div>
              <div className="text-center space-y-1 border-x border-muted">
                <Bath className="w-6 h-6 mx-auto text-primary" />
                <p className="font-bold">{property.baths} حمام</p>
                <p className="text-xs text-muted-foreground">كاملة</p>
              </div>
              <div className="text-center space-y-1">
                <Maximize className="w-6 h-6 mx-auto text-primary" />
                <p className="font-bold">{property.sqft} م²</p>
                <p className="text-xs text-muted-foreground">مساحة</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-headline font-bold">وصف العقار</h2>
              <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                {property.description}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl border-none shadow-2xl shadow-primary/10 overflow-hidden sticky top-24">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-1">
                  <p className="text-muted-foreground">السعر الشهري</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary">{property.price?.toLocaleString()}</span>
                    <span className="text-muted-foreground font-bold">دج</span>
                  </div>
                </div>

                <div className="space-y-3 pt-6">
                  {currentUserType === "Renter" && property.status === "available" && (
                    <Button 
                      onClick={handleBookingRequest}
                      disabled={notifying}
                      className="w-full h-14 rounded-2xl text-lg font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 flex gap-2"
                    >
                      {notifying ? <Loader2 className="w-6 h-6 animate-spin" /> : <CalendarCheck className="w-6 h-6" />}
                      {notifying ? "جاري الإرسال..." : "احجز الآن"}
                    </Button>
                  )}

                  <Button className="w-full h-14 rounded-2xl text-lg font-bold flex gap-2" disabled={property.status === "reserved"}>
                    <Phone className="w-5 h-5" /> اتصل بالمعلن
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
              <h3 className="font-bold text-lg">نصيحة أمان</h3>
              <p className="text-sm text-muted-foreground">التطبيق يقوم بتنبيه المؤجر فورياً. لا تقم بالدفع المسبق خارج مكتب التوثيق.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
