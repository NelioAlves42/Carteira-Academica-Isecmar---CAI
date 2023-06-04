import React, { useState, useEffect } from 'react';
import "./avaliacoes.css";
import { db, auth} from "./firebase";
import { ref, push, onValue, set, remove, update } from "firebase/database";


export const Avaliacoes = () => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [disciplina, setDisciplina] = useState('');
  const [tipoAvaliacao, setTipoAvaliacao] = useState('');
  const [subtipoAvaliacao, setSubtipoAvaliacao] = useState('');
  const [dataAvaliacao, setDataAvaliacao] = useState('');
  const [nota, setNota] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedAvaliacao, setSelectedAvaliacao] = useState(null);
  const [disciplinas, setDisciplinas] = useState([]);

  useEffect(() => {
    const userUid = auth.currentUser.uid; // Get the UID of the current user
  
    // Step 1: Retrieve the current logged-in user's information
    const userRef = ref(db, `alunos/${userUid}`);
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      const currentYear = userData.currentYear;
      const course = userData.userCourse;
  
      // Step 2: Construct the path in the database to access the disciplines
      const path = `${course} ${currentYear}`;
      console.log(path)
  
      // Step 3: Query the database to retrieve the disciplines
      const disciplinesRef = ref(db, path);
      onValue(disciplinesRef, (snapshot) => {
        const disciplinesData = snapshot.val();
        const disciplinesArray = Object.entries(disciplinesData || []).map(([key, value]) => ({
          id: key,
          name: value,
        }));
        setDisciplinas(disciplinesArray);
      });
    });

    // Create a reference to the "avaliacoes" node in the Realtime Database
    const avaliacoesRef = ref(db, "avaliacoes");

    // Listen for changes in the Realtime Database and update the state with the evaluations
    onValue(avaliacoesRef, (snapshot) => {
      const avaliacoesData = snapshot.val();
      const userAvaliacoes = Object.entries(avaliacoesData || {}).map(([id, avaliacao]) => ({
        id: id,
        ...avaliacao,
      })).filter((avaliacao) => avaliacao.uid === userUid);
      setAvaliacoes(userAvaliacoes);
    });
    }, []);
  const handleFormSubmit = (event) => {
    event.preventDefault();
  
    // Check if nota is within the valid range
    if (nota < 0 || nota > 20) {
      alert('Nota deve estar entre 0 e 20');
      return;
    }
  
    const newAvaliacao = {
      disciplina: disciplina,
      tipoAvaliacao: tipoAvaliacao,
      subtipoAvaliacao: subtipoAvaliacao,
      dataAvaliacao: dataAvaliacao,
      nota: nota,
      uid: auth.currentUser.uid, // Add the UID of the current user
    };
  
    // Store the newAvaliacao in the Realtime Database
    const avaliacoesRef = ref(db, 'avaliacoes');
    const newAvaliacaoRef = push(avaliacoesRef);
    const newAvaliacaoId = newAvaliacaoRef.key; // Get the generated key
    set(newAvaliacaoRef, newAvaliacao);
  
    // Update the newAvaliacao object with the generated key
    newAvaliacao.id = newAvaliacaoId;
  
    setAvaliacoes([...avaliacoes, newAvaliacao]);
    setDisciplina('');
    setTipoAvaliacao('');
    setSubtipoAvaliacao('');
    setDataAvaliacao('');
    setNota('');
    setShowForm(false);
  };

  const handleShowForm = () => {
    if (showForm) {
      setDisciplina('');
      setTipoAvaliacao('');
      setSubtipoAvaliacao('');
      setDataAvaliacao('');
      setNota('');
      setSelectedAvaliacao(null); // Reset the selectedAvaliacao state
    }
    setShowForm(!showForm);
  };

  const handleEditAvaliacao = (index) => {
    setSelectedAvaliacao(index);
    setDisciplina(avaliacoes[index].disciplina);
    setTipoAvaliacao(avaliacoes[index].tipoAvaliacao);
    setSubtipoAvaliacao(avaliacoes[index].subtipoAvaliacao);
    setDataAvaliacao(avaliacoes[index].dataAvaliacao);
    setNota(avaliacoes[index].nota);
    setShowForm(true);
  };
  
  const handleUpdateAvaliacao = () => {
    // Check if nota is within the valid range
    if (nota < 0 || nota > 20) {
      alert('Nota deve estar entre 0 e 20');
      return;
    }
  
    const updatedAvaliacao = {
      disciplina: disciplina,
      tipoAvaliacao: tipoAvaliacao,
      subtipoAvaliacao: subtipoAvaliacao,
      dataAvaliacao: dataAvaliacao,
      nota: nota,
      uid: auth.currentUser.uid,
    };
  
    const avaliacaoId = avaliacoes[selectedAvaliacao].id;
    const avaliacaoRef = ref(db, `avaliacoes/${avaliacaoId}`);
    set(avaliacaoRef, updatedAvaliacao);
  
    setAvaliacoes((prevAvaliacoes) => {
      const updatedAvaliacoes = [...prevAvaliacoes];
      updatedAvaliacoes[selectedAvaliacao] = {
        ...updatedAvaliacao,
        id: avaliacaoId,
      };
      return updatedAvaliacoes;
    });
  
    setDisciplina('');
    setTipoAvaliacao('');
    setSubtipoAvaliacao('');
    setDataAvaliacao('');
    setNota('');
    setShowForm(false);
  };
  
  const handleDeleteAvaliacao = (index) => {
    if (window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
      const avaliacaoId = avaliacoes[index].id;
      const avaliacaoRef = ref(db, `avaliacoes/${avaliacaoId}`);
      remove(avaliacaoRef);
  
      setAvaliacoes((prevAvaliacoes) => {
        const updatedAvaliacoes = [...prevAvaliacoes];
        updatedAvaliacoes.splice(index, 1);
        return updatedAvaliacoes;
      });
    }
  };
  const options = disciplinas.map((disciplina) => (
    <option key={disciplina.id} value={disciplina.name}>
      {disciplina.name}
    </option>
  ));
  
  

  return (
    <div className='App'>
      <div className='box-all'>
        <h1>Avaliações</h1>
        <button className='form-button' onClick={handleShowForm}>Nova Avaliação</button>
        {showForm && (
          <form onSubmit={selectedAvaliacao !== null ? handleUpdateAvaliacao : handleFormSubmit}>
            <div className='form-input'>
            <label>
                Disciplina:
                <select
                  value={disciplina}
                  onChange={(event) => setDisciplina(event.target.value)}
                  disabled={selectedAvaliacao !== null} // Disable the select if an evaluation is being edited
                >
                  {/* Options will be populated here */}
                  {options.map((option) => (
                    <option key={option.id} value={option.name}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Tipo de Avaliação:
                <select value={tipoAvaliacao} onChange={(event) => setTipoAvaliacao(event.target.value)}>
                  <option value="">Selecione</option>
                  <option value="Continua">Continua</option>
                  <option value="Exame">Exame</option>
                </select>
              </label>
              {tipoAvaliacao === 'Continua' && (
                <label>
                  Subtipo de Avaliação:
                  <select value={subtipoAvaliacao} onChange={(event) => setSubtipoAvaliacao(event.target.value)}>
                    <option value="">Selecione</option>
                    <option value="Teste">Teste</option>
                    <option value="Pratica">Pratica</option>
                  </select>
                </label>
              )}
              {tipoAvaliacao === 'Exame' && (
                <label>
                  Subtipo de Avaliação:
                  <select value={subtipoAvaliacao} onChange={(event) => setSubtipoAvaliacao(event.target.value)}>
                    <option value="">Selecione</option>
                    <option value="1ª Chamada">1ª Chamada</option>
                    <option value="2ª Chamada">2ª Chamada</option>
                    <option value="Especial">Especial</option>
                    <option value="Recurso">Recurso</option>
                  </select>
                </label>
              )}
              <label>
                Data da Avaliação:
                <input type="date" value={dataAvaliacao} onChange={(event) => setDataAvaliacao(event.target.value)} />
              </label>
              <label>
                Nota:
                <input type="text" value={nota} onChange={(event) => setNota(event.target.value)} />
              </label>
              <div className="form-buttons">
                <button className='form-button' type="submit">{selectedAvaliacao !== null ? 'Atualizar' : 'Adicionar'}</button>
                <button className='form-button' type="button" onClick={handleShowForm}>Cancelar</button>
              </div>
            </div>
          </form>
        )}
        <div>
          <h2>Avaliações cadastradas:</h2>
          {avaliacoes.length === 0 ? (
            <p>Nenhuma avaliação cadastrada ainda.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nome da Disciplina</th>
                  <th>Tipo de Avaliação</th>
                  <th>Subtipo de Avaliação</th>
                  <th>Data da Avaliação</th>
                  <th>Nota</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {avaliacoes.map((avaliacao, index) => (
                  <tr key={index}>
                    <td>{avaliacao.disciplina}</td>
                    <td>{avaliacao.tipoAvaliacao}</td>
                    <td>{avaliacao.subtipoAvaliacao}</td>
                    <td>{avaliacao.dataAvaliacao}</td>
                    <td>{avaliacao.nota}</td>
                    <td>
                      <button onClick={() => handleEditAvaliacao(index)}>Editar</button>
                      <button onClick={() => handleDeleteAvaliacao(index)}>Deletar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};


export default Avaliacoes;
