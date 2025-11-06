// src/components/Header.jsx
import { Link } from "react-router-dom";
import {
  DocumentTextIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

export default function Header({ onOpenModal }) {
  // Función para prevenir el comportamiento por defecto y abrir modal
  const handleModalClick = (e, modalName) => {
    e.preventDefault();
    if (onOpenModal) {
      onOpenModal(modalName);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-sky-900 to-sky-600 text-white shadow-md">
      <div className="mx-auto w-full max-w-[1440px] h-[72px] px-6 flex items-center justify-between">
        {/* Logo / Título */}
        <h1 className="text-2xl font-bold tracking-wide hover:scale-105 transition-transform cursor-pointer">
          Portal DMRE
        </h1>

        {/* Navegación */}
        <nav className="flex items-center gap-6">
          <button
            onClick={(e) => handleModalClick(e, "about")}
            className="hover:text-yellow-400 transition"
          >
            Sobre la DMRE
          </button>
          <button
            onClick={(e) => handleModalClick(e, "news")}
            className="hover:text-yellow-400 transition"
          >
            Noticias
          </button>
          <button
            onClick={(e) => handleModalClick(e, "contact")}
            className="hover:text-yellow-400 transition"
          >
            Contacto
          </button>

          {/* 🔹 Menú desplegable */}
          <div className="relative group">
            <button className="px-4 py-2 hover:text-yellow-400 transition flex items-center gap-1">
              Más ▾
            </button>
            <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 shadow-lg rounded-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transform transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
              <button
                onClick={(e) => handleModalClick(e, "publications")}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors text-left"
              >
                <DocumentTextIcon className="h-5 w-5 text-gray-600" />
                <span>Publicaciones</span>
              </button>
              <button
                onClick={(e) => handleModalClick(e, "research")}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors text-left"
              >
                <AcademicCapIcon className="h-5 w-5 text-gray-600" />
                <span>Investigación</span>
              </button>
              <button
                onClick={(e) => handleModalClick(e, "stats")}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors text-left"
              >
                <ChartBarIcon className="h-5 w-5 text-gray-600" />
                <span>Estadísticas</span>
              </button>
              {/* Acceso Médicos más oculto */}
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 text-blue-700 font-semibold hover:bg-gray-100 rounded-b-lg transition-colors"
              >
                <ShieldCheckIcon className="h-5 w-5 text-blue-700" />
                <span>Acceso Médicos</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
