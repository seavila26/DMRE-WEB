import { useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function PatientProfile({ paciente, setPaciente }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(paciente);

  if (!paciente) {
    return <p className="text-red-500">❌ Paciente no encontrado.</p>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const ref = doc(db, "pacientes", paciente.id);
      await updateDoc(ref, formData);

      setPaciente((prev) => ({ ...prev, ...formData }));
      setIsEditing(false);
      alert("✅ Datos actualizados correctamente");
    } catch (err) {
      console.error("❌ Error al actualizar paciente:", err);
      alert("Error al actualizar paciente");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-sky-600">
          Historial de {paciente.nombre}
        </h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow"
          >
             Editar
          </button>
        )}
      </div>

      {!isEditing ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p>
              <strong>Edad:</strong> {paciente.edad}
            </p>
            <p>
              <strong>Género:</strong> {paciente.genero}
            </p>
            <p>
              <strong>Teléfono:</strong> {paciente.telefono}
            </p>
            <p>
              <strong>Dirección:</strong> {paciente.direccion}
            </p>
            <p className="md:col-span-2">
              <strong>Antecedentes:</strong> {paciente.antecedentes}
            </p>
            <p className="md:col-span-2">
              <strong>Diagnóstico:</strong> {paciente.diagnostico}
            </p>
            <p className="md:col-span-2">
              <strong>Notas:</strong> {paciente.notas}
            </p>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              name="edad"
              value={formData.edad}
              onChange={handleChange}
              placeholder="Edad"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              placeholder="Género"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Teléfono"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Dirección"
              className="border p-2 rounded w-full"
            />
          </div>

          <textarea
            name="antecedentes"
            value={formData.antecedentes}
            onChange={handleChange}
            placeholder="Antecedentes"
            className="border p-2 rounded w-full"
          />
          <textarea
            name="diagnostico"
            value={formData.diagnostico}
            onChange={handleChange}
            placeholder="Diagnóstico"
            className="border p-2 rounded w-full"
          />
          <textarea
            name="notas"
            value={formData.notas}
            onChange={handleChange}
            placeholder="Notas"
            className="border p-2 rounded w-full"
          />

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
            >
              💾 Guardar
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData(paciente);
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg shadow"
            >
              ❌ Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
