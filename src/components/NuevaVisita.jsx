// NuevaVisita.jsx
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { uploadMultipleOriginalImages } from "../utils/imageUtils";

export default function NuevaVisita({ id, setVisitas, setNuevaVisita }) {
  const { user } = useAuth();
  const [diagnostico, setDiagnostico] = useState("");
  const [imagenesDerecho, setImagenesDerecho] = useState([]);
  const [imagenesIzquierdo, setImagenesIzquierdo] = useState([]);
  const [subiendo, setSubiendo] = useState(false);
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

  const handleNuevaVisita = async () => {
    // Validar que haya información del autor
    if (!autorInfo) {
      alert("Error: No se pudo obtener información del usuario");
      return;
    }

    try {
      setSubiendo(true);

      // 1. Crear documento de visita
      const visitaRef = await addDoc(collection(db, "pacientes", id, "visitas"), {
        fecha: new Date().toISOString(),
        diagnostico,
        autor: autorInfo
      });
      const visitId = visitaRef.id;

      // 2. Subir imágenes usando las utilidades con nueva estructura
      const imagenesDerechoSubidas = await uploadMultipleOriginalImages({
        files: imagenesDerecho,
        patientId: id,
        visitId,
        ojo: "derecho",
        diagnostico,
        autor: autorInfo
      });

      const imagenesIzquierdoSubidas = await uploadMultipleOriginalImages({
        files: imagenesIzquierdo,
        patientId: id,
        visitId,
        ojo: "izquierdo",
        diagnostico,
        autor: autorInfo
      });

      // 3. Actualizar estado local de visitas
      const visitaData = {
        id: visitId,
        fecha: new Date().toISOString(),
        diagnostico,
        autor: autorInfo,
        imagenes: {
          derecho: imagenesDerechoSubidas,
          izquierdo: imagenesIzquierdoSubidas,
        },
      };
      setVisitas((prev) => [visitaData, ...prev]);

      // 4. Limpiar formulario
      setDiagnostico("");
      setImagenesDerecho([]);
      setImagenesIzquierdo([]);
      if (setNuevaVisita) setNuevaVisita(false);

      alert("✅ Visita registrada con éxito");
    } catch (err) {
      console.error("❌ Error guardando visita:", err);
      alert("Error al guardar la visita: " + err.message);
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6 border border-gray-200">
      {/* Diagnóstico */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Diagnóstico
        </label>
        <textarea
          value={diagnostico}
          onChange={(e) => setDiagnostico(e.target.value)}
          placeholder="Escribe el diagnóstico..."
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={4}
        />
      </div>

      {/* Imágenes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Imágenes Ojo Derecho
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImagenesDerecho(Array.from(e.target.files))}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Imágenes Ojo Izquierdo
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImagenesIzquierdo(Array.from(e.target.files))}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100 cursor-pointer"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3">
        {setNuevaVisita && (
          <button
            onClick={() => setNuevaVisita(false)}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
        )}
        <button
          onClick={handleNuevaVisita}
          disabled={subiendo}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {subiendo ? "Subiendo..." : "Guardar Visita"}
        </button>
      </div>
    </div>
  );
}
