import React, { useState } from "react";
import Modal from "react-modal";
import "./OptimizedRoute.css";

function OptimizedRoute({ clientes }) {
  const [rotaOtimizada, setRotaOtimizada] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calcularRotaOtimizada = () => {
    const pontos = [{ x: 0, y: 0 }, ...clientes];

    // Função para encontrar o ponto mais próximo não visitado
    const calcularDistancia = (ponto1, ponto2) =>
      Math.sqrt(
        Math.pow(ponto1.x - ponto2.x, 2) + Math.pow(ponto1.y - ponto2.y, 2)
      );

    // Função para encontrar o ponto mais próximo não visitado
    const encontrarProximoPonto = (pontoAtual, pontosNaoVisitados) => {
      let menorDistancia = Infinity;
      let proximoPonto = null;

      for (const ponto of pontosNaoVisitados) {
        const distancia = calcularDistancia(pontoAtual, ponto);
        if (distancia < menorDistancia) {
          menorDistancia = distancia;
          proximoPonto = ponto;
        }
      }

      return proximoPonto;
    };

    let rota = [pontos[0]];
    let pontosNaoVisitados = pontos.slice(1);

    // Encontrar o próximo ponto mais próximo até que todos os pontos sejam visitados
    while (pontosNaoVisitados.length > 0) {
      const pontoAtual = rota[rota.length - 1];
      const proximoPonto = encontrarProximoPonto(
        pontoAtual,
        pontosNaoVisitados
      );
      rota.push(proximoPonto);
      pontosNaoVisitados = pontosNaoVisitados.filter((p) => p !== proximoPonto);
    }

    rota.push(pontos[0]);

    setRotaOtimizada(rota);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="optimized-route-container">
      <h2>Rota Otimizada</h2>
      <button onClick={calcularRotaOtimizada}>Calcular Rota</button>

      {rotaOtimizada.length > 0 && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className="modal"
          overlayClassName="overlay"
        >
          <h2>Ordem de Visitação</h2>
          <ul className="route-list">
            {rotaOtimizada.map((ponto, index) => (
              <li key={index} className="route-item">
                {index === 0 ? "Empresa" : `Cliente ${index}`} - X: {ponto.x},
                Y: {ponto.y}
              </li>
            ))}
          </ul>
          <button onClick={closeModal}>Fechar</button>
        </Modal>
      )}
    </div>
  );
}

export default OptimizedRoute;
