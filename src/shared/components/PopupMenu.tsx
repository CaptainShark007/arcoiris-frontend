import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  MenuProps,
} from '@mui/material';

export interface PopupMenuItem {
  text: string;
  icon?: React.ReactNode;
  path?: string;
  onClick?: () => void;
}

interface PopupMenuProps extends Omit<MenuProps, 'open' | 'onClose'> {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  items: PopupMenuItem[];
  onItemClick?: (item: PopupMenuItem) => void;
}

export default function PopupMenu({
  anchorEl,
  open,
  onClose,
  items,
  onItemClick,
  ...props
}: PopupMenuProps) {
  const handleItemClick = (item: PopupMenuItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (onItemClick) {
      onItemClick(item);
    }
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          minWidth: 180,
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0px 4px 20px rgba(0, 0, 0, 0.5)'
              : '0px 4px 20px rgba(0, 0, 0, 0.15)',
          '& .MuiMenuItem-root': {
            py: 1,
            px: 2,
            borderRadius: 1,
            mx: 0.5,
            my: 0.25,
            transition: 'background-color 0.2s ease',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          },
        },
      }}
      {...props}
    >
      {items.map((item, index) => (
        <MenuItem
          key={index}
          onClick={() => handleItemClick(item)}
          sx={{
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          {item.icon && (
            <ListItemIcon
              sx={{
                minWidth: 36,
                color: 'text.primary',
                '& .MuiSvgIcon-root': {
                  fontSize: '1.2rem',
                },
              }}
            >
              {item.icon}
            </ListItemIcon>
          )}
          <ListItemText
            primary={item.text}
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          />
        </MenuItem>
      ))}
    </Menu>
  );
}
