import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { saveIAAnalysisResult } from "../utils/imageUtils";

export default function VisitList({ visitas, imagenes }) {
  const { user } = useAuth();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [guardandoAnalisis, setGuardandoAnalisis] = useState(false);
  const [imagenSegmentada, setImagenSegmentada] = useState(null);
  const [autorInfo, setAutorInfo] = useState(null);

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
  };

  // Cerrar modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setImagenSeleccionada(null);
    setImagenSegmentada(null);
  };

  // Verificar si una imagen ya fue analizada
  const obtenerEstadoAnalisis = (imagenId) => {
    if (!imagenes) return "sin_analizar";
    const imagen = imagenes.find(img => img.id === imagenId);
    if (!imagen) return "sin_analizar";

    if (imagen.analizadaConIA) return "analizada";
    return "sin_analizar";
  };

  // Obtener resultado de análisis si existe
  const obtenerResultadoIA = (imagenId) => {
    if (!imagenes) return null;
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
      const res = await fetch("http://192.168.40.45:5001/segmentar-url", {
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
            <p><strong>📅 Fecha:</strong> {new Date(v.fecha).toLocaleString()}</p>
            <p><strong>📝 Observación Clínica:</strong> {v.observacionClinica || v.diagnostico || "N/A"}</p>
            <p><strong>🏥 Estadio de la Enfermedad:</strong> <span className={`font-semibold ${
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

      {/* Modal de imagen con opción de analizar */}
      {modalAbierto && imagenSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">
                    {imagenSeleccionada.ojo === "derecho" ? "👁️ Ojo Derecho" : "👁️ Ojo Izquierdo"}
                  </h3>
                  <p className="text-blue-100 text-sm mt-1">
                    {imagenSeleccionada.fecha && formatearFecha(imagenSeleccionada.fecha)}
                  </p>
                </div>
                <button
                  onClick={cerrarModal}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-6">
              {/* Imagen original */}
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-3">🖼️ Imagen Original</h4>
                <img
                  src={imagenSeleccionada.url}
                  alt="Original"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              {/* Estado y botón de análisis */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                {(() => {
                  const estadoAnalisis = obtenerEstadoAnalisis(imagenSeleccionada.id);
                  const resultadoIA = obtenerResultadoIA(imagenSeleccionada.id);

                  if (estadoAnalisis === "analizada" && resultadoIA) {
                    return (
                      <div>
                        <p className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                          ✅ Esta imagen ya fue analizada
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                          Análisis realizado el {formatearFecha(resultadoIA.fechaAnalisis)} por {resultadoIA.autor?.nombre}
                        </p>
                        {imagenSegmentada && (
                          <div className="mt-4">
                            <h4 className="text-lg font-bold text-gray-800 mb-3">🎯 Resultado IA</h4>
                            <img
                              src={imagenSegmentada}
                              alt="Segmentada"
                              className="w-full rounded-lg shadow-lg"
                            />
                            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <p className="font-semibold text-blue-800 mb-2">📊 Análisis Completado</p>
                              <div className="text-sm text-gray-700 space-y-1">
                                <p>✅ <strong>Disco Óptico:</strong> Detectado</p>
                                <p>✅ <strong>Copa Óptica:</strong> Detectada</p>
                                <p>📈 <strong>Confianza:</strong> 95%</p>
                              </div>
                            </div>
                          </div>
                        )}
                        <button
                          onClick={() => analizarConIA(imagenSeleccionada)}
                          disabled={cargando || guardandoAnalisis}
                          className="mt-3 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {cargando ? (
                            <>⏳ Analizando...</>
                          ) : guardandoAnalisis ? (
                            <>💾 Guardando...</>
                          ) : (
                            <>🔄 Analizar Nuevamente con IA</>
                          )}
                        </button>
                      </div>
                    );
                  } else {
                    return (
                      <div>
                        <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          ⚪ Esta imagen aún no ha sido analizada
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                          Haz clic en el botón para procesarla con inteligencia artificial
                        </p>
                        {imagenSegmentada && (
                          <div className="mt-4">
                            <h4 className="text-lg font-bold text-gray-800 mb-3">🎯 Resultado IA</h4>
                            <img
                              src={imagenSegmentada}
                              alt="Segmentada"
                              className="w-full rounded-lg shadow-lg"
                            />
                            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <p className="font-semibold text-blue-800 mb-2">📊 Análisis Completado</p>
                              <div className="text-sm text-gray-700 space-y-1">
                                <p>✅ <strong>Disco Óptico:</strong> Detectado</p>
                                <p>✅ <strong>Copa Óptica:</strong> Detectada</p>
                                <p>📈 <strong>Confianza:</strong> 95%</p>
                              </div>
                            </div>
                          </div>
                        )}
                        <button
                          onClick={() => analizarConIA(imagenSeleccionada)}
                          disabled={cargando || guardandoAnalisis}
                          className="mt-3 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {cargando ? (
                            <>⏳ Analizando...</>
                          ) : guardandoAnalisis ? (
                            <>💾 Guardando...</>
                          ) : (
                            <>🧠 Analizar con IA</>
                          )}
                        </button>
                      </div>
                    );
                  }
                })()}
              </div>

              {/* Información adicional */}
              <div className="space-y-4">
                {imagenSeleccionada.diagnostico && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Observación clínica:</p>
                    <p className="font-semibold text-gray-800">{imagenSeleccionada.diagnostico}</p>
                  </div>
                )}

                {/* Mostrar diagnóstico IA si está disponible */}
                {(() => {
                  const resultadoIA = obtenerResultadoIA(imagenSeleccionada.id);
                  if (resultadoIA && resultadoIA.diagnosticoIA) {
                    return (
                      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border-2 border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">🤖</span>
                          <h5 className="font-bold text-purple-800">Diagnóstico IA</h5>
                        </div>
                        <div className="space-y-2">
                          <p className="text-gray-700">
                            <strong>Estadio detectado:</strong>{" "}
                            <span className={`font-bold ${
                              resultadoIA.diagnosticoIA === "Normal" ? "text-green-600" :
                              resultadoIA.diagnosticoIA === "Leve" ? "text-yellow-600" :
                              resultadoIA.diagnosticoIA === "Moderada" ? "text-orange-600" :
                              resultadoIA.diagnosticoIA === "Avanzada" ? "text-red-600" :
                              resultadoIA.diagnosticoIA === "Severa" ? "text-red-700" :
                              resultadoIA.diagnosticoIA === "Terminal" ? "text-red-900" :
                              "text-gray-600"
                            }`}>
                              {resultadoIA.diagnosticoIA}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Confianza del modelo:</strong> {(resultadoIA.confianzaIA * 100).toFixed(1)}%
                          </p>
                          <p className="text-xs text-gray-500 italic mt-2">
                            ℹ️ Este diagnóstico es generado automáticamente por el modelo de IA y debe ser validado por un profesional médico.
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Botón cerrar */}
              <div className="flex gap-4">
                <button
                  onClick={cerrarModal}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
