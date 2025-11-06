# 🔧 Aplicar Configuración CORS a Firebase Storage

## ⚠️ Problema
Firebase Storage está bloqueando el acceso a las imágenes desde tu dominio de producción (www.dmre-lasalle.com) porque no está en la lista de orígenes permitidos.

## ✅ Solución

El archivo `cors.json` ha sido actualizado para incluir:
- ✅ `https://www.dmre-lasalle.com`
- ✅ `https://dmre-lasalle.com`
- ✅ `https://*.vercel.app` (para deployments preview)
- ✅ localhost (para desarrollo)

---

## 📋 Cómo Aplicar la Configuración

### **Opción 1: Usar Google Cloud Console (Recomendado)**

1. **Instalar Google Cloud SDK** (si no lo tienes):
   - Windows: https://cloud.google.com/sdk/docs/install#windows
   - Mac: `brew install google-cloud-sdk`
   - Linux: `curl https://sdk.cloud.google.com | bash`

2. **Autenticarse:**
   ```bash
   gcloud auth login
   ```

3. **Aplicar configuración CORS:**
   ```bash
   gsutil cors set cors.json gs://dmre-clinica-a7f55.firebasestorage.app
   ```

4. **Verificar que se aplicó:**
   ```bash
   gsutil cors get gs://dmre-clinica-a7f55.firebasestorage.app
   ```

---

### **Opción 2: Usar Firebase Console (Alternativa)**

Si no puedes instalar Google Cloud SDK, puedes configurar CORS desde la consola:

1. **Ir a Firebase Console:**
   - https://console.firebase.google.com/
   - Selecciona tu proyecto: **dmre-clinica-a7f55**

2. **Ir a Storage:**
   - En el menú lateral, clic en **Storage**
   - Clic en **Rules** (pestaña superior)

3. **Verificar reglas de Storage:**
   Las reglas actuales permiten acceso autenticado. Si necesitas hacer público el acceso (NO recomendado para producción), puedes cambiar las reglas, pero **la solución correcta es aplicar CORS con gsutil**.

---

## 🧪 Verificar que Funciona

Después de aplicar CORS:

1. **Espera 1-2 minutos** para que los cambios se propaguen

2. **Limpia caché del navegador:**
   - `Ctrl + Shift + R` (Windows/Linux)
   - `Cmd + Shift + R` (Mac)

3. **Prueba cargar las imágenes:**
   - Ve a: https://www.dmre-lasalle.com/
   - Navega a **Anotaciones Médicas**
   - Clic en **"Seleccionar Imágenes"**
   - Las imágenes deberían cargar correctamente ✅

4. **Verificar en consola:**
   - Abre DevTools (F12)
   - No deberías ver errores de CORS

---

## 📝 Contenido del archivo cors.json

```json
[
  {
    "origin": [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "https://www.dmre-lasalle.com",
      "https://dmre-lasalle.com",
      "https://*.vercel.app"
    ],
    "method": ["GET", "HEAD", "POST", "PUT", "DELETE"],
    "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"],
    "maxAgeSeconds": 3600
  }
]
```

---

## 🚨 Si gsutil no funciona

Si tienes problemas con gsutil, puedes:

1. **Usar Cloud Shell** (recomendado):
   - Ve a: https://console.cloud.google.com/
   - Clic en el icono de terminal (arriba a la derecha) para abrir Cloud Shell
   - Cloud Shell ya tiene gsutil instalado
   - Ejecuta:
     ```bash
     gsutil cors set cors.json gs://dmre-clinica-a7f55.firebasestorage.app
     ```

2. **Temporalmente hacer público el bucket** (NO recomendado):
   - Esto NO es seguro para producción
   - Solo para pruebas rápidas

---

## ✅ Después de Aplicar CORS

El problema de las imágenes que no cargan debería estar completamente resuelto.

**Nota:** Este cambio es permanente y no necesita volver a aplicarse a menos que cambies de dominio.
