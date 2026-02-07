'use server';

/**
 * @fileOverview نظام إرسال التنبيهات (SMS/Email) للمؤجرين عند تلقي طلب حجز.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SendNotificationInputSchema = z.object({
  type: z.enum(['email', 'sms']).describe('نوع التنبيه'),
  recipient: z.string().describe('رقم الهاتف أو البريد الإلكتروني للمستلم'),
  propertyTitle: z.string().describe('عنوان العقار'),
  renterName: z.string().describe('اسم المستأجر'),
});

export type SendNotificationInput = z.infer<typeof SendNotificationInputSchema>;

const SendNotificationOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type SendNotificationOutput = z.infer<typeof SendNotificationOutputSchema>;

export async function sendNotification(input: SendNotificationInput): Promise<SendNotificationOutput> {
  return sendNotificationFlow(input);
}

const sendNotificationFlow = ai.defineFlow(
  {
    name: 'sendNotificationFlow',
    inputSchema: SendNotificationInputSchema,
    outputSchema: SendNotificationOutputSchema,
  },
  async input => {
    // محاكاة عملية الإرسال عبر خادم خارجي
    console.log(`Sending ${input.type} to ${input.recipient}: New booking for ${input.propertyTitle} by ${input.renterName}`);
    
    // في بيئة الإنتاج، هنا يتم استدعاء Twilio للـ SMS أو SendGrid للـ Email
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    return {
      success: true,
      message: `تم إرسال ${input.type === 'sms' ? 'الرسالة النصية' : 'البريد الإلكتروني'} بنجاح إلى ${input.recipient}`,
    };
  }
);
