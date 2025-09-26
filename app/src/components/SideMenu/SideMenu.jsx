import React from 'react';
import { Box, Typography, IconButton, Toolbar, Button } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

// O SideMenu agora está muito mais simples
function SideMenu({ isOpen, onToggle }) {
  return (
    <Box sx={{ p: isOpen ? 2 : 1, borderRight: '1px solid #ddd', height: '100%', transition: 'all 0.3s ease-in-out' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: isOpen ? 'flex-end' : 'center', px: '0 !important' }}>
        <IconButton onClick={onToggle}>
          <ChevronLeftIcon sx={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s' }}/>
        </IconButton>
      </Toolbar>
      
      <Box sx={{ mt: 4 }}>
        {isOpen ? (
            <>
              <Typography variant="h6">Ações</Typography>
              <Button variant='contained' size='large' fullWidth component="a" href="/register-pet" startIcon={<PetsIcon />}>
                Cadastrar Pet
              </Button>
            </>
        ) : (
            <IconButton component="a" href="/register-pet" color="primary" sx={{ width: '100%' }}>
              <PetsIcon />
            </IconButton>
        )}
      </Box>
    </Box>
  );
}

export default SideMenu;