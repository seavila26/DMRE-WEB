// PatientHistory.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs, collectionGroup, query, where, orderBy } from "firebase/firestore";
import { ArrowDownTrayIcon, UserIcon, IdentificationIcon, ChartBarIcon, PencilSquareIcon, PhotoIcon, ClipboardDocumentListIcon, CpuChipIcon } from "@heroicons/react/24/outline";

import PatientProfile from "../components/PatientProfile";
import EyeImagesGallery from "../components/EyeImagesGallery";
import VisitList from "../components/VisitList";
import NuevaVisita from "../components/NuevaVisita";
import ModeloIA from "../components/ModeloIA";
import AnotacionesMedicas from "../components/AnotacionesMedicas";
import { exportarPacienteExcel, exportarPacienteTXT } from "../utils/exportUtils";

export default function PatientHistory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState(null);
  const [visitas, setVisitas] = useState([]);
  const [imagenesCombinadas, setImagenesCombinadas] = useState({ derecho: [], izquierdo: [] });
  const [cargando, setCargando] = useState(true);
  const [nuevaVisita, setNuevaVisita] = useState(false);
  const [tab, setTab] = useState("perfil");
  const [exportando, setExportando] = useState(false);

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

  const handleExportarExcel = async () => {
    try {
      setExportando(true);
      await exportarPacienteExcel(id, paciente);
      alert("✅ Datos exportados a Excel correctamente");
    } catch (error) {
      console.error("Error exportando a Excel:", error);
      alert("❌ Error al exportar datos a Excel");
    } finally {
      setExportando(false);
    }
  };

  const handleExportarTXT = async () => {
    try {
      setExportando(true);
      await exportarPacienteTXT(id, paciente);
      alert("✅ Datos exportados a TXT correctamente");
    } catch (error) {
      console.error("Error exportando a TXT:", error);
      alert("❌ Error al exportar datos a TXT");
    } finally {
      setExportando(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/bg-11111.png')]">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Cargando historial del paciente</h3>
          <p className="text-gray-600">Por favor espera un momento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/bg-11111.png')]">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-blue-700 font-semibold hover:underline mb-4"
          >
            <span className="text-lg">←</span> Volver al Dashboard
          </button>

          {paciente && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Avatar con iniciales */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {paciente.nombre
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                </div>

                {/* Información del paciente */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    {paciente.nombre}
                  </h1>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      <IdentificationIcon className="h-4 w-4" />
                      {paciente.identificacion}
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      <UserIcon className="h-4 w-4" />
                      {paciente.edad} años
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      <ChartBarIcon className="h-4 w-4" />
                      {visitas.length} {visitas.length === 1 ? "visita" : "visitas"}
                    </span>
                    {imagenesCombinadas.derecho.filter(i => i.tipo === "analisis_ia").length +
                      imagenesCombinadas.izquierdo.filter(i => i.tipo === "analisis_ia").length >
                      0 && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                        <CpuChipIcon className="h-4 w-4" />
                        {" "}
                        {imagenesCombinadas.derecho.filter((i) => i.tipo === "analisis_ia")
                          .length +
                          imagenesCombinadas.izquierdo.filter((i) => i.tipo === "analisis_ia")
                            .length}{" "}
                        análisis IA
                      </span>
                    )}
                  </div>
                </div>

                {/* Botones de exportación */}
                <div className="flex gap-2">
                  <button
                    onClick={handleExportarExcel}
                    disabled={exportando}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Exportar a Excel"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    <span className="hidden sm:inline">Excel</span>
                  </button>
                  <button
                    onClick={handleExportarTXT}
                    disabled={exportando}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Exportar a TXT"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    <span className="hidden sm:inline">TXT</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 flex-wrap">
          {["perfil", "imagenes", "visitas", "analisisIA", "anotaciones"].map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`px-6 py-2 mx-1 my-1 rounded-full font-medium transition-all
                ${tab === item ? "bg-blue-600 text-white shadow" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"}`}
            >
              <span className="inline-flex items-center gap-2">
                {item === "analisisIA" && <CpuChipIcon className="h-5 w-5" />}
                {item === "anotaciones" && <PencilSquareIcon className="h-5 w-5" />}
                {item === "perfil" && <UserIcon className="h-5 w-5" />}
                {item === "imagenes" && <PhotoIcon className="h-5 w-5" />}
                {item === "visitas" && <ClipboardDocumentListIcon className="h-5 w-5" />}
                <span>
                  {item === "analisisIA"
                    ? "Análisis IA"
                    : item === "anotaciones"
                    ? "Anotaciones"
                    : item === "perfil"
                    ? "Perfil"
                    : item === "imagenes"
                    ? "Imágenes"
                    : item === "visitas"
                    ? "Visitas"
                    : item.charAt(0).toUpperCase() + item.slice(1)}
                </span>
              </span>
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
          <ModeloIA
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

          {tab === "anotaciones" && (
            <div>
              {visitas.length > 0 ? (
                <AnotacionesMedicas
                  pacienteId={id}
                  visitaId={visitas[0]?.id}
                  analisisId={null}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-50">📝</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    No hay visitas registradas
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Debes registrar al menos una visita antes de agregar anotaciones clínicas
                  </p>
                  <button
                    onClick={() => setTab("visitas")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
                  >
                    Ir a Visitas
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
