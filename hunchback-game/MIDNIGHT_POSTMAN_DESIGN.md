# Midnight Postman - Game Design Document

## Konsept
1920'ler noir atmosferinde gece postacısı olarak çatılardan çatılara atlayıp mektupları doğru pencerelere teslim ediyorsun. Her mektubun içeriği hikayeyi ve şehri etkiliyor. Tek index.html, sıfır bağımlılık.

---

## Renk Paleti (Noir)

| Öğe              | Hex     | Kullanım                          |
|-------------------|---------|-----------------------------------|
| Gece gökyüzü      | #0a0a1a | En derin arka plan                |
| Gökyüzü mid       | #1a1428 | Gradient orta                     |
| Gökyüzü ufuk      | #2d1b3d | Ufuk çizgisi mor tonu             |
| Bina koyu         | #1c1c2e | Uzak bina siluetleri              |
| Bina orta         | #2a2a3e | Orta katman binalar               |
| Bina açık         | #3a3550 | Yakın plan binalar                |
| Tuğla             | #4a3040 | Duvar detay                       |
| Tuğla harç        | #332238 | Tuğla arası                       |
| Çatı              | #554455 | Çatı yüzeyi                       |
| Çatı kenar        | #6b5a6b | Çatı highlight                    |
| Postacı pelerin   | #3a506b | Koyu mavi-gri palto               |
| Postacı şapka     | #2c3e50 | Koyu fedora                       |
| Ten               | #e8c9a0 | Karakter yüz                      |
| Pencere söndük    | #1a1a2e | Karanlık pencere                  |
| Pencere yanık     | #e8a833 | Sıcak sarı ışık                   |
| Pencere turuncu   | #d4762c | Turuncu ışık                      |
| Ay                | #e8e0c8 | Ay rengi                          |
| Ay glow           | #fffbe6 | Ay halesi                         |
| Mektup            | #f5e6c8 | Zarf rengi                        |
| Mektup kırmızı    | #c0392b | Tehdit mektubu                    |
| Mektup pembe      | #e88ca5 | Aşk mektubu                      |
| Mektup mavi       | #5dade2 | Haber mektubu                     |
| Sokak lambası     | #ffcc44 | Lamba ışığı                       |
| Sokak lamba glow  | #fff4cc | Lamba hale                        |
| Duman             | #555566 | Baca dumanı                       |
| Yağmur            | #8899aa | Yağmur damlası                    |
| Kedi gözü         | #44ff44 | Kedi gözleri (easter egg)         |
| UI text           | #d4c5a9 | Eskimiş kağıt rengi metin         |
| UI vurgu          | #e8a833 | Altın sarısı vurgu                |

---

## Karakter - The Postman (Postacı)

- **Boyut**: 16x28 hitbox
- **Görünüm**: Fedora şapka, uzun palto, çanta omuzda, kambur koşuş
- **Hareket hızı**: 3.0 px/frame
- **Koşu animasyonu**: 6 frame, palto eteği sallanıyor
- **Zıplama kuvveti**: -9.0 (çatılar arası mesafe için güçlü)
- **Gravity**: 0.42
- **Sürtünme**: 0.88
- **Duvar kaydırma**: Duvara temas + yön tuşu = yavaş kayma (vy * 0.4)
- **Çift zıplama**: Yok (gerçekçi noir)
- **Eğilme/slide**: ↓ + koşu = kısa slide (dar geçitler için)

---

## Çekirdek Mekanik: Mektup Teslimi

### Mektup Türleri (3 tür)
1. **Aşk Mektubu** 💕 (pembe zarf) — Teslim edilen pencere ışığı sıcak sarıya döner, müzik kutusu sesi
2. **Tehdit Mektubu** 🔴 (kırmızı zarf) — Pencere kapanır, cam kırılma sesi, bina karanlıklaşır
3. **Haber Mektubu** 🔵 (mavi zarf) — Penceredeki figür gazete okur, nötr etki

### Teslim Mekaniği
- HUD'da aktif mektup + hedef pencere gösteriliyor (parlayan pencere çerçevesi)
- Hedef pencereye yaklaş (20px) + ↓ tuşu = mektup bırak
- **Doğru pencere**: +200 puan, pencere hikaye animasyonu oynar
- **Yanlış pencere**: -100 puan, "Wrong address!" uyarısı, pencereden ayakkabı fırlar
- Her seviyede 3-5 mektup teslim et

### Moral Sistemi
- Seviye sonunda "City Mood" göstergesi
- Aşk mektupları → şehir aydınlanır (daha çok ışık)
- Tehdit mektupları → şehir kararır (daha az ışık, daha çok polis)
- Moral %30 altına düşerse → "Dark Ending" (5. seviye sonrası)
- Moral %70 üstünde → "Light Ending"

---

## Engeller & Tehlikeler

### 1. Köpek (Rooftop Guard Dog)
- Belirli çatılarda devriye
- Havlama sesi (oscillator growl)
- Görüş mesafesi: 80px
- Seni görünce koşar, çatı kenarında durur
- **Çözüm**: Üstünden atla veya arkasından geç

### 2. Polis Feneri (Searchlight)
- Yavaşça dönen ışık huzmesi
- Yakalanırsan: 3 saniye freeze + zaman cezası
- **Pattern**: Sinusoidal sweep, öngörülebilir
- Işık huzmesi: `arc` + gradient ile çizilir

### 3. Baca Dumanı
- Bazı bacalardan duman çıkar
- Dumana girersen: yavaşlama (hız * 0.4) + öksürük sesi
- 2 saniye sonra duman dağılır

### 4. Kırık Çatı
- Bazı çatı parçaları çatlak (titreşim animasyonu)
- Üstüne basınca 0.8 saniye sonra düşer
- Düşen çatı parçası particle efekti

### 5. Rüzgar
- Belirli bölgelerde yatay rüzgar
- Zıplarken sürükleme kuvveti: vx += wind_force
- Yön değiştiren rüzgar (3 saniye döngü)

### 6. Kedi
- Rastgele çatılarda oturan kedi
- Zararsız, ama üstüne basarsan miyavlar + seni iter (vx += 4)
- **Easter egg**: 5 kediyi okşarsan (yavaşça yaklaş) bonus puan

---

## Seviye Tasarımı

### Level 1: "First Night" (İlk Gece)
- **Atmosfer**: Sakin, ay ışığı, hafif sis
- **Layout**: 5-6 bina, düz çatılar, kolay mesafeler
- **Mektuplar**: 2 aşk mektubu (tutorial niteliğinde)
- **Engeller**: Yok
- **Öğretici**: Hareket, zıplama, mektup teslimi
- **Özel**: İlk mektup tesliminde slow-motion + tutorial popup

### Level 2: "Barking Mad" (Köpek Gecesi)
- **Atmosfer**: Hafif rüzgar, bulutlar ayı arada kapatır
- **Layout**: 7-8 bina, farklı yüksekliklerde, 1 dar geçit
- **Mektuplar**: 3 mektup (1 aşk, 1 haber, 1 tehdit)
- **Engeller**: 2 köpek, 1 kırık çatı
- **Özel**: İlk tehdit mektubu seçimi — "teslim et mi, atla mı?"

### Level 3: "Under the Spotlight" (Polis Gecesi)
- **Atmosfer**: Yağmur başlar, sokak lambaları yansıma yapar
- **Layout**: 8-9 bina, çok katlı, dikey platform zıplama
- **Mektuplar**: 4 mektup (karışık)
- **Engeller**: 2 polis feneri, 1 köpek, 2 baca dumanı
- **Özel**: Yağmur efekti (200 damla particle), ıslak çatı kaydırması (sürtünme * 0.7)

### Level 4: "Smoke & Mirrors" (Duman Gecesi)
- **Atmosfer**: Yoğun sis, görüş mesafesi kısıtlı (vignette efekt)
- **Layout**: 10 bina, labirent gibi çatı geçişleri
- **Mektuplar**: 4 mektup (zamanlı — 90 saniye limit)
- **Engeller**: 3 baca, 2 kırık çatı, 1 polis, rüzgar bölgeleri
- **Özel**: Sis efekti (radial gradient overlay), fener mekanığı (Space ile fener aç, 5 sn pil)

### Level 5: "The Last Delivery" (Son Teslimat)
- **Atmosfer**: Fırtına, şimşek, dramatik
- **Layout**: 12 bina, en zor parkur
- **Mektuplar**: 5 mektup (son mektup hikaye belirleyici)
- **Engeller**: Hepsi birden + şimşek (rastgele aydınlatma flash)
- **Özel**: Son mektup iki pencereye teslim edilebilir → farklı son
- **Final**: Moral puanına göre 2 farklı bitiş ekranı

---

## Ses Sistemi (Web Audio API)

Tüm sesler oscillator tabanlı, sıfır dosya.

| Ses              | Frekans          | Dalga   | Süre  | Not                           |
|------------------|------------------|---------|-------|-------------------------------|
| Ayak sesi        | 80-120Hz random  | noise   | 0.05s | Her adımda, hafif             |
| Zıplama          | 180→350Hz        | square  | 0.12s | Hızlı yükseliş               |
| İniş             | 120→80Hz         | square  | 0.08s | Kısa thud                    |
| Mektup teslim    | C5→E5→G5→C6     | sine    | 0.4s  | Arpej, başarı hissi          |
| Yanlış adres     | 200→100Hz        | saw     | 0.3s  | Düşen, hata hissi            |
| Köpek havlama    | 200+250Hz        | square  | 0.15s | İki ton, tekrarlı            |
| Polis feneri     | 440Hz pulse      | sine    | 0.5s  | Aralıklı bip                 |
| Duman öksürük    | 60-100Hz noise   | saw     | 0.2s  | Kısık boğuk ses              |
| Çatı kırılma     | 300→50Hz         | noise   | 0.4s  | Çatırdama                    |
| Rüzgar           | 100-200Hz sweep  | sine    | 2.0s  | Arka plan ambiyans            |
| Kedi miyav       | 600→900→600Hz    | sine    | 0.3s  | Yukarı-aşağı                 |
| Level complete   | C4→D4→E4→F4→G4→A4→B4→C5 | square | 0.8s | Tam scale       |
| Game over        | E4→C4→A3→F3     | saw     | 1.0s  | Düşen, dramatik              |
| Ambiyans         | 55Hz drone       | sine    | loop  | Sürekli arka plan hum        |

---

## Görsel Sistem

### Arka Plan (Parallax 3 Katman)
1. **Uzak** (0.1x scroll): Gökyüzü gradient + ay + yıldızlar (50 adet, twinkle)
2. **Orta** (0.4x scroll): Uzak bina siluetleri, kilise kulesi, su kulesi
3. **Yakın** (0.7x scroll): Dekoratif binalar, sokak lambaları (aşağıda)

### Binalar (Prosedürel)
- Her bina: `{x, y, w, h, floors, hasChimney, windowPattern, roofType}`
- **Çatı tipleri**: Düz, eğimli (sol/sağ), sivri, kubbe
- **Pencere grid**: Her katta 2-4 pencere, rastgele açık/kapalı
- **Tuğla pattern**: 8x4 tuğla, offset rows
- **Süslemeler**: Çıkıntı (cornice), pencere pervazı, yangın merdiveni

### Işık Sistemi
- **Ay ışığı**: Global ambient, üst yarı aydınlık
- **Sokak lambaları**: Aşağıdan yukarı radial gradient (sıcak sarı)
- **Pencere ışığı**: Pencereden dışarı hafif glow yayılımı
- **Polis feneri**: Konik ışık huzmesi (arc + gradient)
- **Şimşek**: Tüm ekran flash (0.1s beyaz overlay, %15 opacity)

### Particle Sistemleri
- **Yağmur**: 200 damla, açılı düşüş, çatıda bounce
- **Duman**: 15 parçacık/baca, yukarı spiral, fade out
- **Teslim başarı**: 12 altın parçacık, confetti pattern
- **Çatı kırılma**: 8 kahverengi parçacık, gravity ile düşüş
- **Şimşek**: Jagged polyline, rastgele dallanma

### Efektler
- **Screen shake**: Hasar + çatı kırılma + şimşek
- **Vignette**: Level 4'te sis modu (radial gradient kenarları karartır)
- **Slow motion**: İlk teslimde dt*0.3 (tutorial anı)

---

## UI Tasarımı

### HUD (Üst Bar)
```
[♥♥♥]  SCORE: 003200  LVL 2  [📧 2/3]  ⏱ 1:24
```
- Sol: 3 kalp (can)
- Orta sol: Skor
- Orta: Level
- Orta sağ: Mektup sayacı (teslim edilen / toplam)
- Sağ: Süre (level 4+ için)

### Aktif Mektup Göstergesi
- Ekranın alt-sol köşesinde mektup simgesi
- Renk = mektup türü
- Mektup türünün adı: "Love Letter", "Threat", "News"
- Hedef bina parlayan çerçeveyle işaretli

### Start Ekranı
```
          🌙
    MIDNIGHT POSTMAN
    ─────────────────
    A Noir Delivery Tale

    [Postacı silueti, yürüyen animasyon]

    ► PRESS SPACE TO START ◄

    ← → Move  SPACE Jump  ↓ Deliver
```

### Game Over Ekranı
```
    THE NIGHT IS OVER
    ─────────────────
    Letters Delivered: 12/15
    City Mood: ████████░░ 78%
    Final Score: 8400

    PRESS SPACE TO RETRY
```

### Level Complete
```
    DELIVERY COMPLETE
    ─────────────────
    ✉ 3/3 Delivered
    ♥ +2 Love  ⚠ +1 Threat
    City Mood: ██████░░░░ 58%
    Score: +1200

    PRESS SPACE TO CONTINUE
```

### Hikaye Seçim Overlay
```
    ┌─────────────────────────────┐
    │  This letter is addressed   │
    │  to Window A... but         │
    │  Window B is also marked.   │
    │                             │
    │  [1] Deliver to A (safe)    │
    │  [2] Deliver to B (risky)   │
    └─────────────────────────────┘
```

---

## Mobil Kontroller

```
  [◀] [▶]                    [↓] [⬆]
  Sol  Sağ                Teslim Zıpla
```
- `pointer:coarse` medya sorgusuyla otomatik göster
- Yarı saydam glassmorphism butonlar
- 60x60px, 14px gap
- Aktif basılma: opacity artışı + scale(0.92)

---

## Klavye Kontrolleri

| Tuş         | Aksiyon                     |
|-------------|---------------------------|
| ← →         | Hareket                    |
| Space        | Zıpla                     |
| ↓            | Mektup teslim / Slide     |
| ↑            | Yukarı bak (kamera)       |
| F            | Fener aç/kapa (Level 4+)  |
| P            | Pause                      |
| M            | Müzik/ses on/off           |

---

## Teknik Detaylar

- **Canvas**: 800x500, responsive scale
- **Kamera**: Oyuncuyu takip eden smooth kamera (lerp 0.08)
- **Level genişliği**: 1600-3200px (scroll)
- **FPS**: requestAnimationFrame (~60fps)
- **Font**: Press Start 2P (Google Fonts)
- **Ses**: Web Audio API, oscillator only
- **Kayıt**: localStorage (high score + unlocked levels)
- **Performans**: Object pooling (yağmur, parçacık), offscreen culling
