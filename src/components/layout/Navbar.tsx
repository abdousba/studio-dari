
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, User, PlusCircle, Heart } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
            <Home className="w-6 h-6" />
          </div>
          <span className="text-2xl font-headline font-bold text-foreground tracking-tight">
            داري <span className="text-primary font-normal">DARI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold">
          <Link href="/properties" className="hover:text-primary transition-colors flex items-center gap-1">
            <Search className="w-4 h-4" /> استكشف
          </Link>
          <Link href="/favorites" className="hover:text-primary transition-colors flex items-center gap-1">
            <Heart className="w-4 h-4" /> المفضلة
          </Link>
          <Link href="/add-listing" className="hover:text-primary transition-colors flex items-center gap-1">
            <PlusCircle className="w-4 h-4" /> أضف عقاراً
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="w-5 h-5" />
          </Button>
          <Button className="hidden sm:inline-flex rounded-full px-6 shadow-lg shadow-primary/20">
            تسجيل الدخول
          </Button>
        </div>
      </div>
    </nav>
  );
}
