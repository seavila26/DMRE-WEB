// src/components/Hero.jsx
export default function Hero() {
  return (
    <section
      className="relative w-full h-[90vh] flex items-center justify-center text-center bg-fixed bg-cover bg-center"
      style={{ backgroundImage: "url('/gigapixel-optionF.png')" }}
    >
      {/* Overlay degradado */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-950/70 via-sky-900/40 to-sky-800/10 z-10"></div>

      {/* Contenido */}
      <div className="relative z-20 px-6 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-yellow-400 via-orange-300 to-pink-400 bg-clip-text text-transparent">
            Degeneración Macular
          </span>
          <br />
          Relacionada con la Edad
        </h1>

        <p className="mt-6 text-lg md:text-2xl text-gray-100/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          Infórmate sobre <span className="font-semibold text-yellow-300">prevención</span>, 
          <span className="font-semibold text-yellow-300"> síntomas</span> y los últimos 
          <span className="font-semibold text-yellow-300"> avances científicos </span> 
          en la investigación de la DMRE.
        </p>

        <div className="mt-10 flex justify-center">
          <a
            href="#about"
            className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-blue-900 font-semibold rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            Conoce más
          </a>
        </div>
      </div>
    </section>
  );
}
