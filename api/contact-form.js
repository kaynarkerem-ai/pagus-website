// /api/contact-form.js — Vercel Serverless Function
// Uses built-in https module (no fetch, no dependencies)

const https = require('https');

function sendResendEmail(apiKey, payload) {
    return new Promise(function(resolve, reject) {
        const data = JSON.stringify(payload);
        const options = {
            hostname: 'api.resend.com',
            path: '/emails',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey,
                'Content-Length': Buffer.byteLength(data)
            }
        };
        const req = https.request(options, function(res) {
            let body = '';
            res.on('data', function(chunk) { body += chunk; });
            res.on('end', function() {
                try { resolve({ status: res.statusCode, body: JSON.parse(body) }); }
                catch(e) { resolve({ status: res.statusCode, body: body }); }
            });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { email, phone, note, timestamp, lang } = req.body;

        if (!email && !phone) {
            return res.status(400).json({ error: 'Email or phone required' });
        }

        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        if (!RESEND_API_KEY) {
            return res.status(500).json({ error: 'RESEND_API_KEY not set' });
        }

        const date = new Date(timestamp || Date.now());
        const dateStr = date.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });

        const htmlBody = '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">'
            + '<div style="background:#2c3e50;padding:24px 30px;">'
            + '<h2 style="color:#c9a962;margin:0;font-size:20px;">New Contact Request</h2>'
            + '<p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:13px;">' + dateStr + ' | Lang: ' + (lang || 'en') + '</p>'
            + '</div>'
            + '<div style="padding:28px 30px;">'
            + (email ? '<p style="margin:0 0 12px;font-size:15px;color:#333;"><strong>Email:</strong> <a href="mailto:' + email + '">' + email + '</a></p>' : '')
            + (phone ? '<p style="margin:0 0 12px;font-size:15px;color:#333;"><strong>Phone:</strong> <a href="tel:' + phone + '">' + phone + '</a></p>' : '')
            + (note ? '<p style="margin:0 0 12px;font-size:15px;color:#333;"><strong>Note:</strong> ' + note.replace(/\n/g, '<br>') + '</p>' : '')
            + (email ? '<a href="mailto:' + email + '?subject=Re: Your inquiry - PAGUS Menswear" style="display:inline-block;margin-top:16px;background:#2c3e50;color:#fff;padding:12px 28px;text-decoration:none;border-radius:4px;font-weight:bold;font-size:14px;">Reply to Customer</a>' : '')
            + '</div>'
            + '<div style="background:#f8f5f0;padding:14px 30px;font-size:12px;color:#999;text-align:center;">PAGUS Menswear Contact Form</div>'
            + '</div>';

        const result = await sendResendEmail(RESEND_API_KEY, {
            from: 'PAGUS Contact <info@pagusmenswear.com>',
            to: ['sales@pagusmenswear.com'],
            subject: 'New Contact: ' + (email || phone) + ' - PAGUS Website',
            html: htmlBody
        });

        if (result.status >= 400) {
            console.error('Resend error:', result.body);
            return res.status(500).json({ error: 'Email failed', detail: result.body });
        }

        return res.status(200).json({ success: true, id: result.body.id });

    } catch (error) {
        console.error('Contact form error:', error);
        return res.status(500).json({ error: error.message });
    }
};
