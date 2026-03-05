// /api/send-welcome.js
// Vercel Serverless Function — Resend üzerinden hoşgeldin maili gönderir

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL     = "PAGUS Menswear <sales@pagusmenswear.com>";
const SITE_URL       = "https://www.pagusmenswear.com";
const DISCOUNT_CODE  = "PAGUS-MAR5";

export default async function handler(req, res) {

  // Sadece POST kabul et
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email gerekli" });
  }

  const displayName = name || "Partner";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:     FROM_EMAIL,
        reply_to: "sales@pagusmenswear.com",
        to:       [email],
        subject:  "Welcome to PAGUS Menswear — Your 5% Discount Inside",
        html:     buildEmailHTML(displayName),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend hatası:", data);
      return res.status(500).json({ error: "Mail gönderilemedi", detail: data });
    }

    console.log("✅ Mail gönderildi:", email);
    return res.status(200).json({ success: true, id: data.id });

  } catch (err) {
    console.error("Sunucu hatası:", err);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
}


function buildEmailHTML(name) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to PAGUS Menswear</title>
</head>
<body style="margin:0;padding:0;background:#e8e2d8;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#e8e2d8;padding:40px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#f5f0e8;border-radius:3px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.15);">

  <!-- HEADER -->
  <tr>
    <td style="background:#2c1810;padding:32px 44px 28px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-weight:700;font-size:28px;letter-spacing:10px;color:#c9a84c;text-transform:uppercase;line-height:1;">PAGUS</div>
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-weight:200;font-size:9px;letter-spacing:5px;color:#c9a84c;opacity:0.7;margin-top:6px;text-transform:uppercase;">Atelier &middot; Menswear</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- WELCOME BAND -->
  <tr>
    <td style="background:#c9a84c;padding:9px 44px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-weight:300;font-size:9px;letter-spacing:6px;color:#2c1810;text-transform:uppercase;">Member Registration Confirmed</td>
          <td align="right" style="font-family:'Helvetica Neue',Arial,sans-serif;font-weight:300;font-size:9px;letter-spacing:6px;color:#2c1810;text-transform:uppercase;">March 2025</td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- HERO -->
  <tr>
    <td style="background:#f5f0e8;padding:48px 44px 32px;">
      <p style="font-family:Georgia,serif;font-size:16px;font-style:italic;color:#8b5e2a;margin:0 0 10px;">Dear ${name},</p>
      <h1 style="font-family:Georgia,serif;font-size:30px;font-weight:700;color:#2c1810;line-height:1.2;margin:0 0 20px;">A warm welcome<br>from İzmir.</h1>
      <p style="font-family:Georgia,serif;font-size:16px;color:#5a3e2b;line-height:1.78;margin:0;">
        Your registration with PAGUS Menswear has been confirmed. We handcraft premium suits, tuxedos and ceremony wear for Europe's finest retailers — and we are delighted to welcome you into our wholesale family.
      </p>
      <p style="font-family:Georgia,serif;font-size:16px;color:#5a3e2b;line-height:1.78;margin:16px 0 0;">
        As a gesture of welcome, we have reserved a special discount for all accounts registered this March.
      </p>
    </td>
  </tr>

  <!-- DISCOUNT BANNER -->
  <tr>
    <td style="padding:0 44px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#2c1810;">
        <tr>
          <td width="96" style="background:#c9a84c;padding:26px 20px;text-align:center;vertical-align:middle;">
            <div style="font-family:Georgia,serif;font-size:42px;font-weight:700;color:#2c1810;line-height:1;">5%</div>
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-weight:700;font-size:9px;letter-spacing:3px;color:#2c1810;text-transform:uppercase;margin-top:3px;">OFF</div>
          </td>
          <td style="padding:24px 28px;vertical-align:middle;">
            <div style="font-family:Georgia,serif;font-size:16px;font-weight:700;color:#f5f0e8;margin-bottom:7px;">Your Welcome Discount</div>
            <div style="font-family:Georgia,serif;font-size:14px;color:#a08060;line-height:1.55;">Valid on your first order across all PAGUS collections. Suits, tuxedos, ceremony wear &amp; private label.</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- DISCOUNT CODE -->
  <tr>
    <td style="padding:22px 44px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px dashed rgba(139,94,42,0.35);background:rgba(255,255,255,0.55);">
        <tr>
          <td style="padding:16px 22px;">
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;letter-spacing:4px;color:#8b5e2a;text-transform:uppercase;margin-bottom:5px;">Discount Code</div>
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-weight:700;font-size:15px;letter-spacing:5px;color:#2c1810;">${DISCOUNT_CODE}</div>
          </td>
          <td style="padding:16px 22px;text-align:right;">
            <span style="font-family:Georgia,serif;font-style:italic;font-size:12px;color:#8b5e2a;">First order only</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td style="padding:0 44px 32px;">
      <a href="${SITE_URL}" target="_blank" style="display:block;background:#2c1810;color:#c9a84c;text-align:center;padding:16px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;letter-spacing:5px;text-transform:uppercase;text-decoration:none;">Browse the Wholesale Catalogue</a>
    </td>
  </tr>

  <!-- SIGNATURE -->
  <tr>
    <td style="padding:0 44px 32px;border-top:1px solid rgba(139,94,42,0.2);">
      <p style="font-family:Georgia,serif;font-size:15px;color:#5a3e2b;margin:24px 0 0;">Warm regards,</p>
      <p style="font-family:Georgia,serif;font-style:italic;font-size:16px;color:#2c1810;margin:8px 0 0;">
        PAGUS Menswear — B2B Team<br>
        İzmir, Turkey &middot; <a href="mailto:sales@pagusmenswear.com" style="color:#8b5e2a;text-decoration:none;">sales@pagusmenswear.com</a>
      </p>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:#2c1810;padding:18px 44px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:8px;letter-spacing:3px;color:#7a5a3a;text-transform:uppercase;">&copy; 2025 PAGUS Menswear</td>
          <td align="right" style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:8px;color:#7a5a3a;">You received this because you registered on pagusmenswear.com</td>
        </tr>
      </table>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
