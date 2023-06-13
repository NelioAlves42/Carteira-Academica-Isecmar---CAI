import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import "./App.css";
import { auth, db } from './firebase';
import { ref,onValue,  set } from 'firebase/database';
import { createUserWithEmailAndPassword } from "firebase/auth";


export const Register = (props) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [courses, setCourses] = useState([]);
  const [entryYear, setEntryYear] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const [yearOptions, setYearOptions] = useState([]);
  const history = useHistory();

  // handles registering
  const handleRegister = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        // User registered successfully
        const user = userCredential.user;
        console.log(`User ${user.uid} registered successfully`);
  
        // Write user information to the Firebase Realtime Database
        const userRef = ref(db, `alunos/${user.uid}`);
        const userData = {
          email: email,
          name: name,
          userCourse: course,
          entryYear: entryYear,
          originalYear: currentYear,
          currentYear: currentYear,
          uid: user.uid,
        };
        set(userRef, userData);
  
        setTimeout(() => {
          history.push("/home");
        }, 3000);
      })
      .catch((error) => {
        // Handle errors here
        const errorCode = error.code;
        const errorMessage = error.message;
        alert('Registration failed');
        console.error(`Registration failed: ${errorCode} - ${errorMessage}`);
      });
  };

  // Get Current Year
  const currentYearDate = new Date().getFullYear();

  // useEffect to calculate the possible current years of study accourding to the input entry Year
  useEffect(() => {
    if (entryYear && currentYearDate) {
      const yearDiff = currentYearDate - entryYear;
      const options = [];
      for (let i = 1; i <= Math.min(yearDiff, 3) + 1; i++) {
        options.push(i.toString() + (i === 1 ? 'st' : i === 2 ? 'nd' : i === 3 ? 'rd' : 'th') + 'Year');
      }
      setYearOptions(options);
    }
  }, [entryYear, currentYearDate]);

  // useEffect to get courses
  useEffect(() => {
    const coursesRef = ref(db, 'courses');
    onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      const courseList = Object.keys(data).map((key) => data[key]);
      setCourses(courseList);
    });
  }, []);
  

  return (
    <div className="App">
      <form className="auth-form-container register-form" onSubmit={handleRegister}>
        <h1>Registrar</h1>
        <label htmlFor="name">Nome</label>
        <input type="text" id="name" value={name} placeholder="Digite seu nome e sobrenome" onChange={(e) => setName(e.target.value)} required />

        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} placeholder="Digite seu e-mail de domínio UTA" onChange={(e) => setEmail(e.target.value)} required pattern=".+@uta\.cv" />

        <label htmlFor="pass">Password</label>
        <input type="password" id="pass" value={pass} placeholder="Digite sua senha, minimo 8" onChange={(e) => setPass(e.target.value)} minLength="8" required />

        <label htmlFor="course">Cursos</label>
        <select id="course" name="course" value={course} onChange={(e) => setCourse(e.target.value)} required>
          <option value="">Escolhe um curso</option>
          {courses.map((course) => (
            <option key={course} value={course}>{course}</option>
          ))}
        </select>


        <label htmlFor="entryYear">Ano de Entrada</label>
        <input type="number" id="entryYear" value={entryYear} placeholder="Digite o ano em que ingressou na UTA" 
          onChange={(e) => setEntryYear(e.target.value)} maxLength="4" required 
          onInput={(e) => {
            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 4)
          }} 
        />

        <label htmlFor="current-year">Ano Atual de estudo</label>
        <select id="current-year" name="current-year" value={currentYear} onChange={(e) => setCurrentYear(e.target.value)} required >
          <option value="">Selecione o ano atual de estudo</option>
          {yearOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
            ))}
        </select>

        <button type="submit">Registrar</button>
        <p>Já tem uma conta?<Link to="/login" className="link-btn">Faz Login</Link></p>
      </form>
    </div>
  );
}
