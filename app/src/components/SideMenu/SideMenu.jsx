import React from 'react';
import { Box, Typography, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';

function SideMenu() {
  return (
    <Box sx={{ p: 2, borderRight: '1px solid #ddd', height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Navegação
      </Typography>
      
      <List>
        <ListItem disablePadding>
          {/* MUDANÇA AQUI: O href agora aponta para /profile */}
          <ListItemButton component="a" href="/profile"> 
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