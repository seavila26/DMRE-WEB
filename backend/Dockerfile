# Dockerfile para Hugging Face Spaces
FROM python:3.11-slim

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY requirements.txt .

# Instalar dependencias del sistema necesarias para PyTorch y PIL
RUN apt-get update && apt-get install -y \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código de la aplicación
COPY ia_server.py .

# Pre-descargar el modelo de IA para acelerar el inicio
RUN python -c "from transformers import AutoImageProcessor, AutoModelForSemanticSegmentation; \
    AutoImageProcessor.from_pretrained('pamixsun/segformer_for_optic_disc_cup_segmentation'); \
    AutoModelForSemanticSegmentation.from_pretrained('pamixsun/segformer_for_optic_disc_cup_segmentation'); \
    print('✅ Modelo precargado exitosamente')"

# Exponer puerto (Hugging Face Spaces usa el puerto 7860 por defecto)
EXPOSE 7860

# Variables de entorno
ENV PORT=7860
ENV PYTHONUNBUFFERED=1

# Comando para iniciar la aplicación
CMD ["python", "-u", "ia_server.py"]
