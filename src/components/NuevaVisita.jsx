// NuevaVisita.jsx
import { useState } from "react";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

export default function NuevaVisita({ id, setVisitas, setNuevaVisita }) {
  const [diagnostico, setDiagnostico] = useState("");
  const [imagenesDerecho, setImagenesDerecho] = useState([]);
  const [imagenesIzquierdo, setImagenesIzquierdo] = useState([]);
  const [subiendo, setSubiendo] = useState(false);

  const uploadMultiple = async (files, prefix) => {
    if (!files || files.length === 0) return [];
    return await Promise.all(
      files.map(async (f) => {
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${f.name}`;
        const storagePath = `${prefix}/${fileName}`;
        const sRef = ref(storage, storagePath);
        await uploadBytes(sRef, f);
        const url = await getDownloadURL(sRef);
        return { url, storagePath, name: f.name };
      })
    );
  };

  const handleNuevaVisita = async () => {
    try {
      setSubiendo(true);

      const visitaRef = await addDoc(collection(db, "pacientes", id, "visitas"), {
        fecha: new Date().toISOString(),
        diagnostico,
      });
      const visitId = visitaRef.id;

      const uploadsD = await uploadMultiple(
        imagenesDerecho,
        `pacientes/${id}/visitas/${visitId}/imagenes/derecho`
      );
      const uploadsI = await uploadMultiple(
        imagenesIzquierdo,
        `pacientes/${id}/visitas/${visitId}/imagenes/izquierdo`
      );

      const createVisitImageDocs = async (uploads, ojo) => {
        if (!uploads || uploads.length === 0) return [];
        return await Promise.all(
          uploads.map(async (u) => {
            const imageDoc = {
              url: u.url,
              ojo,
              fecha: new Date().toISOString(),
              origen: "visita",
              diagnostico: diagnostico || "",
              patientId: id,
              visitId,
              fileName: u.name,
              storagePath: u.storagePath,
            };
            const imgRef = await addDoc(
              collection(db, "pacientes", id, "visitas", visitId, "imagenes"),
              imageDoc
            );
            return { id: imgRef.id, ...imageDoc };
          })
        );
      };

      const createdD = await createVisitImageDocs(uploadsD, "derecho");
      const createdI = await createVisitImageDocs(uploadsI, "izquierdo");

      const visitaData = {
        id: visitId,
        fecha: new Date().toISOString(),
        diagnostico,
        imagenes: {
          derecho: createdD,
          izquierdo: createdI,
        },
      };
      setVisitas((prev) => [visitaData, ...prev]);

      setDiagnostico("");
      setImagenesDerecho([]);
      setImagenesIzquierdo([]);
      if (setNuevaVisita) setNuevaVisita(false);
      alert("✅ Visita registrada con éxito");
    } catch (err) {
      console.error("❌ Error guardando visita:", err);
      alert("Error al guardar la visita");
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
