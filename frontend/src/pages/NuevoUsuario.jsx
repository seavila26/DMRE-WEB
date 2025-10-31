import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function NuevoUsuarioWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    especialidad: "",
    rol: "medico",
    password: "",
    telefono: "",
    cedulaProfesional: "",
    institucion: "",
    fechaNacimiento: "",
  });
  const [mostrarPass, setMostrarPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.correo,
        form.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        ...form,
        activo: true,
      });

      alert("✅ Usuario creado correctamente");
      navigate("/admin");
    } catch (error) {
      console.error("❌ Error creando usuario:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg space-y-6"
        >
          {/* Progreso */}
          <div className="flex justify-between items-center mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 mx-1 rounded-full ${
                  step >= s ? "bg-blue-600" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>

          {/* Step 1: Datos personales */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-blue-700 mb-4">
                👤 Datos Personales
              </h2>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <div className="relative mb-4">
                <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej. Dr. Juan Pérez"
                  className="pl-10 border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Especialidad
              </label>
              <div className="relative mb-4">
                <BriefcaseIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="especialidad"
                  value={form.especialidad}
                  onChange={handleChange}
                  placeholder="Ej. Oftalmología"
                  className="pl-10 border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <div className="relative mb-4">
                <input
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="Ej. +52 123 456 7890"
                  className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cédula Profesional
              </label>
              <div className="relative mb-4">
                <input
                  type="text"
                  name="cedulaProfesional"
                  value={form.cedulaProfesional}
                  onChange={handleChange}
                  placeholder="Ej. 12345678"
                  className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institución / Hospital
              </label>
              <div className="relative mb-4">
                <input
                  type="text"
                  name="institucion"
                  value={form.institucion}
                  onChange={handleChange}
                  placeholder="Ej. Hospital General"
                  className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Nacimiento
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={form.fechaNacimiento}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Credenciales */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-blue-700 mb-4">
                🔑 Credenciales
              </h2>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <div className="relative mb-4">
                <EnvelopeIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  className="pl-10 border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña temporal
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={mostrarPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  className="pl-10 border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarPass(!mostrarPass)}
                  className="absolute right-3 top-2 text-xs text-blue-600 hover:underline"
                >
                  {mostrarPass ? "Ocultar" : "Mostrar"}
                </button>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  ← Atrás
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Rol y confirmación */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-blue-700 mb-4">
                ✅ Confirmación
              </h2>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol de usuario
              </label>
              <select
                name="rol"
                value={form.rol}
                onChange={handleChange}
                className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 mb-6"
              >
                <option value="medico">Médico</option>
                <option value="admin">Administrador</option>
              </select>

              {/* Resumen */}
              <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-1 border">
                <p><b>👤 Nombre:</b> {form.nombre}</p>
                <p><b>💼 Especialidad:</b> {form.especialidad || "No especificada"}</p>
                <p><b>📧 Correo:</b> {form.correo}</p>
                <p><b>🛡 Rol:</b> {form.rol}</p>
                {form.telefono && <p><b>📞 Teléfono:</b> {form.telefono}</p>}
                {form.cedulaProfesional && <p><b>📋 Cédula:</b> {form.cedulaProfesional}</p>}
                {form.institucion && <p><b>🏥 Institución:</b> {form.institucion}</p>}
                {form.fechaNacimiento && <p><b>🎂 Fecha de Nac.:</b> {form.fechaNacimiento}</p>}
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  ← Atrás
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Crear Usuario
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
