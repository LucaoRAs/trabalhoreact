import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const veiculosAPI = {
  // Buscar todos os veículos com paginação e busca
  getAll: async (params = {}) => {
    const response = await api.get('/veiculos', { params });
    return response.data;
  },

  // Buscar veículo por ID
  getById: async (id) => {
    const response = await api.get(`/veiculos/${id}`);
    return response.data;
  },

  // Criar novo veículo
  create: async (veiculo) => {
    const response = await api.post('/veiculos', veiculo);
    return response.data;
  },

  // Atualizar veículo
  update: async (id, veiculo) => {
    const response = await api.put(`/veiculos/${id}`, veiculo);
    return response.data;
  },

  // Deletar veículo
  delete: async (id) => {
    const response = await api.delete(`/veiculos/${id}`);
    return response.data;
  },

  // Buscar estatísticas
  getStats: async () => {
    const response = await api.get('/veiculos/stats');
    return response.data;
  },
};

export default api; 