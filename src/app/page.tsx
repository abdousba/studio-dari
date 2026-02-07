
"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Sparkles, Home as HomeIcon } from "lucide-react";
import { FeaturedRecommendations } from "@/components/property/FeaturedRecommendations";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ALGERIAN_WILAYAS, PROPERTY_TYPES } from "@/lib/constants";

export default function Home() {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location && location !== "all") params.append("location", location);
    if (propertyType && propertyType !== "all") params.append("type", propertyType);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/30 rounded-full blur-3xl -z-10" />
        
        <div className="container mx-auto text-center max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm animate-in fade-in slide-in-from-top-4 duration-1000">
            <Sparkles className="w-4 h-4" />
            نرتقي بالعقارات في الجزائر
          </div>
          
          <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
            ابحث عن <span className="text-primary italic">دار</span> أحلامك في الجزائر
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            من الشقق العصرية في العاصمة إلى الفلل الهادئة في وهران، اكتشف قوائم مختارة تشعرك بالانتماء.
          </p>

          <div className="max-w-3xl mx-auto p-2 bg-white rounded-3xl shadow-2xl shadow-primary/10 flex flex-col md:flex-row gap-2 animate-in fade-in zoom-in duration-1000 delay-300">
            <div className="flex-1 flex items-center px-4 gap-2">
              <MapPin className="text-muted-foreground w-5 h-5" />
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="border-none shadow-none focus:ring-0 text-lg text-right h-12">
                  <SelectValue placeholder="اختر الولاية" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {ALGERIAN_WILAYAS.map((wilaya) => (
                    <SelectItem key={wilaya} value={wilaya}>{wilaya}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 flex items-center px-4 gap-2 md:border-r">
              <HomeIcon className="text-muted-foreground w-5 h-5" />
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="border-none shadow-none focus:ring-0 text-lg text-right h-12">
                  <SelectValue placeholder="نوع العقار" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button size="lg" className="rounded-2xl px-10 h-14 text-lg font-bold shadow-lg shadow-primary/30" onClick={handleSearch}>
              بحث
            </Button>
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="space-y-2 text-right">
              <h2 className="text-4xl font-headline font-bold">عقارات <span className="text-primary">مميزة</span></h2>
              <p className="text-muted-foreground">مختاراتنا لك حسب نمط حياتك.</p>
            </div>
            <Button variant="link" asChild className="text-primary font-bold text-lg">
              <Link href="/properties">عرض كل العقارات ←</Link>
            </Button>
          </div>
          
          <FeaturedRecommendations />
        </div>
      </section>

      {/* Recent Listings */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-headline font-bold mb-12 text-right">أحدث الإعلانات على <span className="text-primary">داري</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PlaceHolderImages.map((img, i) => (
              <PropertyCard
                key={img.id}
                id={img.id}
                title={img.description}
                location="الجزائر"
                price={85000 + (i * 12000)}
                beds={i + 1}
                baths={Math.max(1, i)}
                sqft={80 + (i * 20)}
                image={img.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/50 pt-20 pb-10 mt-auto border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-right">
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
                  <HomeIcon className="w-6 h-6" />
                </div>
                <span className="text-2xl font-headline font-bold text-foreground tracking-tight">
                  داري <span className="text-primary">DARI</span>
                </span>
              </Link>
              <p className="text-muted-foreground leading-relaxed">
                تحديث تجربة الكراء في الجزائر. اكتشف الأناقة والراحة والسهولة.
              </p>
            </div>
            <div>
              <h4 className="font-headline font-bold mb-6 text-lg">المنصة</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="/properties" className="hover:text-primary transition-colors">ابحث عن منزل</Link></li>
                <li><Link href="/add-listing" className="hover:text-primary transition-colors">أعلن عن عقارك</Link></li>
                <li><Link href="/favorites" className="hover:text-primary transition-colors">المفضلة</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline font-bold mb-6 text-lg">الدعم</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="/faq" className="hover:text-primary transition-colors">مركز المساعدة</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">شروط الخدمة</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline font-bold mb-6 text-lg">النشرة الإخبارية</h4>
              <p className="text-muted-foreground mb-4">احصل على أحدث العقارات في بريدك.</p>
              <div className="flex gap-2">
                <Input placeholder="البريد الإلكتروني" className="rounded-xl border-none shadow-sm text-right" />
                <Button className="rounded-xl px-4">انضمام</Button>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} داري DARI. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </div>
  );
}
