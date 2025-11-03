import { useState } from "react";
import { exportarAnalisisComparativoPDF } from "../utils/exportUtils";

export default function AnalisisIA({ imagenes, pacienteNombre }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [analisisSeleccionado, setAnalisisSeleccionado] = useState(null);
  const [filtroOjo, setFiltroOjo] = useState("todos");
  const [filtroFecha, setFiltroFecha] = useState("todos");
  const [descargandoPDF, setDescargandoPDF] = useState(false);

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

  // Aplicar filtros
  const analisisFiltrados = analisisIA?.filter(analisis => {
    // Filtro por ojo
    if (filtroOjo !== "todos" && analisis.ojo !== filtroOjo) {
      return false;
    }

    // Filtro por fecha
    if (filtroFecha !== "todos") {
      const fechaAnalisis = new Date(analisis.fechaAnalisis);
      const hoy = new Date();
      const diferenciaDias = Math.floor((hoy - fechaAnalisis) / (1000 * 60 * 60 * 24));

      if (filtroFecha === "hoy" && diferenciaDias > 0) return false;
      if (filtroFecha === "semana" && diferenciaDias > 7) return false;
      if (filtroFecha === "mes" && diferenciaDias > 30) return false;
    }

    return true;
  });

  // Calcular estadísticas
  const estadisticas = {
    total: analisisIA?.length || 0,
    derecho: analisisIA?.filter(a => a.ojo === "derecho").length || 0,
    izquierdo: analisisIA?.filter(a => a.ojo === "izquierdo").length || 0,
    confianzaPromedio: analisisIA?.length > 0
      ? (analisisIA.reduce((sum, a) => sum + (a.resultados?.confianza || 0), 0) / analisisIA.length * 100).toFixed(1)
      : 0,
    ultimoAnalisis: analisisIA?.length > 0
      ? new Date(analisisIA[0].fechaAnalisis).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      : "N/A",
    discoOpticoDetectado: analisisIA?.filter(a => a.resultados?.discoOptico).length || 0,
    copaOpticaDetectada: analisisIA?.filter(a => a.resultados?.copaOptica).length || 0
  };

  // Obtener lista de médicos que han analizado
  const medicos = analisisIA?.reduce((acc, analisis) => {
    const nombreMedico = analisis.autor?.nombre || "N/A";
    if (!acc[nombreMedico]) {
      acc[nombreMedico] = 0;
    }
    acc[nombreMedico]++;
    return acc;
  }, {});

  // Abrir modal con detalle del análisis
  const verDetalle = (analisis) => {
    setAnalisisSeleccionado(analisis);
    setModalAbierto(true);
  };

  // Cerrar modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setAnalisisSeleccionado(null);
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

  // Descargar PDF del análisis comparativo
  const handleDescargarPDF = async () => {
    try {
      setDescargandoPDF(true);
      await exportarAnalisisComparativoPDF(analisisSeleccionado, pacienteNombre || "Paciente");
      alert("✅ PDF generado y descargado correctamente");
    } catch (error) {
      console.error("Error descargando PDF:", error);
      alert("❌ Error al generar el PDF. Por favor, intenta de nuevo.");
    } finally {
      setDescargandoPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 rounded-xl">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Título principal */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
            🧠 Historial de Análisis IA
          </h2>
          <p className="text-gray-600 mt-2">Segmentación de Fondo de Ojo con Inteligencia Artificial</p>
        </div>

        {/* ========================================= */}
        {/* ESTADÍSTICAS */}
        {/* ========================================= */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
          <h3 className="text-2xl font-bold text-blue-800 mb-6 flex items-center gap-2">
            <span className="text-3xl">📊</span>
            Resumen del Paciente
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-sm text-gray-600 mb-1">Total de análisis IA</p>
              <p className="text-3xl font-bold text-blue-600">{estadisticas.total}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-sm text-gray-600 mb-1">Ojo derecho</p>
              <p className="text-3xl font-bold text-green-600">{estadisticas.derecho}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-sm text-gray-600 mb-1">Ojo izquierdo</p>
              <p className="text-3xl font-bold text-purple-600">{estadisticas.izquierdo}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-sm text-gray-600 mb-1">Confianza promedio</p>
              <p className="text-3xl font-bold text-indigo-600">{estadisticas.confianzaPromedio}%</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h4 className="font-semibold text-gray-800 mb-3">🩺 Información Adicional</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="mb-2">
                  <strong>Último análisis:</strong> {estadisticas.ultimoAnalisis}
                </p>
                <p className="mb-2">
                  <strong>Disco óptico detectado:</strong> {estadisticas.discoOpticoDetectado} de {estadisticas.total} ({estadisticas.total > 0 ? ((estadisticas.discoOpticoDetectado / estadisticas.total) * 100).toFixed(0) : 0}%)
                </p>
                <p>
                  <strong>Copa óptica detectada:</strong> {estadisticas.copaOpticaDetectada} de {estadisticas.total} ({estadisticas.total > 0 ? ((estadisticas.copaOpticaDetectada / estadisticas.total) * 100).toFixed(0) : 0}%)
                </p>
              </div>
              <div>
                <p className="font-semibold mb-2">👨‍⚕️ Médicos que analizaron:</p>
                <ul className="space-y-1">
                  {medicos && Object.entries(medicos).map(([nombre, cantidad]) => (
                    <li key={nombre} className="text-gray-600">
                      • {nombre}: {cantidad} análisis
                    </li>
                  ))}
                  {(!medicos || Object.keys(medicos).length === 0) && (
                    <li className="text-gray-500 italic">No hay datos disponibles</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* FILTROS */}
        {/* ========================================= */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            Filtros
          </h3>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ojo</label>
              <select
                value={filtroOjo}
                onChange={(e) => setFiltroOjo(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todos">Todos</option>
                <option value="derecho">👁️ Ojo Derecho</option>
                <option value="izquierdo">👁️ Ojo Izquierdo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
              <select
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todos">Todas las fechas</option>
                <option value="hoy">Hoy</option>
                <option value="semana">Última semana</option>
                <option value="mes">Último mes</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFiltroOjo("todos");
                  setFiltroFecha("todos");
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Mostrando <strong>{analisisFiltrados?.length || 0}</strong> de <strong>{analisisIA?.length || 0}</strong> análisis
          </p>
        </div>

        {/* ========================================= */}
        {/* GALERÍA DE ANÁLISIS */}
        {/* ========================================= */}
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 border-2 border-green-200">
          <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
            <span className="text-3xl">📋</span>
            Análisis Realizados
          </h3>

          {analisisFiltrados && analisisFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analisisFiltrados.map((analisis) => (
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
                      {analisis.diagnosticoIA && (
                        <p>
                          <strong>🤖 Diagnóstico IA:</strong>{" "}
                          <span className={`font-semibold ${
                            analisis.diagnosticoIA === "Normal" ? "text-green-600" :
                            analisis.diagnosticoIA === "Leve" ? "text-yellow-600" :
                            analisis.diagnosticoIA === "Moderada" ? "text-orange-600" :
                            analisis.diagnosticoIA === "Avanzada" ? "text-red-600" :
                            analisis.diagnosticoIA === "Severa" ? "text-red-700" :
                            analisis.diagnosticoIA === "Terminal" ? "text-red-900" :
                            "text-gray-600"
                          }`}>
                            {analisis.diagnosticoIA}
                          </span>
                        </p>
                      )}
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
                {analisisIA && analisisIA.length > 0
                  ? "No hay análisis que coincidan con los filtros"
                  : "No hay análisis previos"}
              </h4>
              <p className="text-gray-500">
                {analisisIA && analisisIA.length > 0
                  ? "Intenta cambiar los filtros para ver más resultados."
                  : "Los análisis procesados con IA aparecerán aquí automáticamente."}
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
                      <p className="text-sm text-gray-600 mb-1">Observación Clínica</p>
                      <p className="font-semibold text-gray-800">{analisisSeleccionado.diagnostico || "N/A"}</p>
                    </div>
                  </div>

                  {/* Diagnóstico IA */}
                  {analisisSeleccionado.diagnosticoIA && (
                    <div className="mt-6 bg-gradient-to-br from-purple-50 to-blue-50 border-l-4 border-purple-500 p-4 rounded">
                      <h5 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                        <span className="text-xl">🤖</span>
                        Diagnóstico Generado por IA
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Estadio detectado</p>
                          <p className={`font-bold text-lg ${
                            analisisSeleccionado.diagnosticoIA === "Normal" ? "text-green-600" :
                            analisisSeleccionado.diagnosticoIA === "Leve" ? "text-yellow-600" :
                            analisisSeleccionado.diagnosticoIA === "Moderada" ? "text-orange-600" :
                            analisisSeleccionado.diagnosticoIA === "Avanzada" ? "text-red-600" :
                            analisisSeleccionado.diagnosticoIA === "Severa" ? "text-red-700" :
                            analisisSeleccionado.diagnosticoIA === "Terminal" ? "text-red-900" :
                            "text-gray-600"
                          }`}>
                            {analisisSeleccionado.diagnosticoIA}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Confianza del modelo</p>
                          <p className="font-bold text-lg text-blue-600">
                            {(analisisSeleccionado.confianzaIA * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 italic mt-3">
                        ℹ️ Este diagnóstico es generado automáticamente por el modelo de IA y debe ser validado por un profesional médico.
                      </p>
                    </div>
                  )}

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
                  <button
                    onClick={handleDescargarPDF}
                    disabled={descargandoPDF}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {descargandoPDF ? "⏳ Generando PDF..." : "📥 Descargar Resultado (PDF)"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
