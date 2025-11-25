import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import {
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  PlusIcon,
  ClockIcon,
  PencilSquareIcon,
  PhotoIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

export default function AnotacionesMedicas({ pacienteId, visitaId, analisisId }) {
  const { user } = useAuth();
  const [anotaciones, setAnotaciones] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [vistaTimeline, setVistaTimeline] = useState(false);
  const [imagenesDisponibles, setImagenesDisponibles] = useState([]);
  const [cargandoImagenes, setCargandoImagenes] = useState(false);
  const [modalImagenesAbierto, setModalImagenesAbierto] = useState(false);

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
          <DocumentTextIcon className="h-7 w-7 text-blue-600" />
          Anotaciones Clínicas
        </h3>
        <div className="flex items-center gap-3">
          {/* Toggle de vista */}
          {anotaciones.length > 0 && !mostrarFormulario && (
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setVistaTimeline(false)}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  !vistaTimeline
                    ? "bg-white text-blue-600 shadow"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <ClipboardDocumentListIcon className="h-5 w-5" />
                Lista
              </button>
              <button
                onClick={() => setVistaTimeline(true)}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  vistaTimeline
                    ? "bg-white text-blue-600 shadow"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <ChartBarIcon className="h-5 w-5" />
                Línea de Tiempo
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
              <PlusIcon className="h-5 w-5" />
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
                Imágenes para Análisis * (Mínimo 2)
              </label>
              <button
                type="button"
                onClick={() => setModalImagenesAbierto(true)}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800">Seleccionar Imágenes</p>
                    <p className="text-xs text-gray-600">
                      {formulario.imagenesRelacionadas.length > 0
                        ? `${formulario.imagenesRelacionadas.length} imagen${formulario.imagenesRelacionadas.length > 1 ? "es" : ""} seleccionada${formulario.imagenesRelacionadas.length > 1 ? "s" : ""}`
                        : "Haz clic para abrir la galería"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {formulario.imagenesRelacionadas.length >= 2 ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      ✓ Listo
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                      Requerido
                    </span>
                  )}
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
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
          <div className="flex justify-center mb-4 opacity-50">
            <DocumentTextIcon className="h-24 w-24 text-gray-400" />
          </div>
          <h4 className="text-xl font-bold text-gray-700 mb-2">No hay anotaciones clínicas aún</h4>
          <p className="text-gray-600 mb-6">
            Agrega la primera anotación clínica para comenzar el seguimiento del paciente
          </p>
        </div>
      )}

      {/* Modal de Selección de Imágenes */}
      {modalImagenesAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Galería de Imágenes</h3>
                  <p className="text-sm text-blue-100">
                    Selecciona al menos 2 imágenes para tu anotación clínica
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalImagenesAbierto(false)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg p-2 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contador */}
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">
                  Imágenes seleccionadas: {formulario.imagenesRelacionadas.length} de {imagenesDisponibles.length}
                </p>
                {formulario.imagenesRelacionadas.length >= 2 ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Cumple el requisito
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                    Mínimo 2 imágenes requeridas
                  </span>
                )}
              </div>
            </div>

            {/* Contenido Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {cargandoImagenes ? (
                <div className="text-center py-12">
                  <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-gray-600 mt-4">Cargando imágenes...</p>
                </div>
              ) : imagenesDisponibles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {imagenesDisponibles.map((imagen) => {
                    const estaSeleccionada = formulario.imagenesRelacionadas.includes(imagen.id);
                    return (
                      <div
                        key={imagen.id}
                        onClick={() => toggleImagenSeleccionada(imagen.id)}
                        className={`relative cursor-pointer rounded-xl overflow-hidden border-4 transition-all hover:shadow-xl ${
                          estaSeleccionada
                            ? "border-blue-500 shadow-lg scale-[1.02]"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        {/* Imagen */}
                        <div className="relative h-48 bg-gray-100">
                          <img
                            src={imagen.url}
                            alt={`${imagen.ojo} - ${imagen.tipo}`}
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                          />
                          {/* Overlay de selección */}
                          {estaSeleccionada && (
                            <div className="absolute inset-0 bg-blue-500 bg-opacity-30 flex items-center justify-center transition-all">
                              <div className="bg-blue-600 rounded-full p-3 shadow-lg animate-bounce">
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Información de la imagen */}
                        <div className="p-3 bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`px-2 py-1 rounded-lg text-xs font-bold ${
                                imagen.ojo === "derecho"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {imagen.ojo === "derecho" ? "👁️ Ojo Derecho" : "👁️ Ojo Izquierdo"}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
                              {imagen.tipo === "analisis_ia" ? "🤖 Análisis IA" : "📸 Original"}
                            </span>
                          </div>

                          {/* Fecha de registro */}
                          <div className="text-xs text-gray-600 space-y-1">
                            <p className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <strong>Registrado:</strong>{" "}
                              {imagen.fecha
                                ? new Date(imagen.fecha).toLocaleDateString("es-ES", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "N/A"}
                            </p>

                            {/* Información adicional según tipo */}
                            {imagen.tipo === "analisis_ia" && imagen.diagnosticoIA && (
                              <p className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                  <path
                                    fillRule="evenodd"
                                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <strong>Diagnóstico:</strong> {imagen.diagnosticoIA}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-50">🖼️</div>
                  <h4 className="text-xl font-bold text-gray-700 mb-2">No hay imágenes disponibles</h4>
                  <p className="text-gray-600">Sube imágenes en la visita primero para crear anotaciones</p>
                </div>
              )}
            </div>

            {/* Footer con botones */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Haz clic en las imágenes para seleccionar/deseleccionar
              </p>
              <button
                onClick={() => setModalImagenesAbierto(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
              >
                Confirmar Selección
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
