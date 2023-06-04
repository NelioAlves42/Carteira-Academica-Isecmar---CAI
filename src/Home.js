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
        console.log(`O usuário ${auth.currentUser.uid} foi desconectado com sucesso`);

        await signOut(auth);

        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
        
      } else {
        alert('Nenhum usuário está conectado no momento');
        console.log('Nenhum usuário está conectado no momento');
      }
    } catch (error) {
      alert('Erro ao sair');
      console.error('Erro ao sair:', error);
    }
  };
  
  

  return (
    <div className="App">
      <div className="box-allh"> 
        <h1>CAI - Carteira Academica Isemcar</h1>
        <div>
          <p>Logado como: {uid}</p>
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
