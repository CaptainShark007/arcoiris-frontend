import React from 'react';
import { Tooltip as MuiTooltip, TooltipProps } from '@mui/material';

interface CustomTooltipProps extends Omit<TooltipProps, 'title'> {
  title: string;
  children: React.ReactElement;
  delay?: number;
}

export default function Tooltip({
  title,
  children,
  delay = 500,
  placement = 'bottom',
  arrow = true,
  ...props
}: CustomTooltipProps) {
  return (
    <MuiTooltip
      title={title}
      placement={placement}
      arrow={arrow}
      enterDelay={delay}
      leaveDelay={200}
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: 'grey.800',
            color: 'common.white',
            fontWeight: 500,
            fontSize: '0.75rem',
            borderRadius: 1,
            maxWidth: 300,
            '&.MuiTooltip-tooltipPlacementTop': {
              mb: 1,
            },
            '&.MuiTooltip-tooltipPlacementBottom': {
              mt: 1,
            },
            '&.MuiTooltip-tooltipPlacementLeft': {
              mr: 1,
            },
            '&.MuiTooltip-tooltipPlacementRight': {
              ml: 1,
            },
          },
        },
        arrow: {
          sx: {
            color: 'grey.800',
          },
        },
      }}
      {...props}
    >
      {children}
    </MuiTooltip>
  );
}
