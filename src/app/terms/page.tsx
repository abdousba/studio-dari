
"use client";

import { Navbar } from "@/components/layout/Navbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-right" dir="rtl">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl flex-1">
        <h1 className="text-4xl font-headline font-bold mb-12">شروط <span className="text-primary">الخدمة</span></h1>
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. مقدمة</h2>
            <p>باستخدامك لمنصة داري DARI، فإنك توافق على الالتزام بالشروط والأحكام التالية. هذه المنصة مخصصة لتسهيل عملية كراء العقارات في الجزائر.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. مسؤولية المحتوى</h2>
            <p>يتحمل المعلن المسؤولية الكاملة عن صحة المعلومات والصور المرفقة في الإعلان. أي تضليل قد يؤدي إلى حذف الحساب نهائياً.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. التعاملات المالية</h2>
            <p>منصة داري لا تتدخل في الاتفاق المالي بين المالك والمستأجر. نحن مجرد وسيط تقني لعرض العقارات فقط.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. الخصوصية</h2>
            <p>نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية وفقاً لسياسة الخصوصية المتبعة لدينا.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
