import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { saveIAAnalysisResult } from "../utils/imageUtils";
import { CalendarIcon, DocumentTextIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline";

export default function VisitList({ visitas, imagenes }) {
  const { user } = useAuth();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [guardandoAnalisis, setGuardandoAnalisis] = useState(false);
  const [imagenSegmentada, setImagenSegmentada] = useState(null);
  const [autorInfo, setAutorInfo] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Obtener información del usuario autenticado
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "usuarios", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setAutorInfo({
              uid: user.uid,
              nombre: userData.nombre || user.displayName || "Usuario",
              email: user.email
            });
          } else {
            setAutorInfo({
              uid: user.uid,
              nombre: user.displayName || "Usuario",
              email: user.email
            });
          }
        } catch (error) {
          console.error("Error obteniendo info de usuario:", error);
          setAutorInfo({
            uid: user.uid,
            nombre: user.displayName || "Usuario",
            email: user.email
          });
        }
      }
    };

    fetchUserInfo();
  }, [user]);

  // Abrir modal con imagen
  const abrirModalImagen = (imagen) => {
    setImagenSeleccionada(imagen);
    setModalAbierto(true);
    setImagenSegmentada(null);
    setZoomLevel(1); // Reset zoom al abrir
  };

  // Cerrar modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setImagenSeleccionada(null);
    setImagenSegmentada(null);
    setZoomLevel(1); // Reset zoom al cerrar
  };

  // Funciones de zoom
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3)); // Máximo 3x
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5)); // Mínimo 0.5x
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  // Verificar si una imagen ya fue analizada
  const obtenerEstadoAnalisis = (imagenId) => {
    if (!imagenes) return "sin_analizar";
    const imagen = imagenes.find(img => img.id === imagenId);
    if (!imagen) return "sin_analizar";

    // Las imágenes de tipo "analisis_ia" SON el análisis mismo
    if (imagen.tipo === "analisis_ia") return "analizada";

    // Las imágenes originales verifican el campo analizadaConIA
    if (imagen.analizadaConIA) return "analizada";
    return "sin_analizar";
  };

  // Obtener resultado de análisis si existe
  const obtenerResultadoIA = (imagenId) => {
    if (!imagenes) return null;

    const imagen = imagenes.find(img => img.id === imagenId);

    // Si la imagen seleccionada ES el análisis IA, retornarla a sí misma
    if (imagen && imagen.tipo === "analisis_ia") {
      return imagen;
    }

    // Si es una imagen original, buscar su análisis asociado
    return imagenes.find(img =>
      img.tipo === "analisis_ia" && img.imagenOriginalId === imagenId
    );
  };

  // Analizar con IA
  const analizarConIA = async (imagenInfo) => {
    console.log("🧠 Iniciando análisis IA para:", imagenInfo);

    if (!imagenInfo.patientId || !imagenInfo.visitId) {
      alert("⚠️ Esta imagen no tiene información de paciente o visita.");
      return;
    }

    try {
      setCargando(true);
      setImagenSegmentada(null);

      // Enviar la URL al servidor para que él descargue y procese la imagen
      const res = await fetch(`${import.meta.env.VITE_API_URL}/segmentar-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: imagenInfo.url }),
      });

      if (!res.ok) throw new Error("Error procesando la imagen");

      const blob = await res.blob();
      const resultUrl = URL.createObjectURL(blob);
      setImagenSegmentada(resultUrl);

      // Guardar análisis en Firestore con trazabilidad
      await guardarAnalisisEnFirestore(blob, imagenInfo);
    } catch (error) {
      console.error("Error en análisis IA:", error);
      alert("❌ Error al analizar la imagen: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  // Guardar análisis IA en Firestore
  const guardarAnalisisEnFirestore = async (imageBlob, imagenOriginalInfo) => {
    if (!autorInfo) {
      console.warn("⚠️ No hay información de autor");
      alert("⚠️ No se pudo guardar el análisis: información de usuario no disponible");
      return;
    }

    if (!imagenOriginalInfo.patientId || !imagenOriginalInfo.visitId) {
      console.error("❌ La imagen no tiene patientId o visitId:", imagenOriginalInfo);
      alert("⚠️ Esta imagen no puede guardarse porque no está vinculada a una visita.");
      return;
    }

    try {
      setGuardandoAnalisis(true);
      console.log("💾 Guardando análisis IA...", {
        patientId: imagenOriginalInfo.patientId,
        visitId: imagenOriginalInfo.visitId,
        imagenId: imagenOriginalInfo.id
      });

      await saveIAAnalysisResult({
        imageBlob,
        patientId: imagenOriginalInfo.patientId,
        visitId: imagenOriginalInfo.visitId,
        imagenOriginalId: imagenOriginalInfo.id,
        ojo: imagenOriginalInfo.ojo,
        diagnostico: imagenOriginalInfo.diagnostico || "",
        autor: autorInfo,
        modeloIA: {
          nombre: "segformer_for_optic_disc_cup_segmentation",
          version: "1.0"
        },
        resultados: {
          discoOptico: true,
          copaOptica: true,
          confianza: 0.95
        }
      });

      console.log("✅ Análisis IA guardado correctamente");
      alert("✅ Análisis guardado exitosamente");

      // Recargar para mostrar el nuevo estado
      window.location.reload();
    } catch (error) {
      console.error("❌ Error guardando análisis:", error);
      alert("❌ Error al guardar el análisis: " + error.message);
    } finally {
      setGuardandoAnalisis(false);
    }
  };

  // Formatear fecha
  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!visitas || visitas.length === 0) {
    return <p className="text-gray-500">No hay visitas registradas.</p>;
  }

  return (
    <>
      <ul className="mb-6 space-y-4">
        {visitas.map((v) => (
          <li key={v.id} className="p-4 bg-white rounded shadow">
            <p className="flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-gray-600" /><strong>Fecha:</strong> {new Date(v.fecha).toLocaleString()}</p>
            <p className="flex items-center gap-2"><DocumentTextIcon className="h-4 w-4 text-gray-600" /><strong>Observación Clínica:</strong> {v.observacionClinica || v.diagnostico || "N/A"}</p>
            <p className="flex items-center gap-2"><BuildingOffice2Icon className="h-4 w-4 text-gray-600" /><strong>Estadio de la Enfermedad:</strong> <span className={`font-semibold ${
              v.estadioEnfermedad === "Normal" ? "text-green-600" :
              v.estadioEnfermedad === "Leve" ? "text-yellow-600" :
              v.estadioEnfermedad === "Moderada" ? "text-orange-600" :
              v.estadioEnfermedad === "Avanzada" ? "text-red-600" :
              v.estadioEnfermedad === "Severa" ? "text-red-700" :
              v.estadioEnfermedad === "Terminal" ? "text-red-900" :
              "text-gray-600"
            }`}>{v.estadioEnfermedad || "No especificado"}</span></p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h3 className="font-bold text-blue-600 mb-2">Ojo Derecho</h3>
                {v.imagenes?.derecho?.length ? (
                  <div className="flex gap-2 flex-wrap">
                    {v.imagenes.derecho.map((img) => {
                      const estadoAnalisis = obtenerEstadoAnalisis(img.id);
                      return (
                        <div key={img.id} className="relative cursor-pointer group">
                          <img
                            src={img.url}
                            alt={img.id}
                            className="w-24 h-24 object-cover rounded border group-hover:ring-2 group-hover:ring-blue-500 transition"
                            onClick={() => abrirModalImagen(img)}
                          />
                          {/* Indicador de estado */}
                          <div className="absolute top-1 right-1">
                            {estadoAnalisis === "analizada" ? (
                              <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                ✓
                              </span>
                            ) : (
                              <span className="bg-gray-400 text-white text-xs px-1.5 py-0.5 rounded-full">
                                ⚪
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : <p className="text-sm text-gray-500">Sin imágenes</p>}
              </div>

              <div>
                <h3 className="font-bold text-blue-600 mb-2">Ojo Izquierdo</h3>
                {v.imagenes?.izquierdo?.length ? (
                  <div className="flex gap-2 flex-wrap">
                    {v.imagenes.izquierdo.map((img) => {
                      const estadoAnalisis = obtenerEstadoAnalisis(img.id);
                      return (
                        <div key={img.id} className="relative cursor-pointer group">
                          <img
                            src={img.url}
                            alt={img.id}
                            className="w-24 h-24 object-cover rounded border group-hover:ring-2 group-hover:ring-blue-500 transition"
                            onClick={() => abrirModalImagen(img)}
                          />
                          {/* Indicador de estado */}
                          <div className="absolute top-1 right-1">
                            {estadoAnalisis === "analizada" ? (
                              <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                ✓
                              </span>
                            ) : (
                              <span className="bg-gray-400 text-white text-xs px-1.5 py-0.5 rounded-full">
                                ⚪
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : <p className="text-sm text-gray-500">Sin imágenes</p>}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal Clínico de Imagen */}
      {modalAbierto && imagenSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-2xl max-w-7xl w-full h-[90vh] flex flex-col">

            {/* Header Clínico - Minimalista y Profesional */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-600 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {imagenSeleccionada.ojo === "derecho" ? "Ojo Derecho" : "Ojo Izquierdo"}
                  </h3>
                  <p className="text-sm text-slate-200">
                    {imagenSeleccionada.fecha && formatearFecha(imagenSeleccionada.fecha)}
                  </p>
                </div>
              </div>
              <button
                onClick={cerrarModal}
                className="text-white hover:bg-white hover:bg-opacity-10 rounded-lg p-2 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenido Principal - Layout de 2 Columnas */}
            <div className="flex flex-1 overflow-hidden">

              {/* Columna Izquierda - Visor de Imagen */}
              <div className="flex-1 bg-slate-900 flex flex-col">
                {/* Controles de Zoom */}
                <div className="bg-slate-800 px-6 py-3 flex items-center justify-between border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                    <span className="text-xs text-slate-400 uppercase tracking-wide">Zoom: {(zoomLevel * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={zoomOut}
                      disabled={zoomLevel <= 0.5}
                      className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded disabled:opacity-30 disabled:cursor-not-allowed transition"
                      title="Zoom out"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                      </svg>
                    </button>
                    <button
                      onClick={resetZoom}
                      className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded transition"
                      title="Reset zoom"
                    >
                      100%
                    </button>
                    <button
                      onClick={zoomIn}
                      disabled={zoomLevel >= 3}
                      className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded disabled:opacity-30 disabled:cursor-not-allowed transition"
                      title="Zoom in"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Área de Imagen con Scroll */}
                <div className="flex-1 p-6 overflow-auto">
                  <div className="flex items-center justify-center min-h-full">
                    <div
                      className="transition-transform duration-200 ease-out"
                      style={{ transform: `scale(${zoomLevel})` }}
                    >
                      {imagenSegmentada ? (
                        <div className="space-y-4">
                          <div className="bg-slate-800 rounded-lg p-3">
                            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">Original</p>
                            <img
                              src={imagenSeleccionada.url}
                              alt="Original"
                              className="w-full max-w-2xl rounded-lg shadow-lg"
                            />
                          </div>
                          <div className="bg-slate-800 rounded-lg p-3">
                            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">Segmentación IA</p>
                            <img
                              src={imagenSegmentada}
                              alt="Segmentada"
                              className="w-full max-w-2xl rounded-lg shadow-lg"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-800 rounded-lg p-4">
                          <img
                            src={imagenSeleccionada.url}
                            alt="Original"
                            className="w-full max-w-2xl rounded-lg shadow-xl"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha - Panel de Información (3 Bloques) */}
              <div className="w-96 bg-gray-50 border-l border-gray-200 flex flex-col overflow-y-auto">

                {/* BLOQUE 1: DATOS CLÍNICOS */}
                <div className="bg-white border-b border-gray-200 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h4 className="font-semibold text-gray-800 uppercase text-xs tracking-wide">Datos Clínicos</h4>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wide">Lateralidad</label>
                      <p className="text-sm font-medium text-gray-800 mt-1">
                        {imagenSeleccionada.ojo === "derecho" ? "Ojo Derecho (OD)" : "Ojo Izquierdo (OI)"}
                      </p>
                    </div>

                    {imagenSeleccionada.fecha && (
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">Fecha de captura</label>
                        <p className="text-sm font-medium text-gray-800 mt-1">
                          {formatearFecha(imagenSeleccionada.fecha)}
                        </p>
                      </div>
                    )}

                    {imagenSeleccionada.diagnostico && (
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">Observación Clínica</label>
                        <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                          {imagenSeleccionada.diagnostico}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wide">Estado de Análisis</label>
                      <div className="mt-1">
                        {obtenerEstadoAnalisis(imagenSeleccionada.id) === "analizada" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Analizada
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Pendiente de análisis
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* BLOQUE 2: RESULTADOS IA */}
                <div className="bg-white border-b border-gray-200 p-5 flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h4 className="font-semibold text-gray-800 uppercase text-xs tracking-wide">Resultados IA</h4>
                  </div>

                  {(() => {
                    const resultadoIA = obtenerResultadoIA(imagenSeleccionada.id);
                    const estadoAnalisis = obtenerEstadoAnalisis(imagenSeleccionada.id);

                    if (estadoAnalisis === "analizada" && resultadoIA) {
                      return (
                        <div className="space-y-4">
                          {/* Diagnóstico IA */}
                          {resultadoIA.diagnosticoIA && (
                            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                              <label className="text-xs text-indigo-700 uppercase tracking-wide font-semibold">Diagnóstico Automatizado</label>
                              <p className={`text-2xl font-bold mt-2 ${
                                resultadoIA.diagnosticoIA === "Normal" ? "text-green-600" :
                                resultadoIA.diagnosticoIA === "Leve" ? "text-yellow-600" :
                                resultadoIA.diagnosticoIA === "Moderada" ? "text-orange-600" :
                                resultadoIA.diagnosticoIA === "Avanzada" ? "text-red-600" :
                                resultadoIA.diagnosticoIA === "Severa" ? "text-red-700" :
                                resultadoIA.diagnosticoIA === "Terminal" ? "text-red-900" :
                                "text-gray-600"
                              }`}>
                                {resultadoIA.diagnosticoIA}
                              </p>
                              <div className="mt-3 pt-3 border-t border-indigo-200">
                                <label className="text-xs text-indigo-600 uppercase tracking-wide">Confianza del Modelo</label>
                                <p className="text-lg font-semibold text-indigo-900 mt-1">
                                  {(resultadoIA.confianzaIA * 100).toFixed(1)}%
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Detecciones */}
                          <div>
                            <label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">Estructuras Detectadas</label>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-700">Disco Óptico</span>
                                {resultadoIA.resultados?.discoOptico ? (
                                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-700">Copa Óptica</span>
                                {resultadoIA.resultados?.copaOptica ? (
                                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Metadata del análisis */}
                          <div className="pt-3 border-t border-gray-200">
                            <label className="text-xs text-gray-500 uppercase tracking-wide">Analizado por</label>
                            <p className="text-sm text-gray-700 mt-1">{resultadoIA.autor?.nombre || "Sistema"}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatearFecha(resultadoIA.fechaAnalisis)}
                            </p>
                          </div>

                          {/* Disclaimer médico */}
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <p className="text-xs text-amber-800 leading-relaxed">
                              <span className="font-semibold">Nota:</span> Este diagnóstico es generado automáticamente y debe ser validado por un profesional médico.
                            </p>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm text-gray-500 mb-1">Sin análisis IA disponible</p>
                          <p className="text-xs text-gray-400">Procese la imagen para ver los resultados</p>
                        </div>
                      );
                    }
                  })()}
                </div>

                {/* BLOQUE 3: ACCIONES */}
                <div className="bg-white p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h4 className="font-semibold text-gray-800 uppercase text-xs tracking-wide">Acciones</h4>
                  </div>

                  <div className="space-y-3">
                    {obtenerEstadoAnalisis(imagenSeleccionada.id) === "analizada" ? (
                      <>
                        <button
                          onClick={() => analizarConIA(imagenSeleccionada)}
                          disabled={cargando || guardandoAnalisis}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                        >
                          {cargando ? (
                            <>
                              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Analizando...
                            </>
                          ) : guardandoAnalisis ? (
                            <>
                              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Guardando...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Re-analizar con IA
                            </>
                          )}
                        </button>
                        <p className="text-xs text-center text-gray-500">
                          Generar un nuevo análisis de esta imagen
                        </p>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => analizarConIA(imagenSeleccionada)}
                          disabled={cargando || guardandoAnalisis}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                        >
                          {cargando ? (
                            <>
                              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Procesando...
                            </>
                          ) : guardandoAnalisis ? (
                            <>
                              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Guardando...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              Analizar con IA
                            </>
                          )}
                        </button>
                        <p className="text-xs text-center text-gray-500">
                          Procesar imagen con modelo de segmentación
                        </p>
                      </>
                    )}

                    <button
                      onClick={cerrarModal}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg font-medium transition"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
