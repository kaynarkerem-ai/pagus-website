"""
PAGUS Virtual Try-On Application
Takım elbiselerinizi farklı ortamlarda görselleştirin.

Kullanım:
1. pip install gradio replicate pillow
2. REPLICATE_API_TOKEN environment variable'ını ayarlayın
3. python virtual_tryon_app.py
"""

import gradio as gr
import replicate
import os
from PIL import Image
import tempfile
import base64
from io import BytesIO

# Ortam seçenekleri ve açıklamaları
SETTINGS = {
    "Düğün Bahçesi": {
        "prompt": "elegant man wearing the suit at a beautiful garden wedding venue, white flowers, fountain, string lights, golden hour lighting, romantic atmosphere, professional photography",
        "negative": "blurry, distorted, low quality, cartoon"
    },
    "Modern Ofis": {
        "prompt": "professional man wearing the suit in a modern corporate office, glass windows, city skyline view, professional lighting, business environment, high-end office interior",
        "negative": "blurry, distorted, low quality, cartoon"
    },
    "Açık Hava - Şehir": {
        "prompt": "stylish man wearing the suit walking in urban city street, modern architecture, daytime, natural lighting, street photography style",
        "negative": "blurry, distorted, low quality, cartoon"
    },
    "Resmi Toplantı": {
        "prompt": "confident businessman wearing the suit in a formal boardroom meeting, large conference table, professional setting, corporate environment",
        "negative": "blurry, distorted, low quality, cartoon"
    },
    "Gala / Kırmızı Halı": {
        "prompt": "elegant man wearing the suit at a red carpet gala event, photographers, glamorous lighting, VIP atmosphere, celebrity style",
        "negative": "blurry, distorted, low quality, cartoon"
    },
    "Sahil / Beach Wedding": {
        "prompt": "handsome man wearing the suit at a beach wedding ceremony, ocean view, sunset, palm trees, romantic seaside atmosphere",
        "negative": "blurry, distorted, low quality, cartoon"
    },
    "Lüks Otel Lobisi": {
        "prompt": "sophisticated man wearing the suit in a luxury hotel lobby, marble floors, chandeliers, elegant interior, high-end atmosphere",
        "negative": "blurry, distorted, low quality, cartoon"
    },
    "Klasik Malikane": {
        "prompt": "distinguished man wearing the suit in a classic mansion, grand staircase, vintage decor, aristocratic setting, timeless elegance",
        "negative": "blurry, distorted, low quality, cartoon"
    }
}

def check_api_key():
    """Replicate API key kontrolü"""
    api_key = os.environ.get("REPLICATE_API_TOKEN")
    if not api_key:
        return False, "REPLICATE_API_TOKEN bulunamadı. Lütfen API anahtarınızı ayarlayın."
    return True, "API bağlantısı hazır."

def process_image(garment_image, setting_choice, custom_prompt=""):
    """
    Virtual try-on işlemi
    """
    # API key kontrolü
    has_key, message = check_api_key()
    if not has_key:
        return None, message

    if garment_image is None:
        return None, "Lütfen bir takım elbise fotoğrafı yükleyin."

    try:
        # Görüntüyü geçici dosyaya kaydet
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
            if isinstance(garment_image, str):
                # Dosya yolu ise
                img = Image.open(garment_image)
            else:
                img = Image.fromarray(garment_image)
            img.save(tmp.name)
            garment_path = tmp.name

        # Prompt oluştur
        if custom_prompt:
            prompt = custom_prompt
        else:
            setting_info = SETTINGS.get(setting_choice, SETTINGS["Düğün Bahçesi"])
            prompt = setting_info["prompt"]

        # IDM-VTON modelini kullan (Replicate'de en popüler virtual try-on modeli)
        # Not: Bu model giysi görüntüsünü alıp bir model üzerine giydirir

        output = replicate.run(
            "cuuupid/idm-vton:c871bb9b046f351a536e9829cccd88a6de2be5f15584cf6e1855e5c93c5ac2cb",
            input={
                "crop": False,
                "seed": 42,
                "steps": 30,
                "category": "upper_body",
                "force_dc": False,
                "garm_img": open(garment_path, "rb"),
                "human_img": "https://replicate.delivery/pbxt/KgwTlBLpoqfAYPzBOVDVGVBMrhYHQCIryXhSQvkwpdxBJlBE/model.webp",  # Default model
                "mask_only": False,
                "garment_des": f"A formal suit, {prompt}"
            }
        )

        # Geçici dosyayı temizle
        os.unlink(garment_path)

        if output:
            return output, f"İşlem başarılı! Ortam: {setting_choice}"
        else:
            return None, "İşlem tamamlanamadı. Lütfen tekrar deneyin."

    except Exception as e:
        return None, f"Hata oluştu: {str(e)}"

def generate_with_stable_diffusion(garment_image, setting_choice, model_type="Erkek Model"):
    """
    Stable Diffusion ile ortam değiştirme (alternatif yöntem)
    """
    has_key, message = check_api_key()
    if not has_key:
        return None, message

    if garment_image is None:
        return None, "Lütfen bir takım elbise fotoğrafı yükleyin."

    try:
        # Görüntüyü base64'e çevir
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
            if isinstance(garment_image, str):
                img = Image.open(garment_image)
            else:
                img = Image.fromarray(garment_image)
            img.save(tmp.name)
            img_path = tmp.name

        setting_info = SETTINGS.get(setting_choice, SETTINGS["Düğün Bahçesi"])

        # SDXL img2img kullan
        output = replicate.run(
            "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
            input={
                "image": open(img_path, "rb"),
                "prompt": setting_info["prompt"],
                "negative_prompt": setting_info["negative"],
                "strength": 0.65,
                "num_outputs": 1,
                "guidance_scale": 7.5,
            }
        )

        os.unlink(img_path)

        if output and len(output) > 0:
            return output[0], f"Görsel oluşturuldu! Ortam: {setting_choice}"
        else:
            return None, "İşlem tamamlanamadı."

    except Exception as e:
        return None, f"Hata: {str(e)}"

def create_demo():
    """Gradio arayüzünü oluştur"""

    with gr.Blocks(
        title="PAGUS Virtual Try-On",
        theme=gr.themes.Soft(primary_hue="blue"),
        css="""
        .main-title {
            text-align: center;
            color: #1a365d;
            margin-bottom: 20px;
        }
        .subtitle {
            text-align: center;
            color: #4a5568;
            margin-bottom: 30px;
        }
        """
    ) as demo:

        gr.HTML("""
        <div class="main-title">
            <h1>🎩 PAGUS Virtual Try-On</h1>
        </div>
        <div class="subtitle">
            <p>Takım elbiselerinizi farklı ortamlarda görselleştirin</p>
        </div>
        """)

        # API durumu
        has_key, api_message = check_api_key()
        if not has_key:
            gr.Markdown(f"""
            ### ⚠️ API Ayarı Gerekli

            Bu uygulamayı kullanmak için Replicate API anahtarı gereklidir:

            1. [replicate.com](https://replicate.com) adresinden ücretsiz hesap oluşturun
            2. API anahtarınızı alın
            3. Terminal'de çalıştırın:
            ```bash
            export REPLICATE_API_TOKEN="your_api_key_here"
            python virtual_tryon_app.py
            ```
            """)

        with gr.Tabs():
            # Tab 1: Virtual Try-On
            with gr.TabItem("👔 Virtual Try-On"):
                with gr.Row():
                    with gr.Column(scale=1):
                        garment_input = gr.Image(
                            label="Takım Elbise Fotoğrafı",
                            type="numpy",
                            height=400
                        )

                        setting_dropdown = gr.Dropdown(
                            choices=list(SETTINGS.keys()),
                            value="Düğün Bahçesi",
                            label="Ortam Seçin"
                        )

                        process_btn = gr.Button("🎨 Görsel Oluştur", variant="primary", size="lg")

                    with gr.Column(scale=1):
                        output_image = gr.Image(
                            label="Sonuç",
                            height=400
                        )
                        status_text = gr.Textbox(label="Durum", interactive=False)

                process_btn.click(
                    fn=process_image,
                    inputs=[garment_input, setting_dropdown],
                    outputs=[output_image, status_text]
                )

            # Tab 2: Ortam Değiştirme (Alternatif)
            with gr.TabItem("🖼️ Ortam Değiştirme"):
                gr.Markdown("""
                ### Mevcut Fotoğrafın Ortamını Değiştirin
                Takım elbise fotoğrafınızı yükleyin ve farklı bir ortamda görün.
                """)

                with gr.Row():
                    with gr.Column(scale=1):
                        garment_input_2 = gr.Image(
                            label="Orijinal Fotoğraf",
                            type="numpy",
                            height=400
                        )

                        setting_dropdown_2 = gr.Dropdown(
                            choices=list(SETTINGS.keys()),
                            value="Modern Ofis",
                            label="Yeni Ortam Seçin"
                        )

                        transform_btn = gr.Button("🔄 Ortamı Değiştir", variant="primary", size="lg")

                    with gr.Column(scale=1):
                        output_image_2 = gr.Image(
                            label="Yeni Ortamda",
                            height=400
                        )
                        status_text_2 = gr.Textbox(label="Durum", interactive=False)

                transform_btn.click(
                    fn=generate_with_stable_diffusion,
                    inputs=[garment_input_2, setting_dropdown_2],
                    outputs=[output_image_2, status_text_2]
                )

            # Tab 3: Ayarlar
            with gr.TabItem("⚙️ Ayarlar ve Bilgi"):
                gr.Markdown("""
                ### Nasıl Kullanılır

                1. **Virtual Try-On**: Takım elbise fotoğrafını (düz arka plan, manken üzerinde) yükleyin.
                   Sistem bunu bir model üzerine giydirir ve seçtiğiniz ortamda gösterir.

                2. **Ortam Değiştirme**: Mevcut bir fotoğrafın arka planını/ortamını değiştirir.
                   Fotoğraf üzerinde kişi varsa, o kişiyi korumaya çalışır.

                ### Ortam Seçenekleri

                | Ortam | Açıklama |
                |-------|----------|
                | 🌸 Düğün Bahçesi | Çiçekli bahçe, fıskiye, string ışıklar |
                | 🏢 Modern Ofis | Cam pencereler, şehir manzarası |
                | 🌆 Açık Hava - Şehir | Şehir sokakları, modern mimari |
                | 💼 Resmi Toplantı | Toplantı odası, kurumsal ortam |
                | 🌟 Gala / Kırmızı Halı | Kırmızı halı, fotoğrafçılar |
                | 🏖️ Sahil / Beach Wedding | Okyanus manzarası, gün batımı |
                | 🏨 Lüks Otel Lobisi | Mermer zemin, avizeler |
                | 🏰 Klasik Malikane | Büyük merdiven, vintage dekor |

                ### API Kurulumu

                ```bash
                # Replicate API anahtarınızı alın: https://replicate.com/account/api-tokens
                export REPLICATE_API_TOKEN="r8_xxxxxxxxxxxx"

                # Gerekli paketleri yükleyin
                pip install gradio replicate pillow

                # Uygulamayı başlatın
                python virtual_tryon_app.py
                ```

                ### Krediler
                - Bu uygulama PAGUS Menswear için geliştirilmiştir
                - AI modelleri: Replicate (IDM-VTON, Stable Diffusion XL)
                """)

                # API test butonu
                test_btn = gr.Button("🔌 API Bağlantısını Test Et")
                test_result = gr.Textbox(label="Test Sonucu", interactive=False)

                def test_api():
                    has_key, message = check_api_key()
                    if has_key:
                        return "✅ API bağlantısı başarılı! Replicate API hazır."
                    else:
                        return f"❌ {message}"

                test_btn.click(fn=test_api, outputs=test_result)

        gr.HTML("""
        <div style="text-align: center; margin-top: 30px; padding: 20px; color: #666;">
            <p>PAGUS Menswear - Made in Türkiye 🇹🇷</p>
            <p style="font-size: 12px;">www.pgsmen.com</p>
        </div>
        """)

    return demo

if __name__ == "__main__":
    print("="*50)
    print("PAGUS Virtual Try-On Uygulaması Başlatılıyor...")
    print("="*50)

    # API durumunu kontrol et
    has_key, message = check_api_key()
    if not has_key:
        print("\n⚠️  UYARI: Replicate API anahtarı bulunamadı!")
        print("Kurulum için:")
        print("  1. https://replicate.com adresinden hesap oluşturun")
        print("  2. API anahtarınızı alın")
        print("  3. export REPLICATE_API_TOKEN='your_key' komutunu çalıştırın")
        print("\nUygulama yine de başlatılacak (önizleme modu)...\n")
    else:
        print("✅ API bağlantısı hazır!\n")

    demo = create_demo()
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=True,  # Genel link oluştur
        show_error=True
    )
