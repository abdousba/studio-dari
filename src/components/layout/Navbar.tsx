
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, User, PlusCircle, Heart, UserCircle2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { USER_TYPES } from "@/lib/constants";

export function Navbar() {
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const storedType = localStorage.getItem("dari_user_type");
    if (storedType) setUserType(storedType);
  }, []);

  const handleSetUserType = (type: string) => {
    setUserType(type);
    localStorage.setItem("dari_user_type", type);
    // Reload to update components that depend on this
    window.location.reload();
  };

  const handleLogout = () => {
    setUserType(null);
    localStorage.removeItem("dari_user_type");
    window.location.reload();
  };

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-right" dir="rtl">
              <DropdownMenuLabel>حسابي</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">اختر نوع حسابك</DropdownMenuLabel>
              {USER_TYPES.map(type => (
                <DropdownMenuItem 
                  key={type.value} 
                  onClick={() => handleSetUserType(type.value)} 
                  className="cursor-pointer"
                >
                  {type.label} {userType === type.value && "✓"}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">تسجيل الخروج</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button className="hidden sm:inline-flex rounded-full px-6 shadow-lg shadow-primary/20">
            {userType ? `أهلاً ${USER_TYPES.find(t => t.value === userType)?.label}` : "تسجيل الدخول"}
          </Button>
        </div>
      </div>
    </nav>
  );
}
