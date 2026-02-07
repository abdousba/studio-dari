
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-right" dir="rtl">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="space-y-2 text-center md:text-right">
            <h1 className="text-4xl font-headline font-bold">عقاراتك <span className="text-primary">المفضلة</span></h1>
            <p className="text-muted-foreground italic">العقارات التي حفظتها للعودة إليها لاحقاً.</p>
          </div>
          <Button asChild variant="outline" className="rounded-2xl px-8 h-12 border-primary text-primary hover:bg-primary/5">
            <Link href="/properties">استكشف المزيد</Link>
          </Button>
        </div>

        {/* Since it's a demo, we'll just show a subset of placeholders as "favorites" */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PlaceHolderImages.slice(0, 2).map((img, i) => (
            <PropertyCard
              key={img.id}
              id={img.id}
              title={img.description}
              location="الجزائر"
              price={95000}
              beds={3}
              baths={2}
              sqft={110}
              image={img.imageUrl}
              isFavorite={true}
            />
          ))}
        </div>

        {PlaceHolderImages.slice(0, 2).length === 0 && (
          <div className="py-32 text-center space-y-6">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
              <Heart className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">قائمة المفضلة فارغة</h2>
              <p className="text-muted-foreground">ابدأ باستكشاف العقارات وأضف ما يعجبك هنا.</p>
            </div>
            <Button asChild className="rounded-2xl px-12 h-14 font-bold">
              <Link href="/properties">ابحث عن عقارات</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
