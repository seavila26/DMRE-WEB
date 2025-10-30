# Estructura de Datos - Sistema de Trazabilidad de Imágenes Médicas

## 📋 Resumen

Este documento describe la estructura de datos implementada para garantizar la trazabilidad completa de imágenes médicas y sus análisis asociados en el sistema DMRE.

## 🗂️ Estructura en Firestore

### Colección: `pacientes/{pacienteId}/visitas/{visitaId}/imagenes/{imagenId}`

Cada documento de imagen contiene los siguientes campos:

#### Campos Comunes (todas las imágenes)

| Campo | Tipo | Descripción | Valores posibles |
|-------|------|-------------|------------------|
| `tipo` | string | Tipo de imagen | `"original"` \| `"analisis_ia"` |
| `url` | string | URL pública de Firebase Storage | - |
| `ojo` | string | Ojo del paciente | `"derecho"` \| `"izquierdo"` |
| `fecha` | string (ISO) | Fecha de creación/captura | ISO 8601 |
| `autor` | object | Información del usuario que subió/generó | `{ uid, nombre, email }` |
| `estado` | string | Estado del procesamiento | `"pendiente"` \| `"analizada"` \| `"revisada"` |
| `metadatos` | object | Metadatos técnicos de la imagen | `{ tamano, formato, dimensiones }` |
| `fileName` | string | Nombre original del archivo | - |
| `storagePath` | string | Ruta en Firebase Storage | - |
| `patientId` | string | ID del paciente (para queries globales) | - |
| `visitId` | string | ID de la visita | - |
| `diagnostico` | string | Diagnóstico asociado | - |

#### Campos Específicos para Imágenes Originales (`tipo: "original"`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `analizadaConIA` | boolean | Si ha sido analizada con IA |
| `analisisIds` | array | IDs de los análisis generados para esta imagen |

#### Campos Específicos para Análisis IA (`tipo: "analisis_ia"`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `imagenOriginalId` | string | ID de la imagen original analizada |
| `modeloIA` | object | Información del modelo usado |
| `modeloIA.nombre` | string | Nombre del modelo (ej: "segformer_optic_disc") |
| `modeloIA.version` | string | Versión del modelo |
| `fechaAnalisis` | string (ISO) | Fecha del análisis |
| `resultados` | object | Resultados específicos del análisis |
| `resultados.discoOptico` | boolean | Detección de disco óptico |
| `resultados.copaOptica` | boolean | Detección de copa óptica |
| `resultados.confianza` | number | Nivel de confianza (0-1) |

## 📁 Estructura en Firebase Storage

```
pacientes/
└── {pacienteId}/
    └── visitas/
        └── {visitaId}/
            └── imagenes/
                ├── originales/
                │   ├── derecho/
                │   │   └── {timestamp}-{random}-{filename}.jpg
                │   └── izquierdo/
                │       └── {timestamp}-{random}-{filename}.jpg
                └── analisis_ia/
                    ├── derecho/
                    │   └── {timestamp}-{originalId}-segmentacion.png
                    └── izquierdo/
                        └── {timestamp}-{originalId}-segmentacion.png
```

## 🔄 Flujo de Trazabilidad

### 1. Carga de Imagen Original

```javascript
// Usuario sube imagen en visita
{
  tipo: "original",
  url: "https://storage.googleapis.com/...",
  ojo: "derecho",
  fecha: "2025-10-30T12:00:00.000Z",
  autor: {
    uid: "user123",
    nombre: "Dr. García",
    email: "garcia@hospital.com"
  },
  estado: "pendiente",
  metadatos: {
    tamano: 2048576,
    formato: "image/jpeg",
    dimensiones: { width: 1920, height: 1080 }
  },
  fileName: "fondo_ojo_derecho.jpg",
  storagePath: "pacientes/ABC123/visitas/VIS456/imagenes/originales/derecho/...",
  patientId: "ABC123",
  visitId: "VIS456",
  diagnostico: "Evaluación rutinaria",
  analizadaConIA: false,
  analisisIds: []
}
```

### 2. Análisis con IA

```javascript
// Sistema genera análisis IA
{
  tipo: "analisis_ia",
  url: "https://storage.googleapis.com/...",
  ojo: "derecho",
  fecha: "2025-10-30T12:05:00.000Z",
  autor: {
    uid: "user123",
    nombre: "Dr. García",
    email: "garcia@hospital.com"
  },
  estado: "analizada",
  metadatos: {
    tamano: 1536789,
    formato: "image/png",
    dimensiones: { width: 1920, height: 1080 }
  },
  fileName: "segmentacion_resultado.png",
  storagePath: "pacientes/ABC123/visitas/VIS456/imagenes/analisis_ia/derecho/...",
  patientId: "ABC123",
  visitId: "VIS456",
  diagnostico: "Evaluación rutinaria",
  imagenOriginalId: "IMG789",
  modeloIA: {
    nombre: "segformer_for_optic_disc_cup_segmentation",
    version: "1.0"
  },
  fechaAnalisis: "2025-10-30T12:05:00.000Z",
  resultados: {
    discoOptico: true,
    copaOptica: true,
    confianza: 0.95
  }
}
```

### 3. Actualización de Imagen Original

```javascript
// Se actualiza la imagen original para incluir referencia al análisis
{
  ...camposAnteriores,
  analizadaConIA: true,
  analisisIds: ["ANALISIS001"]
}
```

## 🔍 Queries Útiles

### Obtener todas las imágenes originales de un paciente
```javascript
const q = query(
  collectionGroup(db, "imagenes"),
  where("patientId", "==", pacienteId),
  where("tipo", "==", "original"),
  orderBy("fecha", "desc")
);
```

### Obtener análisis IA de una imagen específica
```javascript
const q = query(
  collection(db, "pacientes", pacienteId, "visitas", visitaId, "imagenes"),
  where("imagenOriginalId", "==", imagenOriginalId),
  where("tipo", "==", "analisis_ia")
);
```

### Obtener imágenes pendientes de revisión
```javascript
const q = query(
  collectionGroup(db, "imagenes"),
  where("estado", "==", "pendiente"),
  orderBy("fecha", "desc")
);
```

## 📊 Ventajas de esta Estructura

1. **Trazabilidad completa**: Cada análisis está vinculado a su imagen original
2. **Metadatos ricos**: Información detallada sobre autor, fechas, y estados
3. **Organización clara**: Separación física y lógica entre originales y análisis
4. **Queries eficientes**: Índices compuestos para búsquedas rápidas
5. **Escalabilidad**: Estructura preparada para múltiples tipos de análisis
6. **Auditoría**: Registro completo de quién, cuándo y qué se hizo

## 🔐 Reglas de Seguridad Recomendadas

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /pacientes/{pacienteId}/visitas/{visitaId}/imagenes/{imagenId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null &&
                       request.resource.data.autor.uid == request.auth.uid;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && hasRole('admin');
    }
  }
}
```

## 📝 Notas de Implementación

- Los campos `patientId` y `visitId` se duplican para permitir queries en collectionGroup
- Las URLs de Storage incluyen tokens de acceso para seguridad
- Los timestamps usan formato ISO 8601 para compatibilidad universal
- Los metadatos de imagen se capturan en el cliente antes de subir
- El estado "revisada" requiere acción manual de un médico autorizado
