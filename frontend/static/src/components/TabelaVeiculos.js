import React, { useState } from 'react';
import { veiculosAPI } from '../api';
import ModalEdicao from './ModalEdicao';

const TabelaVeiculos = ({ veiculos, onDelete, onUpdate, loading }) => {
  const [editingVeiculo, setEditingVeiculo] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
      try {
        await veiculosAPI.delete(id);
        onDelete();
      } catch (error) {
        alert('Erro ao deletar veículo');
      }
    }
  };

  const handleEdit = (veiculo) => {
    setEditingVeiculo(veiculo);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    onUpdate();
    setIsEditModalOpen(false);
    setEditingVeiculo(null);
  };

  const formatarPreco = (preco) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };

  const getCorClass = (cor) => {
    const cores = {
      'branco': 'cor-branco',
      'preto': 'cor-preto',
      'prata': 'cor-prata',
      'cinza': 'cor-cinza',
      'azul': 'cor-azul',
      'vermelho': 'cor-vermelho',
      'verde': 'cor-verde',
      'amarelo': 'cor-amarelo',
      'laranja': 'cor-laranja',
      'rosa': 'cor-rosa',
      'roxo': 'cor-roxo',
      'marrom': 'cor-marrom'
    };
    return cores[cor.toLowerCase()] || 'cor-padrao';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando veículos...</p>
      </div>
    );
  }

  if (veiculos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🚗</div>
        <h3>Nenhum veículo encontrado</h3>
        <p>Comece adicionando seu primeiro veículo ao sistema</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-container">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Modelo</th>
                <th>Marca</th>
                <th>Ano</th>
                <th>Cor</th>
                <th>Preço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {veiculos.map((veiculo) => (
                <tr key={veiculo.id} className="table-row">
                  <td className="id-cell">#{veiculo.id}</td>
                  <td className="modelo-cell">
                    <strong>{veiculo.modelo}</strong>
                  </td>
                  <td className="marca-cell">{veiculo.marca}</td>
                  <td className="ano-cell">{veiculo.ano}</td>
                  <td className="cor-cell">
                    <div className="cor-indicator">
                      <span className={`cor-dot ${getCorClass(veiculo.cor)}`}></span>
                      <span>{veiculo.cor}</span>
                    </div>
                  </td>
                  <td className="preco-cell">
                    <span className="preco-value">{formatarPreco(veiculo.preco)}</span>
                  </td>
                  <td className="acoes-cell">
                    <div className="acoes-buttons">
                      <button
                        className="btn btn-edit"
                        onClick={() => handleEdit(veiculo)}
                        title="Editar veículo"
                      >
                        <span className="btn-icon">✏️</span>
                        <span className="btn-text">Editar</span>
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete(veiculo.id)}
                        title="Excluir veículo"
                      >
                        <span className="btn-icon">🗑️</span>
                        <span className="btn-text">Excluir</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ModalEdicao
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        veiculo={editingVeiculo}
        onSuccess={handleEditSuccess}
      />
    </>
  );
};

export default TabelaVeiculos; 