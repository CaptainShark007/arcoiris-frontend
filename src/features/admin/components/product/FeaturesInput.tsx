import React from "react";
import { ProductFormValues } from "@features/admin/schema/productSchema";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { Control, FieldErrors, useFieldArray } from "react-hook-form";

interface FeaturesProps {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

export const FeaturesInput = ({ control, errors }: FeaturesProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'features',
  });

  const [newFeature, setNewFeature] = useState('');

  const handleAddFeature = () => {
    if (newFeature.trim() === '') return;
    append({ value: newFeature });
    setNewFeature('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFeature();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.75, sm: 1 } }}>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 'bold',
          textTransform: 'capitalize',
          fontSize: { xs: '0.65rem', sm: '0.75rem' },
        }}
      >
        Características:
      </Typography>

      {fields.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 0.5, sm: 0.75 },
            pl: { xs: 1, sm: 1.5 },
            mb: { xs: 0.5, sm: 0.75 },
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
          }}
        >
          {fields.map((field, index) => (
            <Box
              key={field.id}
              sx={{
                display: 'flex',
                gap: { xs: 0.5, sm: 0.75 },
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: '100%',
              }}
            >
              <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 0.75 }, alignItems: 'center', flex: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    width: { xs: 5, sm: 6 },
                    height: { xs: 5, sm: 6 },
                    borderRadius: '50%',
                    backgroundColor: '#78716c',
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: '#4b5563',
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {field.value}
                </Typography>
              </Box>
              <Button
                onClick={() => remove(index)}
                sx={{
                  color: '#ef4444',
                  fontWeight: 'bold',
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  '&:hover': { transform: 'scale(1.1)' },
                  minWidth: 'auto',
                  p: { xs: 0.15, sm: 0.25 },
                  flexShrink: 0,
                }}
              >
                X
              </Button>
            </Box>
          ))}
        </Box>
      )}

      <Box
        component="input"
        type="text"
        placeholder="Fácil de aplicar y secado rápido"
        value={newFeature}
        onChange={(e) => setNewFeature(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{
          width: '100%',
          boxSizing: 'border-box',
          p: { xs: '0.4rem', sm: '0.5rem' },
          border: errors.features ? '1px solid #ef4444' : '1px solid #d1d5db',
          borderRadius: '4px',
          fontSize: { xs: '0.7rem', sm: '0.8rem' },
          fontFamily: 'inherit',
          transition: 'border-color 200ms',
          '&:focus': {
            outline: 'none',
            borderColor: '#3b82f6',
          },
        }}
      />

      {errors.features && (
        <Typography sx={{ color: '#ef4444', fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>
          {errors.features.message}
        </Typography>
      )}
    </Box>
  );
};