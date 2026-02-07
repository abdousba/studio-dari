
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, User, PlusCircle, Heart, LogOut, LogIn } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth, useUser, useFirestore, useDoc } from "@/firebase";
import { signOut } from "firebase/auth";
import { doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMemo } from "react";

export function Navbar() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();

  const userProfileRef = useMemo(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);

  const { data: profile } = useDoc(userProfileRef);

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push("/");
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
          {(profile?.userType === "Agent" || profile?.userType === "Owner") && (
            <Link href="/add-listing" className="hover:text-primary transition-colors flex items-center gap-1">
              <PlusCircle className="w-4 h-4" /> أضف عقاراً
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.photoURL || ""} />
                    <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="text-right w-56" dir="rtl">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-bold">{user.displayName}</span>
                    <span className="text-xs text-muted-foreground">{profile?.userType === "Agent" ? "وسيط عقاري" : profile?.userType === "Owner" ? "صاحب سكن" : "مستأجر"}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/favorites">المفضلة</Link>
                </DropdownMenuItem>
                {(profile?.userType === "Agent" || profile?.userType === "Owner") && (
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/add-listing">أضف عقاراً جديداً</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 ml-2" /> تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="rounded-full px-6 shadow-lg shadow-primary/20">
              <Link href="/login">
                <LogIn className="w-4 h-4 ml-2" /> تسجيل الدخول
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
