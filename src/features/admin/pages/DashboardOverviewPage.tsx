import {
  Box,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import { SeoHead } from '@shared/components';
import { useMemo, useState } from 'react';
import {
  useDashboardSalesByChannel,
  useDashboardSalesSeries,
  useDashboardStats,
} from '@features/admin/hooks';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const STATS_CONFIG = [
  {
    key: 'totalSales',
    title: 'Ventas totales',
    color: '#3B6D11',
    bg: '#EAF3DE',
    icon: TrendingUpIcon,
    format: 'currency',
  },
  {
    key: 'totalOrders',
    title: 'Pedidos',
    color: '#185FA5',
    bg: '#E6F1FB',
    icon: ShoppingCartIcon,
    format: 'number',
  },
  {
    key: 'totalProducts',
    title: 'Productos',
    color: '#854F0B',
    bg: '#FAEEDA',
    icon: Inventory2Icon,
    format: 'number',
  },
  {
    key: 'totalCategories',
    title: 'Categorías',
    color: '#534AB7',
    bg: '#EEEDFE',
    icon: CategoryIcon,
    format: 'number',
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);

const dateLabel = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(value));
};

const CustomTooltipStyle = {
  backgroundColor: '#fff',
  border: '0.5px solid rgba(0,0,0,0.1)',
  borderRadius: 1,
  fontSize: 12,
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
};

const DashboardOverviewPage = () => {
  const { stats: statsData, isLoading } = useDashboardStats();
  const [rangeDays, setRangeDays] = useState(7);
  const { series: seriesData } = useDashboardSalesSeries(rangeDays);
  const { channels: channelData, isLoading: isLoadingChannel } =
    useDashboardSalesByChannel(rangeDays);

  const rangeLabel =
    rangeDays === 7 ? '7 días' : rangeDays === 30 ? '30 días' : '90 días';

  const channelChartData = useMemo(() => {
    const totals = { direct: 0, partner: 0 };
    (channelData || []).forEach((row) => {
      if (row.channel === 'direct') totals.direct = row.totalSales || 0;
      if (row.channel === 'partner') totals.partner = row.totalSales || 0;
    });
    return [
      { channel: 'Directo', totalSales: totals.direct },
      { channel: 'Socios', totalSales: totals.partner },
    ];
  }, [channelData]);

  return (
    <>
      <SeoHead
        title='Vista General - Panel'
        description='Resumen y estadísticas principales del negocio'
      />

      <Box
        sx={{
          p: { xs: 2, md: 3 },
          width: '100%',
          bgcolor: '#f5f5f4',
          minHeight: '100vh',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant='h5'
              sx={{ fontWeight: 500, color: '#1c1917', lineHeight: 1.2 }}
            >
              Resumen general
            </Typography>
            <Typography variant='body2' sx={{ color: '#78716c', mt: 0.5 }}>
              Panel de administración
            </Typography>
          </Box>

          <ToggleButtonGroup
            size='small'
            exclusive
            value={rangeDays}
            onChange={(_e, v) => v && setRangeDays(v)}
            sx={{
              border: '0.5px solid rgba(0,0,0,0.15)',
              borderRadius: 1,
              overflow: 'hidden',
              '& .MuiToggleButton-root': {
                border: 'none',
                px: 2,
                py: 0.75,
                fontSize: 13,
                textTransform: 'none',
                color: '#78716c',
                '&.Mui-selected': {
                  bgcolor: '#fff',
                  color: '#1c1917',
                  fontWeight: 500,
                  boxShadow: 'none',
                },
              },
            }}
          >
            <ToggleButton value={7}>7 días</ToggleButton>
            <ToggleButton value={30}>30 días</ToggleButton>
            <ToggleButton value={90}>90 días</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Metric Cards — Box grid en lugar de Grid item */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 1.5,
            mb: 2,
          }}
        >
          {STATS_CONFIG.map(({ key, title, color, bg, icon: Icon, format }) => {
            const raw = statsData?.[key as keyof typeof statsData] ?? 0;
            const value = isLoading
              ? '—'
              : format === 'currency'
                ? formatCurrency(raw as number)
                : (raw as number).toLocaleString('es-AR');

            return (
              <Card
                key={key}
                elevation={0}
                sx={{
                  border: '0.5px solid rgba(0,0,0,0.08)',
                  borderRadius: 1,
                  borderLeft: `3px solid ${color}`,
                  bgcolor: '#fff',
                  transition: 'box-shadow .2s',
                  '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
                }}
              >
                <CardContent sx={{ p: '16px 20px !important' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Typography
                        variant='caption'
                        sx={{
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '.06em',
                          color: '#78716c',
                          fontSize: 11,
                        }}
                      >
                        {title}
                      </Typography>
                      <Typography
                        variant='h5'
                        sx={{
                          fontWeight: 500,
                          color: '#1c1917',
                          mt: 0.75,
                          lineHeight: 1,
                        }}
                      >
                        {value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        bgcolor: bg,
                        color,
                        borderRadius: 1,
                        p: 1,
                        display: 'flex',
                        opacity: 0.85,
                      }}
                    >
                      <Icon sx={{ fontSize: 20 }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>

        {/* Charts — Box grid en lugar de Grid item */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '5fr 4fr 3fr' },
            gap: 1.5,
          }}
        >
          {/* Sales area chart */}
          <Card
            elevation={0}
            sx={{ border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 1 }}
          >
            <CardContent sx={{ p: '16px 20px !important' }}>
              <Typography
                variant='body2'
                sx={{ fontWeight: 500, color: '#1c1917', mb: 0.25 }}
              >
                Ventas por día
              </Typography>
              <Typography
                variant='caption'
                sx={{ color: '#78716c', display: 'block', mb: 2 }}
              >
                Últimos {rangeLabel}
              </Typography>
              <Box sx={{ width: '100%', height: { xs: 220, md: 260 } }}>
                <ResponsiveContainer debounce={300}>
                  <AreaChart
                    data={seriesData || []}
                    margin={{ top: 4, right: 8, bottom: 0, left: -16 }}
                  >
                    <defs>
                      <linearGradient
                        id='salesGrad'
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'
                      >
                        <stop
                          offset='5%'
                          stopColor='#3B6D11'
                          stopOpacity={0.12}
                        />
                        <stop
                          offset='95%'
                          stopColor='#3B6D11'
                          stopOpacity={0.01}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      stroke='rgba(0,0,0,.06)'
                      vertical={false}
                    />
                    <XAxis
                      dataKey='day'
                      tickFormatter={dateLabel}
                      tick={{ fontSize: 11, fill: '#a8a29e' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(v: number) =>
                        `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`
                      }
                      tick={{ fontSize: 11, fill: '#a8a29e' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={CustomTooltipStyle}
                      formatter={(value: unknown) => [
                        formatCurrency(value as number),
                        'Ventas',
                      ]}
                      labelFormatter={dateLabel}
                    />
                    <Area
                      type='monotone'
                      dataKey='totalSales'
                      stroke='#3B6D11'
                      strokeWidth={2}
                      fill='url(#salesGrad)'
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>

          {/* Orders bar chart */}
          <Card
            elevation={0}
            sx={{ border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 1 }}
          >
            <CardContent sx={{ p: '16px 20px !important' }}>
              <Typography
                variant='body2'
                sx={{ fontWeight: 500, color: '#1c1917', mb: 0.25 }}
              >
                Pedidos por día
              </Typography>
              <Typography
                variant='caption'
                sx={{ color: '#78716c', display: 'block', mb: 2 }}
              >
                Últimos {rangeLabel}
              </Typography>
              <Box sx={{ width: '100%', height: { xs: 220, md: 260 } }}>
                <ResponsiveContainer debounce={300}>
                  <BarChart
                    data={seriesData || []}
                    margin={{ top: 4, right: 8, bottom: 0, left: -20 }}
                  >
                    <CartesianGrid
                      strokeDasharray='3 3'
                      stroke='rgba(0,0,0,.06)'
                      vertical={false}
                    />
                    <XAxis
                      dataKey='day'
                      tickFormatter={dateLabel}
                      tick={{ fontSize: 11, fill: '#a8a29e' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: '#a8a29e' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={CustomTooltipStyle}
                      labelFormatter={dateLabel}
                      formatter={(value: unknown) => [
                        value as number,
                        'Pedidos',
                      ]}
                    />
                    <Bar
                      dataKey='totalOrders'
                      fill='#B5D4F4'
                      stroke='#185FA5'
                      strokeWidth={1}
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>

          {/* Channel horizontal bar chart */}
          <Card
            elevation={0}
            sx={{ border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 1 }}
          >
            <CardContent sx={{ p: '16px 20px !important' }}>
              <Typography
                variant='body2'
                sx={{ fontWeight: 500, color: '#1c1917', mb: 0.25 }}
              >
                Por canal
              </Typography>
              <Typography
                variant='caption'
                sx={{ color: '#78716c', display: 'block', mb: 2 }}
              >
                Últimos {rangeLabel}
              </Typography>
              <Box sx={{ width: '100%', height: { xs: 220, md: 260 } }}>
                <ResponsiveContainer debounce={300}>
                  <BarChart
                    data={channelChartData}
                    layout='vertical'
                    // 1. Quitar el margen izquierdo negativo (cambiar -20 a 0)
                    margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray='3 3'
                      stroke='rgba(0,0,0,.06)'
                      horizontal={false}
                    />
                    <XAxis
                      type='number'
                      tickFormatter={(v: number) =>
                        `$${(v / 1000).toFixed(0)}k`
                      }
                      tick={{ fontSize: 11, fill: '#a8a29e' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type='category'
                      dataKey='channel'
                      tick={{ fontSize: 12, fill: '#57534e' }}
                      // 2. Aumentar el width para que entre la palabra "Directo" (ej: 65 o 70)
                      axisLine={false}
                      tickLine={false}
                      width={45}
                    />
                    <Tooltip
                      contentStyle={CustomTooltipStyle}
                      formatter={(value: unknown) => [
                        formatCurrency(value as number),
                        'Ventas',
                      ]}
                    />
                    <Bar
                      dataKey='totalSales'
                      fill='#CECBF6'
                      stroke='#534AB7'
                      strokeWidth={1}
                      radius={[0, 5, 5, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              {isLoadingChannel && (
                <Typography variant='caption' sx={{ color: '#a8a29e' }}>
                  Cargando...
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default DashboardOverviewPage;
