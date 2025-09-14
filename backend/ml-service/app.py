from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz
import io
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

BASE_DIR = r"C:\ss\project\JobNepal\backend\ml-service"
CV_FOLDER = os.path.join(BASE_DIR, "dataset", "resumes")

def extract_text(file_bytes):
    text = ""
    try:
        with fitz.open(stream=io.BytesIO(file_bytes), filetype="pdf") as pdf:
            for page in pdf:
                text += page.get_text()
    except Exception as e:
        print(f"[DEBUG] PDF extraction failed: {e}")
    return text

def load_genuine_cvs(folder):
    if not os.path.exists(folder):
        raise FileNotFoundError(f"Folder not found: {folder}")
    texts = []
    filenames = []
    for filename in os.listdir(folder):
        if filename.lower().endswith(".pdf"):
            path = os.path.join(folder, filename)
            try:
                with open(path, "rb") as f:
                    text = extract_text(f.read())
                    if text.strip():
                        texts.append(text)
                        filenames.append(filename)
            except Exception as e:
                print(f"[DEBUG] Failed to read {filename}: {e}")
    if not texts:
        raise ValueError(f"No valid PDFs found in folder: {folder}")
    return texts, filenames

app = Flask(__name__)
CORS(app)

genuine_texts, genuine_filenames = load_genuine_cvs(CV_FOLDER)
vectorizer = TfidfVectorizer()
genuine_vectors = vectorizer.fit_transform(genuine_texts)

@app.route("/validate-cv", methods=["POST"])
def validate_cv():
    try:
        if "file" not in request.files:
            return jsonify({"is_valid": False, "message": "No file uploaded"}), 400
        file = request.files["file"]
        if not file.filename.lower().endswith(".pdf"):
            return jsonify({"is_valid": False, "message": "Only PDF files are supported"}), 400
        file_bytes = file.read()
        text = extract_text(file_bytes)
        if not text.strip():
            return jsonify({"is_valid": False, "message": "PDF contains no readable text"}), 400
        uploaded_vec = vectorizer.transform([text])
        similarities = cosine_similarity(uploaded_vec, genuine_vectors)[0]
        max_similarity = float(similarities.max())
        matched_index = int(similarities.argmax()) if max_similarity > 0 else None
        THRESHOLD = 0.5
        is_cv = bool(max_similarity >= THRESHOLD)
        matched_cv = genuine_filenames[matched_index] if is_cv else None
        response = {
            "is_valid": is_cv,
            "max_similarity": round(max_similarity, 2),
            "matched_cv": matched_cv,
            "message": "Genuine CV detected" if is_cv else "Not a genuine CV"
        }
        print(f"[DEBUG] Response: {response}")
        return jsonify(response)
    except Exception as e:
        print(f"[DEBUG] Exception in validate_cv: {e}")
        return jsonify({"is_valid": False, "message": f"Server error: {e}"}), 500

if __name__ == "__main__":
    print(f"[DEBUG] Starting Flask server on 127.0.0.1:5001")
    print(f"[DEBUG] Genuine CV folder: {CV_FOLDER}")
    app.run(debug=True, host="127.0.0.1", port=5001)
