# 📖 Manual de Usuario - Sistema DMRE-WEB

## Sistema de Gestión y Análisis de Degeneración Macular Relacionada con la Edad

**Versión:** 2.0
**Fecha:** Enero 2025
**Desarrollado para:** Médicos y profesionales de la salud

---

## 📑 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Requisitos del Sistema](#requisitos-del-sistema)
3. [Inicio de Sesión](#inicio-de-sesión)
4. [Dashboard Principal](#dashboard-principal)
5. [Gestión de Pacientes](#gestión-de-pacientes)
6. [Registro de Visitas](#registro-de-visitas)
7. [Gestión de Imágenes](#gestión-de-imágenes)
8. [Análisis con Inteligencia Artificial](#análisis-con-inteligencia-artificial)
9. [Anotaciones Médicas](#anotaciones-médicas)
10. [Exportación de Datos](#exportación-de-datos)
11. [Perfil de Usuario](#perfil-de-usuario)
12. [Solución de Problemas](#solución-de-problemas)
13. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## 1. Introducción

### ¿Qué es DMRE-WEB?

**DMRE-WEB** es una plataforma médica especializada en la gestión integral de pacientes con **Degeneración Macular Relacionada con la Edad (DMRE)**. El sistema combina:

- 📊 **Gestión de historiales clínicos**
- 🖼️ **Almacenamiento de imágenes de fondo de ojo**
- 🤖 **Análisis automatizado con Inteligencia Artificial**
- 📝 **Sistema de anotaciones clínicas**
- 📈 **Seguimiento temporal de la enfermedad**
- 💾 **Exportación de datos para reportes**

### Objetivos del Sistema

1. **Centralizar** la información de pacientes con DMRE
2. **Facilitar** el seguimiento temporal de la progresión de la enfermedad
3. **Automatizar** el análisis de imágenes mediante IA
4. **Documentar** observaciones clínicas con seguimiento
5. **Exportar** información para análisis y reportes

### Roles de Usuario

El sistema cuenta con dos roles principales:

| Rol | Permisos | Descripción |
|-----|----------|-------------|
| **👨‍⚕️ Médico** | Gestión completa de pacientes, visitas, imágenes y anotaciones | Usuario estándar del sistema |
| **⚙️ Administrador** | Todos los permisos + gestión de usuarios | Administración del sistema |

---

## 2. Requisitos del Sistema

### Requisitos Técnicos

#### **Navegador Web:**
- ✅ Google Chrome (v90+) - **Recomendado**
- ✅ Mozilla Firefox (v88+)
- ✅ Microsoft Edge (v90+)
- ✅ Safari (v14+)

#### **Conexión a Internet:**
- 📶 Velocidad mínima: 2 Mbps
- 📶 Recomendada: 10 Mbps o superior
- ⚠️ Se requiere conexión estable para subir imágenes y análisis IA

#### **Resolución de Pantalla:**
- 📱 Mínima: 1280x720 px
- 💻 Recomendada: 1920x1080 px o superior
- ✅ Compatible con dispositivos móviles y tablets

### Requisitos de Acceso

- 🔑 **Cuenta de usuario** creada por el administrador
- 📧 **Correo electrónico** institucional válido
- 🔐 **Contraseña** segura

---

## 3. Inicio de Sesión

### Acceso al Sistema

1. **Abrir el navegador** y navegar a la URL del sistema:
   ```
   https://tu-dominio.com
   ```

2. **Página de inicio:**
   - Verás la pantalla de bienvenida del sistema DMRE
   - Click en el botón **"Iniciar Sesión"** en la esquina superior derecha

3. **Formulario de login:**
   ```
   📧 Correo electrónico: _________________
   🔒 Contraseña:        _________________

   [Iniciar Sesión]
   ```

4. **Ingresa tus credenciales:**
   - Correo: Tu email institucional
   - Contraseña: Tu contraseña proporcionada

5. **Click en "Iniciar Sesión"**

### Primera Vez

Si es tu primera vez usando el sistema:

1. Un administrador debe crear tu cuenta
2. Recibirás un correo con tus credenciales temporales
3. Se recomienda cambiar la contraseña en tu primer acceso

### ¿Olvidaste tu Contraseña?

⚠️ Contacta al administrador del sistema para restablecer tu contraseña.

### Cerrar Sesión

Para cerrar sesión de forma segura:

1. Click en tu **nombre de usuario** en la esquina superior derecha
2. Selecciona **"Cerrar Sesión"**
3. Serás redirigido a la página de inicio

---

## 4. Dashboard Principal

### Vista General

Al iniciar sesión, accederás al **Dashboard Principal**, que muestra:

#### **Estadísticas Generales:**

```
┌─────────────────────────────────────────────────────────┐
│  👥 Pacientes Activos        📊 Visitas Registradas    │
│      42                            128                  │
├─────────────────────────────────────────────────────────┤
│  🤖 Análisis IA              🖼️ Total de Imágenes      │
│      89                            256                  │
└─────────────────────────────────────────────────────────┘
```

#### **Lista de Pacientes:**

Tabla con todos tus pacientes:

| Columna | Descripción |
|---------|-------------|
| **Nombre** | Nombre completo del paciente |
| **Identificación** | Número de documento |
| **Edad** | Edad actual |
| **Género** | Masculino/Femenino |
| **Visitas** | Cantidad de visitas registradas |
| **Última Visita** | Fecha de la última visita |
| **Acciones** | Botón "Ver Historial" |

#### **Acciones Rápidas:**

- ➕ **Nuevo Paciente**: Registrar un nuevo paciente
- 🔍 **Buscar**: Filtrar pacientes por nombre o identificación
- 📊 **Estadísticas**: Ver métricas generales

### Navegación

El menú lateral incluye:

```
🏠 Dashboard
👤 Pacientes
🤖 Análisis IA
👨‍⚕️ Mi Perfil
⚙️ Administración (solo admin)
🚪 Cerrar Sesión
```

---

## 5. Gestión de Pacientes

### 5.1 Registrar Nuevo Paciente

#### **Paso 1: Acceder al Formulario**

- Desde el **Dashboard**, click en el botón **"➕ Nuevo Paciente"**
- O desde el menú lateral: **Pacientes → Nuevo Paciente**

#### **Paso 2: Completar Información**

**Datos Obligatorios (*):**

```
📋 Información Personal
   * Nombre Completo:     _______________________
   * Identificación:      _______________________
   * Edad:                _____ años
   * Género:              [Masculino] [Femenino]

📞 Información de Contacto
   Dirección:             _______________________
   Teléfono:              _______________________

🏥 Información Clínica
   Antecedentes Médicos:  _______________________
   Diagnóstico Inicial:   _______________________
   Notas Adicionales:     _______________________
```

#### **Paso 3: Guardar**

- Click en **"Guardar Paciente"**
- Verás un mensaje de confirmación: ✅ **"Paciente registrado exitosamente"**
- Serás redirigido al historial del paciente

### 5.2 Ver Historial del Paciente

#### **Acceder al Historial:**

1. Desde el **Dashboard**, localiza al paciente en la lista
2. Click en **"Ver Historial"**

#### **Pestañas del Historial:**

El historial del paciente se organiza en **5 pestañas**:

```
[👤 Perfil] [🖼️ Imágenes] [📋 Visitas] [🤖 Análisis IA] [📝 Anotaciones]
```

### 5.3 Pestaña: Perfil

Muestra y permite editar la información del paciente:

- **Datos personales**: Nombre, identificación, edad, género
- **Información de contacto**: Dirección, teléfono
- **Información clínica**: Antecedentes, diagnóstico
- **Botón "Editar"**: Para modificar la información

**Para editar:**
1. Click en **"✏️ Editar Perfil"**
2. Modifica los campos necesarios
3. Click en **"💾 Guardar Cambios"**

### 5.4 Pestaña: Imágenes

Galería de todas las imágenes del paciente organizadas por ojo:

```
👁️ OJO DERECHO          👁️ OJO IZQUIERDO
[Imagen 1] [Imagen 2]   [Imagen 1] [Imagen 2]
[Imagen 3] [Imagen 4]   [Imagen 3] [Imagen 4]
```

**Información de cada imagen:**
- 📅 Fecha de captura
- 🔍 Tipo (Original / Análisis IA)
- 🤖 Diagnóstico IA (si aplica)
- 📊 Nivel de confianza (si aplica)

**Click en una imagen** para verla en tamaño completo.

---

## 6. Registro de Visitas

### 6.1 Crear Nueva Visita

Las visitas permiten documentar cada consulta del paciente.

#### **Paso 1: Acceder al Formulario**

1. Desde el **historial del paciente**, selecciona la pestaña **[📋 Visitas]**
2. Click en **"➕ Registrar Nueva Visita"**

#### **Paso 2: Completar Información**

```
📅 Fecha de la Visita:     [Selector de fecha]

📋 Observación Clínica:    ___________________________
                           ___________________________

🏥 Estadio de la Enfermedad:
   [  ] Normal - Sin signos
   [  ] Temprano - DMRE incipiente
   [  ] Intermedio - Drusas medianas
   [  ] Avanzado - Atrofia geográfica
   [  ] Neovascular - DMRE húmeda
```

#### **Paso 3: Guardar**

- Click en **"💾 Guardar Visita"**
- La visita aparecerá en la lista
- Ahora podrás agregar imágenes a esta visita

### 6.2 Ver Detalles de una Visita

En la lista de visitas, cada entrada muestra:

```
📋 Visita del 15 de Enero, 2025
   Observación: Control rutinario. Sin cambios significativos...
   Estadio: Intermedio
   Imágenes: 4
   [Ver Detalles] [Agregar Imágenes]
```

---

## 7. Gestión de Imágenes

### 7.1 Subir Imágenes

#### **Paso 1: Seleccionar Visita**

1. En la pestaña **[📋 Visitas]**, localiza la visita correspondiente
2. Click en **"📷 Agregar Imágenes"**

#### **Paso 2: Subir Archivos**

```
┌──────────────────────────────────────────┐
│  📤 Arrastra imágenes aquí               │
│     o click para seleccionar            │
│                                          │
│  Formatos aceptados:                     │
│  • JPEG (.jpg, .jpeg)                    │
│  • PNG (.png)                            │
│                                          │
│  Tamaño máximo: 10 MB por archivo       │
└──────────────────────────────────────────┘
```

#### **Paso 3: Especificar Ojo**

Para cada imagen:
- Selecciona el ojo correspondiente:
  - 👁️ **Ojo Derecho**
  - 👁️ **Ojo Izquierdo**

#### **Paso 4: Confirmar**

- Click en **"✅ Subir Imágenes"**
- Espera a que se complete la carga
- Las imágenes aparecerán en la galería

### 7.2 Requisitos de las Imágenes

| Característica | Especificación |
|----------------|----------------|
| **Formato** | JPEG, PNG |
| **Tamaño máximo** | 10 MB por archivo |
| **Resolución recomendada** | 1024x1024 px o superior |
| **Calidad** | Alta calidad, sin compresión excesiva |
| **Contenido** | Imagen de fondo de ojo clara |

### 7.3 Mejores Prácticas

✅ **Recomendaciones:**
- Usa imágenes de alta calidad
- Asegúrate de que el fondo de ojo esté bien iluminado
- Evita imágenes borrosas o con reflejos
- Nombra los archivos de forma descriptiva (ej: "OD_paciente_fecha.jpg")

❌ **Evita:**
- Imágenes de baja resolución
- Archivos muy comprimidos
- Imágenes con marca de agua
- Capturas de pantalla de bajo calidad

---

## 8. Análisis con Inteligencia Artificial

### 8.1 Solicitar Análisis

El sistema utiliza **IA** para analizar automáticamente las imágenes de fondo de ojo y detectar signos de DMRE.

#### **Método 1: Desde Imágenes**

1. Ve a la pestaña **[🖼️ Imágenes]**
2. Selecciona la imagen que deseas analizar
3. Click en **"🤖 Analizar con IA"**

#### **Método 2: Desde Análisis IA**

1. Ve a la pestaña **[🤖 Análisis IA]**
2. Click en **"➕ Nuevo Análisis"**
3. Selecciona la imagen y el ojo

#### **Proceso:**

```
1. Subiendo imagen...          ████████░░  80%
2. Procesando con IA...        ⏳ Analizando...
3. Generando resultados...     ✅ Completado
```

⏱️ **Tiempo estimado:** 10-30 segundos por imagen

### 8.2 Interpretar Resultados

#### **Vista de Resultados:**

```
┌─────────────────────────────────────────────────────┐
│  🤖 ANÁLISIS CON INTELIGENCIA ARTIFICIAL            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Imagen Analizada]         [Mapa de Calor]       │
│                                                     │
├─────────────────────────────────────────────────────┤
│  📊 Diagnóstico Detectado:                         │
│      DMRE INTERMEDIA                               │
│                                                     │
│  🎯 Confianza del Modelo:                          │
│      ████████████░░░░░░  85%                       │
│                                                     │
│  🔍 Hallazgos:                                      │
│      • Drusas medianas detectadas                  │
│      • Cambios pigmentarios leves                  │
│      • Sin signos de neovascularización            │
│                                                     │
│  📐 Mediciones:                                     │
│      Disco Óptico: 0.45                            │
│      Copa Óptica: 0.28                             │
│      Ratio C/D: 0.62                               │
└─────────────────────────────────────────────────────┘
```

#### **Interpretación de Confianza:**

| Nivel | Porcentaje | Interpretación |
|-------|------------|----------------|
| 🟢 **Alta** | ≥ 90% | Muy confiable |
| 🟡 **Media** | 70-89% | Confiable |
| 🔴 **Baja** | < 70% | Requiere revisión manual |

### 8.3 Comparar Análisis

Para comparar análisis de diferentes fechas:

1. En la pestaña **[🤖 Análisis IA]**, selecciona dos análisis
2. Click en **"🔍 Comparar"**
3. Verás una vista lado a lado:

```
ANÁLISIS 1 (Anterior)    |    ANÁLISIS 2 (Actual)
────────────────────────────────────────────────
Fecha: 10/12/2024       |    Fecha: 15/01/2025
Diagnóstico: Temprano   |    Diagnóstico: Intermedio
Confianza: 88%          |    Confianza: 92%

📈 EVOLUCIÓN: Progresión detectada
```

---

## 9. Anotaciones Médicas

### 9.1 ¿Qué son las Anotaciones Médicas?

Las **anotaciones médicas** son registros clínicos detallados que permiten:

- 📝 Documentar observaciones específicas sobre la progresión de DMRE
- 🖼️ Relacionar observaciones con imágenes específicas
- 📊 Clasificar la severidad del caso
- 📅 Hacer seguimiento temporal de la enfermedad
- 💊 Registrar recomendaciones de tratamiento

### 9.2 Crear Nueva Anotación

#### **Paso 1: Acceder al Formulario**

1. Desde el **historial del paciente**, selecciona **[📝 Anotaciones]**
2. Click en **"➕ Nueva Anotación"**

#### **Paso 2: Seleccionar Imágenes**

```
┌──────────────────────────────────────────────────┐
│  🖼️ Imágenes para Análisis * (Mínimo 2)         │
│                                                  │
│  [Seleccionar Imágenes]                         │
│                                                  │
│  📊 0 imágenes seleccionadas                    │
│  ⚠️ Debes seleccionar al menos 2 imágenes       │
└──────────────────────────────────────────────────┘
```

**Click en "Seleccionar Imágenes"** abrirá un modal con la galería:

```
╔══════════════════════════════════════════════════╗
║  🖼️ GALERÍA DE IMÁGENES                          ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  Imágenes seleccionadas: 2 de 8                 ║
║  ✓ Cumple el requisito                          ║
║                                                  ║
║  [✓ Imagen 1]  [✓ Imagen 2]  [ Imagen 3]       ║
║  👁️ Derecho    👁️ Izquierdo   👁️ Derecho        ║
║  📸 Original   🤖 Análisis IA  📸 Original       ║
║  📅 10/01/25   📅 10/01/25     📅 15/01/25      ║
║                                                  ║
║  [ Imagen 4]  [ Imagen 5]  [ Imagen 6]         ║
║                                                  ║
║                 [Confirmar Selección]            ║
╚══════════════════════════════════════════════════╝
```

**Click en las imágenes** para seleccionar/deseleccionar.

#### **Paso 3: Completar Formulario**

```
⚕️ Clasificación de Severidad *
   [ ] Normal - Sin signos de enfermedad
   [ ] Leve - Cambios mínimos detectados
   [✓] Moderado - Requiere monitoreo frecuente
   [ ] Severo - Requiere intervención
   [ ] Crítico - Requiere atención inmediata

📋 Observaciones Clínicas *
   ________________________________________________
   ________________________________________________
   Describa los hallazgos clínicos, cambios
   observados, síntomas reportados...

💊 Recomendaciones de Tratamiento
   ________________________________________________
   ________________________________________________
   Indicaciones terapéuticas, cambios en
   medicación, sugerencias de seguimiento...

⏰ Seguimiento
   [✓] Requiere seguimiento próximo

   📅 Fecha sugerida para próxima revisión:
      [Selector de fecha: 15/02/2025]
```

#### **Paso 4: Guardar**

- Click en **"💾 Guardar Anotación"**
- La anotación se guardará con tu información de usuario
- Aparecerá en el historial de anotaciones

### 9.3 Ver Anotaciones

Las anotaciones se pueden visualizar en dos modos:

#### **Modo Lista:**

```
[📋 Lista] [📈 Línea de Tiempo]

┌─────────────────────────────────────────────────┐
│ LEVE  ⏰ Seguimiento                            │
│ 📅 15 de Enero, 2025                            │
│ 👨‍⚕️ Dr. Juan Pérez                              │
│                                                 │
│ 📋 Observaciones:                               │
│    Drusas pequeñas detectadas en mácula...     │
│                                                 │
│ 💊 Recomendaciones:                             │
│    Suplemento AREDS 2, control en 3 meses...   │
│                                                 │
│ 🖼️ Imágenes Analizadas (2)                     │
│    [Img 1] [Img 2]                             │
│                                                 │
│ 📅 Próxima revisión: 15 de Abril, 2025        │
│                                      [✏️ Editar] │
└─────────────────────────────────────────────────┘
```

#### **Modo Línea de Tiempo:**

```
[📋 Lista] [📈 Línea de Tiempo]

       │
   ✅  │  NORMAL                    📅 10/12/2024
   ────┼────────────────────────────────────────
       │  Sin signos de enfermedad
       │  Dr. María González
       │
       │
   ⚠️  │  LEVE  📈 Mejorando        📅 15/01/2025
   ────┼────────────────────────────────────────
       │  Cambios mínimos detectados
       │  Dr. Juan Pérez
       │
       │
   🔶  │  MODERADO  ➡️ Estable      📅 15/02/2025
   ────┼────────────────────────────────────────
       │  Requiere monitoreo frecuente
       │  Dr. Juan Pérez
       │
```

**Indicadores de tendencia:**
- 📈 **Mejorando**: Severidad disminuyó
- 📉 **Empeorando**: Severidad aumentó
- ➡️ **Estable**: Sin cambios

### 9.4 Editar Anotación

Solo el **autor** de la anotación o un **administrador** pueden editarla:

1. Click en **"✏️ Editar"** en la anotación
2. Modifica los campos necesarios
3. Click en **"💾 Guardar Cambios"**

⚠️ **Nota:** No se puede cambiar la fecha de creación ni el autor.

---

## 10. Exportación de Datos

### 10.1 Tipos de Exportación

El sistema permite exportar datos en **3 formatos**:

| Formato | Icono | Uso Recomendado |
|---------|-------|-----------------|
| **Excel (.xlsx)** | 📊 | Análisis de datos, estadísticas |
| **TXT (.txt)** | 📄 | Reportes legibles, documentación |
| **PDF (.pdf)** | 📑 | Presentaciones, impresión |

### 10.2 Exportar Historial Completo

Para exportar toda la información de un paciente:

#### **Desde el Historial del Paciente:**

1. En la cabecera del historial, localiza los botones de exportación:

```
┌──────────────────────────────────────────────┐
│  👤 Johan Arango - 35 años                   │
│  📋 CC 1234567890                            │
│  📊 5 visitas  |  🤖 12 análisis IA          │
│                                              │
│              [📊 Excel] [📄 TXT]             │
└──────────────────────────────────────────────┘
```

2. Click en el botón del formato deseado
3. El archivo se descargará automáticamente

#### **Contenido de la Exportación:**

**Excel incluye 6 hojas:**
1. **Datos Generales**: Información del paciente
2. **Visitas**: Historial de visitas
3. **Análisis IA**: Resultados de análisis
4. **Imágenes**: Lista de imágenes
5. **Anotaciones Clínicas**: Todas las anotaciones ⭐
6. **Resumen**: Estadísticas generales

**TXT incluye secciones:**
```
===========================================
REPORTE DE PACIENTE - SISTEMA DMRE
===========================================

DATOS GENERALES DEL PACIENTE
-------------------------------------------
Nombre:           Johan Arango
Edad:             35 años
...

RESUMEN
-------------------------------------------
Total de Visitas:         5
Total de Imágenes:        24
Análisis IA Realizados:   12
Anotaciones Clínicas:     8

HISTORIAL DE VISITAS
-------------------------------------------
Visita 1
  Fecha: ...
  ...

ANÁLISIS CON INTELIGENCIA ARTIFICIAL
-------------------------------------------
Análisis IA 1
  ...

ANOTACIONES CLÍNICAS
-------------------------------------------
Anotación 1
  Fecha: ...
  Severidad: MODERADO
  Observaciones: ...
  Recomendaciones: ...
  ...
```

### 10.3 Exportar Análisis Específico (PDF)

Para exportar un análisis comparativo:

1. En la pestaña **[🤖 Análisis IA]**, abre un análisis
2. En el modal comparativo, click en **"📄 Exportar PDF"**
3. El PDF incluirá:
   - Imágenes originales y analizadas
   - Diagnóstico IA
   - Nivel de confianza
   - Hallazgos detallados
   - Mediciones

---

## 11. Perfil de Usuario

### 11.1 Ver Mi Perfil

1. Click en tu **nombre de usuario** en la esquina superior derecha
2. O desde el menú lateral: **👨‍⚕️ Mi Perfil**

### 11.2 Información del Perfil

```
┌────────────────────────────────────────────┐
│  👨‍⚕️ DR. JUAN PÉREZ                        │
├────────────────────────────────────────────┤
│  📧 Email:         juan.perez@hospital.com │
│  🏥 Especialidad:  Oftalmología            │
│  🎓 Rol:           Médico                  │
│  📅 Miembro desde: Enero 2024              │
│                                            │
│           [✏️ Editar Perfil]                │
└────────────────────────────────────────────┘
```

### 11.3 Cambiar Contraseña

⚠️ Por seguridad, contacta al administrador para cambiar tu contraseña.

---

## 12. Solución de Problemas

### Problemas Comunes

#### **❌ No puedo iniciar sesión**

**Posibles causas:**
- Credenciales incorrectas
- Cuenta no activada
- Problemas de conexión

**Solución:**
1. Verifica que tu correo y contraseña sean correctos
2. Asegúrate de tener conexión a internet
3. Limpia el caché del navegador
4. Contacta al administrador si persiste

#### **❌ Error al subir imágenes**

**Posibles causas:**
- Archivo muy grande (>10 MB)
- Formato no soportado
- Conexión inestable

**Solución:**
1. Verifica el tamaño del archivo (máx 10 MB)
2. Usa formatos JPEG o PNG
3. Comprime la imagen si es necesario
4. Intenta de nuevo con mejor conexión

#### **❌ El análisis IA no se completa**

**Posibles causas:**
- Imagen de baja calidad
- Servidor ocupado
- Timeout de conexión

**Solución:**
1. Usa imágenes de alta calidad
2. Espera unos minutos e intenta de nuevo
3. Verifica tu conexión a internet
4. Contacta soporte si persiste

#### **❌ No veo las anotaciones**

**Posibles causas:**
- No hay visitas registradas
- Filtros aplicados
- Problemas de permisos

**Solución:**
1. Verifica que el paciente tenga al menos una visita
2. Revisa los filtros de fecha
3. Recarga la página (F5)

#### **❌ Error al exportar datos**

**Posibles causas:**
- Bloqueador de pop-ups activo
- Sin espacio en disco
- Datos demasiado grandes

**Solución:**
1. Permite pop-ups para este sitio
2. Libera espacio en disco
3. Exporta secciones específicas en lugar del todo

### Mensajes de Error

| Código | Mensaje | Solución |
|--------|---------|----------|
| **PERMISSION_DENIED** | Sin permisos suficientes | Verifica tu rol de usuario |
| **QUOTA_EXCEEDED** | Límite de almacenamiento alcanzado | Contacta al administrador |
| **NETWORK_ERROR** | Error de conexión | Verifica tu internet |
| **INVALID_FILE** | Archivo no válido | Verifica formato y tamaño |

---

## 13. Preguntas Frecuentes

### **P: ¿Cuántos pacientes puedo registrar?**
**R:** No hay límite en el número de pacientes.

### **P: ¿Puedo eliminar un paciente?**
**R:** Solo los administradores pueden eliminar pacientes por seguridad.

### **P: ¿Las anotaciones son privadas?**
**R:** Sí, solo tú y los administradores pueden ver tus anotaciones.

### **P: ¿Puedo editar anotaciones de otros médicos?**
**R:** No, solo puedes editar tus propias anotaciones (salvo administradores).

### **P: ¿Qué tan preciso es el análisis IA?**
**R:** El modelo tiene una precisión del 85-92%, pero siempre debe ser verificado por un médico.

### **P: ¿Se guardan automáticamente los datos?**
**R:** Sí, todos los datos se guardan automáticamente al hacer click en "Guardar".

### **P: ¿Puedo acceder desde mi móvil?**
**R:** Sí, el sistema es totalmente responsive y funciona en móviles y tablets.

### **P: ¿Los datos están seguros?**
**R:** Sí, todos los datos están encriptados y almacenados en servidores seguros de Firebase.

### **P: ¿Necesito instalar algo?**
**R:** No, el sistema funciona completamente en el navegador web.

### **P: ¿Hay límite de imágenes por paciente?**
**R:** No hay límite, pero cada imagen debe ser menor a 10 MB.

---

## 📞 Soporte Técnico

### Contacto

Para asistencia técnica o soporte:

- 📧 **Email:** soporte@dmre-system.com
- 💬 **Chat:** Disponible en la plataforma
- 📱 **Teléfono:** +57 XXX XXX XXXX
- 🕐 **Horario:** Lunes a Viernes, 8:00 AM - 6:00 PM

### Recursos Adicionales

- 📖 **Documentación técnica:** Ver `SECURITY_RULES_README.md`
- 🏗️ **Estructura del proyecto:** Ver `ESTRUCTURA_PROYECTO.md`
- 👥 **Guía de usuarios:** Ver `MIGRACION_USUARIOS.md`

---

## 📝 Notas de Versión

### Versión 2.0 - Enero 2025

**Nuevas Funcionalidades:**
- ✅ Sistema de anotaciones médicas con seguimiento temporal
- ✅ Modal de selección de imágenes mejorado
- ✅ Vista de línea de tiempo para seguimiento
- ✅ Indicadores de progresión de la enfermedad
- ✅ Exportación de anotaciones en Excel y TXT
- ✅ Reglas de seguridad robustas

**Mejoras:**
- 🎨 Diseño visual mejorado en Dashboard
- 🎨 Cards de análisis IA más informativas
- 📊 Progress bars de confianza
- 🖼️ Galería de imágenes optimizada

---

## 📄 Licencia y Términos de Uso

Este sistema es de uso exclusivo para profesionales de la salud autorizados. El uso indebido de la información puede resultar en acciones legales.

**⚠️ IMPORTANTE:** Los diagnósticos generados por IA son herramientas de apoyo y no reemplazan el criterio médico profesional.

---

**Última actualización:** Enero 2025
**Versión del manual:** 2.0
**Desarrollado por:** Equipo DMRE-WEB
