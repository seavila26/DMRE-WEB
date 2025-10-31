# Frontend - Aplicación Web DMRE

Frontend del sistema de gestión de Degeneración Macular Relacionada con la Edad (DMRE) con análisis de imágenes mediante IA.

## 🛠️ Stack Tecnológico

- **React** 19.1.1
- **Vite** 6.0.1 (Build tool)
- **Tailwind CSS** 3.4.17 (Estilos)
- **Firebase** 11.1.0 (Auth + Firestore + Storage)
- **React Router** 7.1.1 (Navegación)

## 📋 Requisitos

- Node.js 18.x o superior
- npm o yarn

## 🚀 Instalación

1. **Navegar al directorio del frontend:**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

## ▶️ Ejecución

### Modo Desarrollo

```bash
npm run dev
```

La aplicación se iniciará en:
- **URL**: `http://localhost:5173`
- **Con acceso de red**: `http://192.168.x.x:5173`

### Build para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en `/dist`

### Preview de Build

```bash
npm run preview
```

## 🔧 Configuración

### Conexión con Backend

El frontend se comunica con el backend de IA. La URL está configurada en:
- **Archivo**: `src/components/VisitList.jsx`
- **URL actual**: `http://192.168.40.45:5001`

Para cambiar la URL del backend, buscar y reemplazar en los componentes:

```javascript
// VisitList.jsx línea ~96
const res = await fetch("http://192.168.40.45:5001/segmentar-url", {
  method: "POST",
  // ...
});

// Cambiar por:
const res = await fetch("http://localhost:5001/segmentar-url", {
  method: "POST",
  // ...
});
```

### Firebase

La configuración de Firebase está en:
- **Archivo**: `src/firebase.js`
- **Credenciales**: Ya configuradas para el proyecto

**Archivos de configuración:**
- `.firebaserc` - Proyecto Firebase
- `firebase.json` - Reglas de hosting
- `firestore.rules` - Reglas de seguridad Firestore
- `storage.rules` - Reglas de seguridad Storage

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/         # Componentes React
│   │   ├── AnalisisIA.jsx
│   │   ├── VisitList.jsx
│   │   ├── NuevaVisita.jsx
│   │   └── ...
│   ├── pages/              # Páginas/Rutas
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── PatientHistory.jsx
│   │   └── ...
│   ├── context/            # Context API
│   │   └── AuthContext.jsx
│   ├── utils/              # Utilidades
│   │   └── imageUtils.js
│   ├── firebase.js         # Config Firebase
│   ├── App.jsx             # Componente raíz
│   └── main.jsx            # Entry point
├── public/                 # Assets estáticos
│   ├── CMYK.png
│   ├── sallee1.png
│   └── bg-11111.png
├── index.html              # HTML base
├── package.json            # Dependencias
├── vite.config.js          # Config Vite
├── tailwind.config.js      # Config Tailwind
└── firebase.json           # Config Firebase

```

## 🌐 Rutas de la Aplicación

| Ruta | Componente | Acceso | Descripción |
|------|-----------|--------|-------------|
| `/` | Home | Público | Página de inicio |
| `/login` | Login | Público | Inicio de sesión |
| `/dashboard` | Dashboard | Privado | Lista de pacientes |
| `/nuevo-paciente` | NuevoPaciente | Privado | Crear paciente |
| `/historial/:id` | PatientHistory | Privado | Historial del paciente |
| `/admin` | AdminPanel | Admin | Panel administrativo |
| `/nuevo-usuario` | NuevoUsuario | Admin | Crear usuario |
| `/perfil-medico` | PerfilMedico | Médico | Perfil del médico |

## 🔑 Roles de Usuario

- **Admin**: Acceso completo + gestión de usuarios
- **Médico**: Acceso a pacientes y análisis IA

## 🧪 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Preview de build
npm run preview

# Lint
npm run lint

# Deploy a Firebase (requiere autenticación)
firebase deploy
```

## 📦 Dependencias Principales

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| react | 19.1.1 | Framework UI |
| react-router-dom | 7.1.1 | Navegación |
| firebase | 11.1.0 | Backend (Auth, DB, Storage) |
| tailwindcss | 3.4.17 | Estilos CSS |
| vite | 6.0.1 | Build tool |

## 🔗 Integración con Backend

El frontend se comunica con el backend de IA para:

1. **Segmentación de imágenes** (`/segmentar-url`)
   - Envía URL de imagen de Firebase
   - Recibe imagen segmentada
   - Guarda resultado en Firestore

2. **Diagnóstico automático**
   - Calcula estadio de enfermedad
   - Muestra confianza del modelo
   - Presenta resultados al médico

**Flujo completo:**
```
Frontend → Firebase Storage → Obtiene URL →
Backend IA → Procesa imagen → Devuelve resultado →
Frontend → Guarda en Firestore → Muestra al médico
```

## 🐛 Troubleshooting

### Error: Cannot connect to backend

Verificar que:
1. El backend esté corriendo en `http://localhost:5001`
2. La URL en el código coincida con donde corre el backend
3. CORS esté habilitado en el backend

### Error: Firebase authentication failed

Verificar:
1. Credenciales en `src/firebase.js`
2. Reglas de Firebase actualizadas
3. Usuario autenticado correctamente

### Error: Vite port already in use

```bash
# Cambiar puerto en vite.config.js
export default defineConfig({
  server: {
    port: 3000  // Cambiar puerto
  }
})
```

## 🚀 Deploy a Producción

### Firebase Hosting

```bash
# Build
npm run build

# Deploy
firebase deploy --only hosting
```

### Variables de Entorno

Para producción, actualizar URL del backend en:
- `src/components/VisitList.jsx`
- Usar variable de entorno o archivo de configuración

## 📝 Notas

- El frontend usa persistencia LOCAL de Firebase Auth (sesión se mantiene al recargar)
- Las imágenes se almacenan en Firebase Storage
- Los metadatos y análisis en Firestore
- El análisis IA se hace en el backend Python separado
