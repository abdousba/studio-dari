
"use client";

import { Navbar } from "@/components/layout/Navbar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-right" dir="rtl">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl flex-1">
        <h1 className="text-4xl font-headline font-bold mb-12">سياسة <span className="text-primary">الخصوصية</span></h1>
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
          <p className="text-lg">نحن في داري DARI نولي أهمية قصوى لخصوصية مستخدمينا. تشرح هذه السياسة كيف نجمع ونستخدم بياناتك.</p>
          
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">البيانات التي نجمعها</h2>
            <ul className="list-disc list-inside">
              <li>معلومات الحساب: الاسم، البريد الإلكتروني، ورقم الهاتف.</li>
              <li>تفاصيل الإعلانات: صور العقارات ومواقعها وتفاصيلها.</li>
              <li>بيانات الاستخدام: كيفية تفاعلك مع التطبيق والبحث.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">كيفية استخدام البيانات</h2>
            <p>نستخدم هذه البيانات لتحسين تجربتك، تفعيل ميزات الذكاء الاصطناعي (مثل التوصيات)، وتسهيل التواصل بين الملاك والمستأجرين.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">أمن البيانات</h2>
            <p>نستخدم تقنيات متطورة (بما في ذلك خدمات Firebase) لضمان حماية بياناتك من الوصول غير المصرح به.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
