import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface AdminClientSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const AdminClientSearch = ({
  value,
  onChange,
  placeholder = 'Buscar por nombre, teléfono o email...',
}: AdminClientSearchProps) => {
  return (
    <TextField
      size="small"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ minWidth: 280 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: '#9ca3af' }} />
          </InputAdornment>
        ),
      }}
    />
  );
};
