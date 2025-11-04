# 🔒 Reglas de Seguridad Firebase - DMRE

## ⚠️ IMPORTANTE - Despliegue Obligatorio

**CRÍTICO:** Las reglas de seguridad actualizadas **DEBEN** ser desplegadas a Firebase antes de usar la aplicación en producción.

---

## 📋 Resumen de Mejoras

### ✅ Firestore Rules (firestore.rules)

#### **Protecciones Implementadas:**

1. **Autenticación Obligatoria**
   - ❌ Antes: Acceso público sin restricciones
   - ✅ Ahora: Requiere autenticación para TODAS las operaciones

2. **Control de Roles**
   - ✅ Roles: `medico` y `admin`
   - ✅ Verificación de rol desde colección `usuarios`
   - ✅ Permisos diferenciados según rol

3. **Protección de Datos de Pacientes**
   - ✅ Solo médicos y admin pueden acceder
   - ✅ Validación de estructura de datos
   - ✅ Validación de tipos y rangos (ej: edad 0-150)

4. **Anotaciones Médicas Seguras**
   - ✅ Solo el autor puede editar/eliminar sus propias anotaciones
   - ✅ Validación de campos obligatorios
   - ✅ Validación de severidad (normal, leve, moderado, severo, crítico)
   - ✅ Requiere mínimo 2 imágenes relacionadas

5. **Control de Usuarios**
   - ✅ Usuarios solo pueden modificar sus propios datos
   - ✅ No pueden cambiar su propio rol
   - ✅ Solo admin puede eliminar usuarios

### ✅ Storage Rules (storage.rules)

#### **Protecciones Implementadas:**

1. **Validación de Archivos**
   - ✅ Solo imágenes permitidas (`image/*`)
   - ✅ Tamaño máximo: 10MB por archivo
   - ✅ Verificación de tipo MIME

2. **Control de Acceso por Ruta**
   - ✅ Rutas organizadas por estructura lógica
   - ✅ Permisos específicos por tipo de recurso
   - ✅ Protección de archivos temporales

3. **Autenticación y Roles**
   - ✅ Solo médicos y admin pueden subir imágenes médicas
   - ✅ Usuarios solo acceden a sus propios archivos temporales

---

## 🚀 Instrucciones de Despliegue

### **Opción 1: Firebase Console (Recomendado para Primera Vez)**

1. **Acceder a Firebase Console:**
   - Ve a https://console.firebase.google.com
   - Selecciona tu proyecto DMRE

2. **Desplegar Firestore Rules:**
   - En el menú lateral, ve a **Firestore Database**
   - Click en la pestaña **Reglas**
   - Copia y pega el contenido de `firestore.rules`
   - Click en **Publicar**

3. **Desplegar Storage Rules:**
   - En el menú lateral, ve a **Storage**
   - Click en la pestaña **Reglas**
   - Copia y pega el contenido de `storage.rules`
   - Click en **Publicar**

### **Opción 2: Firebase CLI (Automatizado)**

```bash
# 1. Instalar Firebase CLI (si no está instalado)
npm install -g firebase-tools

# 2. Login a Firebase
firebase login

# 3. Inicializar proyecto (si no está inicializado)
firebase init

# 4. Desplegar reglas
cd frontend
firebase deploy --only firestore:rules
firebase deploy --only storage:rules

# O desplegar ambas a la vez
firebase deploy --only firestore:rules,storage:rules
```

---

## 📊 Estructura de Datos Requerida

### **Colección: usuarios**

Para que las reglas funcionen correctamente, **DEBES** crear documentos de usuario con esta estructura:

```javascript
{
  uid: "firebase-auth-uid",
  email: "medico@hospital.com",
  rol: "medico",  // o "admin"
  nombre: "Dr. Juan Pérez",
  fechaRegistro: "2025-01-15T10:30:00.000Z"
}
```

**Crear usuario manualmente en Firestore:**
1. Ve a Firestore Database en Firebase Console
2. Crea colección `usuarios`
3. Añade documento con ID = el UID del usuario de Authentication
4. Agrega los campos arriba indicados

### **Roles Disponibles:**
- `medico`: Acceso a pacientes, visitas, imágenes, anotaciones
- `admin`: Acceso completo + puede eliminar datos

---

## ⚙️ Validaciones Implementadas

### **Pacientes:**
- ✅ `nombre` (string, obligatorio)
- ✅ `edad` (number, 0-150, obligatorio)
- ✅ `genero` (string, obligatorio)
- ✅ `identificacion` (string, obligatorio)

### **Visitas:**
- ✅ `fecha` (string ISO, obligatorio)
- ✅ `pacienteId` (string, obligatorio)

### **Anotaciones Médicas:**
- ✅ `severidad` (enum: normal|leve|moderado|severo|critico)
- ✅ `observaciones` (string, no vacío)
- ✅ `fecha` (timestamp)
- ✅ `autor.uid` (debe coincidir con usuario autenticado)
- ✅ `imagenesRelacionadas` (array, mínimo 2 elementos)

### **Imágenes (Storage):**
- ✅ Tipo: Solo archivos `image/*`
- ✅ Tamaño: Máximo 10MB
- ✅ Autenticación requerida
- ✅ Solo médicos y admin

---

## 🧪 Probar las Reglas

### **Usando Firebase Emulator (Desarrollo):**

```bash
# 1. Instalar emulators
firebase init emulators

# 2. Iniciar emulators con reglas
firebase emulators:start

# 3. La aplicación usará automáticamente los emulators en desarrollo
```

### **Usando Rules Playground (Firebase Console):**

1. Ve a Firestore Database > Reglas
2. Click en **Simulador de reglas**
3. Configura el tipo de operación (read/write)
4. Simula la autenticación del usuario
5. Prueba diferentes rutas

**Ejemplos de pruebas:**

```
✅ DEBE PERMITIR:
- Operación: get
- Ubicación: /pacientes/patient123
- Autenticación: { uid: "medico123", token: { rol: "medico" } }

❌ DEBE DENEGAR:
- Operación: get
- Ubicación: /pacientes/patient123
- Sin autenticación
```

---

## 🛡️ Mejores Prácticas de Seguridad

1. **NUNCA uses reglas abiertas en producción:**
   ```javascript
   // ❌ NUNCA HACER ESTO
   allow read, write: if true;
   ```

2. **Siempre valida la estructura de datos:**
   - Campos obligatorios
   - Tipos de datos
   - Rangos válidos

3. **Implementa auditoría:**
   - Registra quién creó/modificó cada documento
   - Usa timestamps para tracking

4. **Principio de mínimo privilegio:**
   - Solo otorga los permisos necesarios
   - Separa roles claramente

5. **Protege datos sensibles:**
   - Información médica requiere máxima seguridad
   - Cumple con HIPAA/GDPR según tu jurisdicción

6. **Monitorea el uso:**
   - Revisa Firebase Console > Usage
   - Configura alertas de uso anómalo

---

## 📝 Checklist de Despliegue

Antes de ir a producción, verifica:

- [ ] Reglas de Firestore desplegadas
- [ ] Reglas de Storage desplegadas
- [ ] Colección `usuarios` creada con roles correctos
- [ ] Probado acceso con cuenta de médico
- [ ] Probado acceso con cuenta de admin
- [ ] Verificado que usuarios no autenticados son rechazados
- [ ] Probado creación de pacientes
- [ ] Probado creación de anotaciones con imágenes
- [ ] Verificado límite de tamaño de archivos (10MB)
- [ ] Verificado que solo imágenes son aceptadas en Storage

---

## 🆘 Solución de Problemas

### **Error: "Missing or insufficient permissions"**

**Causa:** Usuario no tiene el rol correcto en Firestore

**Solución:**
1. Ve a Firestore Console
2. Verifica colección `usuarios/{uid}`
3. Asegúrate de que el campo `rol` existe y es "medico" o "admin"

### **Error: "PERMISSION_DENIED: Missing or insufficient permissions" al subir imagen**

**Causa:** Archivo no es imagen o excede 10MB

**Solución:**
1. Verifica que el archivo sea imagen (JPEG, PNG, etc.)
2. Verifica que el tamaño sea menor a 10MB
3. Verifica que el usuario tenga rol de médico o admin

### **Error al crear anotación: "imagenesRelacionadas size requirement"**

**Causa:** Menos de 2 imágenes seleccionadas

**Solución:**
- Selecciona al menos 2 imágenes en el modal de selección

---

## 📞 Contacto y Soporte

Si encuentras problemas con las reglas de seguridad:
1. Revisa los logs en Firebase Console > Firestore/Storage
2. Usa el simulador de reglas para diagnosticar
3. Verifica la estructura de datos de usuario

---

**Última actualización:** 2025-01-15
**Versión de reglas:** 2.0
**Autor:** Sistema DMRE
