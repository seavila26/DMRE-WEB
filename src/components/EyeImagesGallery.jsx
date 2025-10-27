// EyeImagesGallery.jsx
import { useState, useEffect } from "react";

export default function EyeImagesGallery({ imagenes }) {
  const [selectedImg, setSelectedImg] = useState(null);
  const [compare, setCompare] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const toggleSelectForCompare = (img) => {
    setCompare((prev) => {
      if (prev.find((p) => p.id === img.id)) return prev.filter((p) => p.id !== img.id);
      if (prev.length >= 2) return prev;
      return [...prev, img];
    });
  };

  const openCompare = () => {
    if (compare.length === 2) setShowCompareModal(true);
    else alert("Selecciona 2 imágenes para comparar.");
  };

  // cerrar modal con tecla Esc
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setSelectedImg(null);
        setShowCompareModal(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (!imagenes) return <p className="text-gray-500">No hay imágenes para mostrar.</p>;

  return (
    <div className="mt-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">📸 Galería</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={openCompare}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
            disabled={compare.length < 2}
          >
            Comparar (2)
          </button>
          <span className="text-sm text-gray-600">
            Seleccionadas: {compare.length}
          </span>
        </div>
      </div>

      {/* Galería en columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Izquierdo */}
        <div>
          <h3 className="font-semibold mb-3 text-blue-700">Ojo Izquierdo</h3>
          {imagenes?.izquierdo?.length > 0 ? (
            <div className="flex gap-3 flex-wrap">
              {imagenes.izquierdo.map((img) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.url}
                    alt={`izq-${img.id}`}
                    className="w-32 h-32 object-cover rounded-lg border shadow-sm cursor-pointer group-hover:scale-105 transition"
                    onClick={() => setSelectedImg(img)}
                  />
                  <input
                    type="checkbox"
                    className="absolute top-2 left-2 w-4 h-4 accent-blue-600"
                    checked={!!compare.find((p) => p.id === img.id)}
                    onChange={() => toggleSelectForCompare(img)}
                  />
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    {new Date(img.fecha).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Sin imágenes</p>
          )}
        </div>

        {/* Derecho */}
        <div>
          <h3 className="font-semibold mb-3 text-blue-700">Ojo Derecho</h3>
          {imagenes?.derecho?.length > 0 ? (
            <div className="flex gap-3 flex-wrap">
              {imagenes.derecho.map((img) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.url}
                    alt={`der-${img.id}`}
                    className="w-32 h-32 object-cover rounded-lg border shadow-sm cursor-pointer group-hover:scale-105 transition"
                    onClick={() => setSelectedImg(img)}
                  />
                  <input
                    type="checkbox"
                    className="absolute top-2 left-2 w-4 h-4 accent-blue-600"
                    checked={!!compare.find((p) => p.id === img.id)}
                    onChange={() => toggleSelectForCompare(img)}
                  />
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    {new Date(img.fecha).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Sin imágenes</p>
          )}
        </div>
      </div>

      {/* Modal detalle */}
      {selectedImg && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImg(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen */}
            <div className="flex justify-center items-center">
              <img
                src={selectedImg.url}
                alt="detalle"
                className="max-w-full max-h-[75vh] rounded-lg shadow-lg"
              />
            </div>

            {/* Detalles */}
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Detalles de la imagen
                </h3>
                <p><strong>Ojo:</strong> {selectedImg.ojo}</p>
                <p><strong>Fecha:</strong> {new Date(selectedImg.fecha).toLocaleString()}</p>
                <p><strong>Origen:</strong> {selectedImg.origen}</p>
                <p><strong>Diagnóstico:</strong> {selectedImg.diagnostico || "—"}</p>
                <p><strong>VisitId:</strong> {selectedImg.visitId || "—"}</p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => toggleSelectForCompare(selectedImg)}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  {compare.find((p) => p.id === selectedImg.id)
                    ? "Quitar de comparación"
                    : "Agregar a comparación"}
                </button>
                <button
                  onClick={() => setSelectedImg(null)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal comparación */}
      {showCompareModal && compare.length === 2 && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowCompareModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-6xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {compare.map((img, idx) => (
                <div key={idx} className="text-center">
                  <img
                    src={img.url}
                    alt={`cmp-${idx}`}
                    className="max-w-full max-h-[75vh] rounded-lg shadow-md border"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    {new Date(img.fecha).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowCompareModal(false);
                  setCompare([]);
                }}
                className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Cerrar comparación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
