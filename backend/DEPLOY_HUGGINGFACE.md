# 🚀 Guía de Despliegue en Hugging Face Spaces

Esta guía te ayudará a desplegar el backend de IA en Hugging Face Spaces, una plataforma gratuita diseñada específicamente para aplicaciones de Machine Learning.

## ✅ Ventajas de Hugging Face Spaces

- ✅ **16 GB RAM gratuita** - Suficiente para tu modelo de IA
- ✅ **Sin límite de tiempo de ejecución** - Servidor siempre activo
- ✅ **Optimizado para ML** - Diseñado para PyTorch y Transformers
- ✅ **HTTPS incluido** - Certificado SSL automático
- ✅ **Dominio personalizado disponible** - Puedes conectar tu dominio
- ✅ **100% gratuito** para modelos públicos

---

## 📋 Requisitos Previos

1. **Cuenta en Hugging Face**
   - Crea una cuenta gratuita en: https://huggingface.co/join
   - Verifica tu email

2. **Archivos necesarios** (ya creados en este proyecto):
   - ✅ `Dockerfile` - Configuración del contenedor
   - ✅ `README_SPACES.md` - Configuración del Space
   - ✅ `ia_server.py` - Código del servidor
   - ✅ `requirements.txt` - Dependencias Python

---

## 🎯 Paso 1: Crear un Nuevo Space

1. **Accede a Hugging Face**
   - Ve a: https://huggingface.co/spaces
   - Haz clic en **"Create new Space"**

2. **Configurar el Space**
   ```
   Owner:        [tu-usuario]
   Space name:   dmre-ia-backend
   License:      MIT
   SDK:          Docker          ⬅️ MUY IMPORTANTE
   Hardware:     CPU basic (free) ⬅️ Suficiente para tu modelo
   ```

3. **Hacer el Space público o privado**
   - **Público**: Recomendado, es gratuito y sin límites
   - **Privado**: Solo si necesitas restringir acceso (requiere plan Pro)

4. **Clic en "Create Space"**

---

## 📤 Paso 2: Subir los Archivos

Tienes dos opciones para subir los archivos:

### **Opción A: Interfaz Web (Más Fácil)**

1. **En la página de tu Space**, verás una interfaz para subir archivos

2. **Subir archivos uno por uno**:

   **Archivo 1: README.md**
   - Clic en **"+ Add file"** → **"Create a new file"**
   - Nombre: `README.md`
   - Copiar contenido de: `backend/README_SPACES.md`
   - Clic en **"Commit new file to main"**

   **Archivo 2: Dockerfile**
   - Clic en **"+ Add file"** → **"Create a new file"**
   - Nombre: `Dockerfile`
   - Copiar contenido de: `backend/Dockerfile`
   - Clic en **"Commit new file to main"**

   **Archivo 3: ia_server.py**
   - Clic en **"+ Add file"** → **"Create a new file"**
   - Nombre: `ia_server.py`
   - Copiar contenido de: `backend/ia_server.py`
   - Clic en **"Commit new file to main"**

   **Archivo 4: requirements.txt**
   - Clic en **"+ Add file"** → **"Create a new file"**
   - Nombre: `requirements.txt`
   - Copiar contenido de: `backend/requirements.txt`
   - Clic en **"Commit new file to main"**

### **Opción B: Git CLI (Avanzado)**

```bash
# Clonar el repositorio del Space
git clone https://huggingface.co/spaces/[tu-usuario]/dmre-ia-backend
cd dmre-ia-backend

# Copiar archivos necesarios
cp /ruta/a/DMRE-WEB/backend/Dockerfile .
cp /ruta/a/DMRE-WEB/backend/README_SPACES.md README.md
cp /ruta/a/DMRE-WEB/backend/ia_server.py .
cp /ruta/a/DMRE-WEB/backend/requirements.txt .

# Commit y push
git add .
git commit -m "Initial deployment of DMRE IA backend"
git push
```

---

## ⏳ Paso 3: Esperar el Build

1. **El Space iniciará el build automáticamente**
   - Verás logs en tiempo real en la página del Space
   - El proceso toma aproximadamente **10-15 minutos** la primera vez

2. **Proceso del build**:
   ```
   📦 Building Docker image...
   ⬇️  Installing Python dependencies...
   🧠 Pre-downloading AI model (~400 MB)...
   ✅ Build successful!
   🚀 Starting server...
   ```

3. **Estado del Space**:
   - 🟡 **Building**: En construcción
   - 🟢 **Running**: ¡Listo para usar!
   - 🔴 **Error**: Revisa los logs (ver sección Troubleshooting)

---

## 🧪 Paso 4: Probar el Backend

Una vez que el Space esté **Running** (🟢), tu backend estará disponible en:

```
https://[tu-usuario]-dmre-ia-backend.hf.space
```

### **Test 1: Health Check**

Abre en el navegador:
```
https://[tu-usuario]-dmre-ia-backend.hf.space/
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

### **Test 2: Probar Segmentación con curl**

```bash
# Probar con una imagen local
curl -X POST \
  -F "imagen=@imagen_fondo_ojo.jpg" \
  https://[tu-usuario]-dmre-ia-backend.hf.space/segmentar \
  --output resultado.png

# Probar con URL
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/fondo_ojo.jpg"}' \
  https://[tu-usuario]-dmre-ia-backend.hf.space/segmentar-url \
  --output resultado.png
```

---

## 🔗 Paso 5: Conectar con tu Frontend

### **En Vercel (tu frontend)**

1. **Acceder a tu proyecto en Vercel**
   - Ve a: https://vercel.com/dashboard
   - Selecciona tu proyecto DMRE

2. **Configurar variable de entorno**
   - Ve a: **Settings** → **Environment Variables**
   - Busca `VITE_API_URL` (o crea una nueva)
   - Valor: `https://[tu-usuario]-dmre-ia-backend.hf.space`
   - Aplica a: **Production, Preview, Development**
   - Clic en **Save**

3. **Redeploy el frontend**
   - Ve a: **Deployments**
   - Clic en los tres puntos (...) del último deployment
   - Clic en **Redeploy**

4. **Verificar**
   - Espera a que termine el deployment
   - Visita: https://www.dmre-lasalle.com/
   - Intenta hacer un análisis de IA
   - ¡Debería funcionar! 🎉

---

## 🎛️ Configuración Avanzada (Opcional)

### **Dominio Personalizado**

Si quieres usar un subdominio como `api.dmre-lasalle.com`:

1. En tu Space, ve a: **Settings** → **Domains**
2. Sigue las instrucciones para configurar el CNAME en tu DNS
3. Actualiza `VITE_API_URL` en Vercel con tu nuevo dominio

### **Variables de Entorno**

Si necesitas agregar variables de entorno:

1. En tu Space, ve a: **Settings** → **Variables and secrets**
2. Agrega las variables necesarias
3. El Space se reiniciará automáticamente

### **Logs y Monitoreo**

Para ver logs en tiempo real:

1. Ve a tu Space
2. Pestaña **Logs**
3. Verás todas las peticiones y errores

---

## 🐛 Troubleshooting

### ❌ Error: "Build failed"

**Problema**: El Dockerfile tiene errores o faltan dependencias

**Solución**:
1. Revisa los logs del build
2. Verifica que copiaste correctamente todos los archivos
3. Asegúrate que `requirements.txt` tenga todas las dependencias

### ❌ Error: "Application startup failed"

**Problema**: El servidor no puede iniciar en el puerto correcto

**Solución**:
1. Verifica que `ia_server.py` use el puerto 7860:
   ```python
   port = int(os.environ.get("PORT", 7860))
   ```
2. Verifica que el Dockerfile exponga el puerto 7860:
   ```dockerfile
   EXPOSE 7860
   ENV PORT=7860
   ```

### ❌ Error: "Model download failed"

**Problema**: No se puede descargar el modelo de Hugging Face

**Solución**:
1. Verifica tu conexión
2. El modelo es público y no requiere token
3. Espera unos minutos y vuelve a intentar

### ❌ Error: CORS en el frontend

**Problema**: El navegador bloquea las peticiones

**Solución**:
El CORS ya está habilitado en `ia_server.py` con `CORS(app)`. Si persiste:
1. Verifica que la URL en `VITE_API_URL` sea correcta (con https://)
2. Verifica que no tenga / al final
3. Limpia caché del navegador

### ⚠️ Advertencia: "Cold start"

**Problema**: La primera petición después de inactividad es lenta

**Explicación**:
- Hugging Face Spaces puede "dormir" después de 48 horas sin uso
- La primera petición despierta el Space (~30 segundos)
- Las peticiones siguientes son rápidas

**Solución**:
- Esto es normal en el plan gratuito
- Para evitarlo, puedes hacer un ping cada hora desde tu frontend
- O actualizar a un plan de pago (no recomendado para tu caso)

---

## 📊 Monitoreo y Mantenimiento

### **Verificar Estado**

Puedes verificar el estado del Space en cualquier momento:

```bash
curl https://[tu-usuario]-dmre-ia-backend.hf.space/
```

### **Ver Uso de Recursos**

1. Ve a tu Space
2. Pestaña **Usage**
3. Verás CPU, RAM y peticiones

### **Actualizar el Código**

Para actualizar el backend:

1. Edita los archivos directamente en Hugging Face
2. O usa Git:
   ```bash
   cd dmre-ia-backend
   # Edita archivos
   git add .
   git commit -m "Update backend"
   git push
   ```
3. El Space se rebuildeará automáticamente

---

## 💰 Costos

| Recurso | Plan Gratuito | Tu Uso Estimado |
|---------|---------------|-----------------|
| CPU | Ilimitado | ✅ Suficiente |
| RAM | 16 GB | ✅ ~2 GB usado |
| Almacenamiento | Ilimitado | ✅ ~500 MB |
| Ancho de banda | Ilimitado | ✅ Bajo |
| **Costo total** | **$0/mes** | **$0/mes** |

---

## 🎉 ¡Listo!

Tu backend de IA ahora está desplegado en Hugging Face Spaces de forma gratuita con 16 GB de RAM, suficiente para tu modelo de segmentación de fondo de ojo.

**URL del backend**: `https://[tu-usuario]-dmre-ia-backend.hf.space`

**Frontend**: Ya conectado en `https://www.dmre-lasalle.com/`

---

## 📞 Soporte

Si tienes problemas:

1. **Documentación de Hugging Face Spaces**: https://huggingface.co/docs/hub/spaces
2. **Foro de la comunidad**: https://discuss.huggingface.co/
3. **Issues del proyecto**: Reporta en tu repositorio GitHub

---

**¡Disfruta de tu aplicación DMRE con IA completamente funcional y gratuita!** 🎊
