import React from "react";
import "./pedidos.css"; // Importando o CSS

export default function ThankYouPage() {
  return (
    <div className="thankyou-container">
      <div className="thankyou-card">
        <div className="checkmark">✔</div>
        <h1>Compra Confirmada!</h1>
        <p>Obrigado por sua compra. Seu pedido foi recebido com sucesso!</p>
        <div className="thankyou-buttons">
          <button onClick={() => window.location.href = "/"}>Voltar à Página Inicial</button>
         
        </div>
      </div>
    </div>
  );
}
