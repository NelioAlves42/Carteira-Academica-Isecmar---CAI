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
        options.push(i.toString() + (i === 1 ? 'st' : i === 2 ? 'nd' : i === 3 ? 'rd' : 'th') + ' year');
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
            console.log('Data updated successfully');
            setEditMode(false);
          })
          .catch((error) => {
            alert('Error updating data');
            console.error('Error updating data:', error);
          });
      } else {
        alert('Invalid year input: Must be equal or above, the original study year when registering');
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
            <label>Name:</label>
            <div className="form-value">{userData.name}</div>
          </div>
          <div className="form-field">
            <label>Course:</label>
            <div className="form-value">{userData.course}</div>
          </div>
          <div className="form-field">
            <label>Entry Year:</label>
            <div className="form-value">{userData.entryYear}</div>
          </div>
          <div className="form-field">
            <label>Current Year:</label>
            {editMode ? (
              <select
                id="current-year"
                name="current-year"
                value={updatedCurrentYear}
                onChange={(e) => setUpdatedCurrentYear(e.target.value)}
                required
              >
                <option value="">Select current year of study</option>
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
          <div className="form-field">
            <label>UID:</label>
            <div className="form-value">{userData.uid}</div>
          </div>
          {editMode ? (
            <button onClick={handleUpdate}>Update</button>
          ) : (
            <button onClick={handleEdit}>Edit</button>
          )}
        </div>
      )}
    </div>
  );
};
export default Perfil;
