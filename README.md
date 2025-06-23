# Sistema de Veículos

Um sistema completo para gerenciamento de veículos com backend em Flask e frontend em React.

## 📁 Estrutura do Projeto

```
/meu-projeto
│
├── backend/
│   ├── db_config.py
│   ├── veiculos.py
│   ├── server.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── api.js
│   │   ├── style.css
│   │   └── components/
│   │       ├── ModalCadastro.js
│   │       └── TabelaVeiculos.js
│   └── package.json
│
└── README.md
```

## 🚀 Como Executar

### Pré-requisitos

- Python 3.8+
- Node.js 14+
- MySQL

### Backend (Flask)

1. **Instale as dependências:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure o banco de dados:**
   - Certifique-se de que o MySQL está rodando
   - Crie um banco chamado `veiculos_db`
   - Configure as credenciais em `db_config.py`

3. **Execute o servidor:**
   ```bash
   python server.py
   ```
   O servidor estará disponível em `http://localhost:5000`

### Frontend (React)

1. **Instale as dependências:**
   ```bash
   cd frontend/static
   npm install
   ```

2. **Execute o servidor de desenvolvimento:**
   ```bash
   npm start
   ```
   O frontend estará disponível em `http://localhost:3000`

## 🛠️ Funcionalidades

- ✅ Listar veículos
- ✅ Cadastrar novo veículo
- ✅ Excluir veículo
- ✅ Interface responsiva
- ✅ Validação de formulários
- ✅ Mensagens de feedback

## 📊 API Endpoints

- `GET /veiculos` - Lista todos os veículos
- `GET /veiculos/<id>` - Busca veículo por ID
- `POST /veiculos` - Cadastra novo veículo
- `PUT /veiculos/<id>` - Atualiza veículo
- `DELETE /veiculos/<id>` - Remove veículo

## 🎨 Tecnologias Utilizadas

### Backend
- Flask
- PyMySQL
- Flask-CORS

### Frontend
- React
- Axios
- CSS3

## 📝 Estrutura do Banco

```sql
CREATE TABLE veiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modelo VARCHAR(100) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    ano INT NOT NULL,
    cor VARCHAR(30) NOT NULL,
    preco DECIMAL(10,2) NOT NULL
);
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. 