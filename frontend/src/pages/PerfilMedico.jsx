import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Sidebar from "../components/Sidebar";

export default function PerfilMedico() {
  const { user } = useAuth();
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const ref = doc(db, "usuarios", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setDatos(snap.data());
          setFormData(snap.data());
        } else {
          console.warn("No se encontró el documento del usuario");
        }
      } catch (error) {
        console.error("Error obteniendo datos del médico:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const ref = doc(db, "usuarios", user.uid);
      await updateDoc(ref, formData);
      setDatos(formData);
      setIsEditing(false);
      alert("✅ Perfil actualizado correctamente");
    } catch (error) {
      console.error("❌ Error al actualizar perfil:", error);
      alert("Error al actualizar perfil");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Cargando perfil...</div>;
  }

  if (!datos) {
    return (
      <div className="p-8 text-center text-red-600">
        No se encontraron datos para este usuario.
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-[url('/bg-11111.png')] min-h-screen py-10">
      <Sidebar />
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        {/* Encabezado */}
        <div className="flex flex-col items-center text-center mb-8">
          {datos.fotoURL ? (
            <img
              src={datos.fotoURL}
              alt="Foto de perfil"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 shadow"
            />
          ) : (
            <UserCircleIcon className="w-28 h-28 text-blue-400" />
          )}
          <h1 className="mt-4 text-3xl font-bold text-blue-700">
            {datos.nombre}
          </h1>
          <p className="text-gray-500">Médico Registrado</p>
        </div>

        {!isEditing ? (
          <>
            {/* Datos */}
            <div className="grid gap-6 sm:grid-cols-2">
              <ProfileField label="Correo" value={datos.correo || user.email} />
              <ProfileField label="Especialidad" value={datos.especialidad} />
              <ProfileField label="Rol" value={datos.rol} />
              {datos.telefono && (
                <ProfileField label="Teléfono" value={datos.telefono} />
              )}
            </div>

            {/* Botón de acción */}
            <div className="mt-10 text-center">
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
                onClick={() => setIsEditing(true)}
              >
                 Editar Perfil
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Formulario de edición */}
            <div className="grid gap-6 sm:grid-cols-2">
              <input
                type="text"
                name="nombre"
                value={formData.nombre || ""}
                onChange={handleChange}
                placeholder="Nombre"
                className="border p-2 rounded bg-gray-100"
              />
              <input
                type="text"
                name="especialidad"
                value={formData.especialidad || ""}
                onChange={handleChange}
                placeholder="Especialidad"
                className="border p-2 rounded bg-gray-100"
              />
              <input
                type="text"
                name="telefono"
                value={formData.telefono || ""}
                onChange={handleChange}
                placeholder="Teléfono"
                className="border p-2 rounded bg-gray-100"
              />
              <input
                type="text"
                name="rol"
                value={formData.rol || ""}
                onChange={handleChange}
                placeholder="Rol"
                className="border p-2 rounded bg-gray-100"
              />
            </div>

            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition"
              >
                💾 Guardar
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(datos);
                }}
                className="px-6 py-2 bg-gray-400 text-white rounded-full shadow hover:bg-gray-500 transition"
              >
                ❌ Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* Subcomponente para mostrar campos */
function ProfileField({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-lg font-semibold text-gray-800">
        {value || "—"}
      </span>
    </div>
  );
}
