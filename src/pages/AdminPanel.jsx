import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import { CheckCircleIcon, XCircleIcon, UserCircleIcon } from "@heroicons/react/24/solid";

export default function AdminPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const snapshot = await getDocs(collection(db, "usuarios"));
        setUsuarios(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("❌ Error cargando usuarios:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchUsuarios();
  }, []);

  // Cambiar rol
  const handleRolChange = async (uid, nuevoRol) => {
    try {
      const userRef = doc(db, "usuarios", uid);
      await updateDoc(userRef, { rol: nuevoRol });
      setUsuarios((prev) =>
        prev.map((u) => (u.id === uid ? { ...u, rol: nuevoRol } : u))
      );
      mostrarMensaje("ok", "Rol actualizado correctamente ✅");
    } catch {
      mostrarMensaje("error", "Error al actualizar el rol ❌");
    }
  };

  // Cambiar estado activo/inactivo
  const handleEstadoChange = async (uid, nuevoEstado) => {
    try {
      const userRef = doc(db, "usuarios", uid);
      await updateDoc(userRef, { activo: nuevoEstado });
      setUsuarios((prev) =>
        prev.map((u) => (u.id === uid ? { ...u, activo: nuevoEstado } : u))
      );
      mostrarMensaje("ok", `El médico ahora está ${nuevoEstado ? "Activo ✅" : "Inactivo ❌"}`);
    } catch {
      mostrarMensaje("error", "Error al cambiar estado del médico ❌");
    }
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 3000);
  };

  if (cargando) return <p className="p-6">⏳ Cargando usuarios...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 justify-center p-6">
        <h1 className="text-3xl text-center font-bold text-sky-600 mb-6">
          Panel de Administración ⚕️
        </h1>

        {/* Feedback */}
        {mensaje && (
          <div
            className={`flex items-center gap-2 mb-4 p-3 rounded-lg shadow-md ${
              mensaje.tipo === "ok"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {mensaje.tipo === "ok" ? (
              <CheckCircleIcon className="h-5 w-5" />
            ) : (
              <XCircleIcon className="h-5 w-5" />
            )}
            {mensaje.texto}
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {usuarios.map((u) => (
            <div
              key={u.id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <UserCircleIcon className="h-12 w-12 text-gray-400" />
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {u.nombre}
                  </h2>
                  <p className="text-sm text-gray-600">{u.correo}</p>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-2">
                Especialidad:{" "}
                <span className="font-semibold">{u.especialidad || "—"}</span>
              </p>

              {/* Rol */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    u.rol === "admin"
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {u.rol}
                </span>
                <select
                  value={u.rol}
                  onChange={(e) => handleRolChange(u.id, e.target.value)}
                  className="border px-2 py-1 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-400"
                >
                  <option value="medico">Médico</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              {/* Estado activo/inactivo */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-sm font-medium ${
                    u.activo ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {u.activo ? "Activo" : "Inactivo"}
                </span>
                <button
                  onClick={() => handleEstadoChange(u.id, !u.activo)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                    u.activo ? "bg-green-400" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                      u.activo ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>

              {/* Acciones */}
              <div className="flex gap-2">
                <button className="flex-1 bg-sky-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  Ver perfil
                </button>
                <button className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition">
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
