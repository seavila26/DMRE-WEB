# 📋 Guía de Migración: Usuarios Existentes

## ✅ BUENAS NOTICIAS: No necesitas modificar nada

Tus documentos de usuario **ya son compatibles** con las reglas de seguridad actualizadas.

---

## 📊 Tu Estructura Actual vs Reglas

### **Tu estructura existente:**
```javascript
{
  activo: true,                          // ✅ OK - Campo extra útil
  correo: "medico2@unisalle.edu.co",    // ✅ OK - Aceptado por las reglas
  especialidad: "Optometra",             // ✅ OK - Campo extra útil
  nombre: "Johan Arango",                // ✅ OK - Requerido ✓
  rol: "medico"                          // ✅ OK - CRÍTICO ✓
}
```

### **Campos verificados por las reglas:**

| Campo | Tu estructura | Reglas actualizadas | Estado |
|-------|--------------|---------------------|--------|
| **rol** | ✅ Tienes | ✅ Requerido | ✅ **Compatible** |
| **nombre** | ✅ Tienes | ✅ Requerido | ✅ **Compatible** |
| **correo/email** | ✅ Tienes "correo" | ✅ Acepta ambos | ✅ **Compatible** |
| **activo** | ✅ Tienes | ⚪ Opcional | ✅ **Compatible** |
| **especialidad** | ✅ Tienes | ⚪ Opcional | ✅ **Compatible** |

---

## 🎯 Lo que SÍ necesitas verificar

### **1. El ID del documento debe ser el UID de Firebase Authentication**

Esto es **CRÍTICO** para que las reglas funcionen:

```
✅ CORRECTO:
usuarios/
  ├── kJ8mNpQrStUvWxYz012345 (UID de Auth)
  │   ├── rol: "medico"
  │   ├── nombre: "Johan Arango"
  │   └── correo: "medico2@unisalle.edu.co"

❌ INCORRECTO:
usuarios/
  ├── usuario1 (ID aleatorio)
  │   ├── uid: "kJ8mNpQrStUvWxYz012345"
  │   └── rol: "medico"
```

**Cómo verificar:**
1. Ve a Firebase Console → Authentication
2. Copia el UID de un usuario (ejemplo: `kJ8mNpQrStUvWxYz012345`)
3. Ve a Firestore Database → Colección `usuarios`
4. Verifica que existe un documento con ese **mismo UID como ID**

---

## 🔍 ¿Cómo saber si tus usuarios están correctamente configurados?

### **Opción 1: Verificación Manual (Firebase Console)**

1. **Authentication:**
   - Firebase Console → Authentication → Users
   - Anota el UID de "Johan Arango" (ejemplo: `abc123...`)

2. **Firestore:**
   - Firebase Console → Firestore Database
   - Busca: `usuarios/abc123...`
   - Verifica que el documento exista con ese ID exacto

### **Opción 2: Verificación Programática**

```javascript
// En tu aplicación (código de verificación)
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

async function verificarUsuario() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    console.log("UID del usuario:", user.uid);

    // Intentar leer el documento con ese UID
    const userDoc = await getDoc(doc(db, "usuarios", user.uid));

    if (userDoc.exists()) {
      console.log("✅ Usuario correctamente configurado:", userDoc.data());
      console.log("Rol:", userDoc.data().rol);
    } else {
      console.error("❌ No existe documento de usuario para este UID");
    }
  }
}
```

---

## 🔧 Si necesitas corregir IDs incorrectos

Si tus documentos de usuario **NO** usan el UID de Authentication como ID:

### **Script de Corrección (Ejecutar UNA SOLA VEZ):**

```javascript
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

async function migrarUsuarios() {
  const usuariosRef = collection(db, 'usuarios');
  const snapshot = await getDocs(usuariosRef);

  for (const docSnapshot of snapshot.docs) {
    const data = docSnapshot.data();
    const currentId = docSnapshot.id;

    // Si el documento tiene un campo 'uid' diferente al ID del documento
    if (data.uid && data.uid !== currentId) {
      console.log(`Migrando usuario ${data.nombre}...`);

      // Crear nuevo documento con el UID correcto
      await setDoc(doc(db, 'usuarios', data.uid), {
        ...data,
        // No incluir el campo 'uid' redundante
      });

      // Eliminar documento antiguo
      await deleteDoc(doc(db, 'usuarios', currentId));

      console.log(`✅ Usuario ${data.nombre} migrado correctamente`);
    }
  }

  console.log("✅ Migración completada");
}

// Ejecutar una sola vez
// migrarUsuarios();
```

---

## ⚠️ Campos que DEBES mantener

Para que las reglas de seguridad funcionen, tus usuarios **DEBEN** tener:

### **Campos Obligatorios:**

1. **`rol`** (string)
   - Valores permitidos: `"medico"` o `"admin"`
   - Es el campo más crítico para seguridad

2. **`nombre`** (string)
   - Nombre del usuario

3. **`correo` o `email`** (string)
   - Email del usuario
   - Puedes usar cualquiera de los dos nombres

### **Campos Opcionales (pero recomendados):**

4. **`activo`** (boolean)
   - Útil para deshabilitar usuarios sin eliminarlos

5. **`especialidad`** (string)
   - Útil para médicos

---

## 📝 Ejemplo de Usuario Completo

```javascript
// Documento en: usuarios/{UID-DE-FIREBASE-AUTH}
{
  // OBLIGATORIOS
  rol: "medico",                        // ✅ Crítico para seguridad
  nombre: "Johan Arango",               // ✅ Requerido
  correo: "medico2@unisalle.edu.co",   // ✅ Requerido (o "email")

  // OPCIONALES (tuyos ya los incluyen)
  activo: true,
  especialidad: "Optometra",

  // OPCIONALES (puedes agregar)
  telefono: "+57 123 456 7890",
  fechaRegistro: "2025-01-15T10:30:00.000Z",
  ultimoAcceso: "2025-01-20T15:45:00.000Z"
}
```

---

## ✅ Checklist de Verificación

Antes de desplegar las reglas, verifica:

- [ ] Todos los documentos en `usuarios/` tienen como ID el UID de Firebase Authentication
- [ ] Todos los usuarios tienen el campo `rol` con valor "medico" o "admin"
- [ ] Todos los usuarios tienen el campo `nombre`
- [ ] Todos los usuarios tienen el campo `correo` (o `email`)
- [ ] No hay campos `uid` redundantes dentro del documento

---

## 🚀 ¿Listo para desplegar?

Si cumples el checklist de arriba:

1. ✅ **NO necesitas modificar nada en tus usuarios existentes**
2. ✅ Despliega las reglas actualizadas a Firebase
3. ✅ Las reglas funcionarán inmediatamente con tus datos

### **Desplegar reglas:**

```bash
cd frontend
firebase deploy --only firestore:rules,storage:rules
```

O desde Firebase Console:
- Firestore Database → Reglas → Pegar contenido de `firestore.rules` → Publicar
- Storage → Reglas → Pegar contenido de `storage.rules` → Publicar

---

## 🆘 Problemas Comunes

### **Error: "Missing or insufficient permissions"**

**Posibles causas:**
1. El ID del documento NO coincide con el UID de Authentication
2. El usuario no tiene el campo `rol`
3. El campo `rol` no es "medico" ni "admin"

**Solución:**
```javascript
// Verificar en consola del navegador
console.log("Mi UID:", auth.currentUser.uid);
console.log("Mi rol:", (await getDoc(doc(db, "usuarios", auth.currentUser.uid))).data().rol);
```

---

## 📞 Resumen

### **¿Qué necesitas hacer?**

✅ **NADA** si:
- Tus documentos de usuario usan el UID de Auth como ID del documento
- Todos tienen el campo `rol` ("medico" o "admin")
- Todos tienen `nombre` y `correo`

🔧 **Corregir IDs** si:
- Los documentos de usuario tienen un ID diferente al UID de Authentication
- Usa el script de migración arriba

---

**Última actualización:** 2025-01-15
**Compatible con:** firestore.rules v2.0
