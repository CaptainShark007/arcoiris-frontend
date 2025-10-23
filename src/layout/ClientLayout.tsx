import { signOut } from '@/actions';
import { NavLink, Outlet } from 'react-router';

export const ClientLayout = () => {
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div>
      {/* Menu */}
      <nav>
        <NavLink to='/cuenta/pedidos'>Pedidos</NavLink>
        {/* TODO: LINK DASHBOARD */}
        <button onClick={handleLogout}>Cerrar sesión</button>
      </nav>
      <main>
        <Outlet>
          
        </Outlet>
      </main>
    </div>
  );
};
