"use client";

import React, { useState, useEffect } from "react";
import SignIn from "./sign-in/SignIn";
import Home from "./Home";
import Swal from 'sweetalert2';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Función para manejar el inicio de sesión
  const handleLogin = async (email, password) => {
    try {
      const response = await fetch("https://back-pdfreader.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token); // Guardar el token en localStorage
        setIsAuthenticated(true);

        Swal.fire({
          width: 300,
          position: 'top-end',
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Has iniciado sesión correctamente.',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          toast: true,
        });
      } else {
        Swal.fire({
          width: 300,
          position: 'top-end',
          icon: 'error',
          title: 'Error',
          text: data.error || 'Credenciales incorrectas',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          toast: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error en el servidor");
    }
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem("token"); // Eliminar el token
    setIsAuthenticated(false);
  };

  return (
    <div>
      {isAuthenticated ? (
        <Home onLogout={handleLogout} />
      ) : (
        <SignIn onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;