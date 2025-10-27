// NuevoPaciente.jsx
import { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function NuevoPaciente() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "", edad: "", genero: "", identificacion: "",
    direccion: "", telefono: "", antecedentes: "", diagnostico: "", notas: "",
  });

  // ahora arrays por ojo (puedes subir múltiples desde el inicio)
  const [imagenesDerecho, setImagenesDerecho] = useState([]);
  const [imagenesIzquierdo, setImagenesIzquierdo] = useState([]);
  const [subiendo, setSubiendo] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // helper: subir varios archivos y devolver {url, path, name}
  const uploadMultiple = async (files, prefix) => {
    if (!files || files.length === 0) return [];
    return await Promise.all(
      files.map(async (f) => {
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2,8)}-${f.name}`;
        const storagePath = `${prefix}/${fileName}`;
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, f);
        const url = await getDownloadURL(storageRef);
        return { url, storagePath, name: f.name };
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubiendo(true);

    try {
      // 1) Crear documento paciente sin imágenes para obtener ID
      const pacienteDoc = {
        nombre: formData.nombre,
        edad: parseInt(formData.edad || "0", 10),
        genero: formData.genero,
        identificacion: formData.identificacion,
        direccion: formData.direccion,
        telefono: formData.telefono,
        antecedentes: formData.antecedentes,
        diagnostico: formData.diagnostico,
        notas: formData.notas,
        fechaRegistro: new Date().toISOString(),
      };

      const pacienteRef = await addDoc(collection(db, "pacientes"), pacienteDoc);
      const patientId = pacienteRef.id;

      // 2) Subir imágenes al Storage y crear documentos en subcolección imagenes
      const uploadsDerecho = await uploadMultiple(imagenesDerecho, `pacientes/${patientId}/imagenes/derecho`);
      const uploadsIzquierdo = await uploadMultiple(imagenesIzquierdo, `pacientes/${patientId}/imagenes/izquierdo`);

      // función para crear docs de imagen en Firestore
      const createImageDocs = async (uploads, ojo, origen = "paciente") => {
        if (!uploads || uploads.length === 0) return;
        await Promise.all(
          uploads.map(async (u) => {
            const imageDoc = {
              url: u.url,
              ojo, // 'derecho' | 'izquierdo'
              fecha: new Date().toISOString(),
              origen, // 'paciente'
              diagnostico: formData.diagnostico || "",
              patientId,
              visitId: null,
              fileName: u.name,
              storagePath: u.storagePath,
            };
            await addDoc(collection(db, "pacientes", patientId, "imagenes"), imageDoc);
          })
        );
      };

      await createImageDocs(uploadsDerecho, "derecho", "paciente");
      await createImageDocs(uploadsIzquierdo, "izquierdo", "paciente");

      // 3) (Opcional) puedes actualizar paciente con resumen o 'ultimaImagen' si quieres
      // await updateDoc(doc(db, "pacientes", patientId), { lastUpdated: new Date().toISOString() });

      alert("✅ Paciente agregado correctamente con imágenes.");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Error guardando paciente:", err);
      alert("Hubo un error al guardar el paciente.");
    } finally {
      setSubiendo(false);
    }
  };

  return (
     <div className="min-h-screen bg-[url('/bg-11111.png')] flex items-center justify-center p-8">
      <Sidebar />
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-10">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Registrar Nuevo Paciente</h1>
        <p className="text-gray-500 mb-8">Complete la información del paciente y cargue las imágenes necesarias.</p>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* === Datos Personales === */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Datos Personales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 mb-1">Nombre completo</label>
                <input type="text" name="nombre" required value={formData.nombre} onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Edad</label>
                <input type="number" name="edad" required value={formData.edad} onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Género</label>
                <select name="genero" required value={formData.genero} onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400">
                  <option value="">Seleccione</option>
                  <option>Masculino</option>
                  <option>Femenino</option>
                  <option>Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">N° Identificación</label>
                <input type="text" name="identificacion" required value={formData.identificacion} onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Dirección</label>
                <input type="text" name="direccion" value={formData.direccion} onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Teléfono</label>
                <input type="text" name="telefono" value={formData.telefono} onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400" />
              </div>
            </div>
          </section>

          {/* === Información Médica === */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Información Médica</h2>
            <div className="space-y-4">
              {["antecedentes","diagnostico","notas"].map(field => (
                <div key={field}>
                  <label className="block text-gray-600 mb-1 capitalize">{field}</label>
                  <textarea name={field} rows={field==="notas"?2:3}
                    value={formData[field]} onChange={handleChange}
                    className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400" />
                </div>
              ))}
            </div>
          </section>


          {/* Imágenes (dos inputs múltiples, por ojo) */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Imágenes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="font-medium text-gray-700">Ojo Derecho (múltiples)</label>
                <input type="file" accept="image/*" multiple
                  onChange={e => setImagenesDerecho(Array.from(e.target.files))}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500" />
              </div>

              <div className="space-y-4">
                <label className="font-medium text-gray-700">Ojo Izquierdo (múltiples)</label>
                <input type="file" accept="image/*" multiple
                  onChange={e => setImagenesIzquierdo(Array.from(e.target.files))}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500" />
              </div>
            </div>
          </section>

          <button type="submit" disabled={subiendo}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition">
            {subiendo ? "Subiendo..." : "Guardar Paciente"}
          </button>
        </form>
      </div>
    </div>
  );
}
