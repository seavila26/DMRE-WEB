import * as XLSX from "xlsx";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Recopila toda la información de un paciente desde Firestore
 */
export async function recopilarDatosPaciente(pacienteId, pacienteData) {
  try {
    const datos = {
      paciente: pacienteData,
      visitas: [],
      imagenes: [],
      analisisIA: [],
    };

    // Obtener todas las visitas del paciente
    const visitasSnapshot = await getDocs(
      collection(db, "pacientes", pacienteId, "visitas")
    );

    for (const visitaDoc of visitasSnapshot.docs) {
      const visitaData = visitaDoc.data();
      datos.visitas.push({
        id: visitaDoc.id,
        ...visitaData,
      });

      // Obtener todas las imágenes de cada visita
      const imagenesSnapshot = await getDocs(
        collection(db, "pacientes", pacienteId, "visitas", visitaDoc.id, "imagenes")
      );

      for (const imagenDoc of imagenesSnapshot.docs) {
        const imagenData = imagenDoc.data();
        const imagen = {
          id: imagenDoc.id,
          visitaId: visitaDoc.id,
          fechaVisita: visitaData.fecha,
          observacionClinica: visitaData.observacionClinica,
          estadioEnfermedad: visitaData.estadioEnfermedad,
          ...imagenData,
        };

        datos.imagenes.push(imagen);

        // Separar análisis IA
        if (imagenData.tipo === "analisis_ia") {
          datos.analisisIA.push(imagen);
        }
      }
    }

    return datos;
  } catch (error) {
    console.error("Error recopilando datos del paciente:", error);
    throw error;
  }
}

/**
 * Exportar datos del paciente a formato Excel
 */
export async function exportarPacienteExcel(pacienteId, pacienteData) {
  try {
    const datos = await recopilarDatosPaciente(pacienteId, pacienteData);

    // Crear libro de Excel
    const workbook = XLSX.utils.book_new();

    // Hoja 1: Datos Generales del Paciente
    const datosGenerales = [
      ["INFORMACIÓN DEL PACIENTE"],
      [""],
      ["Campo", "Valor"],
      ["Nombre", datos.paciente.nombre],
      ["Edad", datos.paciente.edad],
      ["Género", datos.paciente.genero],
      ["Identificación", datos.paciente.identificacion],
      ["Dirección", datos.paciente.direccion || "N/A"],
      ["Teléfono", datos.paciente.telefono || "N/A"],
      ["Antecedentes", datos.paciente.antecedentes || "N/A"],
      ["Diagnóstico General", datos.paciente.diagnostico || "N/A"],
      ["Notas", datos.paciente.notas || "N/A"],
      ["Fecha de Registro", new Date(datos.paciente.fechaRegistro).toLocaleString()],
    ];

    const wsDatosGenerales = XLSX.utils.aoa_to_sheet(datosGenerales);
    XLSX.utils.book_append_sheet(workbook, wsDatosGenerales, "Datos Generales");

    // Hoja 2: Visitas Médicas
    const visitasData = datos.visitas.map((visita) => ({
      "ID Visita": visita.id,
      "Fecha": new Date(visita.fecha).toLocaleString(),
      "Observación Clínica": visita.observacionClinica || "N/A",
      "Estadio de la Enfermedad": visita.estadioEnfermedad || "N/A",
      "Total de Imágenes": visita.totalImagenes || 0,
    }));

    if (visitasData.length > 0) {
      const wsVisitas = XLSX.utils.json_to_sheet(visitasData);
      XLSX.utils.book_append_sheet(workbook, wsVisitas, "Visitas");
    }

    // Hoja 3: Análisis IA
    const analisisIAData = datos.analisisIA.map((img) => ({
      "Fecha Visita": img.fechaVisita ? new Date(img.fechaVisita).toLocaleDateString() : "N/A",
      "Ojo": img.ojo === "derecho" ? "Derecho" : "Izquierdo",
      "Diagnóstico IA": img.diagnosticoIA || "N/A",
      "Confianza IA": img.confianzaIA ? `${(img.confianzaIA * 100).toFixed(2)}%` : "N/A",
      "Disco Óptico": img.discoOptico || "N/A",
      "Copa Óptica": img.copaOptica || "N/A",
      "Modelo": img.modeloIA || "Segformer",
      "Fecha Análisis": img.fecha ? new Date(img.fecha).toLocaleString() : "N/A",
      "URL Imagen": img.url || "N/A",
      "Observación Clínica": img.observacionClinica || "N/A",
      "Estadio Enfermedad": img.estadioEnfermedad || "N/A",
    }));

    if (analisisIAData.length > 0) {
      const wsAnalisisIA = XLSX.utils.json_to_sheet(analisisIAData);
      XLSX.utils.book_append_sheet(workbook, wsAnalisisIA, "Análisis IA");
    }

    // Hoja 4: Todas las Imágenes
    const imagenesData = datos.imagenes
      .filter((img) => img.tipo !== "analisis_ia") // Excluir análisis IA (ya están en otra hoja)
      .map((img) => ({
        "Fecha Visita": img.fechaVisita ? new Date(img.fechaVisita).toLocaleDateString() : "N/A",
        "Tipo": img.tipo === "original" ? "Original" : "Otro",
        "Ojo": img.ojo === "derecho" ? "Derecho" : "Izquierdo",
        "Origen": img.origen || "N/A",
        "Fecha Subida": img.fecha ? new Date(img.fecha).toLocaleString() : "N/A",
        "URL Imagen": img.url || "N/A",
        "Nombre Archivo": img.fileName || "N/A",
        "Analizada con IA": img.analizadaConIA ? "Sí" : "No",
      }));

    if (imagenesData.length > 0) {
      const wsImagenes = XLSX.utils.json_to_sheet(imagenesData);
      XLSX.utils.book_append_sheet(workbook, wsImagenes, "Imágenes");
    }

    // Hoja 5: Resumen
    const resumen = [
      ["RESUMEN DEL PACIENTE"],
      [""],
      ["Métrica", "Valor"],
      ["Total de Visitas", datos.visitas.length],
      ["Total de Imágenes", datos.imagenes.length],
      ["Análisis IA Realizados", datos.analisisIA.length],
      [
        "Imágenes Originales",
        datos.imagenes.filter((img) => img.tipo === "original").length,
      ],
      [""],
      ["Fecha de Exportación", new Date().toLocaleString()],
    ];

    const wsResumen = XLSX.utils.aoa_to_sheet(resumen);
    XLSX.utils.book_append_sheet(workbook, wsResumen, "Resumen");

    // Generar archivo
    const nombreArchivo = `Paciente_${datos.paciente.nombre.replace(
      / /g,
      "_"
    )}_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, nombreArchivo);

    return nombreArchivo;
  } catch (error) {
    console.error("Error exportando a Excel:", error);
    throw error;
  }
}

/**
 * Exportar datos del paciente a formato TXT
 */
export async function exportarPacienteTXT(pacienteId, pacienteData) {
  try {
    const datos = await recopilarDatosPaciente(pacienteId, pacienteData);

    let contenido = "";

    // Encabezado
    contenido += "=".repeat(80) + "\n";
    contenido += "REPORTE DE PACIENTE - SISTEMA DMRE\n";
    contenido += "=".repeat(80) + "\n\n";

    // Datos Generales
    contenido += "DATOS GENERALES DEL PACIENTE\n";
    contenido += "-".repeat(80) + "\n";
    contenido += `Nombre:           ${datos.paciente.nombre}\n`;
    contenido += `Edad:             ${datos.paciente.edad} años\n`;
    contenido += `Género:           ${datos.paciente.genero}\n`;
    contenido += `Identificación:   ${datos.paciente.identificacion}\n`;
    contenido += `Dirección:        ${datos.paciente.direccion || "N/A"}\n`;
    contenido += `Teléfono:         ${datos.paciente.telefono || "N/A"}\n`;
    contenido += `Fecha Registro:   ${new Date(datos.paciente.fechaRegistro).toLocaleString()}\n`;
    contenido += `\nAntecedentes:     ${datos.paciente.antecedentes || "N/A"}\n`;
    contenido += `Diagnóstico:      ${datos.paciente.diagnostico || "N/A"}\n`;
    contenido += `Notas:            ${datos.paciente.notas || "N/A"}\n`;
    contenido += "\n\n";

    // Resumen
    contenido += "RESUMEN\n";
    contenido += "-".repeat(80) + "\n";
    contenido += `Total de Visitas:        ${datos.visitas.length}\n`;
    contenido += `Total de Imágenes:       ${datos.imagenes.length}\n`;
    contenido += `Análisis IA Realizados:  ${datos.analisisIA.length}\n`;
    contenido += "\n\n";

    // Visitas
    if (datos.visitas.length > 0) {
      contenido += "HISTORIAL DE VISITAS\n";
      contenido += "-".repeat(80) + "\n";
      datos.visitas.forEach((visita, index) => {
        contenido += `\nVisita ${index + 1}\n`;
        contenido += `  Fecha:                  ${new Date(visita.fecha).toLocaleString()}\n`;
        contenido += `  Observación Clínica:    ${visita.observacionClinica || "N/A"}\n`;
        contenido += `  Estadio Enfermedad:     ${visita.estadioEnfermedad || "N/A"}\n`;
        contenido += `  Total de Imágenes:      ${visita.totalImagenes || 0}\n`;
      });
      contenido += "\n\n";
    }

    // Análisis IA
    if (datos.analisisIA.length > 0) {
      contenido += "ANÁLISIS CON INTELIGENCIA ARTIFICIAL\n";
      contenido += "-".repeat(80) + "\n";
      datos.analisisIA.forEach((analisis, index) => {
        contenido += `\nAnálisis IA ${index + 1}\n`;
        contenido += `  Fecha:                  ${
          analisis.fecha ? new Date(analisis.fecha).toLocaleString() : "N/A"
        }\n`;
        contenido += `  Ojo:                    ${
          analisis.ojo === "derecho" ? "Derecho" : "Izquierdo"
        }\n`;
        contenido += `  Diagnóstico IA:         ${analisis.diagnosticoIA || "N/A"}\n`;
        contenido += `  Confianza:              ${
          analisis.confianzaIA ? `${(analisis.confianzaIA * 100).toFixed(2)}%` : "N/A"
        }\n`;
        contenido += `  Disco Óptico:           ${analisis.discoOptico || "N/A"}\n`;
        contenido += `  Copa Óptica:            ${analisis.copaOptica || "N/A"}\n`;
        contenido += `  Modelo Utilizado:       ${analisis.modeloIA || "Segformer"}\n`;
        contenido += `  URL Imagen:             ${analisis.url || "N/A"}\n`;
        contenido += `  Observación Clínica:    ${analisis.observacionClinica || "N/A"}\n`;
        contenido += `  Estadio Enfermedad:     ${analisis.estadioEnfermedad || "N/A"}\n`;
      });
      contenido += "\n\n";
    }

    // Imágenes
    const imagenesOriginales = datos.imagenes.filter((img) => img.tipo !== "analisis_ia");
    if (imagenesOriginales.length > 0) {
      contenido += "IMÁGENES CARGADAS\n";
      contenido += "-".repeat(80) + "\n";
      imagenesOriginales.forEach((imagen, index) => {
        contenido += `\nImagen ${index + 1}\n`;
        contenido += `  Fecha:                  ${
          imagen.fecha ? new Date(imagen.fecha).toLocaleString() : "N/A"
        }\n`;
        contenido += `  Tipo:                   ${imagen.tipo === "original" ? "Original" : "Otro"}\n`;
        contenido += `  Ojo:                    ${
          imagen.ojo === "derecho" ? "Derecho" : "Izquierdo"
        }\n`;
        contenido += `  Origen:                 ${imagen.origen || "N/A"}\n`;
        contenido += `  Analizada con IA:       ${imagen.analizadaConIA ? "Sí" : "No"}\n`;
        contenido += `  URL:                    ${imagen.url || "N/A"}\n`;
        contenido += `  Nombre Archivo:         ${imagen.fileName || "N/A"}\n`;
      });
      contenido += "\n\n";
    }

    // Pie de página
    contenido += "=".repeat(80) + "\n";
    contenido += `Reporte generado el: ${new Date().toLocaleString()}\n`;
    contenido += "Sistema DMRE - Detección de Retinopatía Diabética\n";
    contenido += "=".repeat(80) + "\n";

    // Descargar archivo
    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const nombreArchivo = `Paciente_${datos.paciente.nombre.replace(
      / /g,
      "_"
    )}_${new Date().toISOString().split("T")[0]}.txt`;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return nombreArchivo;
  } catch (error) {
    console.error("Error exportando a TXT:", error);
    throw error;
  }
}

/**
 * Exportar múltiples pacientes a Excel (para admin)
 */
export async function exportarTodosPacientesExcel(pacientes) {
  try {
    const workbook = XLSX.utils.book_new();

    // Hoja 1: Resumen de todos los pacientes
    const resumenData = pacientes.map((p) => ({
      "Nombre": p.nombre,
      "Edad": p.edad,
      "Género": p.genero,
      "Identificación": p.identificacion,
      "Teléfono": p.telefono || "N/A",
      "Fecha Registro": p.fechaRegistro
        ? new Date(p.fechaRegistro).toLocaleDateString()
        : "N/A",
      "Diagnóstico": p.diagnostico || "N/A",
    }));

    const wsResumen = XLSX.utils.json_to_sheet(resumenData);
    XLSX.utils.book_append_sheet(workbook, wsResumen, "Todos los Pacientes");

    // Generar archivo
    const nombreArchivo = `Pacientes_Sistema_DMRE_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    XLSX.writeFile(workbook, nombreArchivo);

    return nombreArchivo;
  } catch (error) {
    console.error("Error exportando todos los pacientes:", error);
    throw error;
  }
}
