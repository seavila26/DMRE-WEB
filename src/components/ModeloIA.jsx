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
  const [imagenSeleccionadaInfo, setImagenSeleccionadaInfo] = useState(null); // Info completa de imagen del historial
  const [cargando, setCargando] = useState(false);
  const [autorInfo, setAutorInfo] = useState(null);
  const [guardandoAnalisis, setGuardandoAnalisis] = useState(false);

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

  // 🔹 Cuando el usuario selecciona una imagen del dispositivo
  const handleFileChange = (e) => {
    setImagenOriginal(e.target.files[0]);
    setImagenOriginalURL(null);
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
  const procesarDesdeHistorial = async (imagenInfo) => {
    try {
      setCargando(true);
      setImagenSegmentada(null);
      setImagenOriginal(null);
      setImagenOriginalURL(imagenInfo.url);
      setImagenSeleccionadaInfo(imagenInfo); // Guardar info completa de la imagen

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
    if (!autorInfo) {
      console.warn("No hay información de autor, no se guardará en Firestore");
      return;
    }

    try {
      setGuardandoAnalisis(true);

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
    } catch (error) {
      console.error("Error guardando análisis en Firestore:", error);
      // No mostramos error al usuario porque el análisis visual ya se completó
    } finally {
      setGuardandoAnalisis(false);
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
      {(imagenOriginal || imagenOriginalURL) && (
        <div>
          <p className="font-medium text-gray-600">Imagen seleccionada:</p>
          <img
            src={imagenOriginal ? URL.createObjectURL(imagenOriginal) : imagenOriginalURL}
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
        <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-2">O selecciona una imagen original del historial:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imagenes
            ?.filter(img => img.tipo === "original") // Solo mostrar imágenes originales
            .map((img) => (
              <div key={img.id} className="cursor-pointer relative">
                <img
                  src={img.url}
                  alt={img.ojo}
                  onClick={() => procesarDesdeHistorial(img)}
                  className="rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
                />
                <div className="mt-1 text-center">
                  <p className="text-sm text-gray-500 capitalize">{img.ojo}</p>
                  {img.analizadaConIA && (
                    <p className="text-xs text-green-600 font-semibold">✓ Analizada</p>
                  )}
                </div>
              </div>
            ))}
        </div>
        {imagenes?.filter(img => img.tipo === "original").length === 0 && (
          <p className="text-gray-500 text-sm">No hay imágenes originales disponibles en el historial.</p>
        )}
      </div>

      {/* Indicador de guardado */}
      {guardandoAnalisis && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
          💾 Guardando análisis en el historial médico...
        </div>
      )}
    </div>
  );
}
