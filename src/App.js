import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Register } from "./Register";
import { Login } from "./Login";
import { Home } from "./Home";
import { Perfil } from "./perfil";
import { Avaliacoes } from "./avaliacoes";


function App() {
  return (
    <Router>
        <Switch>
          <Route exact path="/home" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={Register} />
          <Route exact path="/perfil" component={Perfil} />
          <Route exact path="/avaliacoes" component={Avaliacoes} />
        </Switch>
    </Router>
  );
}

export default App;
