import React, { useState } from 'react';
import { 
  Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, 
  ListItemButton, ListItemText, ListItemIcon, IconButton, Divider 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
// 1. Ícones para os novos itens de menu
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PetsIcon from '@mui/icons-material/Pets';

// 2. O Header agora recebe o 'user' para mostrar/esconder links
export default function Header({ titulo, user }) {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // 3. Listas de links para organizar o menu
  const publicPages = [
    { text: 'Início', icon: <HomeIcon />, href: '/' },
    { text: 'Buscar Pets', icon: <SearchIcon />, href: '/search-pets' },
  ];

  const privatePages = [
    { text: 'Meu Perfil', icon: <AccountCircleIcon />, href: '/profile' },
    { text: 'Meus Favoritos', icon: <FavoriteIcon />, href: '/my-favorites' },
    { text: 'Meus Pets Cadastrados', icon: <ListAltIcon />, href: '/my-pets' },
    { text: 'Cadastrar um Pet', icon: <PetsIcon />, href: '/register-pet' },
  ];

  const drawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Toolbar />
      <Divider />
      <List>
        {/* Links públicos, sempre visíveis */}
        {publicPages.map((page) => (
          <ListItem key={page.text} disablePadding>
            <ListItemButton component="a" href={page.href}>
              <ListItemIcon>{page.icon}</ListItemIcon>
              <ListItemText primary={page.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      {/* Links privados, visíveis apenas se o usuário estiver logado */}
      {user && (
        <>
          <Divider />
          <List>
            {privatePages.map((page) => (
              <ListItem key={page.text} disablePadding>
                <ListItemButton component="a" href={page.href}>
                  <ListItemIcon>{page.icon}</ListItemIcon>
                  <ListItemText primary={page.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {titulo || "MIAUDOTE"}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 4. O conteúdo do Drawer agora é a lista dinâmica que criamos */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerList}
      </Drawer>
    </Box>
  );
}