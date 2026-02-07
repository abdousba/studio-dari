
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FloatingActionButton() {
  const [userType, setUserType] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkUserType = () => {
      const type = localStorage.getItem("dari_user_type");
      setUserType(type);
    };

    checkUserType();
    // استماع لتغييرات التخزين المحلي في حال تم تغيير الحساب في نافذة أخرى
    window.addEventListener("storage", checkUserType);
    return () => window.removeEventListener("storage", checkUserType);
  }, []);

  if (!mounted) return null;

  // يظهر الزر فقط للمؤجر أو الوسيط العقاري
  const isPublisher = userType === "Agent" || userType === "Owner";

  if (!isPublisher) return null;

  return (
    <div className="fixed bottom-8 left-8 z-50 animate-in fade-in slide-in-from-bottom-10 duration-500">
      <Button
        asChild
        size="icon"
        className="w-16 h-16 rounded-full shadow-2xl shadow-primary/40 hover:scale-110 transition-transform duration-300"
      >
        <Link href="/add-listing">
          <Plus className="w-8 h-8" />
          <span className="sr-only">أضف عقاراً</span>
        </Link>
      </Button>
    </div>
  );
}
