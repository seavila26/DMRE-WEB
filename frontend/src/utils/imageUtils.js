/**
 * imageUtils.js
 * Utilidades para el manejo de imágenes médicas con trazabilidad completa
 */

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { storage, db } from "../firebase";

/**
 * Obtiene los metadatos de una imagen (tamaño, formato, dimensiones)
 * @param {File} file - Archivo de imagen
 * @returns {Promise<Object>} - Metadatos de la imagen
 */
export const getImageMetadata = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        tamano: file.size,
        formato: file.type,
        dimensiones: {
          width: img.width,
          height: img.height
        }
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        tamano: file.size,
        formato: file.type,
        dimensiones: null
      });
    };

    img.src = objectUrl;
  });
};

/**
 * Sube una imagen original a Firebase Storage y crea su documento en Firestore
 * @param {Object} params
 * @param {File} params.file - Archivo de imagen
 * @param {string} params.patientId - ID del paciente
 * @param {string} params.visitId - ID de la visita
 * @param {string} params.ojo - "derecho" | "izquierdo"
 * @param {string} params.diagnostico - Diagnóstico asociado
 * @param {Object} params.autor - { uid, nombre, email }
 * @returns {Promise<Object>} - Documento de imagen creado
 */
export const uploadOriginalImage = async ({
  file,
  patientId,
  visitId,
  ojo,
  diagnostico = "",
  autor
}) => {
  try {
    // 1. Obtener metadatos de la imagen
    const metadatos = await getImageMetadata(file);

    // 2. Generar nombre único para el archivo
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).slice(2, 8);
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomStr}-${file.name}`;

    // 3. Definir ruta en Storage
    const storagePath = `pacientes/${patientId}/visitas/${visitId}/imagenes/originales/${ojo}/${fileName}`;
    const storageRef = ref(storage, storagePath);

    // 4. Subir archivo a Storage
    await uploadBytes(storageRef, file);

    // 5. Obtener URL pública
    const url = await getDownloadURL(storageRef);

    // 6. Crear documento en Firestore
    const imagenData = {
      tipo: "original",
      url,
      ojo,
      fecha: new Date().toISOString(),
      autor,
      estado: "pendiente",
      metadatos,
      fileName: file.name,
      storagePath,
      patientId,
      visitId,
      diagnostico,
      analizadaConIA: false,
      analisisIds: []
    };

    const imageRef = await addDoc(
      collection(db, "pacientes", patientId, "visitas", visitId, "imagenes"),
      imagenData
    );

    return {
      id: imageRef.id,
      ...imagenData
    };
  } catch (error) {
    console.error("Error al subir imagen original:", error);
    throw error;
  }
};

/**
 * Sube múltiples imágenes originales en paralelo
 * @param {Object} params
 * @param {File[]} params.files - Array de archivos
 * @param {string} params.patientId - ID del paciente
 * @param {string} params.visitId - ID de la visita
 * @param {string} params.ojo - "derecho" | "izquierdo"
 * @param {string} params.diagnostico - Diagnóstico asociado
 * @param {Object} params.autor - { uid, nombre, email }
 * @returns {Promise<Object[]>} - Array de documentos creados
 */
export const uploadMultipleOriginalImages = async ({
  files,
  patientId,
  visitId,
  ojo,
  diagnostico = "",
  autor
}) => {
  if (!files || files.length === 0) return [];

  const uploadPromises = files.map(file =>
    uploadOriginalImage({
      file,
      patientId,
      visitId,
      ojo,
      diagnostico,
      autor
    })
  );

  return await Promise.all(uploadPromises);
};

/**
 * Calcula el diagnóstico IA basado en los resultados del análisis
 * @param {Object} resultados - Resultados del análisis IA
 * @returns {Object} - { diagnosticoIA, confianzaIA }
 */
const calcularDiagnosticoIA = (resultados) => {
  const { discoOptico, copaOptica, confianza } = resultados;

  // Lógica para determinar el estadio basado en los resultados
  // NOTA: Esta es una lógica simplificada de ejemplo
  // En un sistema real, esto debería basarse en análisis médicos más complejos

  if (discoOptico && copaOptica) {
    if (confianza >= 0.95) {
      return { diagnosticoIA: "Normal", confianzaIA: confianza };
    } else if (confianza >= 0.85) {
      return { diagnosticoIA: "Leve", confianzaIA: confianza };
    } else if (confianza >= 0.70) {
      return { diagnosticoIA: "Moderada", confianzaIA: confianza };
    } else if (confianza >= 0.50) {
      return { diagnosticoIA: "Avanzada", confianzaIA: confianza };
    } else {
      return { diagnosticoIA: "Severa", confianzaIA: confianza };
    }
  } else {
    // Si no se detectaron ambas estructuras, considerar como avanzado o severo
    if (confianza >= 0.60) {
      return { diagnosticoIA: "Avanzada", confianzaIA: confianza };
    } else {
      return { diagnosticoIA: "Severa", confianzaIA: confianza };
    }
  }
};

/**
 * Guarda el resultado de un análisis IA con trazabilidad completa
 * @param {Object} params
 * @param {Blob} params.imageBlob - Blob de la imagen procesada
 * @param {string} params.patientId - ID del paciente
 * @param {string} params.visitId - ID de la visita
 * @param {string} params.imagenOriginalId - ID de la imagen original
 * @param {string} params.ojo - "derecho" | "izquierdo"
 * @param {string} params.diagnostico - Diagnóstico asociado
 * @param {Object} params.autor - { uid, nombre, email }
 * @param {Object} params.modeloIA - { nombre, version }
 * @param {Object} params.resultados - Resultados del análisis
 * @returns {Promise<Object>} - Documento de análisis creado
 */
export const saveIAAnalysisResult = async ({
  imageBlob,
  patientId,
  visitId,
  imagenOriginalId,
  ojo,
  diagnostico = "",
  autor,
  modeloIA = {
    nombre: "segformer_for_optic_disc_cup_segmentation",
    version: "1.0"
  },
  resultados = {
    discoOptico: true,
    copaOptica: true,
    confianza: 0.95
  }
}) => {
  console.log("🔵 [saveIAAnalysisResult] Iniciando guardado de análisis IA...");
  console.log("📋 Parámetros recibidos:", {
    blobSize: imageBlob?.size,
    patientId,
    visitId,
    imagenOriginalId,
    ojo,
    autor
  });

  try {
    // 1. Generar nombre único para el archivo
    const timestamp = Date.now();
    const fileName = `${timestamp}-${imagenOriginalId}-segmentacion.png`;
    console.log("📝 Nombre de archivo generado:", fileName);

    // 2. Definir ruta en Storage
    const storagePath = `pacientes/${patientId}/visitas/${visitId}/imagenes/analisis_ia/${ojo}/${fileName}`;
    console.log("📂 Ruta en Storage:", storagePath);
    const storageRef = ref(storage, storagePath);

    // 3. Subir blob a Storage
    console.log("⬆️ Subiendo imagen a Firebase Storage...");
    await uploadBytes(storageRef, imageBlob);
    console.log("✅ Imagen subida a Storage exitosamente");

    // 4. Obtener URL pública
    console.log("🔗 Obteniendo URL pública...");
    const url = await getDownloadURL(storageRef);
    console.log("✅ URL obtenida:", url);

    // 5. Obtener tamaño del blob
    const tamano = imageBlob.size;

    // 6. Calcular diagnóstico IA automático
    const { diagnosticoIA, confianzaIA } = calcularDiagnosticoIA(resultados);
    console.log("🤖 Diagnóstico IA calculado:", diagnosticoIA, "con confianza:", confianzaIA);

    // 7. Crear documento en Firestore
    const analisisData = {
      tipo: "analisis_ia",
      url,
      ojo,
      fecha: new Date().toISOString(),
      autor,
      estado: "analizada",
      metadatos: {
        tamano,
        formato: "image/png",
        dimensiones: null
      },
      fileName,
      storagePath,
      patientId,
      visitId,
      diagnostico,
      imagenOriginalId,
      modeloIA,
      fechaAnalisis: new Date().toISOString(),
      resultados,
      diagnosticoIA,
      confianzaIA
    };

    console.log("💾 Guardando documento en Firestore...");
    console.log("📄 Datos del documento:", analisisData);

    const analisisRef = await addDoc(
      collection(db, "pacientes", patientId, "visitas", visitId, "imagenes"),
      analisisData
    );
    console.log("✅ Documento guardado en Firestore con ID:", analisisRef.id);

    // 7. Actualizar imagen original para marcar que fue analizada
    console.log("🔄 Actualizando imagen original...");
    const originalImageRef = doc(
      db,
      "pacientes",
      patientId,
      "visitas",
      visitId,
      "imagenes",
      imagenOriginalId
    );

    const analisisIdsActuales = await getAnalisisIds(patientId, visitId, imagenOriginalId);
    console.log("📋 IDs de análisis actuales:", analisisIdsActuales);

    await updateDoc(originalImageRef, {
      analizadaConIA: true,
      analisisIds: [...analisisIdsActuales, analisisRef.id]
    });
    console.log("✅ Imagen original actualizada");

    console.log("🎉 [saveIAAnalysisResult] ¡Análisis guardado exitosamente!");
    return {
      id: analisisRef.id,
      ...analisisData
    };
  } catch (error) {
    console.error("❌ [saveIAAnalysisResult] Error al guardar análisis IA:", error);
    console.error("❌ Detalles del error:", {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw error;
  }
};

/**
 * Obtiene los IDs de análisis previos de una imagen
 * @param {string} patientId
 * @param {string} visitId
 * @param {string} imagenOriginalId
 * @returns {Promise<string[]>}
 */
const getAnalisisIds = async (patientId, visitId, imagenOriginalId) => {
  try {
    const originalImageRef = doc(
      db,
      "pacientes",
      patientId,
      "visitas",
      visitId,
      "imagenes",
      imagenOriginalId
    );

    const docSnap = await getDoc(originalImageRef);
    if (docSnap.exists()) {
      return docSnap.data().analisisIds || [];
    }
    return [];
  } catch (error) {
    return [];
  }
};

/**
 * Actualiza el estado de una imagen
 * @param {string} patientId
 * @param {string} visitId
 * @param {string} imagenId
 * @param {string} nuevoEstado - "pendiente" | "analizada" | "revisada"
 * @returns {Promise<void>}
 */
export const updateImageStatus = async (patientId, visitId, imagenId, nuevoEstado) => {
  try {
    const imageRef = doc(
      db,
      "pacientes",
      patientId,
      "visitas",
      visitId,
      "imagenes",
      imagenId
    );

    await updateDoc(imageRef, {
      estado: nuevoEstado
    });
  } catch (error) {
    console.error("Error al actualizar estado de imagen:", error);
    throw error;
  }
};

/**
 * Obtiene el historial completo de una imagen (original + análisis)
 * @param {string} patientId
 * @param {string} visitId
 * @param {string} imagenOriginalId
 * @returns {Promise<Object>} - { original, analisis[] }
 */
export const getImageHistory = async (patientId, visitId, imagenOriginalId) => {
  try {
    const { query, where, getDocs, getDoc, doc: firestoreDoc } = await import("firebase/firestore");

    // Obtener imagen original
    const originalRef = firestoreDoc(
      db,
      "pacientes",
      patientId,
      "visitas",
      visitId,
      "imagenes",
      imagenOriginalId
    );

    const originalSnap = await getDoc(originalRef);

    if (!originalSnap.exists()) {
      throw new Error("Imagen original no encontrada");
    }

    // Obtener todos los análisis asociados
    const analisisQuery = query(
      collection(db, "pacientes", patientId, "visitas", visitId, "imagenes"),
      where("imagenOriginalId", "==", imagenOriginalId),
      where("tipo", "==", "analisis_ia")
    );

    const analisisSnap = await getDocs(analisisQuery);
    const analisis = analisisSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      original: {
        id: originalSnap.id,
        ...originalSnap.data()
      },
      analisis
    };
  } catch (error) {
    console.error("Error al obtener historial de imagen:", error);
    throw error;
  }
};
