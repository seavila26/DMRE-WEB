# 🚀 Guía de Despliegue en Render - Backend IA DMRE

## Guía Completa para Desplegar el Servidor de IA en Render.com

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Preparación del Código](#preparación-del-código)
3. [Crear Cuenta en Render](#crear-cuenta-en-render)
4. [Método 1: Despliegue Automático (Recomendado)](#método-1-despliegue-automático)
5. [Método 2: Despliegue Manual](#método-2-despliegue-manual)
6. [Configuración del Servicio](#configuración-del-servicio)
7. [Variables de Entorno](#variables-de-entorno)
8. [Verificar el Despliegue](#verificar-el-despliegue)
9. [Conectar Frontend con Backend](#conectar-frontend-con-backend)
10. [Monitoreo y Logs](#monitoreo-y-logs)
11. [Solución de Problemas](#solución-de-problemas)
12. [Limitaciones del Plan Gratuito](#limitaciones-del-plan-gratuito)
13. [Actualizar el Servicio](#actualizar-el-servicio)

---

## 1. Requisitos Previos

### ✅ Cuentas Necesarias:
- [x] Cuenta de **GitHub** (para alojar el código)
- [x] Cuenta de **Render** (gratis en render.com)

### ✅ Archivos Preparados:
- [x] `ia_server.py` (modificado para usar PORT env)
- [x] `requirements.txt` (con gunicorn)
- [x] `start.sh` (script de inicio)
- [x] `render.yaml` (configuración opcional)

---

## 2. Preparación del Código

### Paso 1: Verificar Archivos

Asegúrate de tener estos archivos en `/backend/`:

```
backend/
├── ia_server.py         ✅ (modificado con PORT env)
├── requirements.txt     ✅ (con gunicorn)
├── start.sh            ✅ (script de inicio)
├── render.yaml         ✅ (configuración de Render)
├── README.md
└── .gitignore
```

### Paso 2: Hacer los Archivos Ejecutables

```bash
cd backend
chmod +x start.sh
```

### Paso 3: Subir a GitHub

Si aún no has subido el código a GitHub:

```bash
# Desde la raíz del proyecto
git add backend/
git commit -m "feat: Preparar backend para despliegue en Render"
git push origin main
```

O push a tu branch actual:

```bash
git push origin claude/add-ia-model-tab-011CUdn99hgJeap7FRXXnDH7
```

---

## 3. Crear Cuenta en Render

### Paso 1: Registrarse

1. Ve a https://render.com
2. Click en **"Get Started for Free"**
3. Regístrate con:
   - 📧 Email
   - 🔗 GitHub (Recomendado)
   - 🔗 GitLab

**Recomendación:** Usa GitHub para conexión automática con tu repositorio.

### Paso 2: Verificar Email

1. Revisa tu email
2. Click en el enlace de verificación
3. Completa tu perfil

---

## 4. Método 1: Despliegue Automático (Recomendado)

### Paso 1: Conectar GitHub

1. En el **Dashboard de Render**, click en **"New +"**
2. Selecciona **"Web Service"**
3. Click en **"Connect a repository"**
4. Autoriza Render para acceder a tu GitHub
5. Selecciona el repositorio **DMRE-WEB**

### Paso 2: Configurar el Servicio

Completa el formulario:

```
┌─────────────────────────────────────────────────┐
│  Nombre del Servicio                            │
│  dmre-ia-backend                                │
├─────────────────────────────────────────────────┤
│  Region                                         │
│  [ ] Frankfurt (Europe)  ← Recomendado         │
│  [ ] Oregon (US)                                │
│  [ ] Singapore (Asia)                           │
├─────────────────────────────────────────────────┤
│  Branch                                         │
│  main  (o tu branch actual)                     │
├─────────────────────────────────────────────────┤
│  Root Directory                                 │
│  backend                                        │
├─────────────────────────────────────────────────┤
│  Runtime                                        │
│  Python 3                                       │
├─────────────────────────────────────────────────┤
│  Build Command                                  │
│  pip install -r requirements.txt                │
├─────────────────────────────────────────────────┤
│  Start Command                                  │
│  bash start.sh                                  │
└─────────────────────────────────────────────────┘
```

### Paso 3: Seleccionar Plan

```
┌─────────────────────────────────────────────────┐
│  Instance Type                                  │
│                                                 │
│  ⚪ Starter ($7/month)                          │
│  🔵 Free Plan                     ← Selecciona │
│     - 512 MB RAM                                │
│     - Se apaga tras inactividad                 │
│     - Arranque lento (~2 min)                   │
└─────────────────────────────────────────────────┘
```

⚠️ **IMPORTANTE:** El plan gratuito tiene limitaciones (ver sección 12).

### Paso 4: Variables de Entorno (Opcional)

Scroll hacia abajo y click en **"Advanced"**:

```
┌─────────────────────────────────────────────────┐
│  Environment Variables                          │
│                                                 │
│  Key: PYTHON_VERSION                            │
│  Value: 3.11.0                                  │
│                                                 │
│  [+ Add Environment Variable]                   │
└─────────────────────────────────────────────────┘
```

### Paso 5: Crear el Servicio

1. Click en **"Create Web Service"**
2. ⏳ Render comenzará a construir tu aplicación
3. 📦 Esto tomará **10-15 minutos** la primera vez

### Proceso de Despliegue:

```
1. Clonando repositorio...           ✅
2. Instalando dependencias...        ⏳ (5-7 min)
   - Flask
   - PyTorch (grande ~500MB)
   - Transformers
   - Otros...
3. Descargando modelo IA...          ⏳ (3-5 min)
   - Segformer model (~1.5GB)
4. Iniciando servidor...             ⏳ (1-2 min)
5. ¡Live! 🎉                         ✅
```

---

## 5. Método 2: Despliegue Manual

Si prefieres no conectar GitHub:

### Paso 1: Crear Web Service

1. Dashboard → **"New +"** → **"Web Service"**
2. En "Public Git repository", pega la URL de tu repo:
   ```
   https://github.com/tu-usuario/DMRE-WEB
   ```

### Paso 2: Seguir los mismos pasos del Método 1

Completa la configuración como se indica arriba.

---

## 6. Configuración del Servicio

### Configuración Avanzada (Opcional)

```
┌─────────────────────────────────────────────────┐
│  Auto-Deploy                                    │
│  🔵 Yes  ⚪ No                                  │
│                                                 │
│  ✅ Habilitar para despliegue automático        │
│     cada vez que hagas push a GitHub            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Health Check Path                              │
│  /                                              │
│                                                 │
│  Render verificará esta ruta para asegurar      │
│  que el servicio está funcionando               │
└─────────────────────────────────────────────────┘
```

---

## 7. Variables de Entorno

### Variables Importantes:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `PORT` | (Auto) | Render lo asigna automáticamente |
| `PYTHON_VERSION` | 3.11.0 | Versión de Python |

### Cómo Agregar Variables:

1. En tu servicio, ve a **"Environment"** (menú lateral)
2. Click en **"Add Environment Variable"**
3. Ingresa `Key` y `Value`
4. Click en **"Save Changes"**

⚠️ **Nota:** Cambiar variables reinicia el servicio.

---

## 8. Verificar el Despliegue

### Paso 1: Obtener la URL

Una vez desplegado, Render te dará una URL como:

```
https://dmre-ia-backend.onrender.com
```

### Paso 2: Probar el Servicio

**Método 1: Navegador**

Abre en tu navegador:
```
https://dmre-ia-backend.onrender.com/
```

Deberías ver:
```json
{
  "status": "ok",
  "service": "DMRE IA Server",
  "version": "2.0",
  "endpoints": ["/segmentar", "/segmentar-url"]
}
```

**Método 2: cURL**

```bash
curl https://dmre-ia-backend.onrender.com/
```

**Método 3: Probar Endpoint de Segmentación**

```bash
curl -X POST \
  -F "imagen=@test-image.jpg" \
  https://dmre-ia-backend.onrender.com/segmentar \
  --output result.png
```

---

## 9. Conectar Frontend con Backend

### Actualizar URL del Backend en el Frontend

#### Opción 1: Variable de Entorno (Recomendado)

En tu proyecto frontend, crea un archivo `.env`:

```env
# .env (frontend)
VITE_API_URL=https://dmre-ia-backend.onrender.com
```

En tu código React:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Usar en llamadas al API
const response = await fetch(`${API_URL}/segmentar-url`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ url: imageUrl })
});
```

#### Opción 2: Configuración Directa

Si tienes un archivo de configuración (ej: `src/config.js`):

```javascript
// src/config.js
const config = {
  API_URL: process.env.NODE_ENV === 'production'
    ? 'https://dmre-ia-backend.onrender.com'
    : 'http://localhost:5001'
};

export default config;
```

### CORS

El backend ya tiene CORS habilitado para permitir todas las origines:

```python
CORS(app)  # Permite todas las origenes
```

Para mayor seguridad en producción, puedes especificar solo tu frontend:

```python
# En ia_server.py
CORS(app, origins=[
    "http://localhost:5173",              # Dev local
    "https://tu-frontend.firebaseapp.com" # Producción
])
```

---

## 10. Monitoreo y Logs

### Ver Logs en Tiempo Real

1. En Render Dashboard, selecciona tu servicio
2. Click en **"Logs"** en el menú lateral
3. Verás logs en tiempo real:

```
[INFO] 🚀 Iniciando servidor IA para DMRE...
[INFO] 📦 Verificando modelo de IA...
[INFO] ✅ Modelo listo
[INFO] 🌐 Iniciando servidor con Gunicorn...
[INFO] Listening at: http://0.0.0.0:10000
```

### Métricas

1. Click en **"Metrics"** para ver:
   - 📊 Uso de CPU
   - 💾 Uso de memoria
   - 🌐 Requests por segundo
   - ⏱️ Tiempo de respuesta

---

## 11. Solución de Problemas

### ❌ Error: Build Failed

**Causa:** Problemas instalando dependencias

**Solución:**

1. Revisa los logs de build
2. Verifica que `requirements.txt` sea correcto
3. Asegúrate de que el directorio raíz sea `backend`

### ❌ Error: Application failed to respond

**Causa:** El servidor no inició correctamente

**Solución:**

1. Verifica los logs
2. Asegúrate de que `start.sh` tenga permisos de ejecución
3. Verifica que `PORT` esté configurado correctamente

### ❌ Error: Out of Memory

**Causa:** El modelo de IA es muy grande para el plan gratuito (512 MB RAM)

**Solución:**

**Opción 1:** Upgrade al plan Starter ($7/mes) con 512 MB → 2 GB RAM

**Opción 2:** Optimizar el modelo

Modifica `ia_server.py` para cargar el modelo de forma más eficiente:

```python
import torch
import gc

# Forzar uso de CPU (no GPU)
model = AutoModelForSemanticSegmentation.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float16  # Usar float16 en vez de float32
)

# Limpiar memoria
gc.collect()
```

**Opción 3:** Usar un modelo más pequeño

### ❌ Error: Servicio muy lento

**Causa:** Plan gratuito se apaga tras 15 minutos de inactividad

**Solución:**

1. **Espera ~2 minutos** al primer request (cold start)
2. Considera upgrade al plan Starter (siempre activo)
3. Usa un servicio de "keep-alive" (ping cada 10 min)

### ❌ Error: CORS

**Causa:** Frontend no puede acceder al backend

**Solución:**

Verifica que CORS esté habilitado en `ia_server.py`:

```python
from flask_cors import CORS
CORS(app)
```

---

## 12. Limitaciones del Plan Gratuito

### ⚠️ Restricciones:

| Limitación | Descripción | Impacto |
|------------|-------------|---------|
| **RAM** | 512 MB | Puede ser insuficiente para modelo IA grande |
| **Inactividad** | Se apaga tras 15 min sin uso | Cold start de ~2 min al siguiente request |
| **CPU** | Compartida | Procesamiento más lento |
| **Almacenamiento** | Efímero | El modelo se descarga en cada deploy |
| **Build time** | 15 min max | Suficiente para este proyecto |

### 💰 Plan Starter ($7/mes):

- ✅ 2 GB RAM (suficiente para el modelo)
- ✅ Siempre activo (sin cold starts)
- ✅ CPU dedicada
- ✅ Mejor rendimiento

### 🎯 Recomendación:

- **Desarrollo/Testing:** Plan gratuito es suficiente
- **Producción:** Plan Starter recomendado

---

## 13. Actualizar el Servicio

### Método 1: Auto-Deploy (Si está habilitado)

1. Haz cambios en tu código local
2. Commit y push a GitHub:
   ```bash
   git add backend/
   git commit -m "feat: Mejoras en el backend"
   git push origin main
   ```
3. Render detectará el cambio y redesplegará automáticamente
4. ⏳ Espera 5-10 minutos

### Método 2: Manual Deploy

1. En Render Dashboard, selecciona tu servicio
2. Click en **"Manual Deploy"** → **"Deploy latest commit"**
3. Render construirá y desplegará nuevamente

### Método 3: Rollback

Si algo sale mal:

1. En Render Dashboard, ve a **"Events"**
2. Encuentra un deploy anterior exitoso
3. Click en **"Rollback"**

---

## 🎯 Checklist de Despliegue

Antes de desplegar, verifica:

- [ ] ✅ `ia_server.py` usa `PORT` de variables de entorno
- [ ] ✅ `requirements.txt` incluye `gunicorn`
- [ ] ✅ `start.sh` existe y tiene permisos de ejecución
- [ ] ✅ Código subido a GitHub
- [ ] ✅ Cuenta de Render creada
- [ ] ✅ Servicio creado en Render
- [ ] ✅ Root directory configurado como `backend`
- [ ] ✅ Build command: `pip install -r requirements.txt`
- [ ] ✅ Start command: `bash start.sh`
- [ ] ✅ Health check configurado en `/`

Después del despliegue:

- [ ] ✅ Servicio desplegado sin errores
- [ ] ✅ Health check responde correctamente
- [ ] ✅ Endpoint `/segmentar` funciona
- [ ] ✅ Frontend actualizado con nueva URL
- [ ] ✅ CORS funcionando correctamente

---

## 📞 Soporte

### Recursos de Render:

- 📖 **Documentación:** https://render.com/docs
- 💬 **Community:** https://community.render.com
- 📧 **Email:** support@render.com

### Recursos del Proyecto:

- 📖 Ver `README.md` para documentación del backend
- 🏗️ Ver `ESTRUCTURA_PROYECTO.md` para estructura completa
- 🔒 Ver `SECURITY_RULES_README.md` para seguridad

---

## 📝 Notas Finales

### Primera Vez:

⏳ El primer despliegue tomará **10-15 minutos**:
- Instalación de dependencias (5-7 min)
- Descarga del modelo IA (3-5 min)
- Inicio del servidor (1-2 min)

### Despliegues Subsecuentes:

⏳ Toman **5-10 minutos** (dependencias ya cacheadas)

### Cold Starts (Plan Gratuito):

⏳ Después de 15 min de inactividad, el primer request tomará **~2 minutos**

---

## 🎉 ¡Listo!

Tu backend de IA para DMRE está ahora desplegado en Render y accesible desde cualquier lugar del mundo.

**URL de ejemplo:**
```
https://dmre-ia-backend.onrender.com
```

**Endpoints disponibles:**
- `GET  /` - Health check
- `POST /segmentar` - Segmentar imagen subida
- `POST /segmentar-url` - Segmentar imagen por URL

---

**Última actualización:** Enero 2025
**Versión:** 2.0
**Autor:** Equipo DMRE-WEB
