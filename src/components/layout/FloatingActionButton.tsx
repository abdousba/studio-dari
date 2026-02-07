
"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";

export function FloatingActionButton() {
  const { user } = useUser();
  const db = useFirestore();

  const userProfileRef = useMemo(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);

  const { data: profile } = useDoc(userProfileRef);

  // يظهر الزر فقط للمؤجر أو الوسيط العقاري المسجل دخوله
  const isPublisher = profile?.userType === "Agent" || profile?.userType === "Owner";

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
