import React, { useState, useEffect } from 'react';
import { veiculosAPI } from '../api';

const ModalEdicao = ({ isOpen, onClose, veiculo, onSuccess }) => {
  const [formData, setFormData] = useState({
    modelo: '',
    marca: '',
    ano: '',
    cor: '',
    preco: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (veiculo && isOpen) {
      setFormData({
        modelo: veiculo.modelo || '',
        marca: veiculo.marca || '',
        ano: veiculo.ano || '',
        cor: veiculo.cor || '',
        preco: veiculo.preco || ''
      });
      setErrors({});
    }
  }, [veiculo, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.modelo.trim()) {
      newErrors.modelo = 'Modelo é obrigatório';
    }
    
    if (!formData.marca.trim()) {
      newErrors.marca = 'Marca é obrigatória';
    }
    
    if (!formData.ano || formData.ano < 1900 || formData.ano > 2030) {
      newErrors.ano = 'Ano deve estar entre 1900 e 2030';
    }
    
    if (!formData.cor.trim()) {
      newErrors.cor = 'Cor é obrigatória';
    }
    
    if (!formData.preco || formData.preco <= 0) {
      newErrors.preco = 'Preço deve ser um valor positivo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await veiculosAPI.update(veiculo.id, {
        ...formData,
        ano: parseInt(formData.ano),
        preco: parseFloat(formData.preco)
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      if (error.response?.data?.details) {
        const apiErrors = {};
        error.response.data.details.forEach(err => {
          if (err.includes('Modelo')) apiErrors.modelo = err;
          else if (err.includes('Marca')) apiErrors.marca = err;
          else if (err.includes('Ano')) apiErrors.ano = err;
          else if (err.includes('Cor')) apiErrors.cor = err;
          else if (err.includes('Preço')) apiErrors.preco = err;
        });
        setErrors(apiErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Editar Veículo</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="modelo">Modelo *</label>
              <input
                type="text"
                id="modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                className={errors.modelo ? 'error' : ''}
                placeholder="Ex: Civic"
              />
              {errors.modelo && <span className="error-message">{errors.modelo}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="marca">Marca *</label>
              <input
                type="text"
                id="marca"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                className={errors.marca ? 'error' : ''}
                placeholder="Ex: Honda"
              />
              {errors.marca && <span className="error-message">{errors.marca}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="ano">Ano *</label>
              <input
                type="number"
                id="ano"
                name="ano"
                value={formData.ano}
                onChange={handleChange}
                className={errors.ano ? 'error' : ''}
                placeholder="2023"
                min="1900"
                max="2030"
              />
              {errors.ano && <span className="error-message">{errors.ano}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="cor">Cor *</label>
              <input
                type="text"
                id="cor"
                name="cor"
                value={formData.cor}
                onChange={handleChange}
                className={errors.cor ? 'error' : ''}
                placeholder="Ex: Branco"
              />
              {errors.cor && <span className="error-message">{errors.cor}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="preco">Preço (R$) *</label>
              <input
                type="number"
                id="preco"
                name="preco"
                value={formData.preco}
                onChange={handleChange}
                className={errors.preco ? 'error' : ''}
                placeholder="50000"
                min="0"
                step="0.01"
              />
              {errors.preco && <span className="error-message">{errors.preco}</span>}
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
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEdicao; 