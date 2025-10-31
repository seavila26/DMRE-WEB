# Backend - Servidor IA

Backend del sistema DMRE que proporciona análisis de imágenes de fondo de ojo mediante inteligencia artificial.

## 🧠 Modelo de IA

- **Modelo**: Segformer para segmentación de disco óptico y copa óptica
- **Proveedor**: `pamixsun/segformer_for_optic_disc_cup_segmentation`
- **Framework**: PyTorch + Transformers

## 📋 Requisitos

- Python 3.8 o superior
- pip

## 🚀 Instalación

1. **Navegar al directorio del backend:**
   ```bash
   cd backend
   ```

2. **Crear un entorno virtual (recomendado):**
   ```bash
   python -m venv venv

   # Activar en Linux/Mac:
   source venv/bin/activate

   # Activar en Windows:
   venv\Scripts\activate
   ```

3. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

   **Nota:** La primera vez, se descargarán automáticamente los pesos del modelo (aproximadamente 1.5 GB).

## ▶️ Ejecución

```bash
python ia_server.py
```

El servidor se iniciará en:
- **URL**: `http://0.0.0.0:5001`
- **Accesible desde**: `http://localhost:5001` o `http://192.168.x.x:5001`

## 📡 API Endpoints

### 1. `/segmentar` (POST)

Procesa una imagen subida directamente.

**Request:**
```bash
curl -X POST \
  -F "imagen=@path/to/image.jpg" \
  http://localhost:5001/segmentar
```

**Response:** Imagen PNG con segmentación aplicada

---

### 2. `/segmentar-url` (POST)

Procesa una imagen desde una URL (evita problemas de CORS).

**Request:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/image.jpg"}' \
  http://localhost:5001/segmentar-url
```

**Response:** Imagen PNG con segmentación aplicada

## 🔧 Configuración

### Cambiar Puerto

Editar en `ia_server.py`:
```python
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)  # Cambiar 5001 por el puerto deseado
```

### CORS

El servidor tiene CORS habilitado para permitir conexiones desde el frontend React:
```python
CORS(app)  # Permite todas las origenes
```

Para mayor seguridad en producción, especificar orígenes permitidos:
```python
CORS(app, origins=["http://localhost:5173", "https://tu-dominio.com"])
```

## 🧪 Testing

Probar que el servidor funciona correctamente:

```bash
# Método 1: Navegador
# Abrir: http://localhost:5001

# Método 2: curl (debe devolver error porque no hay imagen)
curl http://localhost:5001/segmentar
```

## 📦 Dependencias Principales

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| Flask | 3.0.0 | Framework web |
| flask-cors | 4.0.0 | Manejo de CORS |
| torch | 2.1.1 | Framework de deep learning |
| transformers | 4.36.0 | Modelos pre-entrenados |
| Pillow | 10.1.0 | Procesamiento de imágenes |
| numpy | 1.26.2 | Operaciones numéricas |
| requests | 2.31.0 | Descarga de imágenes por URL |

## 🐛 Troubleshooting

### Error: Puerto 5001 en uso

```bash
# Linux/Mac: Matar proceso en puerto 5001
sudo lsof -t -i:5001 | xargs kill -9

# Windows:
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

### Error: Modelo no se descarga

Verificar conexión a internet. El modelo se descarga automáticamente desde HuggingFace en el primer uso.

### Error: CUDA out of memory

Si se ejecuta en GPU y hay problemas de memoria, forzar uso de CPU:
```python
# En ia_server.py, agregar al inicio:
import os
os.environ['CUDA_VISIBLE_DEVICES'] = ''
```

## 📝 Notas

- Primera ejecución: Toma más tiempo por descarga del modelo
- Ejecuciones subsecuentes: Inicio rápido (modelo en caché)
- Recomendado: Usar GPU para mejor rendimiento (opcional)
