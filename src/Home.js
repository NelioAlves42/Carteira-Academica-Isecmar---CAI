import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import 'firebase/auth';
import { ref, onValue } from 'firebase/database';

export const Home = () => {
  const [name, setName] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const userRef = ref(db, `alunos/${user.uid}/name`);
        onValue(userRef, (snapshot) => {
          const userName = snapshot.val();
          setName(userName);
        });
      } else {
        setName(null);
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

  const handlePerfilClick = () => {
    if (auth.currentUser) {
      history.push('/perfil');
    } else {
      alert('Faça login para acessar o perfil');
    }
  };

  const handleAvaliacoesClick = () => {
    if (auth.currentUser) {
      history.push('/avaliacoes');
    } else {
      alert('Faça login para acessar as avaliações');
    }
  };

  return (
    <div className="App">
      <div className="box-allh"> 
        <h1>CAI - Carteira Academica Isemcar</h1>
        <div>
          {name && <p>Logado como: {name}</p>}
          <button onClick={handlePerfilClick}>Perfil</button>
          <button onClick={handleAvaliacoesClick}>Avaliações</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
