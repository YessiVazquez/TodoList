// src/auth/Register.jsx
import { useState } from "react";
import * as authService from "../services/authService";

// src/auth/Register.jsx
export const Register = ({ onRegister, onSwitchToLogin }) => {
    const [userData, setUserData] = useState({
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
    const [error, setError] = useState("");
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validación adicional en frontend
      if (userData.password !== userData.confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }
      
      if (userData.password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        return;
      }
  
      try {
        const response = await authService.register({
          username: userData.username,
          email: userData.email,
          password: userData.password
        });
        
        if (response.error) {
          setError(response.message || "Error al registrarse");
        } else {
          onRegister(response);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error al contactar al servidor");
      }
    };
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Registro</h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Usuario
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre de usuario"
              value={userData.username}
              onChange={(e) => setUserData({...userData, username: e.target.value})}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tu@email.com"
              value={userData.email}
              onChange={(e) => setUserData({...userData, email: e.target.value})}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mínimo 6 caracteres"
              value={userData.password}
              onChange={(e) => setUserData({...userData, password: e.target.value})}
              required
              minLength="6"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Repite tu contraseña"
              value={userData.confirmPassword}
              onChange={(e) => setUserData({...userData, confirmPassword: e.target.value})}
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
          >
            Registrarse
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-400">
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};