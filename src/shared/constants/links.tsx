import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HandshakeIcon from '@mui/icons-material/Handshake';
import CategoryIcon from '@mui/icons-material/Category';

export const dashboardLinks = [
	{
		id: 3,
		title: 'Productos',
		href: '/panel/productos',
		icon: <InventoryIcon />,
	},
	{
		id: 4,
		title: 'Inventario',
		href: '/panel/inventario',
		icon: <InventoryIcon />,
	},
	{
		id: 5,
		title: 'Categorias',
		href: '/panel/categorias',
		icon: <CategoryIcon />,
	},
	{
		id: 6,
		title: 'Pedidos',
		href: '/panel/pedidos',
		icon: <ShoppingCartIcon />,
	},
	{
		id: 7,
		title: 'Socios',
		href: '/panel/socios',
		icon: <HandshakeIcon />,
	}
];