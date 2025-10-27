// src/components/Sidebar.jsx
// src/components/Sidebar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  LogOut,
  Users,
  PlusCircle,
  LayoutDashboard,
  FileText,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { rol, setUser, setRol } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    setUser(null);
    setRol(null);
    navigate("/login");
  };

  // 👉 1) Opciones del menú centralizadas
  const menuConfig = {
    admin: [
      {
        label: "Nuevo usuario",
        path: "/nuevo-usuario",
        icon: <PlusCircle size={20} className="text-blue-600" />,
      },
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard size={20} className="text-green-600" />,
      },
      {
        label: "Usuarios",
        path: "/admin",
        icon: <Users size={20} className="text-purple-600" />,
      },
    ],
    medico: [
      {
      label: "Mi perfil",
      path: "/perfil-medico",
      icon: <Users size={20} className="text-indigo-600" />,
      },
      {
        label: "Mis pacientes",
        path: "/dashboard",
        icon: <LayoutDashboard size={20} className="text-green-600" />,
      },
      {
        label: "Nuevo paciente",
        path: "/nuevo-paciente",
        icon: <FileText size={20} className="text-blue-600" />,
      },
    ],
  };

  // Selecciona menú según rol
  const menuItems = rol === "admin" ? menuConfig.admin : menuConfig.medico;

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-sky-600 text-white rounded hover:bg-blue-700"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/10 z-40"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 
        w-64 transform transition-transform duration-300 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-blue-600">
            {rol === "admin" ? "Admin" : "Médico"}
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded hover:bg-gray-100"
          >
            ✖
          </button>
        </div>

        {/* 👉 2) Mapeo dinámico de las opciones */}
        <nav className="flex flex-col mt-4 space-y-2">
          {menuItems.map(({ label, path, icon }) => (
            <button
              key={label}
              onClick={() => {
                setSidebarOpen(false);
                navigate(path);
              }}
              className="flex items-center px-4 py-2 hover:bg-gray-100"
            >
              {icon}
              <span className="ml-3">{label}</span>
            </button>
          ))}

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center px-4 py-2 hover:bg-gray-100 text-red-600"
          >
            <LogOut size={20} />
            <span className="ml-3">Cerrar sesión</span>
          </button>
        </nav>
      </div>
    </>
  );
}
