import React from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Toolbar, Button } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Ícone para perfil
import ListAltIcon from '@mui/icons-material/ListAlt'; // Ícone para "meus pets"

function SideMenu({ isOpen, onToggle }) {
  return (
    <Box sx={{ p: isOpen ? 2 : 1, borderRight: '1px solid #ddd', height: '100%', transition: 'all 0.3s ease-in-out' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: isOpen ? 'space-between' : 'center', px: '0 !important' }}>
        {isOpen && <Typography variant="h6">Navegação</Typography>}
        <IconButton onClick={onToggle}>
          <ChevronLeftIcon sx={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s' }}/>
        </IconButton>
      </Toolbar>
      
      <List>
        <ListItem disablePadding>
          <ListItemButton component="a" href="/profile" sx={{ justifyContent: isOpen ? 'initial' : 'center' }}> 
            <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}><AccountCircleIcon /></ListItemIcon>
            {isOpen && <ListItemText primary="Meu Perfil" sx={{ ml: 2 }}/>}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="/my-favorites" sx={{ justifyContent: isOpen ? 'initial' : 'center' }}> 
            <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}><FavoriteIcon /></ListItemIcon>
            {isOpen && <ListItemText primary="Meus Favoritos" sx={{ ml: 2 }}/>}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="/my-pets" sx={{ justifyContent: isOpen ? 'initial' : 'center' }}> 
            <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}><ListAltIcon /></ListItemIcon>
            {isOpen && <ListItemText primary="Meus Pets Cadastrados" sx={{ ml: 2 }}/>}
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ mt: 4 }}>
        {isOpen ? (
            <>
              <Typography variant="h6">Ações</Typography>
              <Button variant='contained' size='large' fullWidth component="a" href="/register-pet" startIcon={<PetsIcon />}>
                Cadastrar Pet
              </Button>
            </>
        ) : (
            <IconButton component="a" href="/register-pet" color="primary" sx={{ width: '100%' }}><PetsIcon /></IconButton>
        )}
      </Box>
    </Box>
  );
}

export default SideMenu;