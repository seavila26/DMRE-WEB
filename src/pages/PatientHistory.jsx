// PatientHistory.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs, collectionGroup, query, where, orderBy } from "firebase/firestore";

import PatientProfile from "../components/PatientProfile";
import EyeImagesGallery from "../components/EyeImagesGallery";
import VisitList from "../components/VisitList";
import NuevaVisita from "../components/NuevaVisita";
import AnalisisIA from "../components/AnalisisIA";

export default function PatientHistory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState(null);
  const [visitas, setVisitas] = useState([]);
  const [imagenesCombinadas, setImagenesCombinadas] = useState({ derecho: [], izquierdo: [] });
  const [cargando, setCargando] = useState(true);
  const [nuevaVisita, setNuevaVisita] = useState(false);
  const [tab, setTab] = useState("perfil");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCargando(true);
        // paciente
        const pacienteSnap = await getDoc(doc(db, "pacientes", id));
        if (pacienteSnap.exists()) setPaciente({ id: pacienteSnap.id, ...pacienteSnap.data() });

        // visitas
        const visitasSnap = await getDocs(collection(db, "pacientes", id, "visitas"));
        const visitasDocs = visitasSnap.docs;

        // para cada visita, obtenemos sus imágenes (paralelizar)
        const visitasConImgs = await Promise.all(visitasDocs.map(async (vDoc) => {
          const vData = vDoc.data();
          const imgsSnap = await getDocs(collection(db, "pacientes", id, "visitas", vDoc.id, "imagenes"));
          const imgs = imgsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          const derecho = imgs.filter(i => i.ojo === "derecho");
          const izquierdo = imgs.filter(i => i.ojo === "izquierdo");
          return { id: vDoc.id, ...vData, imagenes: { derecho, izquierdo } };
        }));

        // ordenar visitas por fecha descendente
        visitasConImgs.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        setVisitas(visitasConImgs);

        // obtener TODAS las imágenes del paciente (collectionGroup) — necesita campo patientId en cada doc
        const q = query(
        collectionGroup(db, "imagenes"),
        where("patientId", "==", id),
        orderBy("fecha", "desc") // ya las trae ordenadas
        );

        const allImgsSnap = await getDocs(q);
        const allImgs = allImgsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // separar por ojo
        const derecho = allImgs.filter(i => i.ojo === "derecho");
        const izquierdo = allImgs.filter(i => i.ojo === "izquierdo");

setImagenesCombinadas({ derecho, izquierdo });

      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, [id]);

  if (cargando) return <p className="p-6">⏳ Cargando historial...</p>;

  return (
    <div className="min-h-screen bg-[url('/bg-11111.png')]">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-blue-700 font-semibold hover:underline">
            <span className="text-lg">←</span> Volver al Dashboard
          </button>
          {paciente && (
            <div className="text-right">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{paciente.nombre}</h1>
              <p className="text-sm text-gray-500">{paciente.identificacion} • {paciente.edad} años</p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          {["perfil", "imagenes", "visitas", "analisisIA"].map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`px-6 py-2 mx-1 rounded-full font-medium transition-all
                ${tab === item ? "bg-blue-600 text-white shadow" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"}`}
            >
              {item === "analisisIA"
                ? "Análisis IA"
                : item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {tab === "perfil" && (
          <PatientProfile
          paciente={paciente}
          setPaciente={setPaciente} 
          />
          )}

          {tab === "analisisIA" && (
          <AnalisisIA
          imagenes={[
          ...imagenesCombinadas.derecho,
          ...imagenesCombinadas.izquierdo
          ]}
          />
          )}


          {tab === "imagenes" && <EyeImagesGallery imagenes={imagenesCombinadas} />}

          {tab === "visitas" && (
            <div className="space-y-6">
              {!nuevaVisita ? (
                <button onClick={() => setNuevaVisita(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:scale-105 transition">
                   Registrar nueva visita
                </button>
              ) : (
                <NuevaVisita id={id} setVisitas={setVisitas} setNuevaVisita={setNuevaVisita} />
              )}
              <VisitList
                visitas={visitas}
                imagenes={[
                  ...imagenesCombinadas.derecho,
                  ...imagenesCombinadas.izquierdo
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
