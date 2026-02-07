
"use client";

import { use, useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Bed, Bath, Maximize, MapPin, Calendar, CheckCircle2, Phone, MessageSquare, Share2, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [mounted, setMounted] = useState(false);
  
  // Simulation of fetching data
  const property = PlaceHolderImages.find(p => p.id === id.split('-')[0]) || PlaceHolderImages[0];
  const price = 145000;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white text-right" dir="rtl">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Gallery / Hero */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 h-[300px] md:h-[500px]">
          <div className="md:col-span-2 relative rounded-3xl overflow-hidden group shadow-lg">
            <Image 
              src={property.imageUrl} 
              alt={property.description} 
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
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary/10 text-primary border-none text-sm px-4 py-1">شقة</Badge>
                <Badge variant="secondary" className="text-sm px-4 py-1">كراء سنوي</Badge>
                <Badge variant="outline" className="text-sm px-4 py-1 border-green-200 text-green-600">متوفر الآن</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-headline font-bold">{property.description}</h1>
              <div className="flex items-center gap-2 text-muted-foreground text-lg">
                <MapPin className="w-5 h-5 text-primary" />
                <span>سيدي يحيى، الجزائر العاصمة</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-6 bg-secondary/30 rounded-3xl">
              <div className="text-center space-y-1">
                <Bed className="w-6 h-6 mx-auto text-primary" />
                <p className="font-bold">3 غرف</p>
                <p className="text-xs text-muted-foreground">نوم</p>
              </div>
              <div className="text-center space-y-1 border-x border-muted">
                <Bath className="w-6 h-6 mx-auto text-primary" />
                <p className="font-bold">2 حمام</p>
                <p className="text-xs text-muted-foreground">كاملة</p>
              </div>
              <div className="text-center space-y-1">
                <Maximize className="w-6 h-6 mx-auto text-primary" />
                <p className="font-bold">120 م²</p>
                <p className="text-xs text-muted-foreground">مساحة</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-headline font-bold">وصف العقار</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                شقة فاخرة تقع في قلب سيدي يحيى، تتميز بإطلالة خلابة وتصميم عصري. تتكون الشقة من ثلاث غرف واسعة، صالون كبير، ومطبخ مجهز بالكامل. قريبة من كافة المرافق الحيوية والمحلات التجارية والمدارس. نظام أمان متكامل وموقف سيارات خاص.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-headline font-bold">المرافق والخدمات</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["مكيف هواء", "موقف سيارات", "مصعد", "حراسة 24/7", "انترنت ألياف", "شرفة واسعة"].map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>{amenity}</span>
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
                    <span className="text-4xl font-bold text-primary">{price.toLocaleString()}</span>
                    <span className="text-muted-foreground font-bold">دج</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">التسبيق المطلوب</span>
                    <span className="font-bold">6 أشهر</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">مدة الكراء</span>
                    <span className="font-bold">سنة قابلة للتجديد</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">عقد ملكية</span>
                    <span className="font-bold text-green-600">متوفر وموثق</span>
                  </div>
                </div>

                <div className="space-y-3 pt-6">
                  <Button className="w-full h-14 rounded-2xl text-lg font-bold flex gap-2">
                    <Phone className="w-5 h-5" /> اتصل بالمعلن
                  </Button>
                  <Button variant="secondary" className="w-full h-14 rounded-2xl text-lg font-bold flex gap-2">
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
