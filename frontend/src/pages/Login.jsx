import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser, setRol } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 Login normal
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "usuarios", user.uid));
      if (!userDoc.exists()) {
        throw new Error("❌ Usuario sin rol asignado en la BD");
      }

      const userData = userDoc.data();
      setUser(user);
      setRol(userData.rol);

      if (userData.rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("❌ Error en login:", error);
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  // 🔹 Resetear contraseña
  const handleResetPassword = async () => {
    if (!email) {
      alert("Por favor escribe tu correo para restablecer la contraseña.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("✅ Te hemos enviado un correo para restablecer tu contraseña.");
    } catch (error) {
      console.error("❌ Error restableciendo contraseña:", error);
      alert("Error: " + error.message);
    }
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    {/* Contenedor principal con flex-col para apilar */}

      {/* Logo en esquina inferior izquierda */}
      <img
        src="/CMYK.png"                  // <— pon aquí la ruta de tu logo
        alt="Logo"
        className="absolute bottom-6 right-10 w-58 h-auto"  
      />

    
    <div className="relative flex flex-col w-full ">  
      {/* Tarjeta grande de la imagen (arriba) */}
      <div className="relative w-full px-8">
        <img
          src="/sallee1.png"
          alt="Imagen lateral"
            className="w-full h-[500px] object-cover rounded-2xl shadow-2xl -mt-70"
        />
      </div>

      

      {/* Tarjeta del formulario centrada y superpuesta */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-20
                   bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl
                    w-full max-w-xl p-10 z-10"
      >
        <h1 className="text-3xl font-bold text-center mb-8">Iniciar Sesión</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 transition-colors"
          >
            Entrar
          </button>

          <button
            type="button"
            onClick={handleResetPassword}
            className="block w-full text-sm text-blue-700 hover:underline"
          >
            Olvidé mi contraseña
          </button>
        </form>
      </div>
    </div>
  </div>
);

}