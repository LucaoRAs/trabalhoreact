import React from 'react';
import { veiculosAPI } from '../api';

const TabelaVeiculos = ({ veiculos, onDelete, loading }) => {
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

  const formatarPreco = (preco) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Carregando veículos...</p>
      </div>
    );
  }

  if (veiculos.length === 0) {
    return (
      <div className="table-container">
        <div className="loading">
          <p>Nenhum veículo cadastrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
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
            <tr key={veiculo.id}>
              <td>{veiculo.id}</td>
              <td>{veiculo.modelo}</td>
              <td>{veiculo.marca}</td>
              <td>{veiculo.ano}</td>
              <td>
                <span 
                  style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: veiculo.cor.toLowerCase(),
                    border: '1px solid #ddd',
                    marginRight: '8px'
                  }}
                />
                {veiculo.cor}
              </td>
              <td>{formatarPreco(veiculo.preco)}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(veiculo.id)}
                  title="Excluir veículo"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabelaVeiculos; 