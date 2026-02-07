"use client";

import { use, useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { Bed, Bath, Maximize, MapPin, CheckCircle2, Phone, MessageSquare, Share2, Heart, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PROPERTY_TYPES, PROPERTY_STATUS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);
  
  const propertyRef = db ? doc(db, "properties", id) : null;
  const { data: property, loading, error } = useDoc(propertyRef);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white" dir="rtl">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">جاري تحميل تفاصيل العقار...</p>
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
        {/* Gallery / Hero */}
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
          {/* Main Info */}
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

            <div className="space-y-4">
              <h2 className="text-2xl font-headline font-bold">المرافق والخدمات</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(property.amenities || "مكيف هواء، موقف سيارات، مصعد").split('،').map((amenity: string) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>{amenity.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Contact & Pricing */}
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

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">التسبيق المطلوب</span>
                    <span className="font-bold">{property.advancePayment} أشهر</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">مدة الكراء</span>
                    <span className="font-bold">{property.rentalPeriod === "12" ? "سنة" : property.rentalPeriod + " أشهر"} قابلة للتجديد</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">عقد ملكية</span>
                    <span className={cn("font-bold", property.hasOwnershipContract ? "text-green-600" : "text-orange-500")}>
                      {property.hasOwnershipContract ? "متوفر وموثق" : "غير مصرح به"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">نوع المعلن</span>
                    <span className="font-bold">{property.ownerType === "Owner" ? "صاحب سكن" : "وسيط عقاري"}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-6">
                  <Button className="w-full h-14 rounded-2xl text-lg font-bold flex gap-2" disabled={property.status === "reserved"}>
                    <Phone className="w-5 h-5" /> اتصل بالمعلن
                  </Button>
                  <Button variant="secondary" className="w-full h-14 rounded-2xl text-lg font-bold flex gap-2" disabled={property.status === "reserved"}>
                    <MessageSquare className="w-5 h-5" /> إرسال رسالة
                  </Button>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" className="flex-1 rounded-xl h-12 flex gap-2">
                    <Heart className="w-4 h-4" /> حفظ
                  </Button>
                  <Button variant="outline" className="flex-1 rounded-xl h-12 flex gap-2">
                    <Share2 className="w-4 h-4" /> مشاركة
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
              <h3 className="font-bold text-lg">نصيحة أمان</h3>
              <p className="text-sm text-muted-foreground">لا تقم بإرسال أي مبالغ مالية قبل معاينة العقار والتأكد من كافة الوثائق الرسمية في مكتب التوثيق.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
