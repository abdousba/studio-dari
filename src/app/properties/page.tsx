"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Filter, Grid, Map as MapIcon, Search, Plus, Minus, Home as HomeIcon, LayoutPanelLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ALGERIAN_WILAYAS, PROPERTY_TYPES, FLOORS } from "@/lib/constants";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [advanceFilter, setAdvanceFilter] = useState<string>("all");
  const [selectedWilaya, setSelectedWilaya] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rooms, setRooms] = useState("all");
  const [selectedFloor, setSelectedFloor] = useState("all");

  return (
    <div className="min-h-screen flex flex-col bg-white text-right" dir="rtl">
      <Navbar />
      
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="ابحث بالكلمات المفتاحية..." 
              className="pr-12 rounded-2xl h-12 border-muted text-right"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar w-full lg:w-auto">
             <div className="shrink-0 w-36">
                <Select value={selectedWilaya} onValueChange={setSelectedWilaya}>
                  <SelectTrigger className="rounded-full h-10 border-muted">
                    <SelectValue placeholder="كل الولايات" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    <SelectItem value="all">كل الولايات</SelectItem>
                    {ALGERIAN_WILAYAS.map(w => (
                      <SelectItem key={w} value={w}>{w}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
             
             <div className="shrink-0 w-36">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="rounded-full h-10 border-muted">
                    <SelectValue placeholder="نوع العقار" />
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
                 <Button variant="outline" size="sm" className="rounded-full shrink-0 flex items-center gap-2 border-primary text-primary">
                   <Filter className="w-4 h-4" /> فلاتر متقدمة
                 </Button>
               </SheetTrigger>
               <SheetContent side="right" className="w-full sm:max-w-md text-right" dir="rtl">
                 <SheetHeader>
                   <SheetTitle className="text-right font-headline text-2xl mb-6">تصفية النتائج</SheetTitle>
                 </SheetHeader>
                 <div className="space-y-8 py-4">
                   <div className="space-y-4">
                     <Label className="text-lg">نطاق السعر (دج)</Label>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <Label className="text-xs text-muted-foreground">من</Label>
                         <Input type="number" placeholder="0" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                       </div>
                       <div className="space-y-2">
                         <Label className="text-xs text-muted-foreground">إلى</Label>
                         <Input type="number" placeholder="1,000,000" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                       </div>
                     </div>
                   </div>

                   <div className="space-y-4">
                     <Label className="text-lg">عدد الغرف</Label>
                     <Select value={rooms} onValueChange={setRooms}>
                       <SelectTrigger>
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="all">الكل</SelectItem>
                         <SelectItem value="1">غرفة واحدة</SelectItem>
                         <SelectItem value="2">غرفتين</SelectItem>
                         <SelectItem value="3">3 غرف</SelectItem>
                         <SelectItem value="4">4 غرف</SelectItem>
                         <SelectItem value="5">+5 غرف</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>

                   <div className="space-y-4">
                     <Label className="text-lg">الطابق</Label>
                     <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                       <SelectTrigger>
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

                   <div className="space-y-4">
                     <Label className="text-lg">أشهر التسبيق</Label>
                     <Select value={advanceFilter} onValueChange={setAdvanceFilter}>
                       <SelectTrigger>
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="all">الكل</SelectItem>
                         <SelectItem value="1">شهر واحد</SelectItem>
                         <SelectItem value="3">3 أشهر</SelectItem>
                         <SelectItem value="6">6 أشهر</SelectItem>
                         <SelectItem value="12">سنة</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>

                   <Button className="w-full h-14 rounded-2xl text-lg font-bold mt-8">تطبيق الفلاتر</Button>
                 </div>
               </SheetContent>
             </Sheet>
          </div>

          <div className="flex bg-muted p-1 rounded-2xl shrink-0">
            <Button 
              variant={viewMode === "grid" ? "default" : "ghost"} 
              size="sm" 
              className="rounded-xl px-4"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4 ml-2" /> شبكة
            </Button>
            <Button 
              variant={viewMode === "map" ? "default" : "ghost"} 
              size="sm" 
              className="rounded-xl px-4"
              onClick={() => setViewMode("map")}
            >
              <MapIcon className="w-4 h-4 ml-2" /> خريطة
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">
        {viewMode === "grid" ? (
          <div className="space-y-12">
            <div className="flex items-center justify-between flex-row-reverse">
              <h1 className="text-3xl font-headline font-bold">اكتشف <span className="text-primary">منزلك</span> القادم</h1>
              <p className="text-muted-foreground">عرض العقارات المتاحة في الجزائر</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...PlaceHolderImages, ...PlaceHolderImages].map((img, i) => (
                <PropertyCard
                  key={`${img.id}-${i}`}
                  id={`${img.id}-${i}`}
                  title={img.description.split('in')[0]}
                  location={img.description.split('in')[1] || "الجزائر"}
                  price={45000 + (i * 15000)}
                  beds={(i % 4) + 1}
                  baths={(i % 3) + 1}
                  sqft={70 + (i * 25)}
                  image={img.imageUrl}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-200px)] rounded-3xl overflow-hidden shadow-2xl relative border">
             {/* Map view implementation... */}
             <div className="absolute inset-0 bg-muted flex items-center justify-center">
               <p className="text-xl font-bold">واجهة الخريطة قيد التطوير</p>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
