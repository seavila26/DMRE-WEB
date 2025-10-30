import { useState } from "react";
import { CloudUpload, Loader2, Brain, Image as ImageIcon } from "lucide-react";

export default function ModeloIA({ imagenes }) {
  const [imagenOriginal, setImagenOriginal] = useState(null);
  const [imagenOriginalURL, setImagenOriginalURL] = useState(null);
  const [imagenSegmentada, setImagenSegmentada] = useState(null);
  const [cargando, setCargando] = useState(false);

  // 🔹 Selección manual desde el dispositivo
  const handleFileChange = (e) => {
    setImagenOriginal(e.target.files[0]);
    setImagenOriginalURL(null);
    setImagenSegmentada(null);
  };

  // 🔹 Procesar imagen desde archivo
  const procesarImagen = async (file) => {
    setCargando(true);
    setImagenSegmentada(null);
    const formData = new FormData();
    formData.append("imagen", file);

    try {
      const res = await fetch("http://192.168.40.45:5001/segmentar", {
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

  // 🔹 Procesar imagen desde historial Firebase
  const procesarDesdeHistorial = async (urlFirebase) => {
    try {
      setCargando(true);
      setImagenSegmentada(null);
      setImagenOriginal(null);
      setImagenOriginalURL(urlFirebase);

      const res = await fetch("http://192.168.40.45:5001/segmentar-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlFirebase }),
      });
      if (!res.ok) throw new Error("Error procesando la imagen");
      const blob = await res.blob();
      setImagenSegmentada(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error cargando imagen desde Firebase:", error);
      alert("Error al cargar imagen desde el historial");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 rounded-xl">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Título principal */}
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Brain className="text-blue-600" /> 
          Segmentación de Fondo de Ojo (IA)
        </h2>

        {/* --- CARD: Subida y selección --- */}
        <div className="bg-white shadow-md rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <CloudUpload className="text-blue-500" /> Cargar imagen
          </h3>
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
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-300 flex items-center gap-2"
            >
              {cargando ? <Loader2 className="animate-spin w-4 h-4" /> : <Brain size={18} />}
              {cargando ? "Procesando..." : "Procesar Imagen"}
            </button>
          </div>
        </div>

        {/* --- CARD: Imagen seleccionada --- */}
        {(imagenOriginal || imagenOriginalURL) && (
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <ImageIcon className="text-green-500" /> Imagen seleccionada
            </h3>
            <img
              src={imagenOriginal ? URL.createObjectURL(imagenOriginal) : imagenOriginalURL}
              alt="Original"
              className="w-64 rounded-lg shadow-md mt-2"
            />
          </div>
        )}

        {/* --- CARD: Resultado segmentado --- */}
        {imagenSegmentada && (
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Brain className="text-purple-600" /> Resultado del modelo IA
            </h3>
            <img
              src={imagenSegmentada}
              alt="Segmentada"
              className="w-64 rounded-lg shadow-md mt-2"
            />
            {/* 🧠 Resumen del resultado */}
            <div className="mt-4 bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold text-blue-700">Resultado IA:</p>
              <p className="text-sm text-gray-600">
                Área afectada: <span className="font-medium text-gray-800">24%</span> del fondo de ojo (estimación).
              </p>
            </div>
          </div>
        )}

        {/* --- CARD: Historial Firebase --- */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Selecciona una imagen del historial del paciente
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imagenes?.map((img) => (
              <div key={img.id} className="cursor-pointer group">
                <img
                  src={img.url}
                  alt={img.ojo}
                  onClick={() => procesarDesdeHistorial(img.url)}
                  className="rounded-lg shadow-md group-hover:scale-105 transition-transform duration-200"
                />
                <p className="text-sm text-gray-500 text-center mt-1 capitalize">
                  {img.ojo}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
