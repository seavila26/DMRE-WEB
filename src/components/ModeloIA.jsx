import { useState } from "react";

export default function ModeloIA({ imagenes }) {
  const [imagenOriginal, setImagenOriginal] = useState(null);
  const [imagenSegmentada, setImagenSegmentada] = useState(null);
  const [cargando, setCargando] = useState(false);

  // 🔹 Cuando el usuario selecciona una imagen del dispositivo
  const handleFileChange = (e) => {
    setImagenOriginal(e.target.files[0]);
    setImagenSegmentada(null);
  };

  // 🔹 Procesar la imagen seleccionada (dispositivo o historial)
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

  // 🔹 Cuando el usuario selecciona una imagen del historial
  const procesarDesdeHistorial = async (urlFirebase) => {
    try {
      setCargando(true);
      const response = await fetch(urlFirebase);
      const blob = await response.blob();
      await procesarImagen(blob);
    } catch (error) {
      console.error("Error cargando imagen desde Firebase:", error);
      alert("Error al cargar imagen desde el historial");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Segmentación de Fondo de Ojo (IA)</h2>

      {/* Subida de imagen manual */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={() => imagenOriginal && procesarImagen(imagenOriginal)}
          disabled={!imagenOriginal || cargando}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300"
        >
          {cargando ? "Procesando..." : "Procesar Imagen"}
        </button>
      </div>

      {/* Mostrar imagen original */}
      {imagenOriginal && (
        <div>
          <p className="font-medium text-gray-600">Imagen seleccionada:</p>
          <img
            src={URL.createObjectURL(imagenOriginal)}
            alt="Original"
            className="w-64 rounded-lg shadow-md mt-2"
          />
        </div>
      )}

      {/* Mostrar resultado */}
      {imagenSegmentada && (
        <div>
          <p className="font-medium text-gray-600">Resultado segmentado:</p>
          <img
            src={imagenSegmentada}
            alt="Segmentada"
            className="w-64 rounded-lg shadow-md mt-2"
          />
        </div>
      )}

      {/* Galería desde historial Firebase */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-2">O selecciona una imagen del historial:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imagenes?.map((img) => (
            <div key={img.id} className="cursor-pointer">
              <img
                src={img.url}
                alt={img.ojo}
                onClick={() => procesarDesdeHistorial(img.url)}
                className="rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
              />
              <p className="text-sm text-gray-500 text-center mt-1 capitalize">{img.ojo}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
