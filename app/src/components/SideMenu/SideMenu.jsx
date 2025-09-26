import React from 'react';
import { Box, Typography, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Toolbar } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'; // Ícone para fechar
import MenuIcon from '@mui/icons-material/Menu'; // Ícone para abrir (alternativa)

// MUDANÇA 1: Recebe 'isOpen' e 'onToggle' como props
function SideMenu({ isOpen, onToggle }) {
  return (
    <Box sx={{ 
        p: isOpen ? 2 : 1, // Padding menor quando fechado
        borderRight: '1px solid #ddd', 
        height: '100%',
        transition: 'all 0.3s ease-in-out' // Transição suave
    }}>
      {/* MUDANÇA 2: Header do menu com título e botão de toggle */}
      <Toolbar sx={{ display: 'flex', justifyContent: isOpen ? 'space-between' : 'center', px: '0 !important' }}>
        {isOpen && (
            <Typography variant="h6">
                Navegação
            </Typography>
        )}
        <IconButton onClick={onToggle}>
            <ChevronLeftIcon sx={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s' }}/>
        </IconButton>
      </Toolbar>
      
      <List>
        <ListItem disablePadding>
          <ListItemButton component="a" href="/profile" sx={{ justifyContent: isOpen ? 'initial' : 'center' }}> 
            <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
              <FavoriteIcon />
            </ListItemIcon>
            {/* MUDANÇA 3: O texto só aparece se o menu estiver aberto */}
            {isOpen && <ListItemText primary="Meus Favoritos" sx={{ ml: 2 }}/>}
          </ListItemButton>
        </ListItem>
      </List>

      {/* MUDANÇA 4: Ações com comportamento similar */}
      <Box sx={{ mt: 4 }}>
        {isOpen ? (
            <>
                <Typography variant="h6">Ações</Typography>
                <Button 
                    variant='contained' 
                    size='large' 
                    fullWidth
                    component="a" 
                    href="/register-pet"
                    startIcon={<PetsIcon />}
                >
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