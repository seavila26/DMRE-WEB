# Sistema DMRE - Gestión de Degeneración Macular

Sistema completo de gestión médica para Degeneración Macular Relacionada con la Edad (DMRE) con análisis de imágenes de fondo de ojo mediante inteligencia artificial.

## 🚀 Inicio Rápido

### Ejecutar Backend (Python IA Server)
```bash
cd backend
pip install -r requirements.txt
python ia_server.py
```

### Ejecutar Frontend (React App)
```bash
cd frontend
npm install
npm run dev
```

### Acceder
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001

## 📁 Estructura del Proyecto

```
DMRE-WEB/
├── frontend/          # Aplicación React + Vite
├── backend/           # Servidor Python IA (Flask)
└── docs/              # Documentación
```

## 📚 Documentación Completa

- **[📖 Guía Completa del Proyecto](README_PROYECTO.md)** - Arquitectura, instalación, deploy
- **[⚛️ Frontend](frontend/README.md)** - React, Firebase, configuración
- **[🧠 Backend](backend/README.md)** - Python, Flask, modelo IA

## 🛠️ Stack Tecnológico

**Frontend:**
- React 19 + Vite
- Firebase (Auth + Firestore + Storage)
- Tailwind CSS

**Backend:**
- Flask + PyTorch
- Modelo: Segformer para segmentación oftalmológica

## 📦 Dependencias Rápidas

```bash
# Backend
cd backend && pip install flask flask-cors pillow torch transformers requests

# Frontend
cd frontend && npm install
```

## 🐛 Problemas Comunes

**Backend no inicia:** Verificar puerto 5001 libre
**Frontend no conecta:** Revisar URL en `VisitList.jsx`
**Error Firebase:** Verificar credenciales en `firebase.js`

Ver **[README_PROYECTO.md](README_PROYECTO.md)** para troubleshooting completo.

---

**Proyecto DMRE** | Análisis oftalmológico con IA

