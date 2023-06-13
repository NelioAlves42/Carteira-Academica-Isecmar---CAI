import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from "react-router-dom";
import { Register } from "./Register";
import { Login } from "./Login";
import { Home } from "./Home";
import { Perfil } from "./perfil";
import { Avaliacoes } from "./avaliacoes";
import { auth } from "./firebase";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  const handleAvaliacoesClick = () => {
    if (!user) {
      window.alert("Nenhum usuário está conectado no momento. Clique em OK para fazer login.");
      return <Redirect to="/login" />;
    }
  };
  
  const handlePerfilClick = () => {
    if (!user) {
      window.alert("Nenhum usuário está conectado no momento. Clique em OK para fazer login.");
      return <Redirect to="/login" />;
    }
  };
  
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/avaliacoes" onClick={handleAvaliacoesClick}>
                Avaliações
              </Link>
            </li>
            <li>
              <Link to="/perfil" onClick={handlePerfilClick}>
                Perfil
              </Link>
            </li>
            <li>
              {user ? (
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                <Link to="/login">Login</Link>
              )}
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/" component={Register} />
          {user ? (
            <>
              <Route path="/perfil" component={Perfil} />
              <Route path="/avaliacoes" component={Avaliacoes} />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
