# CLAUDE.md — PAGUS Menswear Proje Hafızası

Bu dosya Claude Code tarafından her oturum başında otomatik okunur.
Proje kökünde (`/CLAUDE.md`) tutulmalıdır.

---

## ⚠️ EN KRİTİK KURAL

**index.html üzerinde çalışırken SADECE istenen değişikliği yap.**
- Dosyayı yeniden oluşturma, kopyalama veya farklı bir versiyonu baz alma.
- `str_replace` mantığıyla çalış — minimum müdahale, maksimum hassasiyet.
- Başka hiçbir satıra dokunma.
- Değişiklik öncesi ilgili bölümü oku, değişiklik sonrası doğrula.


## YASAK: Otomatik İyileştirme

Claude Code KENDİ İNİSİYATİFİYLE hiçbir değişiklik YAPMAZ.
- İstenmeden "tutarlılık düzeltmesi" yapma
- İstenmeden data-t attribute silme/ekleme
- İstenmeden nav, footer veya başka bölümlere dokunma
- İstenmeden dosya formatı değiştirme
- "Bu da düzeltilmeli" diye düşünüyorsan YAPMA, önce sor
- Sadece ve sadece açıkça istenen değişikliği yap
- Şüphen varsa değişiklik yapma, kullanıcıya sor

Başka hiçbir şeye dokunma.

---

## Proje Bilgileri

- **Domain:** pagusmenswear.com
- **Hosting:** Vercel (GitHub'dan otomatik deploy)
- **GitHub repo:** github.com/kaynarkerem-ai/pagus-website
- **Ana dosya:** index.html (tek dosya, ~2700 satır, ~180KB)
- **Dil:** Çok dilli — EN / IT / FR / DE / ES (i18n sistemi var)
- **Zoom:** `body { zoom: 1.1; }` — kasıtlı, dokunma

---

## Claude Code Workflow

### Çalışma Döngüsü
```
1. cd /proje-klasörü        → proje kökünde başla
2. git pull                  → en güncel kodu çek
3. Değişikliği yap           → str_replace ile sadece istenen yeri düzenle
4. Tarayıcıda test et        → localhost veya Vercel preview
5. git add . && git commit   → anlamlı commit mesajı yaz
6. git push                  → Vercel otomatik deploy eder
```

### Commit Mesajı Formatı
```
fix: WhatsApp butonunun z-index düzeltmesi
feat: Yeni ürün kartı eklendi (showcase)
style: Logistics section logo hizalaması
i18n: Almanca çeviri düzeltmeleri
```

### Dikkat Edilecekler
- **Her değişiklikten ÖNCE** ilgili bölümü oku ve anla
- **Her değişiklikten SONRA** dosya bütünlüğünü kontrol et (satır sayısı ~2700 olmalı)
- Birden fazla değişiklik istenirse her birini **ayrı ayrı** uygula, tek seferde toplu değiştirme yapma
- **Test etmeden commit atma**

---

## Renk Paleti ve Fontlar

```css
--color-black: #1a1a1a
--color-gold:  #c9a962
--color-noble: #2c3e50
background:    #FAFAFA (sayfa arka planı)
white:         #FFFFFF (kartlar, footer)
krem:          #f8f5f0 (blog section arka planı)
```

**Fontlar:**
- Display: `Playfair Display` (serif) — başlıklar
- Body: `Montserrat` (sans-serif) — metin

---

## HTML Sayfa Yapısı (Sırayla)

Aşağıdaki sıra **kesinlikle korunmalı**, hiçbir section yerinden oynatılmamalı:

```
1.  <head>                → meta, CSS, fontlar, Schema.org JSON-LD
2.  <header>              → logo, nav, dil seçici, search, auth butonu
3.  SVG Sprite            → sosyal medya ikonları (instagram, whatsapp, linkedin, facebook)
4.  Carousel              → #carouselSection (display:none, JS ile açılıyor)
5.  Showcase              → #showcaseSection (kategori grid görselleri)
6.  Hero                  → #heroSection (tagline, başlık, istatistikler)
7.  Page Title Area       → #pageTitleArea (kategori başlığı, geri butonu)
8.  Product Grid          → #pGrid (ürünler buraya render ediliyor)
9.  Search Results        → #searchResults
10. Private Label         → #privateLabelSection
11. Float Cart Btn        → #floatCart (yeşil, fixed, bottom:90px right:20px)
12. Cart Panel            → #cartPanel + #cartOverlay (sağdan kayıyor)
13. Toast                 → #toastNotification
14. Auth Modal            → login / register / forgot password formları
15. Promo Popup           → indirim popup'ı
16. Cookie Banner         → GDPR cookie bildirimi
17. Fullscreen Lightbox   → #fullscreenOverlay (ürün fotoğrafı tam ekran)
18. BLOG SECTION          → "Wholesale Mens Suits from Turkey" ⚠️ SİLME
19. LOGISTICS SECTION     → DHL / FedEx / UPS logoları ⚠️ SİLME
20. <footer>              → 3 kolonlu footer (Why Pagus / B2B Contact / Quick Links + Social)
21. Advanced Search Panel → #advPanelOverlay
22. T&C Overlay           → terms and conditions
23. Firebase SDK          → 3 script tag
24. Ana JS                → tüm uygulama mantığı (~1800 satır)
25. Chatling Chatbot      → EN SONDA, </body>'den önce ⚠️ SİLME
```

---

## Kritik Bölümler — Detaylı Açıklama

### 📌 BLOG SECTION (satır ~612)
```html
<!-- BLOG / INSIGHTS SECTION -->
<section style="background:#f8f5f0; padding:80px 40px; border-top:1px solid rgba(44,62,80,0.08);">
```
- SEO için kritik, sayfada kalıcı olmalı
- İçerik: "Wholesale Mens Suits from Turkey: The Complete Guide for European Retailers"
- 3 stat kutusu: Delivery 3-11 days / Private Label Available / IT·DE·FR·ES
- 2 kolonlu liste: Why Source from Turkey + What We Manufacture
- Siyah CTA kutusu: "Ready to Start Wholesale Sourcing?"
- **Bu section silinirse SEO trafiği düşer — asla silme**

### 📌 LOGISTICS SECTION (satır ~663)
```html
<!-- LOGISTICS SECTION -->
<section style="background:#f8f5f0; padding:0; border-top:1px solid rgba(44,62,80,0.08);">
```
- Blog section'ın hemen altında, footer'ın üstünde
- Sol: koyu navy (#2c3e50) kutuda "Fast & Reliable Worldwide Shipping" metni
- Sağ: **krem/beyaz (#f8f5f0) arka plan** üzerinde DHL / FedEx / UPS logoları yan yana
- Her logo altında: EXPRESS / INTERNATIONAL / WORLDWIDE yazısı
- 3 logo arasında dikey bölücü çizgiler var
- **Logo arka planı KESİNLİKLE krem/beyaz olmalı, navy/koyu olmamalı**

### 📌 CART PANEL (satır ~454)
```html
<!-- CART PANEL -->
<div class="cart-panel-overlay" id="cartOverlay">
<div class="cart-panel" id="cartPanel">
```
- Float butona tıklayınca sağdan kayarak açılıyor
- Kullanıcının seçtiği modeller listeleniyor (ürün adı + küçük thumbnail)
- Not alanı (opsiyonel)
- 2 buton: **WhatsApp'a gönder** (yeşil) + **Email ile gönder** (beyaz)
- Sepeti temizle butonu
- **Adet/MOQ bilgisi YOK — kasıtlı olarak kaldırıldı**
- Float buton: yeşil (#25D366), bottom:90px (chatbot ile çakışmıyor)

### 📌 FLOAT CART BUTTON (satır ~449)
```html
<button id="floatCart" class="float-cart" onclick="openCartPanel()">
```
- `bottom: 90px; right: 20px` — chatbot butonunun üstünde
- Sepet boşken `display:none`, ürün eklenince `display:flex`
- Tıklanınca `sendListToWhatsapp()` değil, `openCartPanel()` açıyor

### 📌 CHATLING CHATBOT (EN SONDA, satır ~2715)
```html
<!-- Chatling AI Chatbot -->
<script>window.chtlConfig = { chatbotId: "1894737114" }</script>
<script async data-id="1894737114" id="chtl-script" type="text/javascript" src="https://chatling.ai/js/embed.js"></script>
```
- `</body>` kapanış etiketinden hemen önce
- chatbotId: **1894737114** — değiştirme
- **Bu kod silinirse chatbot kaybolur**

---

## Firebase & Auth

- Firebase project: `pagus-website`
- authDomain: `pagus-website.firebaseapp.com`
- Kullanıcı kayıt olduğunda `/api/send-welcome` endpoint'ine POST atıyor (Vercel serverless function)
- Kullanıcı rolü: standard / premium / VIP (fiyat katmanları için)
- Firestore'da kullanıcı favorileri saklanıyor

---

## Vercel Serverless Function

- Dosya: `/api/send-welcome.js` (Vercel'de deploy edildi)
- Tetik: Yeni kullanıcı kaydı
- İşlev: Resend API ile hoş geldin emaili gönderir
- Environment variable: `RESEND_API_KEY` (Vercel dashboard'da tanımlı)
- Email gönderen: `info@pagusmenswear.com`

---

## WhatsApp & Email

```
WhatsApp: 905511748907  (PAGUS.config.whatsappNumber)
Email:    sales@pagusmenswear.com
```

---

## i18n Sistemi

- Dil seçimi `LANG` değişkeniyle tutuluyor
- Tüm metinler `data-t="key"` attribute'u ile işaretli
- `t('key')` fonksiyonu çeviriyi döndürüyor
- I18N objesi ~satır 1300'de, tüm dilleri içeriyor
- **Yeni metin eklenirken mutlaka 5 dil için çeviri ekle (en/it/fr/de/es)**

---

## CSS Kritik Noktalar

```css
/* Chatbot ile çakışmama için float buton yüksekte */
.float-cart { bottom: 90px; right: 20px; }

/* Scope fix - global stub fonksiyonlar */
/* Satır ~765: */
function t(key){ return window.__pagus_i18n ? window.__pagus_i18n(key) : key; }
function escapeHTML(s){ ... }
/* Bu stub'lar 2. script bloğundaki asıl fonksiyonlardan önce geliyor */
/* window.__pagus_i18n ve window.__pagus_escapeHTML ile bağlanıyorlar */
/* SİLME */
```

---

## Geçmişte Yapılan Düzeltmeler (Geri Alma YASAK)

| Fix | Sorun | Çözüm |
|-----|-------|-------|
| #1  | Carousel HTML eksikti | Eklendi |
| #3  | popstate race condition | Modal state tracking |
| #4  | probeImageCount race condition | Session tracking |
| #7  | WhatsApp sonrası sepet temizlenmiyordu | visibilitychange event |
| #9  | Fullscreen lightbox arka plan click | Ayrı overlay layer |
| #11 | Toast notification yoktu | Element eklendi |
| #13 | Heart butonlarında aria-label eksikti | Eklendi |
| #14 | document.write kullanımı | span + JS textContent |

---

## ❌ YAPMA Listesi

1. Logistics section'ı footer içine koyma — ayrı section olmalı
2. Logo arka planını navy/koyu yapma — krem/beyaz olmalı
3. Blog section'ı silme veya taşıma
4. Chatling kodunu silme veya yanlış yere koyma
5. `bottom: 90px` değerini `20px` yapma (chatbot ile çakışır)
6. `zoom: 1.1` değerini silme
7. Stub fonksiyonları (`t()`, `escapeHTML()`) silme
8. Firebase config'i değiştirme
9. `openCartPanel()` yerine `sendListToWhatsapp()` yazma
10. Sepete adet/MOQ bilgisi ekleme — kasıtlı olarak yok
11. Eski bir dosya versiyonunu baz alarak çalışma
12. Birden fazla değişikliği tek seferde toplu yapma
13. Test etmeden commit atma

---

## Dosya Boyutu Referansı

- index.html: ~2700 satır, ~180KB
- Daha kısa gelirse bir şeyler eksik demektir — kontrol et

---

## Diğer Proje Dosyaları

```
/index.html          → Ana site (tek sayfa)
/api/send-welcome.js → Vercel serverless (hoş geldin email)
/privacy.html        → GDPR/KVKK gizlilik politikası
/mesafeli-satis.html → Mesafeli satış sözleşmesi
/vercel.json         → Vercel konfigürasyonu
/CLAUDE.md           → Bu dosya (Claude Code hafızası)
```
## YASAK: Otomatik İyileştirme
Claude Code KENDİ İNİSİYATİFİYLE hiçbir "iyileştirme" veya "tutarlılık düzeltmesi" YAPMAZ.
Sadece ve sadece açıkça istenen değişikliği yapar.
"Bu da düzeltilmeli" diye düşünüyorsan, YAPMA — önce sor.

---

*Son güncelleme: 10 Mart 2026*
*PAGUS Menswear — pagusmenswear.com*
