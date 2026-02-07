
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-right" dir="rtl">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-3xl flex-1">
        <h1 className="text-4xl font-headline font-bold mb-12 text-center">الأسئلة <span className="text-primary">الشائعة</span></h1>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="border rounded-2xl px-6 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-bold hover:no-underline">كيف يمكنني الإعلان عن عقاري؟</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">
              يمكنك بسهولة إضافة عقارك من خلال صفحة "أضف عقاراً". ستحتاج إلى تسجيل الدخول، ملء تفاصيل العقار، رفع الصور، ونشره ليصل إلى آلاف المستأجرين.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border rounded-2xl px-6 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-bold hover:no-underline">هل الخدمة مجانية؟</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">
              نعم، إضافة الإعلانات وتصفح العقارات مجاني تماماً حالياً. قد نقدم ميزات متميزة (Premium) في المستقبل لزيادة ظهور الإعلانات.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border rounded-2xl px-6 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-bold hover:no-underline">كيف أتحقق من مصداقية المعلن؟</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">
              نحن ننصح دائماً بمعاينة العقار شخصياً وعدم دفع أي مبالغ مالية قبل توثيق العقد عند الموثق الرسمي. نحن نقوم بمراجعة الإعلانات بلا شك، لكن الحذر واجب.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" className="border rounded-2xl px-6 bg-white shadow-sm">
            <AccordionTrigger className="text-lg font-bold hover:no-underline">ما هي ميزة تحسين الوصف بالذكاء الاصطناعي؟</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">
              هي أداة مبتكرة تساعدك على كتابة وصف جذاب واحترافي لعقارك بناءً على التفاصيل التي تدخلها، مما يزيد من فرص جذب المستأجرين.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </div>
  );
}
