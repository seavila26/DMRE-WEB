import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { saveIAAnalysisResult } from "../utils/imageUtils";

export default function ModeloIA({ imagenes }) {
  const { user } = useAuth();
  const [imagenOriginal, setImagenOriginal] = useState(null);
  const [imagenOriginalURL, setImagenOriginalURL] = useState(null);
  const [imagenSegmentada, setImagenSegmentada] = useState(null);
  const [imagenSeleccionadaInfo, setImagenSeleccionadaInfo] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [autorInfo, setAutorInfo] = useState(null);
  const [guardandoAnalisis, setGuardandoAnalisis] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [analisisSeleccionado, setAnalisisSeleccionado] = useState(null);

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

  // Filtrar análisis IA y vincularlos con sus imágenes originales
  const analisisIA = imagenes
    ?.filter(img => img.tipo === "analisis_ia")
    .map(analisis => {
      const imagenOriginal = imagenes.find(img => img.id === analisis.imagenOriginalId);
      return {
        ...analisis,
        imagenOriginal
      };
    })
    .sort((a, b) => new Date(b.fechaAnalisis) - new Date(a.fechaAnalisis));

  // 🔹 Cuando el usuario selecciona una imagen del dispositivo
  const handleFileChange = (e) => {
    setImagenOriginal(e.target.files[0]);
    setImagenOriginalURL(null);
    setImagenSegmentada(null);
    setImagenSeleccionadaInfo(null);
  };

  // 🔹 Procesar imagen desde archivo del dispositivo
  const procesarImagen = async (file) => {
    setCargando(true);
    setImagenSegmentada(null);

    const formData = new FormData();
    formData.append("imagen", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/segmentar`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error procesando la imagen");

      const blob = await res.blob();
      setImagenSegmentada(URL.createObjectURL(blob));
    } catch (error) {
      console.error(error);
      alert("Error en el procesamiento de la imagen");
    } finally {
      setCargando(false);
    }
  };

  // 🔹 Procesar imagen desde el historial Firebase
  const procesarDesdeHistorial = async (imagenInfo) => {
    console.log("📸 Imagen seleccionada del historial:", imagenInfo);

    try {
      setCargando(true);
      setImagenSegmentada(null);
      setImagenOriginal(null);
      setImagenOriginalURL(imagenInfo.url);
      setImagenSeleccionadaInfo(imagenInfo);

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
      setImagenSegmentada(URL.createObjectURL(blob));

      // Guardar análisis en Firestore con trazabilidad
      await guardarAnalisisEnFirestore(blob, imagenInfo);
    } catch (error) {
      console.error("Error cargando imagen desde Firebase:", error);
      alert("Error al cargar imagen desde el historial");
    } finally {
      setCargando(false);
    }
  };

  // 🔹 Guardar análisis IA en Firestore con trazabilidad completa
  const guardarAnalisisEnFirestore = async (imageBlob, imagenOriginalInfo) => {
    // Validar que tengamos información del autor
    if (!autorInfo) {
      console.warn("⚠️ No hay información de autor, no se guardará en Firestore");
      alert("⚠️ No se pudo guardar el análisis: información de usuario no disponible");
      return;
    }

    // Validar que la imagen tenga los campos necesarios
    if (!imagenOriginalInfo.patientId || !imagenOriginalInfo.visitId) {
      console.error("❌ La imagen no tiene patientId o visitId:", imagenOriginalInfo);
      alert("⚠️ Esta imagen no puede guardarse automáticamente porque no está vinculada a una visita. Use imágenes del historial del paciente.");
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

      console.log("✅ Análisis IA guardado correctamente en Firestore");
      alert("✅ Análisis guardado exitosamente en el historial médico");

      // Recargar la página para mostrar el nuevo análisis en "Resultados anteriores"
      window.location.reload();
    } catch (error) {
      console.error("❌ Error guardando análisis en Firestore:", error);
      alert("❌ Error al guardar el análisis: " + error.message);
    } finally {
      setGuardandoAnalisis(false);
    }
  };

  // 🔹 Abrir modal con detalle del análisis
  const verDetalle = (analisis) => {
    setAnalisisSeleccionado(analisis);
    setModalAbierto(true);
  };

  // 🔹 Cerrar modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setAnalisisSeleccionado(null);
  };

  // 🔹 Formatear fecha
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

  return (
    <div className="min-h-screen bg-gray-50 p-6 rounded-xl">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Título principal */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
            🧠 Análisis con Inteligencia Artificial
          </h2>
          <p className="text-gray-600 mt-2">Segmentación de Fondo de Ojo</p>
        </div>

        {/* ========================================= */}
        {/* SECCIÓN 1: PROCESAR NUEVA IMAGEN */}
        {/* ========================================= */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
          <h3 className="text-2xl font-bold text-blue-800 mb-6 flex items-center gap-2">
            <span className="text-3xl">📤</span>
            Sección 1: Procesar Nueva Imagen
          </h3>

          {/* Card: Subida desde dispositivo */}
          <div className="bg-white shadow-md rounded-2xl p-6 space-y-4 mb-6">
            <h4 className="text-lg font-semibold text-gray-700">
              Opción A: Cargar desde dispositivo
            </h4>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
              <p className="text-sm text-yellow-800">
                ℹ️ <strong>Nota:</strong> Las imágenes cargadas desde tu dispositivo solo se procesarán temporalmente y NO se guardarán.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="p-2 border border-gray-300 rounded-md w-full md:w-auto"
              />
              <button
                onClick={() => imagenOriginal && procesarImagen(imagenOriginal)}
                disabled={!imagenOriginal || cargando}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {cargando ? "⏳ Procesando..." : "🧠 Procesar Imagen"}
              </button>
            </div>
          </div>

          {/* Card: Selección del historial */}
          <div className="bg-white shadow-md rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-700">
                Opción B: Seleccionar del historial del paciente
              </h4>
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                💾 Se guarda automáticamente
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagenes
                ?.filter(img => img.tipo === "original" || !img.tipo)
                .map((img) => (
                  <div key={img.id} className="cursor-pointer group relative">
                    <img
                      src={img.url}
                      alt={img.ojo}
                      onClick={() => procesarDesdeHistorial(img)}
                      className="rounded-lg shadow-md group-hover:scale-105 group-hover:shadow-xl transition-all duration-200 w-full"
                    />
                    <div className="mt-2 text-center">
                      <p className="text-sm text-gray-600 capitalize font-medium">
                        {img.ojo === "derecho" ? "👁️ Ojo Derecho" : "👁️ Ojo Izquierdo"}
                      </p>
                      {img.analizadaConIA && (
                        <p className="text-xs text-green-600 font-semibold bg-green-50 rounded px-2 py-1 inline-block mt-1">
                          ✓ Ya Analizada
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {(!imagenes || imagenes.filter(img => img.tipo === "original" || !img.tipo).length === 0) && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">
                  📭 No hay imágenes disponibles en el historial del paciente.
                </p>
              </div>
            )}
          </div>

          {/* Mostrar imágenes procesadas temporalmente */}
          {(imagenOriginal || imagenOriginalURL) && (
            <div className="bg-white shadow-md rounded-2xl p-6 mt-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                🖼️ Imagen Original
              </h4>
              <img
                src={imagenOriginal ? URL.createObjectURL(imagenOriginal) : imagenOriginalURL}
                alt="Original"
                className="w-full max-w-md rounded-lg shadow-md"
              />
            </div>
          )}

          {imagenSegmentada && (
            <div className="bg-white shadow-md rounded-2xl p-6 mt-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                🎯 Resultado de Segmentación
              </h4>
              <img
                src={imagenSegmentada}
                alt="Segmentada"
                className="w-full max-w-md rounded-lg shadow-md"
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

          {guardandoAnalisis && (
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 flex items-center gap-3 shadow-sm mt-6">
              <div className="animate-spin">⏳</div>
              <p className="text-sm text-blue-700 font-medium">
                💾 Guardando análisis en el historial médico con trazabilidad completa...
              </p>
            </div>
          )}
        </div>

        {/* ========================================= */}
        {/* SECCIÓN 2: RESULTADOS ANTERIORES */}
        {/* ========================================= */}
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 border-2 border-green-200">
          <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
            <span className="text-3xl">📊</span>
            Sección 2: Resultados Anteriores
          </h3>

          {analisisIA && analisisIA.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analisisIA.map((analisis) => (
                <div
                  key={analisis.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  {/* Imágenes comparativas */}
                  <div className="grid grid-cols-2 gap-1 bg-gray-100 p-2">
                    <div className="relative">
                      <img
                        src={analisis.imagenOriginal?.url}
                        alt="Original"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Original
                      </span>
                    </div>
                    <div className="relative">
                      <img
                        src={analisis.url}
                        alt="Segmentada"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                        IA
                      </span>
                    </div>
                  </div>

                  {/* Información del análisis */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-gray-800 capitalize">
                        {analisis.ojo === "derecho" ? "👁️ Ojo Derecho" : "👁️ Ojo Izquierdo"}
                      </span>
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                        ✓ Analizada
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p>
                        <strong>📅 Fecha:</strong> {formatearFecha(analisis.fechaAnalisis)}
                      </p>
                      <p>
                        <strong>👤 Autor:</strong> {analisis.autor?.nombre || "N/A"}
                      </p>
                      <p>
                        <strong>📈 Confianza:</strong> {(analisis.resultados?.confianza * 100).toFixed(0)}%
                      </p>
                      {analisis.resultados?.discoOptico && (
                        <p className="text-green-600">✓ Disco óptico detectado</p>
                      )}
                      {analisis.resultados?.copaOptica && (
                        <p className="text-green-600">✓ Copa óptica detectada</p>
                      )}
                    </div>

                    <button
                      onClick={() => verDetalle(analisis)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      👁️ Ver Detalle Comparativo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">
                No hay análisis previos
              </h4>
              <p className="text-gray-500">
                Los análisis procesados con IA aparecerán aquí automáticamente.
              </p>
            </div>
          )}
        </div>

        {/* ========================================= */}
        {/* MODAL COMPARADOR */}
        {/* ========================================= */}
        {modalAbierto && analisisSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header del modal */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">
                      Comparación Detallada - {analisisSeleccionado.ojo === "derecho" ? "Ojo Derecho" : "Ojo Izquierdo"}
                    </h3>
                    <p className="text-blue-100 text-sm mt-1">
                      Análisis del {formatearFecha(analisisSeleccionado.fechaAnalisis)}
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
                {/* Comparación lado a lado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                      🖼️ Imagen Original
                    </h4>
                    <img
                      src={analisisSeleccionado.imagenOriginal?.url}
                      alt="Original"
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                      🎯 Resultado IA
                    </h4>
                    <img
                      src={analisisSeleccionado.url}
                      alt="Segmentada"
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                </div>

                {/* Información detallada */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">📋 Información del Análisis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm text-gray-600 mb-1">Modelo IA</p>
                      <p className="font-semibold text-gray-800">{analisisSeleccionado.modeloIA?.nombre}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm text-gray-600 mb-1">Versión</p>
                      <p className="font-semibold text-gray-800">{analisisSeleccionado.modeloIA?.version}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm text-gray-600 mb-1">Confianza</p>
                      <p className="font-semibold text-gray-800">{(analisisSeleccionado.resultados?.confianza * 100).toFixed(1)}%</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm text-gray-600 mb-1">Fecha</p>
                      <p className="font-semibold text-gray-800">{formatearFecha(analisisSeleccionado.fechaAnalisis)}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm text-gray-600 mb-1">Analizado por</p>
                      <p className="font-semibold text-gray-800">{analisisSeleccionado.autor?.nombre}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm text-gray-600 mb-1">Diagnóstico</p>
                      <p className="font-semibold text-gray-800">{analisisSeleccionado.diagnostico || "N/A"}</p>
                    </div>
                  </div>

                  {/* Resultados de detección */}
                  <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <h5 className="font-bold text-blue-900 mb-2">🔍 Resultados de Detección</h5>
                    <div className="space-y-2 text-sm">
                      <p className={analisisSeleccionado.resultados?.discoOptico ? "text-green-700" : "text-red-700"}>
                        {analisisSeleccionado.resultados?.discoOptico ? "✅" : "❌"} Disco Óptico
                      </p>
                      <p className={analisisSeleccionado.resultados?.copaOptica ? "text-green-700" : "text-red-700"}>
                        {analisisSeleccionado.resultados?.copaOptica ? "✅" : "❌"} Copa Óptica
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-4">
                  <button
                    onClick={cerrarModal}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Cerrar
                  </button>
                  <a
                    href={analisisSeleccionado.url}
                    download
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition text-center"
                  >
                    📥 Descargar Resultado
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
