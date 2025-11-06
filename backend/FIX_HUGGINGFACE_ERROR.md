# 🚨 SOLUCIÓN RÁPIDA - Error de Configuración en Hugging Face

## El Problema
Hugging Face requiere que el archivo se llame **exactamente** `README.md` (no `README_SPACES.md`) y tenga el header YAML correcto al inicio.

---

## ✅ SOLUCIÓN: Copiar y pegar esto en tu Space

Cuando crees el archivo en Hugging Face, debe llamarse **`README.md`** y tener este contenido exacto:

```markdown
---
title: DMRE IA Backend
emoji: 👁️
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
pinned: false
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
```

---

## 📝 Pasos Corregidos:

### **1. En Hugging Face Space:**

1. **Elimina** el README.md si ya existe (si lo subiste mal)
2. Clic en **"+ Add file"** → **"Create a new file"**
3. Nombre del archivo: **`README.md`** (exactamente así)
4. **Copia y pega** todo el contenido de arriba (incluyendo el header YAML)
5. Clic en **"Commit new file to main"**

### **2. Luego sube estos archivos:**

**Archivo 1: Dockerfile**
```dockerfile
# Copiar contenido de backend/Dockerfile
```

**Archivo 2: ia_server.py**
```python
# Copiar contenido de backend/ia_server.py
```

**Archivo 3: requirements.txt**
```
# Copiar contenido de backend/requirements.txt
```

---

## ⚠️ IMPORTANTE

El header YAML (las líneas entre `---`) debe estar **al inicio del archivo** sin ningún espacio o línea antes.

Debe verse exactamente así:
```
---
title: DMRE IA Backend
emoji: 👁️
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
pinned: false
---
```

Sin espacios antes de los `---` y cada campo en una línea separada.

---

## 🎯 Orden de creación de archivos:

1. ✅ **README.md** (con el header YAML correcto)
2. ✅ **Dockerfile**
3. ✅ **ia_server.py**
4. ✅ **requirements.txt**

Una vez que tengas los 4 archivos, Hugging Face iniciará el build automáticamente.

---

¿Necesitas que te copie el contenido de algún archivo específico para que lo pegues directamente?
