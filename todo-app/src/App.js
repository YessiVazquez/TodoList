//src/App.js
import { useState, useEffect } from "react";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import { NotesPage } from "./pages/NotesPage";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  // Verificar si hay un usuario logueado al cargar la app
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
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