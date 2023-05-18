import React, { useState } from 'react';
import "./avaliacoes.css";

export const Avaliacoes = () => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [disciplina, setDisciplina] = useState('');
  const [tipoAvaliacao, setTipoAvaliacao] = useState('');
  const [dataAvaliacao, setDataAvaliacao] = useState('');
  const [nota, setNota] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedAvaliacao, setSelectedAvaliacao] = useState(null);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Check if nota is within the valid range
    if (nota < 0 || nota > 20) {
      alert('Nota must be between 0 and 20');
      return;
    }

    const newAvaliacao = {
      disciplina: disciplina,
      tipoAvaliacao: tipoAvaliacao,
      dataAvaliacao: dataAvaliacao,
      nota: nota
    };
    setAvaliacoes([...avaliacoes, newAvaliacao]);
    setDisciplina('');
    setTipoAvaliacao('');
    setDataAvaliacao('');
    setNota('');
    setShowForm(false);
  };

  const handleShowForm = () => {
    if (showForm) {
      setDisciplina('');
      setTipoAvaliacao('');
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
    setDataAvaliacao(avaliacoes[index].dataAvaliacao);
    setNota(avaliacoes[index].nota);
    setShowForm(true);
  };

  const handleUpdateAvaliacao = () => {
    // Check if nota is within the valid range
    if (nota < 0 || nota > 20) {
      alert('Nota must be between 0 and 20');
      return;
    }

    const updatedAvaliacao = {
      disciplina: disciplina,
      tipoAvaliacao: tipoAvaliacao,
      dataAvaliacao: dataAvaliacao,
      nota: nota
    };
    const updatedAvaliacoes = [...avaliacoes];
    updatedAvaliacoes[selectedAvaliacao] = updatedAvaliacao;
    setAvaliacoes(updatedAvaliacoes);
    setDisciplina('');
    setTipoAvaliacao('');
    setDataAvaliacao('');
    setNota('');
    setSelectedAvaliacao(null);
    setShowForm(false);
  };

  const handleDeleteAvaliacao = (index) => {
    if (window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
      const newAvaliacoes = [...avaliacoes];
      newAvaliacoes.splice(index, 1);
      setAvaliacoes(newAvaliacoes);
    }
  }

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
              <input type="text" value={disciplina} onChange={(event) => setDisciplina(event.target.value)} />
            </label>
            <label>
              Tipo de Avaliação:
              <input type="text" value={tipoAvaliacao} onChange={(event) => setTipoAvaliacao(event.target.value)} />
            </label>
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
