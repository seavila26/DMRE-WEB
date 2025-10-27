import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Analysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Simulación del análisis con IA
    setTimeout(() => {
      const posiblesResultados = [
        "Riesgo Bajo – Control periódico",
        "Riesgo Moderado – Se recomienda seguimiento cercano",
        "Riesgo Alto – Remitir a especialista inmediatamente",
      ];
      const randomResult =
        posiblesResultados[
          Math.floor(Math.random() * posiblesResultados.length)
        ];
      setResult(randomResult);
      setLoading(false);
    }, 2000); // 2 segundos de "análisis"
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Análisis con IA – Paciente #{id}
      </h1>

      {loading ? (
        <p className="text-lg text-gray-600 animate-pulse">
          🔄 Analizando imágenes del paciente...
        </p>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-semibold mb-4">
            Resultado del Análisis
          </h2>
          <p className="text-gray-800 text-lg">{result}</p>
        </div>
      )}

      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Volver al Dashboard
      </button>
    </div>
  );
}
