# Configurar CORS en Firebase Storage

## Problema
Las imágenes de Firebase Storage están bloqueadas por CORS cuando se intenta acceder desde localhost. Esto impide que el PDF se genere correctamente con las imágenes.

## Solución
Configurar CORS en el bucket de Firebase Storage para permitir peticiones desde localhost.

## Pasos para configurar CORS

### Opción 1: Usar Firebase Console (MÁS FÁCIL)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: `dmre-clinica-a7f55`
3. Ve a **Storage** en el menú lateral
4. Haz clic en la pestaña **Rules**
5. Las reglas de Storage no controlan CORS, necesitas usar gsutil (ver Opción 2)

### Opción 2: Usar Google Cloud SDK (RECOMENDADO)

#### Paso 1: Instalar Google Cloud SDK

**Windows:**
1. Descarga el instalador: https://cloud.google.com/sdk/docs/install
2. Ejecuta el instalador y sigue las instrucciones

**macOS:**
```bash
brew install google-cloud-sdk
```

**Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

#### Paso 2: Autenticarte

```bash
gcloud auth login
```

Esto abrirá un navegador para que inicies sesión con tu cuenta de Google (la misma que usa Firebase).

#### Paso 3: Configurar el proyecto

```bash
gcloud config set project dmre-clinica-a7f55
```

#### Paso 4: Aplicar configuración CORS

Desde el directorio raíz del proyecto (donde está el archivo `cors.json`):

```bash
gsutil cors set cors.json gs://dmre-clinica-a7f55.firebasestorage.app
```

#### Paso 5: Verificar que se aplicó correctamente

```bash
gsutil cors get gs://dmre-clinica-a7f55.firebasestorage.app
```

Deberías ver la configuración CORS que aplicaste.

### Opción 3: Usar Firebase CLI con gcloud (ALTERNATIVA)

Si ya tienes Firebase CLI instalado:

```bash
# Instalar gcloud como se indica arriba
gcloud auth login
gcloud config set project dmre-clinica-a7f55

# Aplicar CORS
gsutil cors set cors.json gs://dmre-clinica-a7f55.firebasestorage.app
```

## Verificar que funciona

1. Después de aplicar CORS, **espera 5 minutos** (la configuración puede tardar en propagarse)
2. **Recarga completamente tu aplicación** (Ctrl+Shift+R o Cmd+Shift+R)
3. Ve a Historial del Paciente → Análisis IA → Ver detalle comparativo
4. Haz clic en "Descargar Resultado"
5. Verifica que:
   - ✅ No aparezcan errores CORS en consola
   - ✅ No aparezca "Tainted canvas"
   - ✅ El PDF se descargue con las imágenes visibles

## Configuración CORS aplicada

El archivo `cors.json` permite:
- **Orígenes:** localhost:5173, localhost:5174, localhost:3000
- **Métodos:** GET, HEAD
- **Headers:** Content-Type, Access-Control-Allow-Origin
- **Cache:** 3600 segundos (1 hora)

## Para producción

Cuando despliegues a producción, necesitarás actualizar `cors.json` para incluir tu dominio de producción:

```json
[
  {
    "origin": [
      "http://localhost:5173",
      "https://tu-dominio-produccion.com",
      "https://www.tu-dominio-produccion.com"
    ],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"],
    "maxAgeSeconds": 3600
  }
]
```

Luego vuelve a aplicar:
```bash
gsutil cors set cors.json gs://dmre-clinica-a7f55.firebasestorage.app
```

## Troubleshooting

### Error: "gsutil: command not found"
- No instalaste Google Cloud SDK correctamente
- Reinicia tu terminal después de instalar
- En Windows, verifica que esté en el PATH

### Error: "AccessDeniedException: 403"
- No tienes permisos en el proyecto Firebase
- Asegúrate de haber iniciado sesión con la cuenta correcta
- Pide permisos al administrador del proyecto Firebase

### Error: "ServiceException: 401"
- No estás autenticado
- Ejecuta: `gcloud auth login`

### Las imágenes siguen bloqueadas después de configurar CORS
- Espera 5-10 minutos para que se propague la configuración
- Limpia la caché del navegador (Ctrl+Shift+Delete)
- Prueba en modo incógnito
- Verifica que aplicaste CORS al bucket correcto

## Documentación oficial
- [Google Cloud Storage CORS](https://cloud.google.com/storage/docs/configuring-cors)
- [gsutil cors command](https://cloud.google.com/storage/docs/gsutil/commands/cors)
