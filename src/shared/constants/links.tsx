import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HandshakeIcon from '@mui/icons-material/Handshake';

export const dashboardLinks = [
	{
		id: 1,
		title: 'Productos',
		href: '/panel/productos',
		icon: <InventoryIcon />,
	},
	{
		id: 2,
		title: 'Ordenes',
		href: '/panel/pedidos',
		icon: <ShoppingCartIcon />,
	},
	{
		id: 3,
		title: 'Socios',
		href: '/panel/socios',
		icon: <HandshakeIcon />,
	}
];