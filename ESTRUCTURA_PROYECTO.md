# 📁 Estructura del Proyecto DMRE-WEB

## 🌳 Árbol de Directorios

```
DMRE-WEB/
│
├── 📂 backend/
│   └── README.md                          # Documentación del backend
│
└── 📂 frontend/                           # Aplicación React
    │
    ├── 📄 package.json                    # Dependencias del proyecto
    ├── 📄 package-lock.json               # Lock de dependencias
    │
    ├── 📄 vite.config.js                  # Configuración de Vite
    ├── 📄 tailwind.config.js              # Configuración de Tailwind CSS
    ├── 📄 postcss.config.js               # Configuración de PostCSS
    ├── 📄 eslint.config.js                # Configuración de ESLint
    │
    ├── 📄 index.html                      # HTML principal
    │
    ├── 🔒 firestore.rules                 # Reglas de seguridad Firestore ⭐ NUEVO
    ├── 🔒 storage.rules                   # Reglas de seguridad Storage ⭐ NUEVO
    ├── 📄 firestore.indexes.json          # Índices de Firestore
    ├── 📄 firebase.json                   # Configuración de Firebase
    │
    ├── 📖 README.md                       # Documentación principal
    ├── 📖 SECURITY_RULES_README.md        # Guía de reglas de seguridad ⭐ NUEVO
    ├── 📖 MIGRACION_USUARIOS.md           # Guía de migración de usuarios ⭐ NUEVO
    │
    ├── 📂 public/                         # Archivos estáticos públicos
    │   └── bg-11111.png                   # Imagen de fondo
    │
    └── 📂 src/                            # Código fuente
        │
        ├── 📄 main.jsx                    # Punto de entrada de React
        ├── 📄 App.jsx                     # Componente raíz con rutas
        ├── 📄 index.css                   # Estilos globales
        │
        ├── 🔥 firebase.js                 # Configuración de Firebase
        ├── 🔐 auth.js                     # Utilidades de autenticación
        ├── 📄 cors.json                   # Configuración CORS
        │
        ├── 📂 context/                    # Contextos de React
        │   └── AuthContext.jsx            # Contexto de autenticación
        │
        ├── 📂 pages/                      # Páginas principales
        │   ├── Home.jsx                   # Página de inicio
        │   ├── Login.jsx                  # Página de login
        │   ├── Dashboard.jsx              # Dashboard principal ⭐ MEJORADO
        │   ├── NuevoPaciente.jsx          # Formulario nuevo paciente
        │   ├── PatientHistory.jsx         # Historial del paciente ⭐ MEJORADO
        │   ├── Analysis.jsx               # Página de análisis
        │   ├── PerfilMedico.jsx           # Perfil del médico
        │   ├── AdminPanel.jsx             # Panel de administración
        │   └── NuevoUsuario.jsx           # Formulario nuevo usuario
        │
        ├── 📂 components/                 # Componentes reutilizables
        │   │
        │   ├── Header.jsx                 # Encabezado de navegación
        │   ├── Sidebar.jsx                # Barra lateral
        │   ├── Footer.jsx                 # Pie de página
        │   ├── Hero.jsx                   # Sección hero de la landing
        │   ├── Card.jsx                   # Componente de tarjeta
        │   │
        │   ├── PrivateRoute.jsx           # Ruta protegida con autenticación
        │   ├── useInView.jsx              # Hook personalizado de visibilidad
        │   │
        │   ├── PatientProfile.jsx         # Perfil del paciente
        │   ├── NuevaVisita.jsx            # Formulario nueva visita
        │   ├── VisitList.jsx              # Lista de visitas
        │   ├── EyeImagesGallery.jsx       # Galería de imágenes de ojos
        │   │
        │   ├── ModeloIA.jsx               # Componente del modelo IA
        │   ├── AnalisisIA.jsx             # Resultados análisis IA ⭐ MEJORADO
        │   │
        │   └── AnotacionesMedicas.jsx     # Anotaciones médicas DMRE ⭐ NUEVO
        │       └── 📝 Características:
        │           ├── Formulario de anotaciones clínicas
        │           ├── Clasificación de severidad
        │           ├── Selección de imágenes (modal flotante) ⭐
        │           ├── Vista de lista y timeline
        │           ├── Indicadores de progresión
        │           └── Seguimiento temporal
        │
        └── 📂 utils/                      # Utilidades
            ├── exportUtils.js             # Exportación Excel/TXT/PDF ⭐ MEJORADO
            │   └── 📊 Incluye:
            │       ├── Exportación de pacientes
            │       ├── Exportación de visitas
            │       ├── Exportación de análisis IA
            │       └── Exportación de anotaciones médicas ⭐
            │
            └── imageUtils.js              # Utilidades de imágenes
```

---

## 📊 Estadísticas del Proyecto

### **Frontend**

| Categoría | Cantidad | Descripción |
|-----------|----------|-------------|
| **Páginas** | 9 | Rutas principales de la aplicación |
| **Componentes** | 15 | Componentes reutilizables |
| **Contextos** | 1 | Context API para estado global |
| **Utilidades** | 2 | Funciones auxiliares |
| **Reglas de seguridad** | 2 | Firestore + Storage |
| **Documentación** | 3 | READMEs y guías |

---

## 🆕 Archivos Nuevos Agregados en esta Sesión

### **Componentes:**
- ✅ `src/components/AnotacionesMedicas.jsx` (898 líneas)
  - Sistema completo de anotaciones médicas
  - Modal de selección de imágenes
  - Vista lista y timeline
  - Validaciones y guardado en Firestore

### **Reglas de Seguridad:**
- ✅ `firestore.rules` (178 líneas) - **Crítico para producción**
  - Control de acceso basado en roles
  - Validaciones de datos
  - Protección de información médica

- ✅ `storage.rules` (100 líneas) - **Crítico para producción**
  - Validación de tipos de archivo
  - Límites de tamaño (10MB)
  - Control de acceso por ruta

### **Documentación:**
- ✅ `SECURITY_RULES_README.md` (350+ líneas)
  - Guía completa de despliegue de reglas
  - Instrucciones de seguridad
  - Checklist de validación

- ✅ `MIGRACION_USUARIOS.md` (270+ líneas)
  - Guía de compatibilidad de usuarios
  - Scripts de migración
  - Verificación de estructura

---

## ⭐ Archivos Modificados en esta Sesión

### **Páginas:**
- 🔄 `src/pages/Dashboard.jsx`
  - Mejoras visuales con gradientes
  - Cards animados con hover
  - Lista de pacientes mejorada
  - Empty states mejorados

- 🔄 `src/pages/PatientHistory.jsx`
  - Nueva pestaña "Anotaciones"
  - Integración de AnotacionesMedicas
  - Tabs con iconos
  - Diseño responsive

### **Componentes:**
- 🔄 `src/components/AnalisisIA.jsx`
  - Imágenes más grandes (h-52)
  - Bordes de color por ojo
  - Modal comparativo mejorado
  - Progress bars de confianza
  - Diagnóstico más prominente

### **Utilidades:**
- 🔄 `src/utils/exportUtils.js`
  - Agregada función `recopilarDatosPaciente` con anotaciones
  - Nueva hoja Excel: "Anotaciones Clínicas"
  - Nueva sección TXT: "ANOTACIONES CLÍNICAS"
  - Resumen actualizado con contador de anotaciones

---

## 🔑 Archivos de Configuración

### **Build & Dev:**
```
vite.config.js          → Configuración de Vite (servidor dev, build)
tailwind.config.js      → Configuración de Tailwind CSS
postcss.config.js       → Configuración de PostCSS
eslint.config.js        → Reglas de linting
```

### **Firebase:**
```
firebase.json           → Configuración general de Firebase
firestore.rules         → Reglas de seguridad de Firestore ⭐
storage.rules           → Reglas de seguridad de Storage ⭐
firestore.indexes.json  → Índices compuestos de Firestore
```

### **Package Management:**
```
package.json            → Dependencias y scripts
package-lock.json       → Lock de versiones
```

---

## 📦 Dependencias Principales

### **Frontend (package.json):**

#### **Core:**
- `react: ^19.1.1` - Framework de UI
- `react-dom: ^19.1.1` - Renderizado DOM
- `react-router-dom: ^7.1.3` - Enrutamiento

#### **Firebase:**
- `firebase: ^11.2.0` - SDK de Firebase

#### **UI & Styling:**
- `tailwindcss: ^4.1.13` - Framework CSS
- `@heroicons/react: ^2.2.0` - Iconos

#### **Exportación:**
- `xlsx: ^0.18.5` - Exportación a Excel
- `jspdf: ^2.5.2` - Generación de PDFs
- `jspdf-autotable: ^3.8.4` - Tablas en PDFs
- `html2canvas: ^1.4.1` - Screenshots para PDFs

#### **Dev Tools:**
- `vite: ^6.0.11` - Build tool
- `eslint: ^9.18.0` - Linter

---

## 🎯 Funcionalidades por Carpeta

### **📂 src/pages/**
```
Gestión de rutas principales:
├── Autenticación (Login)
├── Dashboard de médicos
├── Gestión de pacientes (Nuevo, Historial)
├── Análisis con IA
├── Panel de administración
└── Perfil de médico
```

### **📂 src/components/**
```
Componentes reutilizables:
├── Navegación (Header, Sidebar, Footer)
├── Protección (PrivateRoute)
├── Pacientes (Profile, Visits, Images)
├── IA (ModeloIA, AnalisisIA)
└── Anotaciones (AnotacionesMedicas) ⭐
```

### **📂 src/utils/**
```
Funciones auxiliares:
├── Exportación de datos (Excel, TXT, PDF)
└── Manipulación de imágenes
```

### **📂 src/context/**
```
Estado global:
└── Autenticación de usuarios
```

---

## 🔒 Seguridad

### **Firestore Rules (firestore.rules):**
```javascript
✅ Control de acceso basado en roles (medico/admin)
✅ Validación de estructura de datos
✅ Protección de datos sensibles de pacientes
✅ Solo autores editan sus anotaciones
✅ Validación de campos obligatorios
```

### **Storage Rules (storage.rules):**
```javascript
✅ Solo imágenes permitidas (image/*)
✅ Tamaño máximo 10MB
✅ Control por ruta específica
✅ Solo médicos/admin pueden subir
```

---

## 📈 Líneas de Código (Estimadas)

| Archivo | Líneas | Tipo |
|---------|--------|------|
| AnotacionesMedicas.jsx | ~898 | Componente |
| PatientHistory.jsx | ~300 | Página |
| Dashboard.jsx | ~250 | Página |
| AnalisisIA.jsx | ~600 | Componente |
| exportUtils.js | ~800 | Utilidad |
| firestore.rules | 178 | Seguridad |
| storage.rules | 100 | Seguridad |
| **Total agregado/modificado** | **~3,126** | **Código** |

---

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Build
npm run build            # Construir para producción
npm run preview          # Vista previa del build

# Linting
npm run lint             # Ejecutar ESLint

# Firebase
firebase deploy --only firestore:rules    # Desplegar reglas Firestore
firebase deploy --only storage:rules      # Desplegar reglas Storage
firebase deploy                           # Desplegar todo
```

---

## 📝 Notas Importantes

1. **🔒 CRÍTICO:** Desplegar `firestore.rules` y `storage.rules` antes de producción
2. **📊 Estructura de usuarios:** Verificar que los IDs coincidan con UIDs de Authentication
3. **🖼️ CORS:** Ya configurado en Firebase Storage
4. **📦 Dependencias:** Todas actualizadas y funcionando
5. **🎨 Diseño:** Sistema de diseño consistente con Tailwind CSS

---

**Última actualización:** 2025-01-15
**Versión:** 2.0
**Branch activo:** `claude/add-ia-model-tab-011CUdn99hgJeap7FRXXnDH7`
