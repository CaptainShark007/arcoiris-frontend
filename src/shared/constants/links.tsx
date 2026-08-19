import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HandshakeIcon from '@mui/icons-material/Handshake';
import CategoryIcon from '@mui/icons-material/Category';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';

export const dashboardLinks = [
	{
		id: 1,
		title: 'Resumen',
		href: '/panel',
		icon: <DashboardIcon />,
	},
	{
		id: 3,
		title: 'Productos',
		href: '/panel/productos',
		icon: <IndeterminateCheckBoxIcon />,
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
	},
	{
		id: 8,
		title: 'Clientes',
		href: '/panel/clientes',
		icon: <PeopleIcon />,
	}
];