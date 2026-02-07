
"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Filter, Grid, Map as MapIcon, Search, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [advanceFilter, setAdvanceFilter] = useState<string>("all");

  return (
    <div className="min-h-screen flex flex-col bg-white text-right" dir="rtl">
      <Navbar />
      
      {/* Sub-Header / Filters */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="ابحث بالمدينة، الحي، أو الكلمات المفتاحية..." 
              className="pr-12 rounded-2xl h-12 border-muted text-right"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar w-full lg:w-auto">
             <div className="shrink-0 w-40">
                <Select value={advanceFilter} onValueChange={setAdvanceFilter}>
                  <SelectTrigger className="rounded-full h-10 border-muted">
                    <SelectValue placeholder="أشهر التسبيق" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل التسبيقات</SelectItem>
                    <SelectItem value="1">شهر واحد</SelectItem>
                    <SelectItem value="3">3 أشهر</SelectItem>
                    <SelectItem value="6">6 أشهر</SelectItem>
                    <SelectItem value="12">سنة</SelectItem>
                  </SelectContent>
                </Select>
             </div>
            <Badge variant="secondary" className="rounded-full px-4 py-2 cursor-pointer hover:bg-primary/10 transition-colors shrink-0">السعر: 2مليون - 50مليون</Badge>
            <Badge variant="secondary" className="rounded-full px-4 py-2 cursor-pointer hover:bg-primary/10 transition-colors shrink-0">نوع العقار: الكل</Badge>
            <Button variant="outline" size="sm" className="rounded-full shrink-0 flex items-center gap-2">
              <Filter className="w-4 h-4" /> كل الفلترات
            </Button>
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
              <p className="text-muted-foreground">عرض 142 عقاراً في الجزائر</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...PlaceHolderImages, ...PlaceHolderImages].map((img, i) => (
                <PropertyCard
                  key={`${img.id}-${i}`}
                  id={`${img.id}-${i}`}
                  title={img.description.split('in')[0]}
                  location={img.description.split('in')[1] || "الجزائر العاصمة"}
                  price={45000 + (i * 15000)}
                  beds={Math.floor(Math.random() * 4) + 1}
                  baths={Math.floor(Math.random() * 3) + 1}
                  sqft={70 + (i * 25)}
                  image={img.imageUrl}
                />
              ))}
            </div>
            
            <div className="flex justify-center py-12">
              <Button variant="outline" className="rounded-2xl px-12 h-14 font-bold">تحميل المزيد من العقارات</Button>
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-200px)] rounded-3xl overflow-hidden shadow-2xl relative border">
            <div className="absolute inset-0 bg-secondary/20 flex items-center justify-center bg-[url('https://picsum.photos/seed/map/1920/1080')] bg-cover opacity-50 grayscale contrast-125" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
            
            {/* Interactive map markers simulation */}
            <div className="absolute top-[20%] right-[30%]">
              <div className="bg-primary text-white p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
                <div className="absolute -top-8 right-1/2 translate-x-1/2 bg-white text-foreground text-xs font-bold px-2 py-1 rounded shadow whitespace-nowrap">
                  120,000 دج
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 right-1/2 translate-x-1/2 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl flex items-center gap-8 w-full max-w-2xl flex-row-reverse">
              <div className="hidden sm:block aspect-square w-24 rounded-2xl overflow-hidden relative">
                <img src={PlaceHolderImages[0].imageUrl} className="object-cover w-full h-full" alt="preview" />
              </div>
              <div className="flex-1 text-right">
                <h3 className="text-xl font-headline font-bold">شقة فاخرة بالعاصمة</h3>
                <p className="text-muted-foreground text-sm">سيدي يحيى، الجزائر</p>
                <div className="flex items-center gap-4 mt-2 font-bold text-primary flex-row-reverse">
                  <span>145,000 دج / شهر</span>
                </div>
              </div>
              <Button className="rounded-xl h-12 px-6">عرض العقار</Button>
            </div>
            
            <div className="absolute top-8 right-8 flex flex-col gap-2">
              <Button variant="secondary" size="icon" className="rounded-xl bg-white/90 shadow-md">
                <Plus className="w-5 h-5" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-xl bg-white/90 shadow-md">
                <Minus className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
