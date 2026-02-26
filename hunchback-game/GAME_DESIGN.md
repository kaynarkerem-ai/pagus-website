# Hunchback HTML5 - Game Design Document

Amstrad CPC Hunchback (1983) oyununun HTML5 Canvas klonu. Tek index.html dosyası, sıfır bağımlılık.

## Renk Paleti

| Öğe        | Renk Kodu |
|------------|-----------|
| Background | #1a1a2e   |
| Duvar      | #5c4033   |
| Platform   | #6b4423   |
| Player     | #e94560   |
| Ten        | #ffcc99   |
| İp         | #c8a84e   |
| Ok         | #c0c0c0   |
| Ateş       | #ff6600   |
| Asker      | #3366cc   |
| Çan        | #ffd700   |
| Esmeralda  | #9b59b6   |
| Ay         | #fffde7   |

## Karakter - Quasimodo

- 20x24 hitbox
- Kırmızı pelerin, kambur duruş
- Koşma animasyonu (frame tabanlı)
- Yöne göre flip (sol/sağ)
- Hareket hızı: 2.8
- Zıplama kuvveti: -8.5
- Gravity: 0.45
- Sürtünme: 0.85

## İp Mekaniği

- Sarkaç fiziği ile sallanan ipler
- Havadayken ↑ ile 25px mesafeden tutunma
- ↑↓ ile tırmanma (yukarı/aşağı)
- Space ile bırakınca momentum fırlatması
- Her ipin ayrı hız ve uzunluk parametresi

## Engeller

1. **Ok** - Yatay uçar, 3-6 hız, ekrandan çıkınca geri döner
2. **Ateş Topu** - Merkez etrafında dairesel yörünge, radial gradient glow
3. **Asker** - İki nokta arası devriye, mızraklı

## 5+ Seviye

- **Lv1**: Kolay platformlar + 1 ok
- **Lv2**: İp sallanma + 1 ateş topu
- **Lv3**: Asker koridoru + 2 asker + 1 ok
- **Lv4**: Çok katlı + ipler + asker + ateş
- **Lv5**: Hepsi birden: 3 ip + 2 ok + 1 asker + 1 ateş
- **Lv6+**: Aynı layout, %20 daha hızlı engeller

## Hedef

Her seviye sonunda altın çan (parıldayan) + Esmeralda (el sallayan). Çana dokunma = seviye tamamlandı.

## Ses Sistemi (Web Audio API Oscillator)

- **Zıplama**: 400→600Hz square wave
- **İp tutma**: 300+450Hz
- **Hasar**: 100→60Hz sawtooth
- **Skor**: 523→659→784Hz arpej
- **Level bitti**: C5→C6 scale
- **Game over**: 400→200Hz düşen ton

## Görsel

- Canvas 640x400, responsive
- Gradient gökyüzü
- 40 twinkle yıldız
- Ay (glow + krater detayı)
- Notre Dame siluetleri
- Tuğla pattern duvarlar
- Particle sistem (hasar = kırmızı, çan = altın)
- Screen shake efekti
- Press Start 2P pixel font

## UI

- HUD: Skor, Level, 3 kalp (can)
- Start ekranı
- Game over ekranı
- Level complete overlay

## Mobil Kontrol

- Dokunmatik butonlar (pointer:coarse ile göster)
- ◀ ▶ yön butonları
- ▲ ip tut/tırman
- ⬆ zıpla

## Klavye Kontrolleri

- ← → : Hareket
- Space : Zıpla / İpten bırak
- ↑ : İp tut / Tırman
- ↓ : İpte aşağı in
