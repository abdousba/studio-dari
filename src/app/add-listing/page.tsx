
"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { generatePropertyDescription } from "@/ai/flows/generate-property-description";
import { Loader2, Upload, Sparkles, LayoutPanelTop, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ALGERIAN_WILAYAS, PROPERTY_TYPES, PROPERTY_STATUS, FLOORS } from "@/lib/constants";

export default function AddListingPage() {
  const [loadingAI, setLoadingAI] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "apartment",
    location: "الجزائر",
    price: "",
    beds: "1",
    baths: "1",
    sqft: "80",
    floor: "ground",
    amenities: "شرفة، واي فاي",
    description: "",
    ownerType: "Owner", 
    hasOwnershipContract: false,
    rentalPeriod: "12", 
    advancePayment: "6",
    status: "available",
    availabilityNote: "",
    isPriceNegotiable: false,
    isDurationNegotiable: false,
    ownerPhone: "0550000000",
    ownerEmail: "owner@dari.dz"
  });
  const { toast } = useToast();
  const db = useFirestore();
  const router = useRouter();

  const handleAIEnhance = async () => {
    if (!formData.price || !formData.location) {
      toast({
        title: "معلومات ناقصة",
        description: "يرجى ملء السعر والموقع أولاً.",
        variant: "destructive",
      });
      return;
    }

    setLoadingAI(true);
    try {
      const typeLabel = PROPERTY_TYPES.find(t => t.value === formData.type)?.label || formData.type;
      const res = await generatePropertyDescription({
        propertyType: typeLabel,
        location: formData.location,
        price: Number(formData.price),
        numBedrooms: Number(formData.beds),
        numBathrooms: Number(formData.baths),
        amenities: formData.amenities,
      });
      setFormData({ ...formData, description: res.description });
    } catch (error) {
      toast({ title: "خطأ في الذكاء الاصطناعي", description: "تعذر توليد الوصف.", variant: "destructive" });
    } finally {
      setLoadingAI(false);
    }
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.price || !formData.location) {
      toast({
        title: "خطأ في النشر",
        description: "يرجى ملء كافة الحقول الإلزامية.",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);
    try {
      if (db) {
        await addDoc(collection(db, "properties"), {
          ...formData,
          price: Number(formData.price),
          beds: Number(formData.beds),
          baths: Number(formData.baths),
          sqft: Number(formData.sqft),
          createdAt: serverTimestamp(),
          imageUrl: "https://picsum.photos/seed/" + Math.random() + "/800/600",
        });
        
        toast({
          title: "تم النشر بنجاح!",
          description: "عقارك الآن متاح للمستأجرين.",
        });
        router.push("/properties");
      }
    } catch (e) {
      toast({
        title: "فشل النشر",
        description: "حدث خطأ أثناء حفظ البيانات.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-right" dir="rtl">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-12 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">أعلن عن <span className="text-primary">عقارك</span></h1>
          <p className="text-muted-foreground text-lg">شارك عقارك مع آلاف المستأجرين المهتمين في جميع أنحاء الجزائر.</p>
        </div>

        <div className="space-y-8">
          <Card className="rounded-3xl border-none shadow-xl shadow-primary/5">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">تفاصيل العقار</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>أنا أعلن كـ:</Label>
                  <Select value={formData.ownerType} onValueChange={(v) => setFormData({...formData, ownerType: v})}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Owner">صاحب سكن</SelectItem>
                      <SelectItem value="Agent">وسيط عقاري</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">عنوان الإعلان</Label>
                  <Input id="title" placeholder="مثلاً: شقة فاخرة تطل على البحر" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>الولاية</Label>
                  <Select value={formData.location} onValueChange={(v) => setFormData({...formData, location: v})}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {ALGERIAN_WILAYAS.map(w => (
                        <SelectItem key={w} value={w}>{w}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>نوع العقار</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>الطابق</Label>
                  <Select value={formData.floor} onValueChange={(v) => setFormData({...formData, floor: v})}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FLOORS.map(f => (
                        <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>عدد الغرف</Label>
                  <Input type="number" value={formData.beds} onChange={e => setFormData({...formData, beds: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>المساحة (م²)</Label>
                  <Input type="number" value={formData.sqft} onChange={e => setFormData({...formData, sqft: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>حالة العقار</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_STATUS.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">السعر (شهري بالدينار)</Label>
                  <Input id="price" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
              </div>

              {/* Negotiation Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/30 rounded-2xl border border-dashed border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">السعر قابل للتفاوض</Label>
                    <p className="text-xs text-muted-foreground">هل تسمح للمستأجر بمناقشة السعر؟</p>
                  </div>
                  <Switch 
                    checked={formData.isPriceNegotiable} 
                    onCheckedChange={(v) => setFormData({...formData, isPriceNegotiable: v})} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">المدة قابلة للتفاوض</Label>
                    <p className="text-xs text-muted-foreground">هل تسمح بتغيير مدة الكراء؟</p>
                  </div>
                  <Switch 
                    checked={formData.isDurationNegotiable} 
                    onCheckedChange={(v) => setFormData({...formData, isDurationNegotiable: v})} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>رقم الهاتف</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input className="pr-10" value={formData.ownerPhone} onChange={e => setFormData({...formData, ownerPhone: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input className="pr-10" value={formData.ownerEmail} onChange={e => setFormData({...formData, ownerEmail: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse py-2">
                <Checkbox 
                  id="contract" 
                  checked={formData.hasOwnershipContract} 
                  onCheckedChange={(checked) => setFormData({...formData, hasOwnershipContract: !!checked})} 
                />
                <Label htmlFor="contract" className="cursor-pointer">أصرح بتوفر عقد ملكية للعقار</Label>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="description">الوصف</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleAIEnhance} 
                    disabled={loadingAI}
                    className="text-primary hover:text-primary/80 font-bold"
                  >
                    {loadingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 ml-1" />}
                    تحسين بالذكاء الاصطناعي
                  </Button>
                </div>
                <Textarea 
                  id="description" 
                  placeholder="صف سحر وجمال عقارك..." 
                  className="min-h-[150px] rounded-2xl" 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <Button 
                size="lg" 
                className="w-full rounded-2xl h-14 font-bold shadow-lg shadow-primary/30"
                onClick={handlePublish}
                disabled={isPublishing}
              >
                {isPublishing ? <Loader2 className="w-5 h-5 animate-spin ml-2" /> : null}
                نشر الإعلان
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
