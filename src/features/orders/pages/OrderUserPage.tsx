import { Link } from "react-router";

const OrderUserPage = () => {
  return (
    <div>
      <div>
        <h1>Pedidos</h1>
        <span>30</span>
      </div>
      {
        [].length === 0 ? (
          <>
            <p>Todavia no has hecho ningun pedido</p>
            <Link to="/tienda">Empezar a comprar</Link>
          </>
        ) : (
          <div>tabla de ordenes</div>
        )
      }
    </div>
  );
};

export default OrderUserPage;
