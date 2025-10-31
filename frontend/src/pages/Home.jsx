// src/pages/Home.jsx
import Header from "../components/Header";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";
import useInView from "../components/useInView";

function SlideSection(props) {
  const [ref, visible] = useInView();

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
      `}
    >
      <Card {...props} />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <Hero />

      <main className="bg-background">
        <SlideSection
          bg="#EBEAE7"
          title="¿Qué es la DMRE?"
          subtitle="Enfermedad ocular frecuente"
          body="La degeneración macular relacionada con la edad (DMRE) es una enfermedad ocular que afecta la visión central y la nitidez de los detalles, dificultando la lectura, el reconocimiento de rostros y las tareas cotidianas. Es una de las causas principales de pérdida de visión en personas mayores de 60 años. Se produce por el daño a la mácula, la parte central de la retina."
          image="/eye1.png"
        />

        <SlideSection
          bg="#FFFFFF"
          title="Prevención y Síntomas"
          subtitle="Cómo detectarla a tiempo"
          body="Conoce los principales factores de riesgo, síntomas tempranos y estrategias preventivas que pueden ayudar a reducir la progresión de la DMRE."
          image="/eye.jpg"
          reverse
        />

        <SlideSection
          bg="#EBEAE7"
          title="Noticias y Publicaciones"
          subtitle="Avances e investigaciones"
          body="Accede a publicaciones científicas, avances en investigación y actividades académicas de nuestra universidad sobre la DMRE y la visión."
          image="/noticia.png"
        />
      </main>

      <Footer />
    </>
  );
}
