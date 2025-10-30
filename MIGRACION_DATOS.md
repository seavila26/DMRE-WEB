# Guía de Migración de Datos - Nueva Estructura de Imágenes

## 📋 Contexto

Se ha implementado una nueva estructura de datos para mejorar la trazabilidad de las imágenes médicas y sus análisis de IA. Esta guía explica cómo manejar la transición entre la estructura antigua y la nueva.

## 🔄 Cambios Principales

### Estructura Antigua
```javascript
{
  url: string,
  ojo: string,
  fecha: string,
  origen: "visita",
  diagnostico: string,
  patientId: string,
  visitId: string,
  fileName: string,
  storagePath: string
}
```

### Estructura Nueva
```javascript
{
  tipo: "original" | "analisis_ia",
  url: string,
  ojo: string,
  fecha: string,
  autor: { uid, nombre, email },
  estado: "pendiente" | "analizada" | "revisada",
  metadatos: { tamano, formato, dimensiones },
  fileName: string,
  storagePath: string,
  patientId: string,
  visitId: string,
  diagnostico: string,
  // Campos adicionales según tipo...
}
```

## ✅ Compatibilidad Hacia Atrás

La aplicación es compatible con ambas estructuras:

1. **Imágenes antiguas sin campo `tipo`**:
   - Se consideran automáticamente como `tipo: "original"`
   - Se pueden visualizar normalmente
   - Se pueden procesar con IA

2. **Nuevas funcionalidades**:
   - Solo las nuevas imágenes tendrán trazabilidad completa
   - Los análisis IA siempre se guardan con la estructura nueva

## 🛠️ Script de Migración (Opcional)

Si deseas actualizar todas las imágenes existentes a la nueva estructura, puedes ejecutar este script en la consola del navegador (con las dev tools abiertas en tu aplicación):

```javascript
// Script de migración de imágenes existentes
async function migrarImagenesExistentes() {
  const { collection, getDocs, doc, updateDoc, collectionGroup, query } = await import('firebase/firestore');
  const { db } = await import('./firebase');

  console.log("🚀 Iniciando migración de imágenes...");

  try {
    // Obtener todas las imágenes del sistema
    const q = query(collectionGroup(db, "imagenes"));
    const snapshot = await getDocs(q);

    let actualizadas = 0;
    let yaActualizadas = 0;
    let errores = 0;

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();

      // Si ya tiene el campo "tipo", saltarla
      if (data.tipo) {
        yaActualizadas++;
        continue;
      }

      try {
        // Preparar campos nuevos
        const actualizacion = {
          tipo: "original",
          estado: "pendiente",
          analizadaConIA: false,
          analisisIds: [],
          metadatos: {
            tamano: null,
            formato: null,
            dimensiones: null
          }
        };

        // Si no tiene autor, agregar uno por defecto
        if (!data.autor) {
          actualizacion.autor = {
            uid: "sistema",
            nombre: "Sistema (migración)",
            email: "sistema@dmre.com"
          };
        }

        // Actualizar documento
        await updateDoc(docSnap.ref, actualizacion);
        actualizadas++;

        console.log(`✅ Imagen ${docSnap.id} actualizada`);
      } catch (error) {
        errores++;
        console.error(`❌ Error actualizando imagen ${docSnap.id}:`, error);
      }
    }

    console.log("\n📊 Resumen de migración:");
    console.log(`   ✅ Actualizadas: ${actualizadas}`);
    console.log(`   ⏭️  Ya actualizadas: ${yaActualizadas}`);
    console.log(`   ❌ Errores: ${errores}`);
    console.log(`   📁 Total procesadas: ${snapshot.docs.length}`);

    return { actualizadas, yaActualizadas, errores, total: snapshot.docs.length };
  } catch (error) {
    console.error("❌ Error en la migración:", error);
    throw error;
  }
}

// Ejecutar migración
migrarImagenesExistentes()
  .then(resultado => console.log("✅ Migración completada:", resultado))
  .catch(error => console.error("❌ Migración fallida:", error));
```

### Cómo Ejecutar el Script

1. **Abre tu aplicación** en el navegador
2. **Inicia sesión** con una cuenta de administrador
3. **Abre las DevTools** (F12 o Ctrl+Shift+I)
4. **Ve a la pestaña Console**
5. **Copia y pega** todo el script anterior
6. **Presiona Enter** para ejecutarlo
7. **Espera** a que termine (verás el progreso en la consola)

## 🎯 Recomendaciones

### Opción 1: Migración Completa (Recomendado)
- Ejecuta el script de migración antes de usar las nuevas funcionalidades
- Todas las imágenes tendrán metadatos consistentes
- Mejor experiencia de usuario

### Opción 2: Migración Gradual
- No hagas nada, la app es compatible con ambas estructuras
- Las imágenes se migrarán automáticamente cuando se editen
- Las nuevas imágenes usarán la estructura nueva

### Opción 3: Sin Migración
- La aplicación funcionará normalmente
- Las imágenes antiguas se visualizan como "originales" por defecto
- Solo las nuevas funcionalidades no estarán disponibles para imágenes antiguas

## 📝 Verificación Post-Migración

Para verificar que la migración fue exitosa:

```javascript
// Verificar imágenes migradas
async function verificarMigracion() {
  const { collectionGroup, getDocs, query, where } = await import('firebase/firestore');
  const { db } = await import('./firebase');

  // Contar imágenes con nuevo formato
  const qNuevas = query(collectionGroup(db, "imagenes"), where("tipo", "==", "original"));
  const snapshotNuevas = await getDocs(qNuevas);

  console.log(`📊 Imágenes con nueva estructura: ${snapshotNuevas.docs.length}`);

  // Mostrar ejemplos
  console.log("\n📄 Ejemplo de imagen migrada:");
  if (snapshotNuevas.docs.length > 0) {
    console.log(snapshotNuevas.docs[0].data());
  }
}

verificarMigracion();
```

## ⚠️ Notas Importantes

1. **Backup**: Antes de migrar, considera hacer un backup de Firestore desde la consola de Firebase
2. **Tiempo**: La migración puede tomar varios minutos si tienes muchas imágenes
3. **Conexión**: Asegúrate de tener buena conexión a internet
4. **Permisos**: Necesitas permisos de escritura en Firestore
5. **Storage**: Los archivos en Firebase Storage NO se mueven, solo se actualizan los metadatos en Firestore

## 🆘 Solución de Problemas

### Error: "No tienes permisos"
- Verifica que estés autenticado como administrador
- Revisa las reglas de seguridad de Firestore

### La migración se cuelga
- Refresca la página e intenta de nuevo
- Verifica la conexión a internet
- Revisa la consola de Firebase para ver errores

### Imágenes no se visualizan después de migrar
- Refresca la página
- Limpia la caché del navegador
- Verifica que las URLs de Storage sigan siendo válidas

## 📞 Soporte

Si encuentras problemas durante la migración:
1. Revisa los logs en la consola del navegador
2. Verifica los logs de Firestore en la consola de Firebase
3. Consulta el archivo `ESTRUCTURA_DATOS.md` para más detalles

---

**Fecha de creación**: 2025-10-30
**Versión**: 1.0
