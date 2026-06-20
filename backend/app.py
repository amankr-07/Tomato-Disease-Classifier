import os
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

app = FastAPI(title="Tomato Disease Classifier")

CLASS_NAMES = [
    "Bacterial Spot",
    "Early Blight",
    "Late Blight",
    "Leaf Mold",
    "Septoria Leaf Spot",
    "Spider Mites",
    "Target Spot",
    "Yellow Leaf Curl Virus",
    "Tomato Mosaic Virus",
    "Healthy"
]

IMAGE_SIZE = 256

model = None

@app.on_event("startup")
def load_model():
    global model
    model_path = os.path.join(os.path.dirname(__file__), "../saved_models/best_model.h5")
    try:
        model = tf.keras.models.load_model(model_path, compile=False)
        print(f"Model loaded successfully from {model_path}")
    except Exception as e:
        print(f"Error loading model: {e}")
        raise

origins = [
    "http://localhost:5000",
    "http://localhost:3000",
    "http://127.0.0.1:5000",
    "https://vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin if not origin.endswith("vercel.app") else "*" for origin in origins] + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        image = image.resize((IMAGE_SIZE, IMAGE_SIZE))

        image_array = np.array(image, dtype=np.float32)
        image_array = np.expand_dims(image_array, axis=0)

        predictions = model.predict(image_array, verbose=0)
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0])) * 100

        return {
            "class": CLASS_NAMES[predicted_class_idx],
            "confidence": round(confidence, 2),
            "all_predictions": {
                CLASS_NAMES[i]: round(float(predictions[0][i]) * 100, 2)
                for i in range(len(CLASS_NAMES))
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.get("/")
def root():
    return {"message": "Tomato Disease Classifier API", "docs": "/docs"}
