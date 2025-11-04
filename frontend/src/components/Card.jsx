// src/components/Card.jsx
export default function Card({ title, subtitle, body, image, reverse }) {
  return (
    <section
      className={`w-full py-16 px-6 md:px-12 flex flex-col md:flex-row items-center gap-12
        ${reverse ? "md:flex-row-reverse" : ""}
      `}
    >
      {/* Imagen */}
      {image && (
        <div className="flex-1 relative group overflow-hidden rounded-2xl shadow-lg">
          <img
            src={image}
            alt={title}
            className="w-full h-80 object-cover transform transition-transform duration-700 group-hover:scale-105"
          />
          {/* Overlay sutil al hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-500"></div>
        </div>
      )}

      {/* Texto */}
      <div className="flex-1 space-y-4 animate-fadeInUp">
        <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
          {subtitle}
        </h3>
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        <p className="text-lg text-gray-600 leading-relaxed">{body}</p>
      </div>
    </section>
  );
}
