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
  const { user, rol } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (rolRequerido && rol !== rolRequerido) {
    return <p className="p-6 text-red-600">❌ Acceso denegado</p>;
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
