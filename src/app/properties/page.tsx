"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Filter, Grid, Map as MapIcon, Search, Home as HomeIcon, Loader2 } from "lucide-react";
import { ALGERIAN_WILAYAS, PROPERTY_TYPES, FLOORS } from "@/lib/constants";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [selectedWilaya, setSelectedWilaya] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const db = useFirestore();

  const propertiesQuery = useMemo(() => {
    if (!db) return null;
    // لجعل التجربة حقيقية، نأتي بكل العقارات مرتبة حسب الأحدث
    // الفلترة تتم برمجياً في الواجهة لتقليل استهلاك الكوتا في هذه المرحلة
    return query(collection(db, "properties"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: properties, loading } = useCollection(propertiesQuery);

  const filteredProperties = useMemo(() => {
    if (!properties) return [];
    return properties.filter(p => {
      const matchWilaya = selectedWilaya === "all" || p.location === selectedWilaya;
      const matchType = selectedType === "all" || p.type === selectedType;
      const matchMinPrice = !minPrice || p.price >= Number(minPrice);
      const matchMaxPrice = !maxPrice || p.price <= Number(maxPrice);
      const matchFloor = selectedFloor === "all" || p.floor === selectedFloor;
      const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchWilaya && matchType && matchMinPrice && matchMaxPrice && matchFloor && matchSearch;
    });
  }, [properties, selectedWilaya, selectedType, minPrice, maxPrice, selectedFloor, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-right" dir="rtl">
      <Navbar />
      
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 space-y-4">
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:max-w-md group">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="ابحث بالكلمات المفتاحية (حي، شارع...)" 
                className="pr-12 rounded-2xl h-12 border-muted bg-secondary/20 focus:bg-white transition-all text-right"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="hidden sm:flex bg-muted/50 p-1.5 rounded-2xl shrink-0">
              <Button 
                variant={viewMode === "grid" ? "default" : "ghost"} 
                size="sm" 
                className="rounded-xl px-4 h-9 font-bold"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4 ml-2" /> شبكة
              </Button>
              <Button 
                variant={viewMode === "map" ? "default" : "ghost"} 
                size="sm" 
                className="rounded-xl px-4 h-9 font-bold"
                onClick={() => setViewMode("map")}
              >
                <MapIcon className="w-4 h-4 ml-2" /> خريطة
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-hidden">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex items-center gap-2 pb-2">
                <div className="shrink-0 min-w-[130px]">
                  <Select value={selectedWilaya} onValueChange={setSelectedWilaya}>
                    <SelectTrigger className="rounded-full h-10 border-muted bg-white px-4">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <SelectValue placeholder="الولاية" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      <SelectItem value="all">كل الولايات</SelectItem>
                      {ALGERIAN_WILAYAS.map(w => (
                        <SelectItem key={w} value={w}>{w}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="shrink-0 min-w-[130px]">
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="rounded-full h-10 border-muted bg-white px-4">
                      <div className="flex items-center gap-2">
                        <HomeIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                        <SelectValue placeholder="النوع" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">كل الأنواع</SelectItem>
                      {PROPERTY_TYPES.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-full h-10 shrink-0 flex items-center gap-2 border-primary text-primary hover:bg-primary/5 px-4 font-bold">
                      <Filter className="w-4 h-4" /> فلاتر متقدمة
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-md text-right" dir="rtl">
                    <SheetHeader>
                      <SheetTitle className="text-right font-headline text-2xl mb-6">تصفية النتائج</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-8 py-4">
                      <div className="space-y-4">
                        <Label className="text-lg font-bold">نطاق السعر (دج)</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">من</Label>
                            <Input type="number" placeholder="0" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="rounded-xl h-12" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">إلى</Label>
                            <Input type="number" placeholder="1,000,000" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="rounded-xl h-12" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-lg font-bold">الطابق</Label>
                        <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                          <SelectTrigger className="rounded-xl h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">الكل</SelectItem>
                            {FLOORS.map(f => (
                              <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="pt-4">
                        <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20">تطبيق الفلاتر</Button>
                        <Button variant="ghost" onClick={() => {
                          setMinPrice("");
                          setMaxPrice("");
                          setSelectedFloor("all");
                          setSelectedWilaya("all");
                          setSelectedType("all");
                        }} className="w-full mt-2 text-muted-foreground">إعادة تعيين</Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">جاري جلب العقارات الحقيقية من داري...</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b pb-4">
              <div>
                <h1 className="text-3xl font-headline font-bold">اكتشف <span className="text-primary">منزلك</span> القادم</h1>
                <p className="text-muted-foreground">نعرض لك أفضل العقارات المتاحة حالياً</p>
              </div>
              <p className="text-sm font-bold text-primary">{filteredProperties.length} عقار متوفر</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    id={prop.id}
                    title={prop.title}
                    location={prop.location}
                    price={prop.price}
                    beds={prop.beds}
                    baths={prop.baths}
                    sqft={prop.sqft}
                    image={prop.imageUrl}
                    status={prop.status}
                    availabilityNote={prop.availabilityNote}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-muted-foreground">
                  لم يتم العثور على نتائج تطابق اختياراتك.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-280px)] rounded-3xl overflow-hidden shadow-2xl relative border-2 border-muted/20">
             <div className="absolute inset-0 bg-muted/50 flex flex-col items-center justify-center space-y-4">
               <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                 <MapIcon className="w-10 h-10 text-primary" />
               </div>
               <p className="text-xl font-bold">واجهة الخريطة التفاعلية</p>
               <Button variant="outline" onClick={() => setViewMode("grid")} className="rounded-xl">العودة لعرض الشبكة</Button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
