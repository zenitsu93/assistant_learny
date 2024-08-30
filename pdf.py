import os
from PyPDF2 import PdfReader
import google.generativeai as genai
from PIL import Image
import io

def extract_content_from_pdf(pdf_path):
    def extract_text_from_page(page):
        text = page.extract_text()
        if text.strip():
            return text
        else:
            # Si pas de texte, traiter toutes les images de la page
            images = page.images
            page_text = ""
            for img in images:
                image = Image.open(io.BytesIO(img.data))
                page_text += process_image_with_gemini(image) + "\n"
            return page_text

    def process_image_with_gemini(image):
        model = genai.GenerativeModel('gemini-pro-vision')
        response = model.generate_content(["Extraire et transcrire tout le texte visible dans cette image.", image])
        return response.text

    pdf = PdfReader(pdf_path)
    full_text = ""
    for i, page in enumerate(pdf.pages):
        page_content = extract_text_from_page(page)
        full_text += f"--- Page {i+1} ---\n{page_content}\n\n"

    # Enregistrer le texte extrait dans un fichier
    output_file = os.path.splitext(pdf_path)[0] + "_extracted_text.txt"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(full_text)

    print(f"Le texte extrait a été enregistré dans {output_file}")
    return full_text

a = extract_content_from_pdf("context/Cours de Maths 3ème Burkina Faso.pdf")