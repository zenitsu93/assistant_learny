import os
from dotenv import load_dotenv
import base64
from PyPDF2 import PdfReader
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
import google.generativeai as genai
from PIL import Image
import io
import time


load_dotenv()
google_api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=google_api_key)

def extract_content_from_pdf(pdf_path):
    def extract_content_from_page(page):
        text = page.extract_text()
        images = page.images
        page_content = ""

        if text.strip():
            page_content += f"Texte extrait : {text}\n\n"

        for i, img in enumerate(images):
            image = Image.open(io.BytesIO(img.data))
            image_description = process_image_with_gemini(image)
            page_content += f"Description de l'image {i+1} : {image_description}\n\n"
            time.sleep(2)  # Attendre 2 secondes après chaque traitement d'image

        return page_content

    def process_image_with_gemini(image):
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content([
            "Décrivez en détail cette image, y compris tout texte visible, schémas, graphiques ou autres éléments visuels importants. Si c'est un schéma ou un graphique, expliquez ce qu'il représente.",
            image
        ])
        return response.text

    pdf = PdfReader(pdf_path)
    full_content = ""
    for i, page in enumerate(pdf.pages):
        full_content += f"--- Contenu de la page {i+1} ---\n"
        full_content += extract_content_from_page(page) + "\n\n"
        time.sleep(1)  # Attendre 1 seconde après chaque page

    return full_content


def rag_answer_question(doc_path, question):
    def initialize_vector_store(text):
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=50)
        texts = text_splitter.split_text(text)
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        vector_store = Chroma.from_texts(texts, embeddings)
        return vector_store

    document_text = extract_content_from_pdf(doc_path)
    vector_store = initialize_vector_store(document_text)

    prompt_template = """
    Utilisez les informations suivantes pour répondre à la question de l'utilisateur.
    Si vous ne pouvez pas répondre à la question en vous basant uniquement sur les informations fournies, dites "Je ne peux pas répondre à cette question avec les informations disponibles."
    
    Contexte : {context}
    
    Question : {question}
    
    Réponse :
    """

    prompt = PromptTemplate(template=prompt_template, input_variables=['context', 'question'])

    model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.4)

    qa_chain = RetrievalQA.from_chain_type(
        model,
        retriever=vector_store.as_retriever(search_kwargs={"k": 1}),
        chain_type="stuff",
        return_source_documents=True,
        chain_type_kwargs={"prompt": prompt}
    )

    response = qa_chain.invoke({"query": question})
    return response['result']

# Exemple d'utilisation
chemin_du_document = "context/Rapport de stage opérateur_2023_BADOLO Christian Thomas.pdf"
question = "Fait moi un résumé du document"
reponse = rag_answer_question(chemin_du_document, question)
print(reponse)