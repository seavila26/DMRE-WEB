---
title: DMRE IA Backend
emoji: 👁️
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
license: mit
app_port: 7860
---

# DMRE IA Backend - Análisis de Fondo de Ojo

Backend del sistema DMRE (Detección de Maculopatías y Retinopatías en el Ojo) que proporciona análisis de imágenes de fondo de ojo mediante inteligencia artificial.

## 🧠 Modelo de IA

- **Modelo**: Segformer para segmentación de disco óptico y copa óptica
- **Proveedor**: `pamixsun/segformer_for_optic_disc_cup_segmentation`
- **Framework**: PyTorch + Transformers

## 📡 API Endpoints

### 1. Health Check - `GET /`

Verifica el estado del servidor.

**Response:**
```json
{
  "status": "ok",
  "service": "DMRE IA Server",
  "version": "2.0",
  "endpoints": ["/segmentar", "/segmentar-url"]
}
```

### 2. Segmentar Imagen - `POST /segmentar`

Procesa una imagen subida directamente.

**Request:**
```bash
curl -X POST \
  -F "imagen=@path/to/image.jpg" \
  https://YOUR-SPACE.hf.space/segmentar
```

**Response:** Imagen PNG con segmentación aplicada (disco óptico en amarillo, copa óptica en rojo)

### 3. Segmentar desde URL - `POST /segmentar-url`

Procesa una imagen desde una URL (evita problemas de CORS).

**Request:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/image.jpg"}' \
  https://YOUR-SPACE.hf.space/segmentar-url
```

**Response:** Imagen PNG con segmentación aplicada

## 🎨 Interpretación de Colores

- **Amarillo**: Disco óptico (área más grande)
- **Rojo**: Copa óptica (área central)

Estos dos elementos son fundamentales para el diagnóstico de glaucoma y otras patologías del nervio óptico.

## 🔒 CORS

El servidor tiene CORS habilitado para permitir conexiones desde cualquier origen, facilitando la integración con el frontend.

## 📦 Tecnologías

- **Flask**: Framework web para Python
- **PyTorch**: Framework de deep learning
- **Transformers**: Biblioteca de Hugging Face para modelos pre-entrenados
- **Pillow**: Procesamiento de imágenes
- **Docker**: Contenedor para despliegue

## 🚀 Uso

Este backend está diseñado para ser consumido por la aplicación web DMRE, que proporciona una interfaz médica completa para:
- Gestión de pacientes
- Registro de visitas médicas
- Análisis de imágenes de fondo de ojo con IA
- Seguimiento temporal de enfermedades retinianas
- Anotaciones médicas sobre hallazgos

## 📝 Licencia

MIT License - Universidad De La Salle
