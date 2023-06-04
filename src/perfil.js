import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { ref, onValue, update } from 'firebase/database';
import './perfil.css';

export const Perfil = () => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedCurrentYear, setUpdatedCurrentYear] = useState('');
  const [yearOptions, setYearOptions] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(db, `alunos/${user.uid}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setUserData(data);
        setUpdatedCurrentYear(data.currentYear);
      });
    }
  }, []);

  // Get Current Year
  const currentYearDate = new Date().getFullYear();

  // useEffect to calculate the possible current years of study according to the input entry Year
  useEffect(() => {
    if (userData && userData.entryYear && currentYearDate) {
      const yearDiff = currentYearDate - userData.entryYear;
      const options = [];
      for (let i = 1; i <= Math.min(yearDiff, 3) + 1; i++) {
        options.push(i.toString() + (i === 1 ? 'st' : i === 2 ? 'nd' : i === 3 ? 'rd' : 'th') + 'Year');
      }
      setYearOptions(options);
    }
  }, [userData, currentYearDate]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleUpdate = () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(db, `alunos/${user.uid}`);
      const entryYear = parseInt(userData.originalYear.charAt(0)) // Get the originally registered entry year
      const currentYear = parseInt(updatedCurrentYear.charAt(0)); // Extract the numeric value of the updated current year
  
      if (currentYear >= entryYear) { // Check if the updated current year is greater than or equal to the entry year
        update(userRef, {
          currentYear: updatedCurrentYear
        })
          .then(() => {
            console.log('Dados atualizados com sucesso');
            setEditMode(false);
          })
          .catch((error) => {
            alert('Erro ao atualizar dados');
            console.error('Erro ao atualizar dados:', error);
          });
      } else {
        alert('Ano de estudo inválido: Deve ser igual ou superior ao ano de estudo original ao se registrar');
        console.error('Invalid current year');
        console.error(currentYear);
      }
    }
  };
  

  return (
    <div className="App">
      {userData && (
        <div className="box-allh">
          <div className="form-field">
            <label>Email:</label>
            <div className="form-value">{userData.email}</div>
          </div>
          <div className="form-field">
            <label>Nome:</label>
            <div className="form-value">{userData.name}</div>
          </div>
          <div className="form-field">
            <label>Curso:</label>
            <div className="form-value">{userData.userCourse}</div>
          </div>
          <div className="form-field">
            <label>Ano de Entrada:</label>
            <div className="form-value">{userData.entryYear}</div>
          </div>
          <div className="form-field">
            <label>Ano Atual de estudo:</label>
            {editMode ? (
              <select
                id="current-year"
                name="current-year"
                value={updatedCurrentYear}
                onChange={(e) => setUpdatedCurrentYear(e.target.value)}
                required
              >
                <option value="">Selecione o ano atual de estudo</option>
                {yearOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <div className="form-value">{userData.currentYear}</div>
            )}
          </div>
          {editMode ? (
            <button onClick={handleUpdate}>Atualizar</button>
          ) : (
            <button onClick={handleEdit}>Editar</button>
          )}
        </div>
      )}
    </div>
  );
};
export default Perfil;
