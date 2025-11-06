#!/bin/bash

# Script de inicio para Render
echo "🚀 Iniciando servidor IA para DMRE..."

# Descargar modelo si no existe (primera vez)
echo "📦 Verificando modelo de IA..."
python -c "from transformers import AutoImageProcessor, AutoModelForSemanticSegmentation; AutoImageProcessor.from_pretrained('pamixsun/segformer_for_optic_disc_cup_segmentation'); AutoModelForSemanticSegmentation.from_pretrained('pamixsun/segformer_for_optic_disc_cup_segmentation'); print('✅ Modelo listo')"

# Iniciar servidor con Gunicorn
echo "🌐 Iniciando servidor con Gunicorn..."
gunicorn --bind 0.0.0.0:$PORT --workers 2 --timeout 120 ia_server:app
