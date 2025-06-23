import React, { useState } from 'react';
import { veiculosAPI } from '../api';

const ModalCadastro = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    modelo: '',
    marca: '',
    ano: '',
    cor: '',
    preco: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await veiculosAPI.create(form);
      setForm({ modelo: '', marca: '', ano: '', cor: '', preco: '' });
      onSuccess();
      onClose();
    } catch (err) {
      setError('Erro ao cadastrar veículo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Cadastrar Novo Veículo</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="form-container">
          {error && <div className="message error">{error}</div>}
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="modelo">Modelo</label>
              <input
                type="text"
                id="modelo"
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="marca">Marca</label>
              <input
                type="text"
                id="marca"
                name="marca"
                value={form.marca}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="ano">Ano</label>
              <input
                type="number"
                id="ano"
                name="ano"
                value={form.ano}
                onChange={handleChange}
                required
                min="1900"
                max="2030"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cor">Cor</label>
              <input
                type="text"
                id="cor"
                name="cor"
                value={form.cor}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="preco">Preço</label>
              <input
                type="number"
                id="preco"
                name="preco"
                value={form.preco}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
      
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 30px;
          border-bottom: 1px solid #eee;
        }
        
        .modal-header h2 {
          margin: 0;
          color: #333;
        }
        
        .btn-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }
        
        .btn-close:hover {
          color: #333;
        }
        
        .modal-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
        
        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }
        
        .btn-secondary:hover {
          background-color: #5a6268;
        }
      `}</style>
    </div>
  );
};

export default ModalCadastro; 