import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from './components/Navbar';
import NotesList from './components/NotesList';
import AddNote from './components/AddNote';
import EditNote from './components/EditNote';
import ViewNote from './components/ViewNote';
import Login from './components/Login';
import Signup from './components/Signup';
import { auth } from './firebase.config';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);
  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route
          path="/"
          element={user ? <NotesList /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-note"
          element={user ? <AddNote /> : <Navigate to="/login" />}
        />
        <Route
          path="/notes/:id"
          element={user ? <ViewNote /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit/:id"
          element={user ? <EditNote /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;