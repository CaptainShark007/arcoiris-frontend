import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

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
];