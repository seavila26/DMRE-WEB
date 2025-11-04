// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-linear-to-r/hsl from-sky-600 to-sky-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Columna 1: Logo */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <img
            src="/CMYK.png"
            alt="Logo Universidad La Salle"
            className="w-36 h-auto transform hover:scale-105 transition duration-300"
          />
          <p className="text-sm text-gray-300 leading-relaxed text-center md:text-left">
            Universidad de La Salle <br />
            Portal DMRE
          </p>
        </div>

        {/* Columna 2: Facultades */}
        <div className="flex flex-col items-center space-y-8">
          <p className="text-sm text-gray-300">Facultad Ciencias de la Salud</p>
          <p className="text-sm text-gray-300">Optometría</p>
          <p className="text-sm text-gray-300">Facultad Ingeniería</p>
        </div>

        {/* Columna 3: Navegación y redes */}
        <div className="flex flex-col items-center md:items-end space-y-6">
          {/* Links */}
          <nav className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
            <a href="#about" className="hover:text-yellow-400 transition">
              Sobre la DMRE
            </a>
            <a href="#news" className="hover:text-yellow-400 transition">
              Noticias
            </a>
            <a href="#contact" className="hover:text-yellow-400 transition">
              Contacto
            </a>
            {/* Acceso médico discreto */}
            <Link
              to="/login"
              className="text-gray-300 hover:text-yellow-400 transition"
            >
              👨‍⚕️ Acceso Médicos
            </Link>
          </nav>

          {/* Redes sociales */}
          <div className="flex gap-5">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition transform hover:scale-110"
            >
              <Facebook size={22} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition transform hover:scale-110"
            >
              <Twitter size={22} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition transform hover:scale-110"
            >
              <Instagram size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="mt-6 border-t border-blue-700 pt-4 text-center text-xs text-gray-400">
        &copy; 2025 Universidad de La Salle — Todos los derechos reservados
      </div>
    </footer>
  );
}
