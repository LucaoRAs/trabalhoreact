import React, { useState, useEffect } from 'react';
import { veiculosAPI } from './api';
import ModalCadastro from './components/ModalCadastro';
import TabelaVeiculos from './components/TabelaVeiculos';
import './style.css';

function App() {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchVeiculos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await veiculosAPI.getAll();
      setVeiculos(data);
    } catch (err) {
      setError('Erro ao carregar veículos. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVeiculos();
  }, []);

  const handleCadastroSuccess = () => {
    setSuccess('Veículo cadastrado com sucesso!');
    fetchVeiculos();
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteSuccess = () => {
    setSuccess('Veículo excluído com sucesso!');
    fetchVeiculos();
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <h1>🏎️ Sistema de Veículos</h1>
          <p>Gerencie seu estoque de veículos de forma simples e eficiente</p>
        </div>
      </header>

      <main className="container">
        {error && <div className="message error">{error}</div>}
        {success && <div className="message success">{success}</div>}

        <div className="form-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Lista de Veículos</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              + Novo Veículo
            </button>
          </div>

          <TabelaVeiculos 
            veiculos={veiculos}
            loading={loading}
            onDelete={handleDeleteSuccess}
          />
        </div>
      </main>

      <ModalCadastro
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCadastroSuccess}
      />
    </div>
  );
}

export default App;
