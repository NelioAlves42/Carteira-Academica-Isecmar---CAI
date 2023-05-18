import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import "./App.css";
import { courses } from './courses';
import { auth, db } from './firebase';
import { ref, set, get, update, remove, child } from 'firebase/database';
import { createUserWithEmailAndPassword } from "firebase/auth";


export const Register = (props) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
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
          course: course,
          entryYear: entryYear,
          originalYear: currentYear,
          currentYear: currentYear,
          uid: user.uid,
        };
        set(userRef, userData);
  
        setTimeout(() => {
          history.push("/login");
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
        options.push(i.toString() + (i === 1 ? 'st' : i === 2 ? 'nd' : i === 3 ? 'rd' : 'th') + ' year');
      }
      setYearOptions(options);
    }
  }, [entryYear]);

  return (
    <div className="App">
      <form className="auth-form-container register-form" onSubmit={handleRegister}>
        <h1>Register</h1>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" value={name} placeholder="Enter your first and last name" onChange={(e) => setName(e.target.value)} required />

        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} placeholder="Enter your UTA domain Email" onChange={(e) => setEmail(e.target.value)} required pattern=".+@uta\.cv" />

        <label htmlFor="pass">Password</label>
        <input type="password" id="pass" value={pass} placeholder="Enter your password, min 8" onChange={(e) => setPass(e.target.value)} minLength="8" required />

        <label htmlFor="course">Course</label>
        <select id="course" name="course" value={course} onChange={(e) => setCourse(e.target.value)} required>
          <option value="">Choose a course</option>
          {courses.map((course) => (
            <option key={course} value={course}>{course}</option>
          ))}
        </select>

        <label htmlFor="entryYear">Entry Year</label>
        <input type="number" id="entryYear" value={entryYear} placeholder="Enter the year you joined UTA" 
          onChange={(e) => setEntryYear(e.target.value)} maxLength="4" required 
          onInput={(e) => {
            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 4)
          }} 
        />

        <label htmlFor="current-year">Current Year of Study</label>
        <select id="current-year" name="current-year" value={currentYear} onChange={(e) => setCurrentYear(e.target.value)} required >
          <option value="">Select current year of study</option>
          {yearOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
            ))}
        </select>

        <button type="submit">Register</button>
        <p>Already have an account? <Link to="/login" className="link-btn">Login</Link></p>
      </form>
    </div>
  );
}
