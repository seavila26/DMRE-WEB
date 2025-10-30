from flask import Flask, request, jsonify
from io import BytesIO
from PIL import Image
import base64
import torch
import numpy as np
from transformers import AutoImageProcessor, AutoModelForSemanticSegmentation
from flask_cors import CORS

# ------------------------------
# CONFIGURACIÓN DEL MODELO
# ------------------------------
MODEL_NAME = "pamixsun/segformer_for_optic_disc_cup_segmentation"
processor = AutoImageProcessor.from_pretrained(MODEL_NAME)
model = AutoModelForSemanticSegmentation.from_pretrained(MODEL_NAME)

app = Flask(__name__)
CORS(app)  # permitir conexión desde tu frontend React

# ------------------------------
# FUNCIÓN DE SEGMENTACIÓN
# ------------------------------
def segmentar_fondo_ojo(image):
    image = image.convert("RGB")
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    upsampled_logits = torch.nn.functional.interpolate(
        logits, size=image.size[::-1], mode="bilinear", align_corners=False
    )
    pred_seg = upsampled_logits.argmax(dim=1)[0].cpu().numpy()

    colores = np.zeros((*pred_seg.shape, 3), dtype=np.uint8)
    colores[pred_seg == 1] = [255, 255, 0]  # Disco óptico
    colores[pred_seg == 2] = [255, 0, 0]    # Copa óptica

    overlay = np.array(image) * 0.6 + colores * 0.4
    overlay = overlay.astype(np.uint8)

    return Image.fromarray(overlay)

# ------------------------------
# ENDPOINT IA
# ------------------------------
@app.route("/api/segmentar", methods=["POST"])
def segmentar():
    if "imagen" not in request.files:
        return jsonify({"error": "No se envió ninguna imagen"}), 400

    file = request.files["imagen"]
    image = Image.open(file.stream)
    result_img = segmentar_fondo_ojo(image)

    # Convertir resultado a base64
    buffer = BytesIO()
    result_img.save(buffer, format="JPEG")
    base64_img = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return jsonify({"segmentada": base64_img})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
