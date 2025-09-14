import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import FeatureUnion
from sklearn.base import BaseEstimator, TransformerMixin
import pandas as pd
import os
import fitz  # PyMuPDF

# === Custom keyword transformer ===
class KeywordFeature(BaseEstimator, TransformerMixin):
    CV_KEYWORDS = ["resume", "curriculum vitae", "experience", "education",
                   "skills", "projects", "objective", "certification",
                   "contact", "work experience"]

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        features = []
        for text in X:
            found = any(k in text.lower() for k in self.CV_KEYWORDS)
            features.append([int(found)])
        return np.array(features, dtype=int)

# === Optional: Extract text from PDFs ===
def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            text += page.get_text()
    except Exception as e:
        print(f"[ERROR] Failed to read {pdf_path}: {e}")
    return text

# === Load dataset ===
use_pdf_dataset = False  # Set True if your dataset is PDF folders

if use_pdf_dataset:
    data, labels = [], []
    for filename in os.listdir("dataset/cv"):
        if filename.endswith(".pdf"):
            data.append(extract_text_from_pdf(os.path.join("dataset/cv", filename)))
            labels.append(1)
    for filename in os.listdir("dataset/non_cv"):
        if filename.endswith(".pdf"):
            data.append(extract_text_from_pdf(os.path.join("dataset/non_cv", filename)))
            labels.append(0)
    train_texts, train_labels = data, labels
else:
    # Load CSV dataset
    df = pd.read_csv("dataset.csv")  # Replace with your dataset path
    train_texts = df["text"].tolist()
    train_labels = df["label"].tolist()

print(f"[DEBUG] Loaded {len(train_texts)} samples")

# === Count keyword matches for debug ===
keyword_count = sum(KeywordFeature().transform([t])[0][0] for t in train_texts)
print(f"[DEBUG] Samples containing CV keywords: {keyword_count}/{len(train_texts)}")

# === Build feature extractor ===
vectorizer = FeatureUnion([
    ("tfidf", TfidfVectorizer(max_features=5000, stop_words="english")),
    ("keywords", KeywordFeature())
])

print("[DEBUG] Extracting features...")
X_features = vectorizer.fit_transform(train_texts)
print(f"[DEBUG] Feature matrix shape: {X_features.shape}")

# === Train model ===
model = LogisticRegression(max_iter=500)
model.fit(X_features, train_labels)
print("[DEBUG] Model trained successfully!")

# === Save model & vectorizer ===
joblib.dump(model, "resume_classifier.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")
print("Model and vectorizer saved as 'resume_classifier.pkl' and 'vectorizer.pkl'!")
