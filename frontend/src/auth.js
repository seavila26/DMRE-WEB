import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { app } from "./firebase"; // importa tu inicialización de firebase

export const auth = getAuth(app);

// Registrar médico
export const registrarMedico = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Login médico
export const loginMedico = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Logout médico
export const logoutMedico = () => {
  return signOut(auth);
};
