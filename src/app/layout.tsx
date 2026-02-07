
import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import { FloatingActionButton } from '@/components/layout/FloatingActionButton';

export const metadata: Metadata = {
  title: 'داري - منصتك المثالية للعثور على سكن في الجزائر',
  description: 'الطريقة الأسهل والأكثر أناقة للعثور على العقارات وكراء السكنات في الجزائر.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
        <FirebaseClientProvider>
          {children}
          <FloatingActionButton />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
