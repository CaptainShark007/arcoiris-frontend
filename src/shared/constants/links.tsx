import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';

export const dashboardLinks = [
	{
		id: 1,
		title: 'Panel',
		href: '/panel/dashboard',
		icon: <DashboardIcon />,
	},
	{
		id: 2,
		title: 'Punto de Venta',
		href: '/panel/punto-de-venta',
		icon: <LocalGroceryStoreIcon />,
	},
	{
		id: 3,
		title: 'Productos',
		href: '/panel/productos',
		icon: <InventoryIcon />,
	},
	{
		id: 4,
		title: 'Pedidos',
		href: '/panel/pedidos',
		icon: <ShoppingCartIcon />,
	},
	{
		id: 5,
		title: 'Socios',
		href: '/panel/socios',
		icon: <HandshakeIcon />,
	},
	{
		id: 6,
		title: 'Banners',
		href: '/panel/banners',
		icon: <ViewCarouselIcon />,
	}
];