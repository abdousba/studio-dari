
"use client";

import { use, useEffect, useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { Bed, Bath, Maximize, MapPin, Phone, Heart, Loader2, AlertCircle, Clock, CalendarCheck, Handshake, Info, AlertTriangle, ChevronRight, ChevronLeft, ShieldCheck, Calculator, Landmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PROPERTY_TYPES, PROPERTY_STATUS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { sendNotification } from "@/ai/flows/send-notification";
import { Separator } from "@/components/ui/separator";

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  const [notifying, setNotifying] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const [currentUserType, setCurrentUserType] = useState<string | null>(null);

  const propertyRef = useMemo(() => (db ? doc(db, "properties", id) : null), [db, id]);
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
      const renterName = "مستخدم داري"; 
      
      await sendNotification({
        type: 'sms',
        recipient: property.ownerPhone || "0550000000",
        propertyTitle: property.title,
        renterName: renterName
      });

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
  const images = property.images && property.images.length > 0 ? property.images : [property.imageUrl || "https://picsum.photos/seed/dari/800/600"];

  // حاسبة التكاليف
  const price = Number(property.price);
  const advanceMonths = Number(property.advancePayment) || 6;
  const totalAdvance = price * advanceMonths;
  const agentFee = property.ownerType === "Agent" ? price : 0; // عمولة شهر واحد إذا كان المعلن وسيط

  return (
    <div className="min-h-screen flex flex-col bg-white text-right" dir="rtl">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Gallery Section */}
        <div className="relative h-[350px] md:h-[550px] rounded-[3rem] overflow-hidden shadow-2xl mb-8 group">
          <Image 
            src={images[activeImageIndex]} 
            alt={property.title} 
            fill 
            className="object-cover transition-all duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          
          {images.length > 1 && (
            <>
              <button 
                onClick={() => setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setActiveImageIndex((activeImageIndex + 1) % images.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImageIndex(i)}
                className={cn("w-3 h-3 rounded-full transition-all", i === activeImageIndex ? "bg-white w-8" : "bg-white/50")}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center">
                <Badge className="bg-primary/10 text-primary border-none text-sm px-4 py-1">{typeLabel}</Badge>
                {property.hasOwnershipContract && (
                  <Badge className="bg-blue-50 text-blue-600 border-blue-200 flex items-center gap-1 px-4 py-1 font-bold">
                    <ShieldCheck className="w-4 h-4" /> عقار موثق
                  </Badge>
                )}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line bg-muted/20 p-6 rounded-3xl border">
                {property.description}
              </p>
            </div>

            {/* حاسبة التكاليف الذكية */}
            <Card className="rounded-3xl border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-2 border-b bg-white/50">
                <Calculator className="w-5 h-5 text-primary" />
                <CardTitle className="text-xl font-bold">حاسبة التكاليف التقريبية</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-muted-foreground">مبلغ التسبيق ({advanceMonths} أشهر):</span>
                  <span className="font-bold">{totalAdvance.toLocaleString()} دج</span>
                </div>
                {agentFee > 0 && (
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-muted-foreground">عمولة الوسيط العقاري:</span>
                    <span className="font-bold">{agentFee.toLocaleString()} دج</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between items-center text-2xl">
                  <span className="font-headline font-bold">المبلغ الإجمالي عند التوثيق:</span>
                  <span className="font-headline font-bold text-primary">{(totalAdvance + agentFee).toLocaleString()} دج</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/50 p-2 rounded-lg">
                  <Info className="w-4 h-4" />
                  <span>هذا المبلغ تقديري ويشمل التسبيق والعمولة، ولا يشمل رسوم الموثق.</span>
                </div>
              </CardContent>
            </Card>

            {/* Defects Display */}
            {property.defects && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="w-6 h-6" />
                  <h2 className="text-2xl font-headline font-bold">عيوب العقار (بكل أمانة)</h2>
                </div>
                <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl text-orange-900 leading-relaxed text-lg italic">
                  "{property.defects}"
                  <p className="text-xs mt-4 text-orange-700/60 font-bold flex items-center gap-1">
                    <Info className="w-3 h-3" /> تم التصريح بهذا العيب من قبل المؤجر التزاماً بالشفافية.
                  </p>
                </div>
              </div>
            )}
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

                <div className="space-y-3 pt-6 border-t">
                  <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-2xl mb-4">
                    <Landmark className="w-5 h-5 text-primary" />
                    <div className="text-xs">
                      <p className="font-bold">التسبيق المطلوب: {advanceMonths} أشهر</p>
                      <p className="text-muted-foreground">نظام الدفع المتفق عليه</p>
                    </div>
                  </div>

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
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 rounded-2xl h-12">
                      <Heart className="w-5 h-5 ml-2" /> حفظ
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-2xl h-12">
                      شارك
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
              <h3 className="font-bold text-lg">نصيحة أمان</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">تطبيق داري يشجع على الشفافية. لا تقم بالدفع المسبق أبداً دون معاينة حقيقية للعقار وتوثيق العقد.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
