// src/components/Header.jsx
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-sky-900 to-sky-600 text-white shadow-md">
      <div className="mx-auto w-full max-w-[1440px] h-[72px] px-6 flex items-center justify-between">
        {/* Logo / Título */}
        <h1 className="text-2xl font-bold tracking-wide hover:scale-105 transition-transform">
          Portal DMRE
        </h1>

        {/* Navegación */}
        <nav className="flex items-center gap-6">
          <a href="#about" className="hover:text-yellow-400 transition">Sobre la DMRE</a>
          <a href="#news" className="hover:text-yellow-400 transition">Noticias</a>
          <a href="#contact" className="hover:text-yellow-400 transition">Contacto</a>

          {/* 🔹 Menú desplegable */}
          <div className="relative group">
            <button className="px-4 py-2 hover:text-yellow-400 transition flex items-center gap-1">
              Más ▾
            </button>
            <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 shadow-lg rounded-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transform transition-all duration-200">
              <a
                href="#publications"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                📄 Publicaciones
              </a>
              <a
                href="#research"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                🎓 Investigación
              </a>
              <a
                href="#stats"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                📊 Estadísticas
              </a>
              {/* Acceso Médicos más oculto */}
              <Link
                to="/login"
                className="block px-4 py-2 text-blue-700 font-semibold hover:bg-gray-100 rounded-b-lg"
              >
                👨‍⚕️ Acceso 
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
