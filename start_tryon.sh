#!/bin/bash

echo "=========================================="
echo "  PAGUS Virtual Try-On Başlatılıyor"
echo "=========================================="

# Sanal ortam kontrolü
if [ ! -d "venv_tryon" ]; then
    echo "📦 Sanal ortam oluşturuluyor..."
    python3 -m venv venv_tryon
fi

# Sanal ortamı aktifleştir
source venv_tryon/bin/activate

# Gereksinimleri yükle
echo "📥 Gerekli paketler yükleniyor..."
pip install -q -r requirements_tryon.txt

# API key kontrolü
if [ -z "$REPLICATE_API_TOKEN" ]; then
    echo ""
    echo "⚠️  UYARI: REPLICATE_API_TOKEN ayarlanmamış!"
    echo ""
    echo "API anahtarı almak için:"
    echo "  1. https://replicate.com adresine gidin"
    echo "  2. Ücretsiz hesap oluşturun"
    echo "  3. API anahtarınızı kopyalayın"
    echo "  4. Aşağıdaki komutu çalıştırın:"
    echo ""
    echo "     export REPLICATE_API_TOKEN='r8_xxxxxxxxxx'"
    echo ""
    echo "Sonra bu scripti tekrar çalıştırın."
    echo ""
    read -p "API anahtarı olmadan devam etmek ister misiniz? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Uygulamayı başlat
echo ""
echo "🚀 Uygulama başlatılıyor..."
echo "   Tarayıcınızda açılacak: http://localhost:7860"
echo ""
python virtual_tryon_app.py
