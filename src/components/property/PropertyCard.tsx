
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Heart, MapPin, Bed, Bath, Maximize } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  isFavorite?: boolean;
}

export function PropertyCard({
  id,
  title,
  location,
  price,
  beds,
  baths,
  sqft,
  image,
  isFavorite = false,
}: PropertyCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayPrice = mounted ? price.toLocaleString() : price.toString();

  return (
    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl bg-white text-right" dir="rtl">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          data-ai-hint="property house"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/90 text-foreground hover:bg-white backdrop-blur-sm rounded-full px-3 py-1 border-none font-bold">
            {displayPrice} دج <span className="text-muted-foreground font-normal mr-1">/ شهر</span>
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-4 left-4 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm text-muted-foreground transition-colors",
            isFavorite && "text-primary"
          )}
        >
          <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
        </Button>
      </div>
      <CardContent className="p-5">
        <h3 className="text-xl font-headline font-bold line-clamp-1 mb-1">{title}</h3>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
          <MapPin className="w-3.5 h-3.5" />
          <span className="line-clamp-1">{location}</span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground border-t pt-4 flex-row-reverse">
          <div className="flex items-center gap-1 flex-row-reverse">
            <Bed className="w-4 h-4 text-primary" />
            <span className="text-xs">{beds} غرف</span>
          </div>
          <div className="flex items-center gap-1 flex-row-reverse">
            <Bath className="w-4 h-4 text-primary" />
            <span className="text-xs">{baths} حمام</span>
          </div>
          <div className="flex items-center gap-1 flex-row-reverse">
            <Maximize className="w-4 h-4 text-primary" />
            <span className="text-xs">{sqft} م²</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button variant="secondary" className="w-full rounded-2xl bg-secondary hover:bg-secondary/80 font-bold">
          عرض التفاصيل
        </Button>
      </CardFooter>
    </Card>
  );
}
