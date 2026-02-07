
"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { USER_TYPES } from "@/lib/constants";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState("Renter");
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "أهلاً بك مجدداً!", description: "تم تسجيل الدخول بنجاح." });
      router.push("/");
    } catch (error: any) {
      toast({ title: "خطأ في تسجيل الدخول", description: "يرجى التحقق من البريد وكلمة المرور.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });
      
      // حفظ ملف المستخدم في Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        userType,
        createdAt: new Date().toISOString()
      });

      toast({ title: "تم إنشاء الحساب!", description: "مرحباً بك في عائلة داري." });
      router.push("/");
    } catch (error: any) {
      toast({ title: "فشل إنشاء الحساب", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/20" dir="rtl">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md rounded-3xl border-none shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-headline font-bold">مرحباً بك في <span className="text-primary">داري</span></CardTitle>
            <CardDescription>انضم إلينا للعثور على سكنك المثالي أو عرض عقارك.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 rounded-xl h-12">
                <TabsTrigger value="login" className="rounded-lg font-bold">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg font-bold">إنشاء حساب</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input id="email" type="email" className="pr-10 rounded-xl" placeholder="example@dari.dz" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input id="password" type="password" className="pr-10 rounded-xl" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={loading}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "دخول"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">الاسم الكامل</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input id="signup-name" className="pr-10 rounded-xl" placeholder="محمد علي" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input id="signup-email" type="email" className="pr-10 rounded-xl" placeholder="example@dari.dz" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>نوع الحساب</Label>
                    <Select value={userType} onValueChange={setUserType}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {USER_TYPES.map(t => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input id="signup-password" type="password" className="pr-10 rounded-xl" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={loading}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "إنشاء الحساب"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">باستخدامك لداري، أنت توافق على شروط الخدمة.</p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
