import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import 'firebase/auth';

export const Home = () => {
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      if (auth.currentUser) {
        console.log(`User ${auth.currentUser.uid} logged out successfully`);

        await signOut(auth);

        setTimeout(() => {
          window.location.href = '/register';
        }, 3000);
        
      } else {
        alert('No user is currently signed in');
        console.log('No user is currently signed in');
      }
    } catch (error) {
      alert('Error logging out');
      console.error('Error logging out:', error);
    }
  };
  
  

  return (
    <div className="App">
      <div className="box-allh"> 
        <h1>CAI - Carteira Academica Isemcar</h1>
        <div>
          <p>Logged in as: {uid}</p>
          <Link to="/perfil">
            <button>Perfil</button>
          </Link>
          <Link to="/avaliacoes">
            <button>Avaliações</button>
          </Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
