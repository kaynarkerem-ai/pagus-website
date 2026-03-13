// /api/send-welcome.js
// Vercel Serverless Function
//
// 1) Yeni üyeye hoş geldin emaili gönderir
// 2) Üyeyi Resend Audience'a ekler (newsletter listesi)
// 3) Kerem'e bildirim emaili atar (yeni üye bilgileri)
//
// Environment Variables (Vercel Dashboard → Settings → Environment Variables):
//   RESEND_API_KEY      → Resend API anahtarı (zaten var)
//   RESEND_AUDIENCE_ID  → Resend audience ID'si
//   NOTIFY_EMAIL        → Bildirim alacak email (ör: sales@pagusmenswear.com)

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, name, phone } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
    const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'sales@pagusmenswear.com';

    // Kayıt zamanı (Türkiye saati)
    const now = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });

    try {
        // ─── 1) WELCOME EMAIL → KULLANICIYA ───
        const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Pagus Menswear <info@pagusmenswear.com>',
                to: [email],
                subject: 'Welcome to Pagus Menswear',
                html: `
                    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                        <h1 style="color: #2c3e50; font-size: 24px;">Welcome to Pagus Menswear</h1>
                        <p style="color: #555; font-size: 15px; line-height: 1.6;">
                            Dear ${name || 'Valued Customer'},<br><br>
                            Thank you for registering. You now have access to our full wholesale catalogue and pricing.
                        </p>
                        <p style="color: #555; font-size: 15px; line-height: 1.6;">
                            Browse our collection at <a href="https://pagusmenswear.com" style="color: #c9a962;">pagusmenswear.com</a>
                            or contact us directly via <a href="https://wa.me/905511748907" style="color: #25D366;">WhatsApp</a>.
                        </p>
                        <p style="color: #999; font-size: 12px; margin-top: 40px;">
                            Pagus Menswear · İzmir, Turkey<br>
                            Premium wholesale menswear for European retailers
                        </p>
                    </div>
                `,
            }),
        });

        const emailResult = await emailResponse.json();

        // ─── 2) RESEND AUDIENCE'A EKLE (NEWSLETTER LİSTESİ) ───
        let audienceResult = null;

        if (RESEND_AUDIENCE_ID) {
            const audienceResponse = await fetch(
                `https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${RESEND_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        first_name: name || '',
                        unsubscribed: false,
                    }),
                }
            );

            audienceResult = await audienceResponse.json();
        }

        // ─── 3) BİLDİRİM EMAİLİ → KEREM'E ───
        const notifyResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Pagus Menswear <info@pagusmenswear.com>',
                to: [NOTIFY_EMAIL],
                subject: `🆕 Yeni Üye: ${name || email}`,
                html: `
                    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px 24px;">
                        <div style="background: #2c3e50; padding: 16px 24px; border-radius: 6px 6px 0 0;">
                            <h2 style="color: #c9a962; font-size: 16px; margin: 0; letter-spacing: 1px;">PAGUS — Yeni Kayıt</h2>
                        </div>
                        <div style="background: #ffffff; border: 1px solid #eee; border-top: none; padding: 24px; border-radius: 0 0 6px 6px;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 10px 0; color: #999; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; width: 100px; vertical-align: top;">İsim</td>
                                    <td style="padding: 10px 0; color: #1a1a1a; font-size: 15px; font-weight: 600;">${name || '—'}</td>
                                </tr>
                                <tr style="border-top: 1px solid #f0f0f0;">
                                    <td style="padding: 10px 0; color: #999; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Email</td>
                                    <td style="padding: 10px 0; color: #1a1a1a; font-size: 15px;">
                                        <a href="mailto:${email}" style="color: #2c3e50; text-decoration: none;">${email}</a>
                                    </td>
                                </tr>
                                <tr style="border-top: 1px solid #f0f0f0;">
                                    <td style="padding: 10px 0; color: #999; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Telefon</td>
                                    <td style="padding: 10px 0; color: #1a1a1a; font-size: 15px;">${phone || 'Google ile kayıt'}</td>
                                </tr>
                                <tr style="border-top: 1px solid #f0f0f0;">
                                    <td style="padding: 10px 0; color: #999; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Tarih</td>
                                    <td style="padding: 10px 0; color: #1a1a1a; font-size: 15px;">${now}</td>
                                </tr>
                            </table>

                            <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #f0f0f0;">
                                <a href="https://wa.me/${(phone || '').replace(/[^0-9]/g, '')}" style="display: inline-block; background: #25D366; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-size: 13px; font-weight: 600; margin-right: 8px;">WhatsApp Yaz</a>
                                <a href="mailto:${email}" style="display: inline-block; background: #2c3e50; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-size: 13px; font-weight: 600;">Email At</a>
                            </div>
                        </div>
                        <p style="color: #bbb; font-size: 11px; text-align: center; margin-top: 16px;">
                            Bu otomatik bir bildirimdir · pagusmenswear.com
                        </p>
                    </div>
                `,
            }),
        });

        return res.status(200).json({
            success: true,
            email: emailResult,
            audience: audienceResult,
            notification: notifyResponse.ok ? 'sent' : 'failed',
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
