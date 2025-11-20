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
				bgcolor: 'white',
				height: 'fit-content',
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