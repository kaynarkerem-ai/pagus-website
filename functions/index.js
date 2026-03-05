const functions = require("firebase-functions");
const https = require("https");

// ─── CONFIG ───────────────────────────────────────────────
const RESEND_API_KEY = "rre_gUDrUS6J_ALbqBG9yZaimwVT1B75uwvgz";
const FROM_EMAIL = "PAGUS Menswear <sales@pagusmenswear.com>";
const REPLY_TO       = "sales@pagusmenswear.com";
const SITE_URL       = "https://www.pagusmenswear.com";
const DISCOUNT_CODE  = "PAGUS-MAR5";
// ──────────────────────────────────────────────────────────


/**
 * Yeni kullanıcı kaydolduğunda otomatik çalışır.
 * Firebase Auth → onCreate trigger
 */
exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {

  const email = user.email;
  const name  = user.displayName || "Partner";

  // Email yoksa işlem yapma (anonim kayıtlar vb.)
  if (!email) {
    console.log("Email bulunamadı, atlandı:", user.uid);
    return null;
  }

  console.log(`Yeni kayıt: ${email} — hoşgeldin maili gönderiliyor...`);

  const htmlBody = buildEmailHTML(name);

  try {
    await sendViaResend({
      from:     FROM_EMAIL,
      reply_to: REPLY_TO,
      to:       [email],
      subject:  "Welcome to PAGUS Menswear — Your 5% Discount Inside",
      html:     htmlBody,
    });
    console.log(`✅ Mail gönderildi: ${email}`);
  } catch (err) {
    console.error(`❌ Mail gönderilemedi: ${email}`, err);
  }

  return null;
});


// ─── RESEND API CALL ──────────────────────────────────────
function sendViaResend(payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);

    const options = {
      hostname: "api.resend.com",
      path:     "/emails",
      method:   "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type":  "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Resend API hatası ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}


// ─── EMAIL HTML ───────────────────────────────────────────
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
          <td width="6" style="background:linear-gradient(180deg,#c9a84c 0%,#8b5e2a 100%);"></td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- WELCOME BAND -->
  <tr>
    <td style="background:#c9a84c;padding:9px 44px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-weight:300;font-size:9px;letter-spacing:6px;color:#2c1810;text-transform:uppercase;white-space:nowrap;">Member Registration Confirmed</td>
          <td style="padding:0 16px;"><hr style="border:none;border-top:1px solid rgba(44,24,16,0.2);margin:0;"></td>
          <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-weight:300;font-size:9px;letter-spacing:6px;color:#2c1810;text-transform:uppercase;white-space:nowrap;">March 2025</td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- HERO -->
  <tr>
    <td style="background:#f5f0e8;padding:48px 44px 32px;">
      <p style="font-family:Georgia,serif;font-size:16px;font-style:italic;color:#8b5e2a;margin:0 0 10px;">Dear ${name},</p>
      <h1 style="font-family:Georgia,serif;font-size:30px;font-weight:700;color:#2c1810;line-height:1.2;margin:0 0 20px;">A warm welcome<br>from &Iuml;zmir.</h1>
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
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#2c1810;overflow:hidden;">
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
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-weight:300;font-size:9px;letter-spacing:4px;color:#8b5e2a;text-transform:uppercase;margin-bottom:5px;">Discount Code</div>
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-weight:700;font-size:15px;letter-spacing:5px;color:#2c1810;">${DISCOUNT_CODE}</div>
          </td>
          <td style="padding:16px 22px;text-align:right;">
            <span style="font-family:Georgia,serif;font-style:italic;font-size:12px;color:#8b5e2a;">First order only</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- CTA BUTTON -->
  <tr>
    <td style="padding:0 44px 32px;">
      <a href="${SITE_URL}" target="_blank" style="display:block;background:#2c1810;color:#c9a84c;text-align:center;padding:16px;font-family:'Helvetica Neue',Arial,sans-serif;font-weight:400;font-size:10px;letter-spacing:5px;text-transform:uppercase;text-decoration:none;">Browse the Wholesale Catalogue</a>
    </td>
  </tr>

  <!-- SIGNATURE -->
  <tr>
    <td style="padding:0 44px 32px;border-top:1px solid rgba(139,94,42,0.2);margin-top:8px;">
      <p style="font-family:Georgia,serif;font-size:15px;color:#5a3e2b;line-height:1.75;margin:24px 0 0;">Warm regards,</p>
      <p style="font-family:Georgia,serif;font-style:italic;font-size:16px;color:#2c1810;line-height:1.6;margin:8px 0 0;">
        PAGUS Menswear — B2B Team<br>
        &Iuml;zmir, Turkey &middot; <a href="mailto:sales@pagusmenswear.com" style="color:#8b5e2a;text-decoration:none;">sales@pagusmenswear.com</a>
      </p>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:#2c1810;padding:18px 44px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-weight:200;font-size:8px;letter-spacing:3px;color:#7a5a3a;text-transform:uppercase;">&copy; 2025 PAGUS Menswear</td>
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
