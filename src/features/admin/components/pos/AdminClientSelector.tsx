import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Chip,
  InputAdornment,
  ClickAwayListener,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { searchAdminClientsForPos } from '@/actions/admin-clients';
import { AdminClient } from '@shared/types/admin-client';

interface AdminClientSelectorProps {
  selectedClient: AdminClient | null;
  onSelect: (client: AdminClient | null) => void;
}

export const AdminClientSelector = ({ selectedClient, onSelect }: AdminClientSelectorProps) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<AdminClient[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchAdminClientsForPos(value);
        setResults(data);
        setOpen(data.length > 0);
      } catch {
        setResults([]);
      }
    }, 300);
  }, []);

  const handleSelect = (client: AdminClient) => {
    onSelect(client);
    setSearch('');
    setResults([]);
    setOpen(false);
  };

  const handleClear = () => {
    onSelect(null);
    setSearch('');
    setResults([]);
    setOpen(false);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  if (selectedClient) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 1.5,
          bgcolor: '#eff6ff',
          borderRadius: 1,
          border: '1px solid #bfdbfe',
        }}
      >
        <PersonIcon sx={{ color: '#2563eb', fontSize: '1.2rem' }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e3a8a' }}>
            {selectedClient.full_name}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6' }}>
            {selectedClient.phone}
            {selectedClient.email && ` · ${selectedClient.email}`}
          </Typography>
        </Box>
        <Chip
          label="Quitar"
          size="small"
          onDelete={handleClear}
          deleteIcon={<CloseIcon sx={{ fontSize: '0.9rem !important' }} />}
          sx={{ fontSize: '0.7rem', height: 24 }}
        />
      </Box>
    );
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box ref={containerRef} sx={{ position: 'relative' }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Buscar cliente (nombre, teléfono, email)..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#9ca3af', fontSize: '1.1rem' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontSize: '0.85rem',
            },
          }}
        />
        {open && results.length > 0 && (
          <Paper
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 0.5,
              zIndex: 1300,
              maxHeight: 200,
              overflow: 'auto',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <List dense disablePadding>
              {results.map((client) => (
                <ListItemButton
                  key={client.id}
                  onClick={() => handleSelect(client)}
                  sx={{ py: 1 }}
                >
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                        {client.full_name}
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {client.phone}
                        {client.email && ` · ${client.email}`}
                      </Typography>
                    }
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}
        <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af', mt: 0.5, fontStyle: 'italic' }}>
          Si no se selecciona, será Cliente Anónimo
        </Typography>
      </Box>
    </ClickAwayListener>
  );
};
