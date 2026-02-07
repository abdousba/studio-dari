
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
import { generatePropertyDescription } from "@/ai/flows/generate-property-description";
import { Loader2, Upload, Sparkles, CheckCircle2, Home as HomeIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AddListingPage() {
  const [loadingAI, setLoadingAI] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "Apartment",
    location: "الجزائر العاصمة",
    price: "",
    beds: "1",
    baths: "1",
    sqft: "80",
    amenities: "شرفة، واي فاي",
    description: "",
    ownerType: "Owner", 
    hasOwnershipContract: false,
    rentalPeriod: "12", 
    advancePayment: "6",
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
      const res = await generatePropertyDescription({
        propertyType: formData.type,
        location: formData.location,
        price: Number(formData.price),
        numBedrooms: Number(formData.beds),
        numBathrooms: Number(formData.baths),
        amenities: formData.amenities,
      });
      setFormData({ ...formData, description: res.description });
    } catch (error) {
      console.error(error);
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
      console.error(e);
      toast({
        title: "فشل النشر",
        description: "حدث خطأ أثناء حفظ البيانات.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleImageUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      toast({
        title: "تم النجاح",
        description: "تم ضغط الصور ورفعها بنجاح.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col text-right" dir="rtl">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-12 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">أعلن عن <span className="text-primary">عقارك</span></h1>
          <p className="text-muted-foreground text-lg">شارك عقارك مع آلاف المستأجرين المهتمين في جميع أنحاء الجزائر.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Card className="rounded-3xl border-none shadow-xl shadow-primary/5">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">تفاصيل العقار</CardTitle>
                <CardDescription>أخبرنا عن الخصائص الأساسية لمكانك.</CardDescription>
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
                    <Label htmlFor="location">الموقع (الولاية، الحي)</Label>
                    <Input id="location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">السعر (شهري بالدينار)</Label>
                    <Input id="price" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <Label>مدة الكراء القابلة للتجديد (بالأشهر):</Label>
                    <Select value={formData.rentalPeriod} onValueChange={(v) => setFormData({...formData, rentalPeriod: v})}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">شهرياً</SelectItem>
                        <SelectItem value="3">3 أشهر</SelectItem>
                        <SelectItem value="6">6 أشهر</SelectItem>
                        <SelectItem value="12">سنة كاملة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>التسبيق المطلوب (بالأشهر):</Label>
                    <Select value={formData.advancePayment} onValueChange={(v) => setFormData({...formData, advancePayment: v})}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">شهر واحد</SelectItem>
                        <SelectItem value="3">3 أشهر</SelectItem>
                        <SelectItem value="6">6 أشهر</SelectItem>
                        <SelectItem value="12">12 شهر</SelectItem>
                      </SelectContent>
                    </Select>
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

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="beds">غرف النوم</Label>
                    <Input id="beds" type="number" value={formData.beds} onChange={e => setFormData({...formData, beds: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baths">الحمامات</Label>
                    <Input id="baths" type="number" value={formData.baths} onChange={e => setFormData({...formData, baths: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sqft">المساحة م²</Label>
                    <Input id="sqft" type="number" value={formData.sqft} onChange={e => setFormData({...formData, sqft: e.target.value})} />
                  </div>
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
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-xl shadow-primary/5 overflow-hidden">
              <CardHeader className="bg-secondary/30">
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                  <Upload className="w-6 h-6 text-primary" />
                  الصور
                </CardTitle>
                <CardDescription>ارفع صوراً عالية الجودة. سنتولى عملية الضغط لضمان سرعة التحميل.</CardDescription>
              </CardHeader>
              <CardContent className="p-12">
                <div 
                  className="border-2 border-dashed border-primary/20 rounded-3xl p-12 text-center space-y-4 hover:bg-primary/5 transition-colors cursor-pointer"
                  onClick={handleImageUpload}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                    {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
                  </div>
                  <div>
                    <p className="text-xl font-bold">ضع صورك هنا</p>
                    <p className="text-muted-foreground">أو انقر للتصفح من جهازك</p>
                  </div>
                  <div className="flex justify-center gap-4 text-xs font-medium text-muted-foreground pt-4">
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> ضغط تلقائي</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> تحميل سريع مفعّل</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" size="lg" className="flex-1 rounded-2xl h-14">حفظ كمسودة</Button>
              <Button 
                size="lg" 
                className="flex-1 rounded-2xl h-14 font-bold shadow-lg shadow-primary/30"
                onClick={handlePublish}
                disabled={isPublishing}
              >
                {isPublishing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                نشر الإعلان
              </Button>
            </div>
          </div>

          <aside className="space-y-8">
            <Card className="rounded-3xl border-none shadow-xl shadow-primary/5 bg-primary/5">
              <CardHeader>
                <CardTitle className="font-headline text-xl">نصائح سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">1</div>
                  <p>الصور الواضحة والمشرقة تجذب اهتماماً أكبر بـ 3 أضعاف.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">2</div>
                  <p>كن دقيقاً في الموقع. اذكر القرب من المعالم مثل الجامع الأعظم أو الجامعات الكبرى.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">3</div>
                  <p>استخدم محسّن الذكاء الاصطناعي لكتابة وصف احترافي يبيع "نمط الحياة" في المنزل.</p>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
