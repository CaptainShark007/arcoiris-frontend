import { ReactNode } from 'react';
import { Typography, Paper } from '@mui/material';

interface Props {
	className?: string;
	titleSection?: string;
	children: ReactNode;
}

export const SectionFormProduct = ({
	titleSection,
	children,
}: Props) => {
	return (
		<Paper
			sx={{
				p: 2.75,
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
				bgcolor: '#f9fafb',
				height: 'fit-content',
				boxShadow: 'none',
        border: '1px solid #E5E7EB',
			}}
		>
			{titleSection && (
				<Typography variant="h6" sx={{ fontWeight: 'bold' }}>
					{titleSection}:
				</Typography>
			)}
			{children}
		</Paper>
	);
};