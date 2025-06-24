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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0
  });

  const fetchVeiculos = async (page = 1, search = '') => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        per_page: 10,
        search: search.trim()
      };
      
      const data = await veiculosAPI.getAll(params);
      setVeiculos(data.veiculos);
      setPagination(data.pagination);
    } catch (err) {
      setError('Erro ao carregar veículos. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVeiculos(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleCadastroSuccess = () => {
    setSuccess('Veículo cadastrado com sucesso!');
    fetchVeiculos(currentPage, searchTerm);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteSuccess = () => {
    setSuccess('Veículo excluído com sucesso!');
    fetchVeiculos(currentPage, searchTerm);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleUpdateSuccess = () => {
    setSuccess('Veículo atualizado com sucesso!');
    fetchVeiculos(currentPage, searchTerm);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchVeiculos(1, searchTerm);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
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

        <div className="dashboard">
          {/* Barra de busca e ações */}
          <div className="dashboard-header">
            <div className="search-section">
              <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-group">
                  <input
                    type="text"
                    placeholder="Buscar por modelo, marca ou cor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <button type="submit" className="search-btn">
                    🔍
                  </button>
                  {searchTerm && (
                    <button 
                      type="button" 
                      onClick={clearSearch}
                      className="clear-search-btn"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </form>
            </div>
            
            <div className="actions-section">
              <button 
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
              >
                <span className="btn-icon">+</span>
                <span className="btn-text">Novo Veículo</span>
              </button>
            </div>
          </div>

          {/* Estatísticas rápidas */}
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-value">{pagination.total}</div>
                <div className="stat-label">Total de Veículos</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📄</div>
              <div className="stat-content">
                <div className="stat-value">{pagination.pages}</div>
                <div className="stat-label">Páginas</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔍</div>
              <div className="stat-content">
                <div className="stat-value">{veiculos.length}</div>
                <div className="stat-label">Exibindo</div>
              </div>
            </div>
          </div>

          {/* Tabela de veículos */}
          <div className="table-section">
            <TabelaVeiculos 
              veiculos={veiculos}
              loading={loading}
              onDelete={handleDeleteSuccess}
              onUpdate={handleUpdateSuccess}
            />
          </div>

          {/* Paginação */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Anterior
              </button>
              
              <div className="pagination-pages">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const page = Math.max(1, Math.min(pagination.pages - 4, currentPage - 2)) + i;
                  if (page > pagination.pages) return null;
                  
                  return (
                    <button
                      key={page}
                      className={`pagination-page ${page === currentPage ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.pages}
              >
                Próxima →
              </button>
            </div>
          )}
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
