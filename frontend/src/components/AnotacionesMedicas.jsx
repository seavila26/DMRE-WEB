import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function AnotacionesMedicas({ pacienteId, visitaId, analisisId }) {
  const { user } = useAuth();
  const [anotaciones, setAnotaciones] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [vistaTimeline, setVistaTimeline] = useState(false);
  const [imagenesDisponibles, setImagenesDisponibles] = useState([]);
  const [cargandoImagenes, setCargandoImagenes] = useState(false);

  // Estado del formulario
  const [formulario, setFormulario] = useState({
    severidad: "leve",
    observaciones: "",
    recomendaciones: "",
    seguimientoRequerido: false,
    proximaRevision: "",
    imagenesRelacionadas: [],
  });

  // Cargar anotaciones
  useEffect(() => {
    cargarAnotaciones();
    cargarImagenes();
  }, [pacienteId, visitaId, analisisId]);

  const cargarAnotaciones = async () => {
    try {
      setCargando(true);
      let anotacionesRef;

      if (analisisId) {
        // Anotaciones específicas del análisis IA
        anotacionesRef = collection(
          db,
          "pacientes",
          pacienteId,
          "visitas",
          visitaId,
          "analisis",
          analisisId,
          "anotaciones"
        );
      } else {
        // Anotaciones generales de la visita
        anotacionesRef = collection(db, "pacientes", pacienteId, "visitas", visitaId, "anotaciones");
      }

      const q = query(anotacionesRef, orderBy("fecha", "desc"));
      const snapshot = await getDocs(q);
      const anotacionesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAnotaciones(anotacionesData);
    } catch (error) {
      console.error("Error cargando anotaciones:", error);
    } finally {
      setCargando(false);
    }
  };

  const cargarImagenes = async () => {
    try {
      setCargandoImagenes(true);

      // Cargar todas las imágenes de la visita
      const imagenesRef = collection(db, "pacientes", pacienteId, "visitas", visitaId, "imagenes");
      const snapshot = await getDocs(imagenesRef);
      const imagenes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setImagenesDisponibles(imagenes);
    } catch (error) {
      console.error("Error cargando imágenes:", error);
    } finally {
      setCargandoImagenes(false);
    }
  };

  const toggleImagenSeleccionada = (imagenId) => {
    setFormulario((prev) => {
      const yaSeleccionada = prev.imagenesRelacionadas.includes(imagenId);

      if (yaSeleccionada) {
        return {
          ...prev,
          imagenesRelacionadas: prev.imagenesRelacionadas.filter((id) => id !== imagenId),
        };
      } else {
        return {
          ...prev,
          imagenesRelacionadas: [...prev.imagenesRelacionadas, imagenId],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que se hayan seleccionado al menos 2 imágenes
    if (formulario.imagenesRelacionadas.length < 2) {
      alert("⚠️ Debes seleccionar al menos 2 imágenes para crear una anotación clínica");
      return;
    }

    try {
      const anotacionData = {
        ...formulario,
        fecha: new Date().toISOString(),
        autor: {
          uid: user.uid,
          nombre: user.displayName || user.email,
          email: user.email,
        },
        pacienteId,
        visitaId,
        analisisId: analisisId || null,
      };

      let anotacionesRef;
      if (analisisId) {
        anotacionesRef = collection(
          db,
          "pacientes",
          pacienteId,
          "visitas",
          visitaId,
          "analisis",
          analisisId,
          "anotaciones"
        );
      } else {
        anotacionesRef = collection(db, "pacientes", pacienteId, "visitas", visitaId, "anotaciones");
      }

      if (editando) {
        // Actualizar anotación existente
        await updateDoc(doc(anotacionesRef, editando.id), {
          ...formulario,
          fechaModificacion: new Date().toISOString(),
        });
        alert("✅ Anotación actualizada correctamente");
      } else {
        // Crear nueva anotación
        await addDoc(anotacionesRef, anotacionData);
        alert("✅ Anotación guardada correctamente");
      }

      // Resetear formulario
      setFormulario({
        severidad: "leve",
        observaciones: "",
        recomendaciones: "",
        seguimientoRequerido: false,
        proximaRevision: "",
        imagenesRelacionadas: [],
      });
      setMostrarFormulario(false);
      setEditando(null);
      cargarAnotaciones();
    } catch (error) {
      console.error("Error guardando anotación:", error);
      alert("❌ Error al guardar la anotación");
    }
  };

  const handleEditar = (anotacion) => {
    setEditando(anotacion);
    setFormulario({
      severidad: anotacion.severidad,
      observaciones: anotacion.observaciones,
      recomendaciones: anotacion.recomendaciones || "",
      seguimientoRequerido: anotacion.seguimientoRequerido || false,
      proximaRevision: anotacion.proximaRevision || "",
      imagenesRelacionadas: anotacion.imagenesRelacionadas || [],
    });
    setMostrarFormulario(true);
  };

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSeveridadColor = (severidad) => {
    const colores = {
      normal: "bg-green-100 text-green-700 border-green-300",
      leve: "bg-yellow-100 text-yellow-700 border-yellow-300",
      moderado: "bg-orange-100 text-orange-700 border-orange-300",
      severo: "bg-red-100 text-red-700 border-red-300",
      critico: "bg-red-200 text-red-900 border-red-500",
    };
    return colores[severidad] || colores.leve;
  };

  return (
    <div className="space-y-6">
      {/* Header con botón para agregar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          📝 Anotaciones Clínicas
        </h3>
        <div className="flex items-center gap-3">
          {/* Toggle de vista */}
          {anotaciones.length > 0 && !mostrarFormulario && (
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setVistaTimeline(false)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  !vistaTimeline
                    ? "bg-white text-blue-600 shadow"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                📋 Lista
              </button>
              <button
                onClick={() => setVistaTimeline(true)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  vistaTimeline
                    ? "bg-white text-blue-600 shadow"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                📈 Línea de Tiempo
              </button>
            </div>
          )}
          {!mostrarFormulario && (
            <button
              onClick={() => {
                setMostrarFormulario(true);
                setEditando(null);
                setFormulario({
                  severidad: "leve",
                  observaciones: "",
                  recomendaciones: "",
                  seguimientoRequerido: false,
                  proximaRevision: "",
                  imagenesRelacionadas: [],
                });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:scale-105"
            >
              <span>➕</span>
              <span>Nueva Anotación</span>
            </button>
          )}
        </div>
      </div>

      {/* Formulario de anotación */}
      {mostrarFormulario && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h4 className="text-lg font-bold text-gray-800 mb-4">
            {editando ? "Editar Anotación" : "Nueva Anotación Clínica"}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Severidad */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Clasificación de Severidad *
              </label>
              <select
                value={formulario.severidad}
                onChange={(e) => setFormulario({ ...formulario, severidad: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="normal">Normal - Sin signos de enfermedad</option>
                <option value="leve">Leve - Cambios mínimos detectados</option>
                <option value="moderado">Moderado - Requiere monitoreo frecuente</option>
                <option value="severo">Severo - Requiere intervención</option>
                <option value="critico">Crítico - Requiere atención inmediata</option>
              </select>
            </div>

            {/* Selección de Imágenes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Seleccionar Imágenes para Análisis * (Mínimo 2)
              </label>
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4">
                {cargandoImagenes ? (
                  <div className="text-center py-4">
                    <div className="inline-block w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-600 mt-2">Cargando imágenes...</p>
                  </div>
                ) : imagenesDisponibles.length > 0 ? (
                  <>
                    <p className="text-sm text-gray-600 mb-3">
                      Seleccionadas: {formulario.imagenesRelacionadas.length} de {imagenesDisponibles.length}
                      {formulario.imagenesRelacionadas.length < 2 && (
                        <span className="text-red-600 font-semibold ml-2">
                          (Debes seleccionar al menos 2 imágenes)
                        </span>
                      )}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {imagenesDisponibles.map((imagen) => {
                        const estaSeleccionada = formulario.imagenesRelacionadas.includes(imagen.id);
                        return (
                          <div
                            key={imagen.id}
                            onClick={() => toggleImagenSeleccionada(imagen.id)}
                            className={`relative cursor-pointer rounded-lg overflow-hidden border-4 transition-all ${
                              estaSeleccionada
                                ? "border-blue-500 shadow-lg scale-105"
                                : "border-transparent hover:border-gray-300"
                            }`}
                          >
                            <img
                              src={imagen.url}
                              alt={`${imagen.ojo} - ${imagen.tipo}`}
                              className="w-full h-32 object-cover"
                              crossOrigin="anonymous"
                            />
                            <div className={`absolute inset-0 flex items-center justify-center ${
                              estaSeleccionada ? "bg-blue-500 bg-opacity-30" : "bg-black bg-opacity-0 hover:bg-opacity-20"
                            } transition-all`}>
                              {estaSeleccionada && (
                                <div className="bg-blue-600 rounded-full p-2 shadow-lg">
                                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className={`absolute bottom-0 left-0 right-0 p-2 ${
                              imagen.ojo === "derecho" ? "bg-blue-600" : "bg-green-600"
                            } bg-opacity-90`}>
                              <p className="text-xs text-white font-bold truncate">
                                {imagen.ojo === "derecho" ? "👁️ Derecho" : "👁️ Izquierdo"}
                              </p>
                              <p className="text-xs text-white opacity-90">
                                {imagen.tipo === "analisis_ia" ? "🤖 IA" : "📸 Original"}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2 opacity-50">🖼️</div>
                    <p className="text-sm text-gray-600">No hay imágenes disponibles en esta visita</p>
                    <p className="text-xs text-gray-500 mt-1">Sube imágenes primero para crear anotaciones</p>
                  </div>
                )}
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Observaciones Clínicas *
              </label>
              <textarea
                value={formulario.observaciones}
                onChange={(e) => setFormulario({ ...formulario, observaciones: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describa los hallazgos clínicos, cambios observados, síntomas reportados por el paciente, etc."
                required
              />
            </div>

            {/* Recomendaciones */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Recomendaciones de Tratamiento
              </label>
              <textarea
                value={formulario.recomendaciones}
                onChange={(e) => setFormulario({ ...formulario, recomendaciones: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Indicaciones terapéuticas, cambios en medicación, sugerencias de seguimiento, etc."
              />
            </div>

            {/* Seguimiento requerido */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="seguimiento"
                checked={formulario.seguimientoRequerido}
                onChange={(e) =>
                  setFormulario({ ...formulario, seguimientoRequerido: e.target.checked })
                }
                className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded"
              />
              <label htmlFor="seguimiento" className="text-sm font-medium text-gray-700">
                Requiere seguimiento próximo
              </label>
            </div>

            {/* Próxima revisión */}
            {formulario.seguimientoRequerido && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha sugerida para próxima revisión
                </label>
                <input
                  type="date"
                  value={formulario.proximaRevision}
                  onChange={(e) => setFormulario({ ...formulario, proximaRevision: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
              >
                {editando ? "Actualizar Anotación" : "Guardar Anotación"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMostrarFormulario(false);
                  setEditando(null);
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista/Timeline de anotaciones */}
      {cargando ? (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-2">Cargando anotaciones...</p>
        </div>
      ) : anotaciones.length > 0 ? (
        <>
          {/* Vista de Lista */}
          {!vistaTimeline && (
            <div className="space-y-4">
              {anotaciones.map((anotacion) => (
                <div
                  key={anotacion.id}
                  className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${getSeveridadColor(
                    anotacion.severidad
                  )}`}
                >
                  {/* Header de la anotación */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getSeveridadColor(
                            anotacion.severidad
                          )}`}
                        >
                          {anotacion.severidad}
                        </span>
                        {anotacion.seguimientoRequerido && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-300">
                            ⏰ Seguimiento Requerido
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        <strong>Fecha:</strong> {formatearFecha(anotacion.fecha)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Médico:</strong> {anotacion.autor?.nombre}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEditar(anotacion)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                    >
                      ✏️ Editar
                    </button>
                  </div>

                  {/* Contenido */}
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-bold text-gray-700 mb-1">📋 Observaciones:</h5>
                      <p className="text-gray-800 whitespace-pre-wrap">{anotacion.observaciones}</p>
                    </div>

                    {anotacion.recomendaciones && (
                      <div>
                        <h5 className="text-sm font-bold text-gray-700 mb-1">💊 Recomendaciones:</h5>
                        <p className="text-gray-800 whitespace-pre-wrap">{anotacion.recomendaciones}</p>
                      </div>
                    )}

                    {/* Imágenes Relacionadas */}
                    {anotacion.imagenesRelacionadas && anotacion.imagenesRelacionadas.length > 0 && (
                      <div>
                        <h5 className="text-sm font-bold text-gray-700 mb-2">
                          🖼️ Imágenes Analizadas ({anotacion.imagenesRelacionadas.length})
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {anotacion.imagenesRelacionadas.map((imagenId) => {
                            const imagen = imagenesDisponibles.find((img) => img.id === imagenId);
                            if (!imagen) return null;
                            return (
                              <div key={imagenId} className="relative rounded-lg overflow-hidden border-2 border-gray-200 group">
                                <img
                                  src={imagen.url}
                                  alt={`${imagen.ojo}`}
                                  className="w-full h-24 object-cover"
                                  crossOrigin="anonymous"
                                />
                                <div className={`absolute bottom-0 left-0 right-0 p-1 ${
                                  imagen.ojo === "derecho" ? "bg-blue-600" : "bg-green-600"
                                } bg-opacity-90`}>
                                  <p className="text-xs text-white font-bold text-center">
                                    {imagen.ojo === "derecho" ? "👁️ Der" : "👁️ Izq"}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {anotacion.proximaRevision && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-3">
                        <p className="text-sm font-semibold text-purple-900">
                          📅 Próxima revisión sugerida:{" "}
                          {new Date(anotacion.proximaRevision).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Vista de Timeline */}
          {vistaTimeline && (
            <div className="relative">
              {/* Línea vertical del timeline */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400"></div>

              <div className="space-y-8">
                {[...anotaciones].reverse().map((anotacion, index) => {
                  const severidadOrder = { normal: 1, leve: 2, moderado: 3, severo: 4, critico: 5 };
                  const prevAnotacion = index > 0 ? [...anotaciones].reverse()[index - 1] : null;
                  let tendencia = null;

                  if (prevAnotacion) {
                    const severidadActual = severidadOrder[anotacion.severidad] || 2;
                    const severidadAnterior = severidadOrder[prevAnotacion.severidad] || 2;
                    if (severidadActual > severidadAnterior) tendencia = "empeorando";
                    else if (severidadActual < severidadAnterior) tendencia = "mejorando";
                    else tendencia = "estable";
                  }

                  return (
                    <div key={anotacion.id} className="relative pl-20">
                      {/* Punto en el timeline */}
                      <div className="absolute left-0 flex items-center">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-white ${getSeveridadColor(
                            anotacion.severidad
                          )}`}
                        >
                          <span className="text-2xl">
                            {anotacion.severidad === "normal"
                              ? "✅"
                              : anotacion.severidad === "leve"
                              ? "⚠️"
                              : anotacion.severidad === "moderado"
                              ? "🔶"
                              : anotacion.severidad === "severo"
                              ? "🔴"
                              : "🚨"}
                          </span>
                        </div>
                      </div>

                      {/* Tarjeta de la anotación */}
                      <div
                        className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${getSeveridadColor(
                          anotacion.severidad
                        )}`}
                      >
                        {/* Header con tendencia */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getSeveridadColor(
                                  anotacion.severidad
                                )}`}
                              >
                                {anotacion.severidad}
                              </span>
                              {tendencia && (
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    tendencia === "mejorando"
                                      ? "bg-green-100 text-green-700"
                                      : tendencia === "empeorando"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {tendencia === "mejorando"
                                    ? "📈 Mejorando"
                                    : tendencia === "empeorando"
                                    ? "📉 Empeorando"
                                    : "➡️ Estable"}
                                </span>
                              )}
                              {anotacion.seguimientoRequerido && (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                                  ⏰ Seguimiento
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 font-semibold">
                              📅 {formatearFecha(anotacion.fecha)}
                            </p>
                            <p className="text-xs text-gray-500">👨‍⚕️ {anotacion.autor?.nombre}</p>
                          </div>
                          <button
                            onClick={() => handleEditar(anotacion)}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                          >
                            ✏️ Editar
                          </button>
                        </div>

                        {/* Contenido */}
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                              Observaciones
                            </p>
                            <p className="text-sm text-gray-800">{anotacion.observaciones}</p>
                          </div>

                          {anotacion.recomendaciones && (
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                                Recomendaciones
                              </p>
                              <p className="text-sm text-gray-800">{anotacion.recomendaciones}</p>
                            </div>
                          )}

                          {/* Imágenes Relacionadas */}
                          {anotacion.imagenesRelacionadas && anotacion.imagenesRelacionadas.length > 0 && (
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                                Imágenes Analizadas ({anotacion.imagenesRelacionadas.length})
                              </p>
                              <div className="grid grid-cols-3 gap-1.5">
                                {anotacion.imagenesRelacionadas.map((imagenId) => {
                                  const imagen = imagenesDisponibles.find((img) => img.id === imagenId);
                                  if (!imagen) return null;
                                  return (
                                    <div key={imagenId} className="relative rounded overflow-hidden border border-gray-200">
                                      <img
                                        src={imagen.url}
                                        alt={`${imagen.ojo}`}
                                        className="w-full h-16 object-cover"
                                        crossOrigin="anonymous"
                                      />
                                      <div className={`absolute bottom-0 left-0 right-0 py-0.5 ${
                                        imagen.ojo === "derecho" ? "bg-blue-600" : "bg-green-600"
                                      } bg-opacity-90`}>
                                        <p className="text-xs text-white font-bold text-center">
                                          {imagen.ojo === "derecho" ? "👁️ D" : "👁️ I"}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {anotacion.proximaRevision && (
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 mt-2">
                              <p className="text-xs font-semibold text-purple-900">
                                📅 Próxima revisión:{" "}
                                {new Date(anotacion.proximaRevision).toLocaleDateString("es-ES", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-8xl mb-4 opacity-50">📝</div>
          <h4 className="text-xl font-bold text-gray-700 mb-2">No hay anotaciones clínicas aún</h4>
          <p className="text-gray-600 mb-6">
            Agrega la primera anotación clínica para comenzar el seguimiento del paciente
          </p>
        </div>
      )}
    </div>
  );
}
