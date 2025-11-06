// src/pages/Home.jsx
import { useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";
import useInView from "../components/useInView";
import Modal from "../components/Modal";
import {
  AboutDMREContent,
  NewsContent,
  ContactContent,
  PublicationsContent,
  ResearchContent,
  StatsContent
} from "../components/ModalContents";

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
  // Estado para controlar qué modal está abierto
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  return (
    <>
      <Header onOpenModal={openModal} />
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

      {/* Modales */}
      <Modal
        isOpen={activeModal === "about"}
        onClose={closeModal}
        title="Sobre la DMRE"
        size="lg"
      >
        <AboutDMREContent />
      </Modal>

      <Modal
        isOpen={activeModal === "news"}
        onClose={closeModal}
        title="Noticias"
        size="lg"
      >
        <NewsContent />
      </Modal>

      <Modal
        isOpen={activeModal === "contact"}
        onClose={closeModal}
        title="Contacto"
        size="md"
      >
        <ContactContent />
      </Modal>

      <Modal
        isOpen={activeModal === "publications"}
        onClose={closeModal}
        title="Publicaciones"
        size="lg"
      >
        <PublicationsContent />
      </Modal>

      <Modal
        isOpen={activeModal === "research"}
        onClose={closeModal}
        title="Investigación"
        size="lg"
      >
        <ResearchContent />
      </Modal>

      <Modal
        isOpen={activeModal === "stats"}
        onClose={closeModal}
        title="Estadísticas"
        size="lg"
      >
        <StatsContent />
      </Modal>
    </>
  );
}
