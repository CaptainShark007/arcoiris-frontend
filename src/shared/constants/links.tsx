import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';

export const dashboardLinks = [
	{
		id: 1,
		title: 'Productos',
		href: '/panel/productos',
		icon: <InventoryIcon />,
	},
	{
		id: 2,
		title: 'Pedidos',
		href: '/panel/pedidos',
		icon: <ShoppingCartIcon />,
	},
	{
		id: 3,
		title: 'Socios',
		href: '/panel/socios',
		icon: <HandshakeIcon />,
	},
	{
		id: 4,
		title: 'Banners',
		href: '/panel/banners',
		icon: <ViewCarouselIcon />,
	}
];