import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Editor from './components/Editor';
import Login from './components/Login';
import { User } from './types';
import { styles } from './styles';

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Router>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1>CodeSignal Code Snippet Tool</h1>
          <button 
            onClick={handleLogout} 
            style={{...styles.button, ...styles.logoutButton}}
          >
            Logout
          </button>
        </header>
        <Routes>
          <Route path="/" element={<Editor />} />
          <Route path="/snippet/:id" element={<Editor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;