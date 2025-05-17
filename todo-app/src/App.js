//src/App.js
import { useState, useEffect } from "react";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import { NotesPage } from "./pages/NotesPage";

// src/App.js
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        setCurrentUser(JSON.parse(user));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    window.location.href = '/'; // Fuerza recarga completa
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    window.location.href = '/'; // Fuerza recarga completa
  };

  if (!currentUser) {
    return showRegister ? (
      <Register 
        onRegister={handleLogin}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login 
        onLogin={handleLogin}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  return <NotesPage user={currentUser} onLogout={handleLogout} />;
}

export default App;