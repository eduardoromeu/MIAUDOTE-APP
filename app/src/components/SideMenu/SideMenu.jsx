import React from 'react';
import { Box, Typography, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
// MUDANÇA 1: Removido o import do 'react-router-dom' que estava causando o erro.
import PetsIcon from '@mui/icons-material/Pets';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';

function SideMenu() {
  return (
    <Box sx={{ p: 2, borderRight: '1px solid #ddd', height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Navegação
      </Typography>
      
      <List>
        <ListItem disablePadding>
          {/* MUDANÇA 2: Trocamos component={Link} por component="a" e 'to' por 'href' */}
          <ListItemButton component="a" href="/search-pets">
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary="Buscar Pets" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          {/* MUDANÇA 3: Mesma troca aqui */}
          <ListItemButton component="a" href="/my-favorites">
            <ListItemIcon>
              <FavoriteIcon />
            </ListItemIcon>
            <ListItemText primary="Meus Favoritos" />
          </ListItemButton>
        </ListItem>
      </List>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Ações
      </Typography>
      
      <Button 
        variant='contained' 
        size='large' 
        fullWidth
        // MUDANÇA 4: E aqui também
        component="a" 
        href="/register-pet"
        startIcon={<PetsIcon />}
      >
        Cadastrar Pet
      </Button>
    </Box>
  );
}

export default SideMenu;