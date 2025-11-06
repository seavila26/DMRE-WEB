// src/components/ModalContents.jsx
import { useState } from "react";
import {
  EyeIcon,
  NewspaperIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  BeakerIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

// ====================================
// 1. SOBRE LA DMRE
// ====================================
export function AboutDMREContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <EyeIcon className="h-8 w-8 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-800">¿Qué es la DMRE?</h3>
      </div>

      <p className="text-gray-700 leading-relaxed">
        La <strong>Degeneración Macular Relacionada con la Edad (DMRE)</strong> es una enfermedad ocular
        que afecta la mácula, la parte central de la retina responsable de la visión nítida y detallada.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Datos Importantes</h4>
        <ul className="space-y-2 text-gray-700 text-sm">
          <li>• Principal causa de ceguera en personas mayores de 50 años</li>
          <li>• Afecta la visión central, dificultando leer, conducir y reconocer rostros</li>
          <li>• La detección temprana es clave para preservar la visión</li>
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">DMRE Seca</h4>
          <p className="text-sm text-gray-700">
            La forma más común (85-90%). Progresa lentamente con acumulación de depósitos
            llamados drusas debajo de la retina.
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold text-red-900 mb-2">DMRE Húmeda</h4>
          <p className="text-sm text-gray-700">
            Menos común pero más severa. Vasos sanguíneos anormales crecen bajo la mácula
            causando pérdida rápida de visión.
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-900 mb-2">Factores de Riesgo</h4>
        <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
          <div>✓ Edad avanzada (>50 años)</div>
          <div>✓ Tabaquismo</div>
          <div>✓ Historial familiar</div>
          <div>✓ Hipertensión arterial</div>
          <div>✓ Exposición solar prolongada</div>
          <div>✓ Obesidad</div>
        </div>
      </div>

      <div className="mt-6 text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <p className="text-gray-800 font-medium">
          La Universidad De La Salle trabaja en investigación y tecnología para la
          detección temprana de DMRE mediante inteligencia artificial.
        </p>
      </div>
    </div>
  );
}

// ====================================
// 2. NOTICIAS
// ====================================
export function NewsContent() {
  const noticias = [
    {
      fecha: "Noviembre 2025",
      titulo: "Avances en IA para Detección de DMRE",
      contenido: "Nuestro sistema de inteligencia artificial ha alcanzado un 95% de precisión en la detección temprana de degeneración macular, superando los métodos tradicionales.",
      categoria: "Tecnología"
    },
    {
      fecha: "Octubre 2025",
      titulo: "Convenio con Clínicas Especializadas",
      contenido: "La Universidad De La Salle firma convenio con 5 clínicas oftalmológicas de Bogotá para implementar el sistema DMRE en entornos reales.",
      categoria: "Institucional"
    },
    {
      fecha: "Septiembre 2025",
      titulo: "Jornada de Prevención Visual",
      contenido: "Más de 200 personas se beneficiaron de evaluaciones gratuitas en nuestra jornada de prevención de enfermedades retinianas.",
      categoria: "Comunidad"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <NewspaperIcon className="h-8 w-8 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-800">Últimas Noticias</h3>
      </div>

      {noticias.map((noticia, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              {noticia.categoria}
            </span>
            <span className="text-sm text-gray-500">{noticia.fecha}</span>
          </div>
          <h4 className="font-semibold text-gray-800 mb-2">{noticia.titulo}</h4>
          <p className="text-gray-600 text-sm leading-relaxed">{noticia.contenido}</p>
        </div>
      ))}

      <div className="mt-6 text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600 text-sm">
          ¿Quieres recibir nuestras actualizaciones?
          <button className="ml-2 text-blue-600 hover:text-blue-700 font-semibold underline">
            Suscríbete aquí
          </button>
        </p>
      </div>
    </div>
  );
}

// ====================================
// 3. CONTACTO
// ====================================
export function ContactContent() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: ""
  });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log("Formulario enviado:", formData);
    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      setFormData({ nombre: "", email: "", asunto: "", mensaje: "" });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <EnvelopeIcon className="h-8 w-8 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-800">Contáctanos</h3>
      </div>

      {enviado ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h4 className="text-xl font-semibold text-green-900 mb-2">¡Mensaje Enviado!</h4>
          <p className="text-gray-700">Nos pondremos en contacto contigo pronto.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asunto *
            </label>
            <select
              name="asunto"
              value={formData.asunto}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="">Selecciona un asunto</option>
              <option value="informacion">Solicitud de Información</option>
              <option value="colaboracion">Colaboración Institucional</option>
              <option value="investigacion">Proyectos de Investigación</option>
              <option value="tecnico">Soporte Técnico</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje *
            </label>
            <textarea
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              required
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              placeholder="Escribe tu mensaje aquí..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Enviar Mensaje
          </button>
        </form>
      )}

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Dirección</h4>
          <p className="text-sm text-gray-600">
            Universidad De La Salle<br />
            Carrera 2 # 10-70<br />
            Bogotá, Colombia
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Horario</h4>
          <p className="text-sm text-gray-600">
            Lunes a Viernes<br />
            8:00 AM - 5:00 PM<br />
            Sábados: 9:00 AM - 1:00 PM
          </p>
        </div>
      </div>
    </div>
  );
}

// ====================================
// 4. PUBLICACIONES
// ====================================
export function PublicationsContent() {
  const publicaciones = [
    {
      año: "2025",
      titulo: "Detección Automatizada de DMRE mediante Deep Learning",
      autores: "García M., Rodríguez P., Silva L.",
      revista: "Revista Colombiana de Oftalmología",
      tipo: "Artículo"
    },
    {
      año: "2024",
      titulo: "Segmentación del Disco Óptico: Estado del Arte",
      autores: "Martínez A., González J.",
      revista: "IEEE Latin America Transactions",
      tipo: "Review"
    },
    {
      año: "2024",
      titulo: "Sistemas de IA en Telemedicina Oftalmológica",
      autores: "López C., Torres D., Ramírez S.",
      revista: "Congreso Latinoamericano de Ingeniería Biomédica",
      tipo: "Ponencia"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <DocumentTextIcon className="h-8 w-8 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-800">Publicaciones Científicas</h3>
      </div>

      <p className="text-gray-700 mb-6">
        Investigaciones y publicaciones académicas del equipo de la Universidad De La Salle
        relacionadas con la detección y diagnóstico de enfermedades retinianas.
      </p>

      {publicaciones.map((pub, index) => (
        <div key={index} className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded-r-lg hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2">
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
              {pub.tipo}
            </span>
            <span className="text-sm font-semibold text-gray-600">{pub.año}</span>
          </div>
          <h4 className="font-semibold text-gray-800 mb-1">{pub.titulo}</h4>
          <p className="text-sm text-gray-600 mb-1">{pub.autores}</p>
          <p className="text-sm text-blue-600 italic">{pub.revista}</p>
        </div>
      ))}

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg text-center">
        <p className="text-gray-800 font-medium">
          ¿Interesado en colaborar en nuestras investigaciones?
        </p>
        <button className="mt-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
          Contáctanos
        </button>
      </div>
    </div>
  );
}

// ====================================
// 5. INVESTIGACIÓN
// ====================================
export function ResearchContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <BeakerIcon className="h-8 w-8 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-800">Líneas de Investigación</h3>
      </div>

      <p className="text-gray-700">
        Nuestro equipo interdisciplinario trabaja en múltiples proyectos de investigación
        aplicada en el campo de la oftalmología y la inteligencia artificial.
      </p>

      <div className="grid gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-lg border-l-4 border-blue-500">
          <h4 className="font-semibold text-blue-900 mb-2">
            1. Visión por Computador en Oftalmología
          </h4>
          <p className="text-sm text-gray-700">
            Desarrollo de algoritmos de procesamiento de imágenes para análisis automatizado
            de fotografías de fondo de ojo, identificando patrones tempranos de DMRE.
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-lg border-l-4 border-green-500">
          <h4 className="font-semibold text-green-900 mb-2">
            2. Telemedicina y Salud Digital
          </h4>
          <p className="text-sm text-gray-700">
            Plataformas web y móviles para tele-oftalmología, permitiendo diagnóstico remoto
            y seguimiento de pacientes en zonas rurales.
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-lg border-l-4 border-purple-500">
          <h4 className="font-semibold text-purple-900 mb-2">
            3. Inteligencia Artificial Explicable
          </h4>
          <p className="text-sm text-gray-700">
            Desarrollo de modelos de IA transparentes que permiten a los médicos entender
            las decisiones del sistema, aumentando la confianza en el diagnóstico asistido.
          </p>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-5 rounded-lg border-l-4 border-orange-500">
          <h4 className="font-semibold text-orange-900 mb-2">
            4. Epidemiología de Enfermedades Retinianas
          </h4>
          <p className="text-sm text-gray-700">
            Estudios poblacionales sobre la prevalencia de DMRE en Colombia y factores
            de riesgo específicos de nuestra región.
          </p>
        </div>
      </div>

      <div className="mt-6 p-5 bg-gray-800 text-white rounded-lg">
        <h4 className="font-semibold mb-3">Proyectos Activos</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">▸</span>
            <span>Sistema DMRE-IA: Diagnóstico asistido por inteligencia artificial (2024-2026)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">▸</span>
            <span>Portal Web de Telemedicina Oftalmológica (2025-2026)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">▸</span>
            <span>Estudio Epidemiológico de DMRE en Bogotá (2025-2027)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// ====================================
// 6. ESTADÍSTICAS
// ====================================
export function StatsContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <ChartBarIcon className="h-8 w-8 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-800">Estadísticas e Impacto</h3>
      </div>

      <p className="text-gray-700">
        Datos relevantes sobre el impacto de la DMRE y los resultados de nuestro proyecto.
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg text-center">
          <div className="text-4xl font-bold mb-2">95%</div>
          <div className="text-sm opacity-90">Precisión del Sistema IA</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg text-center">
          <div className="text-4xl font-bold mb-2">500+</div>
          <div className="text-sm opacity-90">Pacientes Evaluados</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg text-center">
          <div className="text-4xl font-bold mb-2">1,200</div>
          <div className="text-sm opacity-90">Imágenes Analizadas</div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 p-5 rounded-lg">
        <h4 className="font-semibold text-red-900 mb-3">Impacto Global de la DMRE</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• 196 millones de personas afectadas mundialmente (2020)</li>
          <li>• Se estima llegar a 288 millones para el año 2040</li>
          <li>• Principal causa de ceguera irreversible en mayores de 50 años</li>
          <li>• En Colombia: ~2.5 millones de personas en riesgo</li>
        </ul>
      </div>

      <div className="bg-green-50 border border-green-200 p-5 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-3">Resultados del Proyecto DMRE-IA</h4>
        <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold text-xl">✓</span>
            <span>Detección temprana mejorada en 40%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold text-xl">✓</span>
            <span>Reducción de tiempo de diagnóstico en 60%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold text-xl">✓</span>
            <span>5 clínicas asociadas al proyecto</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold text-xl">✓</span>
            <span>12 publicaciones científicas generadas</span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-center">
        <h4 className="font-semibold text-lg mb-2">¡Ayúdanos a Seguir Creciendo!</h4>
        <p className="text-sm opacity-90">
          Cada evaluación y cada paciente nos ayuda a mejorar nuestro sistema y contribuir
          a la prevención de la ceguera por DMRE.
        </p>
      </div>
    </div>
  );
}
