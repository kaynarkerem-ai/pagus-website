// /api/contact-form.js — Vercel Serverless Function
// Receives contact form data and sends email via Resend API
// Environment variable needed: RESEND_API_KEY (already in Vercel dashboard)

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://pagusmenswear.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, phone, note, timestamp, lang } = req.body;

        if (!email && !phone) {
            return res.status(400).json({ error: 'Email or phone required' });
        }

        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        if (!RESEND_API_KEY) {
            console.error('RESEND_API_KEY not configured');
            return res.status(500).json({ error: 'Email service not configured' });
        }

        // Build email body
        const date = new Date(timestamp || Date.now());
        const dateStr = date.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });

        const htmlBody = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
            <div style="background:#2c3e50;padding:24px 30px;">
                <h2 style="color:#c9a962;margin:0;font-size:20px;">📩 New Contact Request</h2>
                <p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:13px;">${dateStr} · Lang: ${lang || 'en'}</p>
            </div>
            <div style="padding:28px 30px;">
                <table style="width:100%;border-collapse:collapse;">
                    ${email ? `<tr><td style="padding:10px 0;color:#888;width:90px;vertical-align:top;font-size:14px;">✉️ Email</td><td style="padding:10px 0;font-size:15px;color:#333;"><a href="mailto:${email}" style="color:#2c3e50;">${email}</a></td></tr>` : ''}
                    ${phone ? `<tr><td style="padding:10px 0;color:#888;width:90px;vertical-align:top;font-size:14px;">📞 Phone</td><td style="padding:10px 0;font-size:15px;color:#333;"><a href="tel:${phone}" style="color:#2c3e50;">${phone}</a></td></tr>` : ''}
                    ${note ? `<tr><td style="padding:10px 0;color:#888;width:90px;vertical-align:top;font-size:14px;">📝 Note</td><td style="padding:10px 0;font-size:15px;color:#333;">${note.replace(/\n/g, '<br>')}</td></tr>` : ''}
                </table>
                ${email ? `<a href="mailto:${email}?subject=Re: Your inquiry — PAGUS Menswear" style="display:inline-block;margin-top:20px;background:#2c3e50;color:#fff;padding:12px 28px;text-decoration:none;border-radius:4px;font-weight:bold;font-size:14px;">Reply to Customer</a>` : ''}
            </div>
            <div style="background:#f8f5f0;padding:14px 30px;font-size:12px;color:#999;text-align:center;">
                PAGUS Menswear Contact Form · pagusmenswear.com
            </div>
        </div>`;

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'PAGUS Contact <info@pagusmenswear.com>',
                to: ['sales@pagusmenswear.com'],
                subject: `📩 New Contact: ${email || phone} — PAGUS Website`,
                html: htmlBody
            })
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Resend API error:', result);
            return res.status(500).json({ error: 'Email send failed', detail: result });
        }

        return res.status(200).json({ success: true, id: result.id });

    } catch (error) {
        console.error('Contact form error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
