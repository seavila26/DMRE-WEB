import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, where, collectionGroup } from "firebase/firestore";
import { logoutMedico } from "../auth";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import {UserGroupIcon, ClipboardDocumentListIcon, CpuChipIcon} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pacientes, setPacientes] = useState([]);
  const [nuevosCasos, setNuevosCasos] = useState(0);
  const [analisisIA, setAnalisisIA] = useState(0);
  const { user, rol } = useAuth();

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        // Si viene medicoId en query params (desde admin), filtrar por ese médico
        const medicoIdParam = searchParams.get("medicoId");
        const medicoIdFinal = medicoIdParam || (rol === "medico" ? user?.uid : null);

        let pacientesQuery;
        if (medicoIdFinal) {
          // Filtrar pacientes por médico asignado
          pacientesQuery = query(
            collection(db, "pacientes"),
            where("medicoId", "==", medicoIdFinal)
          );
        } else {
          // Admin sin filtro: mostrar todos los pacientes
          pacientesQuery = collection(db, "pacientes");
        }

        const snapshot = await getDocs(pacientesQuery);
        const pacientesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPacientes(pacientesData);

        // Calcular nuevos casos (últimos 30 días)
        const hace30Dias = new Date();
        hace30Dias.setDate(hace30Dias.getDate() - 30);
        const nuevos = pacientesData.filter(
          (p) => p.fechaRegistro && new Date(p.fechaRegistro) > hace30Dias
        );
        setNuevosCasos(nuevos.length);

        // Calcular análisis IA (contar imágenes analizadas con IA)
        let totalAnalisisIA = 0;
        for (const paciente of pacientesData) {
          const visitasSnapshot = await getDocs(
            collection(db, "pacientes", paciente.id, "visitas")
          );
          for (const visitaDoc of visitasSnapshot.docs) {
            const imagenesSnapshot = await getDocs(
              collection(db, "pacientes", paciente.id, "visitas", visitaDoc.id, "imagenes")
            );
            const imagenesIA = imagenesSnapshot.docs.filter(
              (imgDoc) => imgDoc.data().tipo === "analisis_ia"
            );
            totalAnalisisIA += imagenesIA.length;
          }
        }
        setAnalisisIA(totalAnalisisIA);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    if (user) {
      fetchPacientes();
    }
  }, [user, rol, searchParams]);

  const handleLogout = async () => {
    await logoutMedico();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-[url('/bg-1111111.png')]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex justify-around items-center 
                           bg-white/90 backdrop-blur-md shadow-md px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Dashboard Médico – <span className="text-blue-600">DMRE</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user?.email}</span>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          {/* Resumen */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Pacientes Activos", value: pacientes.length, icon: UserGroupIcon },
              { title: "Nuevos Casos (30 días)", value: nuevosCasos, icon: ClipboardDocumentListIcon },
              { title: "Análisis IA Realizados", value: analisisIA, icon: CpuChipIcon },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-xl shadow-md p-6 flex flex-col 
                           items-center justify-center hover:shadow-lg transition"
              >
                <card.icon className="h-10 w-10 text-blue-600 mb-3" /> {/* ← AQUÍ va el ícono */}
                <h2 className="text-gray-500">{card.title}</h2>
                <p className="text-3xl font-bold text-blue-600 mt-2">{card.value}</p>
              </div>
            ))}
          </section>

          {/* Lista de pacientes */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Pacientes</h2>
            {pacientes.length > 0 ? (
              <ul className="space-y-3">
                {pacientes.map((p) => (
                  <li
                    key={p.id}
                    className="bg-white rounded-lg border shadow-sm p-4 flex 
                               justify-between items-center hover:bg-gray-50 transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{p.nombre}</p>
                      <p className="text-sm text-gray-500">{p.edad} años</p>
                    </div>
                    <button
                      onClick={() => navigate(`/historial/${p.id}`)}
                      className="px-4 py-1.5 rounded-md bg-blue-600 text-white 
                                 hover:bg-blue-700 transition"
                    >
                      Ver historial
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No hay pacientes registrados.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
