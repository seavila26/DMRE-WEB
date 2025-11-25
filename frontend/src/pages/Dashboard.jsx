import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, where, collectionGroup } from "firebase/firestore";
import { logoutMedico } from "../auth";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import {UserGroupIcon, ClipboardDocumentListIcon, CpuChipIcon, ArrowDownTrayIcon, UserIcon, IdentificationIcon} from "@heroicons/react/24/outline";
import { exportarTodosPacientesExcel } from "../utils/exportUtils";

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

  const handleExportarPacientes = async () => {
    try {
      await exportarTodosPacientesExcel(pacientes);
      alert("✅ Lista de pacientes exportada correctamente");
    } catch (error) {
      console.error("Error exportando pacientes:", error);
      alert("❌ Error al exportar la lista de pacientes");
    }
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
              {
                title: "Pacientes Activos",
                value: pacientes.length,
                icon: UserGroupIcon,
                gradient: "from-blue-50 to-blue-100",
                iconColor: "text-blue-600",
                valueColor: "text-blue-700",
                borderColor: "border-t-4 border-blue-500"
              },
              {
                title: "Nuevos Casos (30 días)",
                value: nuevosCasos,
                icon: ClipboardDocumentListIcon,
                gradient: "from-green-50 to-green-100",
                iconColor: "text-green-600",
                valueColor: "text-green-700",
                borderColor: "border-t-4 border-green-500"
              },
              {
                title: "Análisis IA Realizados",
                value: analisisIA,
                icon: CpuChipIcon,
                gradient: "from-purple-50 to-purple-100",
                iconColor: "text-purple-600",
                valueColor: "text-purple-700",
                borderColor: "border-t-4 border-purple-500"
              },
            ].map((card) => (
              <div
                key={card.title}
                className={`bg-gradient-to-br ${card.gradient} ${card.borderColor} rounded-xl shadow-md p-6
                           flex flex-col items-center justify-center hover:shadow-xl hover:scale-105
                           transition-all duration-300`}
              >
                <card.icon className={`h-14 w-14 ${card.iconColor} mb-3`} />
                <h2 className="text-gray-600 font-medium text-center">{card.title}</h2>
                <p className={`text-4xl font-bold ${card.valueColor} mt-2`}>{card.value}</p>
              </div>
            ))}
          </section>

          {/* Lista de pacientes */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Pacientes</h2>
              {pacientes.length > 0 && rol === "admin" && (
                <button
                  onClick={handleExportarPacientes}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  Exportar Lista (Excel)
                </button>
              )}
            </div>
            {pacientes.length > 0 ? (
              <ul className="space-y-3">
                {pacientes.map((p) => (
                  <li
                    key={p.id}
                    className="bg-white rounded-lg border shadow-sm p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer"
                    onClick={() => navigate(`/historial/${p.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar con iniciales */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {p.nombre
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>

                      {/* Información del paciente */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-800">{p.nombre}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 items-center text-xs">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                            <UserIcon className="h-3.5 w-3.5" />
                            {p.edad} años
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                            <IdentificationIcon className="h-3.5 w-3.5" />
                            {p.identificacion || "N/A"}
                          </span>
                          {p.fechaRegistro && (
                            <span className="text-gray-500">
                              Registro: {new Date(p.fechaRegistro).toLocaleDateString("es-ES")}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Flecha para indicar que es clickeable */}
                      <div className="text-blue-600 flex-shrink-0">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="text-8xl mb-4">👥</div>
                <h4 className="text-xl font-semibold text-gray-700 mb-2">
                  No hay pacientes registrados
                </h4>
                <p className="text-gray-500">
                  Los pacientes aparecerán aquí cuando se registren en el sistema
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
