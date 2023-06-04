import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./App.css";
import { auth } from './firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

export const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  // handles login
  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User logged in successfully
        const user = userCredential.user;
        console.log(`User ${user.uid} logged in successfully`);
        
        setTimeout(() => {
          history.push("/home");
        }, 3000);
      })
      .catch((error) => {
        // Handle errors here
        const errorCode = error.code;
        const errorMessage = error.message;
        alert('Login failed');
        console.error(`Login failed: ${errorCode} - ${errorMessage}`);
      });
  };

  return (
    <div className="App">
      <form onSubmit={handleLogin} className="auth-form-container login-form">
        <h1>Login</h1>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />

        <button type="submit">Login</button>

        <div>
          Não tem uma conta?{" "}
          <Link to="/" className="link-btn">
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
};
