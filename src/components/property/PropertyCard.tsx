"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Heart, MapPin, Bed, Bath, Maximize } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PROPERTY_STATUS } from "@/lib/constants";

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
  status?: string;
  availabilityNote?: string;
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
  isFavorite: initialFavorite = false,
  status = "available",
  availabilityNote
}: PropertyCardProps) {
  const [mounted, setMounted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayPrice = mounted ? price.toLocaleString() : price.toString();
  const statusInfo = PROPERTY_STATUS.find(s => s.value === status) || PROPERTY_STATUS[0];

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl bg-white text-right" dir="rtl">
      <Link href={`/property/${id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            data-ai-hint="property house"
          />
          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
            <Badge className="bg-white/95 text-foreground hover:bg-white backdrop-blur-sm rounded-full px-3 py-1 border-none font-bold shadow-sm">
              {displayPrice} دج <span className="text-muted-foreground font-normal mr-1">/ شهر</span>
            </Badge>
            <div className={cn("text-white rounded-full px-3 py-1 text-xs font-bold shadow-lg transition-transform hover:scale-105", statusInfo.color)}>
              {status === "soon" && availabilityNote ? availabilityNote : statusInfo.label}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFavorite}
            className={cn(
              "absolute top-4 left-4 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm transition-colors z-10 shadow-sm",
              isFavorite ? "text-primary" : "text-muted-foreground"
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
      </Link>
      <CardFooter className="p-5 pt-0">
        <Button asChild variant="secondary" className="w-full rounded-2xl bg-secondary hover:bg-secondary/80 font-bold">
          <Link href={`/property/${id}`}>عرض التفاصيل</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
