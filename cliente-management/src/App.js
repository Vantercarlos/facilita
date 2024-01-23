import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import OptimizedRoute from "./OptimizedRoute";
import "./App.css";

const clientes2 = [
  { x: 1, y: 2 },
  { x: 3, y: 4 },
  // ... adicione outros clientes com suas coordenadas
];

function App() {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);
  const [novoCliente, setNovoCliente] = useState({
    nome: "",
    email: "",
    telefone: "",
  });
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    const response = await axios.get("http://localhost:3001/clientes");
    setClientes(response.data);
  };

  const cadastrarCliente = async () => {
    // Validar se os campos do formulário não estão vazios
    if (!novoCliente.nome || !novoCliente.email || !novoCliente.telefone) {
      setError("Preencha todos os campos antes de cadastrar.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/clientes",
        novoCliente
      );
      fetchClientes();
      setNovoCliente({ nome: "", email: "", telefone: "" });
      setError(null);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("Cliente com o mesmo e-mail já cadastrado.");
      } else {
        setError("Erro ao cadastrar cliente.");
      }
    }
  };

  const openModal = (client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedClient(null);
    setIsModalOpen(false);
  };

  const filterClientes = () => {
    // Filtrar clientes com base no texto de filtro
    return clientes.filter((cliente) => {
      const searchString = filtro.toLowerCase();
      return (
        cliente.nome.toLowerCase().includes(searchString) ||
        cliente.email.toLowerCase().includes(searchString) ||
        cliente.telefone.includes(searchString)
      );
    });
  };

  return (
    <div className="app-container">
      <header>
        <h1>Gerenciamento de Clientes</h1>
      </header>
      <main>
        <section className="cadastro-section">
          <h2>Cadastrar Novo Cliente</h2>
          {error && <div className="error-message">{error}</div>}
          <form>
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              id="nome"
              value={novoCliente.nome}
              onChange={(e) =>
                setNovoCliente({ ...novoCliente, nome: e.target.value })
              }
            />

            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              value={novoCliente.email}
              onChange={(e) =>
                setNovoCliente({ ...novoCliente, email: e.target.value })
              }
            />

            <label htmlFor="telefone">Telefone:</label>
            <input
              type="text"
              id="telefone"
              value={novoCliente.telefone}
              onChange={(e) =>
                setNovoCliente({ ...novoCliente, telefone: e.target.value })
              }
            />

            <button type="button" onClick={cadastrarCliente}>
              Cadastrar
            </button>
          </form>
        </section>
        <section className="clientes-section">
          <h2>Lista de Clientes</h2>
          <section className="filtro-section">
            <label htmlFor="filtro">Buscar:</label>
            <input
              type="text"
              id="filtro"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </section>
          <ul className="clientes-list">
            {filterClientes().map((cliente) => (
              <li key={cliente.id} onClick={() => openModal(cliente)}>
                <strong>{cliente.nome}</strong>
                <p>Email: {cliente.email}</p>
                <p>Telefone: {cliente.telefone}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <div>
        <header>
          <h1>Gerenciamento de Rota Otimizada</h1>
        </header>
        <OptimizedRoute clientes={clientes2} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="overlay"
      >
        {selectedClient && (
          <div>
            <h2>Detalhes do Cliente</h2>
            <p>
              <strong>Nome:</strong> {selectedClient.nome}
            </p>
            <p>
              <strong>Email:</strong> {selectedClient.email}
            </p>
            <p>
              <strong>Telefone:</strong> {selectedClient.telefone}
            </p>
          </div>
        )}
        <button onClick={closeModal}>Fechar</button>
      </Modal>
    </div>
  );
}

export default App;
