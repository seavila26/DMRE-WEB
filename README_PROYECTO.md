# Sistema DMRE - Gestión de Degeneración Macular

Sistema completo de gestión médica para Degeneración Macular Relacionada con la Edad (DMRE) con análisis de imágenes de fondo de ojo mediante inteligencia artificial.

## 📁 Estructura del Proyecto

```
DMRE-WEB/
├── frontend/                    # Aplicación React
│   ├── src/                     # Código fuente React
│   ├── public/                  # Assets estáticos
│   ├── package.json             # Dependencias Node.js
│   ├── vite.config.js           # Configuración Vite
│   └── README.md                # Documentación frontend
│
├── backend/                     # Servidor Python IA
│   ├── ia_server.py             # Servidor Flask + modelo IA
│   ├── requirements.txt         # Dependencias Python
│   └── README.md                # Documentación backend
│
├── ESTRUCTURA_DATOS.md          # Estructura de datos Firestore
├── MIGRACION_DATOS.md           # Guía de migración
├── NUEVA_ARQUITECTURA.md        # Documentación arquitectura
└── README_PROYECTO.md           # Este archivo
```

## 🏗️ Arquitectura

### Frontend
- **Framework**: React 19.1.1 + Vite
- **Estilos**: Tailwind CSS
- **Backend**: Firebase (Auth + Firestore + Storage)
- **Puerto**: 5173

### Backend
- **Framework**: Flask 3.0.0
- **IA**: PyTorch + Transformers (Segformer)
- **Modelo**: Segmentación de disco óptico y copa óptica
- **Puerto**: 5001

### Base de Datos
- **Firestore**: Metadatos, usuarios, visitas, análisis
- **Storage**: Imágenes originales y segmentadas

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

**Backend (Python):**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Frontend (Node.js):**
```bash
cd frontend
npm install
```

### 2. Ejecutar Servicios

**Opción A: Terminal separadas (Recomendado)**

Terminal 1 - Backend:
```bash
cd backend
source venv/bin/activate  # Si no está activado
python ia_server.py
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

**Opción B: Ejecutar en background**

```bash
# Backend en background
cd backend && python ia_server.py &

# Frontend
cd frontend && npm run dev
```

### 3. Acceder a la Aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001

## 🔧 Configuración

### Conectar Frontend con Backend

Si el backend corre en una IP diferente, actualizar en:

**Archivo**: `frontend/src/components/VisitList.jsx`

```javascript
// Línea ~96
const res = await fetch("http://localhost:5001/segmentar-url", {
  method: "POST",
  // ...
});
```

Cambiar `localhost` por la IP donde corre el backend.

### Firebase

Credenciales ya configuradas en `frontend/src/firebase.js`

Si necesitas cambiar el proyecto Firebase:
1. Crear nuevo proyecto en Firebase Console
2. Actualizar credenciales en `frontend/src/firebase.js`
3. Actualizar reglas en `firestore.rules` y `storage.rules`

## 📊 Flujo de Trabajo

### Análisis de Imagen con IA

```
1. Médico sube imagen → Firebase Storage
2. Frontend obtiene URL de Storage
3. Frontend envía URL → Backend IA (POST /segmentar-url)
4. Backend descarga imagen, procesa con modelo IA
5. Backend devuelve imagen segmentada
6. Frontend guarda:
   - Imagen segmentada → Firebase Storage
   - Metadatos + diagnóstico IA → Firestore
7. Médico visualiza resultados en interfaz clínica
```

### Estructura de Datos

Ver documentación completa en `ESTRUCTURA_DATOS.md`

**Firestore:**
```
pacientes/{patientId}
  ├── nombre, identificacion, edad, ...
  └── visitas/{visitId}
      ├── fecha, observacionClinica, estadioEnfermedad
      └── imagenes/{imageId}
          ├── tipo: "original" | "analisis_ia"
          ├── url, ojo, fecha, autor
          ├── diagnosticoIA (para análisis)
          └── confianzaIA (para análisis)
```

## 📦 Dependencias

### Backend (Python)
- Flask 3.0.0 - Framework web
- PyTorch 2.1.1 - Deep learning
- Transformers 4.36.0 - Modelo pre-entrenado
- Pillow 10.1.0 - Procesamiento de imágenes

### Frontend (Node.js)
- React 19.1.1 - Framework UI
- Firebase 11.1.0 - Backend completo
- Tailwind CSS 3.4.17 - Estilos
- Vite 6.0.1 - Build tool

## 🧪 Testing

### Backend
```bash
# Verificar que el servidor corre
curl http://localhost:5001/

# Probar endpoint (debe dar error sin imagen - OK)
curl -X POST http://localhost:5001/segmentar
```

### Frontend
```bash
# Ejecutar en modo desarrollo
cd frontend && npm run dev

# Build de producción
cd frontend && npm run build
```

## 🐛 Troubleshooting

### Backend no inicia

**Error**: Puerto 5001 en uso
```bash
# Linux/Mac
sudo lsof -t -i:5001 | xargs kill -9

# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

**Error**: Módulo no encontrado
```bash
cd backend
pip install -r requirements.txt
```

### Frontend no conecta con Backend

1. Verificar que backend esté corriendo: `curl http://localhost:5001`
2. Revisar URL en `frontend/src/components/VisitList.jsx`
3. Verificar CORS habilitado en backend (ya está configurado)

### Error de Firebase

1. Verificar credenciales en `frontend/src/firebase.js`
2. Revisar reglas de seguridad en Firebase Console
3. Verificar que el usuario tenga permisos

## 📚 Documentación Adicional

- **Frontend**: Ver `frontend/README.md`
- **Backend**: Ver `backend/README.md`
- **Estructura de Datos**: Ver `ESTRUCTURA_DATOS.md`
- **Arquitectura**: Ver `NUEVA_ARQUITECTURA.md`
- **Migración**: Ver `MIGRACION_DATOS.md`

## 🚢 Deploy a Producción

### Frontend (Firebase Hosting)
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

### Backend (Servidor Python)

Opciones:
1. **Google Cloud Run** (Recomendado)
2. **Heroku**
3. **VPS con systemd**
4. **Docker** (ver sección Docker)

### Docker (Opcional)

Crear `backend/Dockerfile`:
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY ia_server.py .
EXPOSE 5001
CMD ["python", "ia_server.py"]
```

Ejecutar:
```bash
docker build -t dmre-backend ./backend
docker run -p 5001:5001 dmre-backend
```

## 👥 Roles de Usuario

- **Admin**: Gestión completa + creación de usuarios
- **Médico**: Gestión de pacientes + análisis IA

## 🔐 Seguridad

- Autenticación: Firebase Auth
- Persistencia: LOCAL (sesión se mantiene al recargar)
- Reglas: Definidas en `firestore.rules` y `storage.rules`
- CORS: Habilitado en backend para desarrollo

**Para producción**, configurar CORS específico:
```python
# backend/ia_server.py
CORS(app, origins=["https://tu-dominio.com"])
```

## 📝 Changelog

### v1.0.0 - Arquitectura Separada
- ✅ Separación frontend/backend en carpetas independientes
- ✅ Backend con servidor Flask + modelo IA
- ✅ Frontend con React + Firebase
- ✅ Documentación completa de ambos lados
- ✅ Sistema de análisis IA integrado
- ✅ Modal clínico profesional con zoom
- ✅ Diagnóstico automático por IA
- ✅ Persistencia de sesión

## 📄 Licencia

Proyecto privado - DMRE Clinic

## 🤝 Contribuir

Para contribuir al proyecto:
1. Crear branch desde `main`
2. Hacer cambios y commit
3. Push y crear Pull Request
4. Esperar revisión

## 📧 Soporte

Para problemas o preguntas, contactar al equipo de desarrollo.

---

**Desarrollado con ❤️ para mejorar la atención médica oftalmológica**
