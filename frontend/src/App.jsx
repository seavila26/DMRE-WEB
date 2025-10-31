import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Analysis from "./pages/Analysis.jsx";
import NuevoPaciente from "./pages/NuevoPaciente.jsx";
import PatientHistory from "./pages/PatientHistory.jsx";
import PrivateRoute from "./components/PrivateRoute";
import AdminPanel from "./pages/AdminPanel";
import { useAuth } from "./context/AuthContext";
import NuevoUsuario from "./pages/NuevoUsuario.jsx";
import PerfilMedico from "./pages/PerfilMedico";


function RutaProtegida({ children, rolRequerido }) {
  const { user, rol, cargando } = useAuth();

  // Mostrar indicador de carga mientras Firebase verifica la autenticación
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Solo redirigir al login si ya terminó de cargar y no hay usuario
  if (!user) return <Navigate to="/login" />;

  // Verificar rol si es requerido
  if (rolRequerido && rol !== rolRequerido) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <p className="text-red-600 text-lg font-semibold">❌ Acceso denegado</p>
          <p className="text-gray-600 mt-2">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return children;
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/analisis/:id" element={<Analysis />} />
        <Route path="/nuevo-paciente" element={<PrivateRoute><NuevoPaciente /></PrivateRoute>} />
        <Route path="/historial/:id" element={<PrivateRoute><PatientHistory /></PrivateRoute>} />
        <Route path="/admin" element={<RutaProtegida rolRequerido="admin"><AdminPanel /></RutaProtegida>}/>
        <Route path="/nuevo-usuario" element={<RutaProtegida rolRequerido="admin"><NuevoUsuario /></RutaProtegida>}/>
        <Route path="/perfil-medico" element={<RutaProtegida rolRequerido="medico"><PerfilMedico /></RutaProtegida>} />
      </Routes>
    </Router>
  );
}

export default App;
