"use client";
import * as React from 'react';
import {
  AppBar, Box, Toolbar, IconButton, Typography, Menu,
  Container, Avatar, Button, Tooltip, MenuItem, Stack
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AppLogo from '../AppLogo/AppLogo';

// 1. Imports para funcionalidade de Logout
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase'; // Verifique se o caminho está correto

const paginas = [
  { label: "Cadastrar Pet", href: "/register-pet", requireLogin: true },
  { label: "Buscar Pets", href: "/search-pets", requireLogin: false },
  { label: "Adoções Concluídas", href: "/success-stories", requireLogin: false },
];

const configs = [
  { label: "Perfil", href: "/profile" },
  { label: "Sair", action: "logout" },
];

// A NavBar agora recebe o 'user' como prop do root.jsx
export default function NavBar({ user, setOpenModal }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  // O 'useNavigate' FOI REMOVIDO

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  // 2. Função de Logout agora usa window.location.href para redirecionar
  const handleLogout = async () => {
    try {
      await signOut(auth);
      handleCloseUserMenu();
      // Redireciona para a home com um recarregamento completo da página
      window.location.href = '/';
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* ... (Seu código do Logo e Menu Mobile - sem alterações) ... */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: 'none', md: 'inline-flex' } }}
            component="a"
            href="/"
          >
            <AppLogo />
            <Typography variant='h5' sx={{ fontFamily: 'monospace', marginBottom: '-5px', marginLeft: '.25em' }}>MIAUDOTE</Typography>
          </IconButton>

          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {paginas.map(({ label, href, requireLogin }) => (
                (requireLogin && !user) ? null :
                  <MenuItem key={href} onClick={handleCloseNavMenu}>
                    <Button component="a" href={href} sx={{ textAlign: 'center' }} size="small">
                      {label}
                    </Button>
                  </MenuItem>
              ))}
              <MenuItem onClick={handleCloseNavMenu} component="a" href='/cadastro-usuario'>
                <Button sx={{ textAlign: 'center' }} size="small">Cadastrar</Button>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu} component="a" href='/login'>
                <Button sx={{ textAlign: 'center' }} size="small">Login</Button>
              </MenuItem>
            </Menu>
          </Box>

          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            component="a"
            href="/"
            disableRipple
            sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1 }}
          >
            <AppLogo />
            <Typography variant='h5' sx={{ fontFamily: 'monospace', marginBottom: '-5px', marginLeft: '.25em' }}>MIAUDOTE</Typography>
          </IconButton>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {paginas.map(({ label, href, requireLogin }) => (
              (requireLogin && !user) ? null :
                <Button
                  key={href}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  component="a"
                  href={href}
                >
                  {label}
                </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              // Se o usuário EXISTE (está logado)
              <>
                <Tooltip title="Abrir configurações">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user.displayName || ''}>
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : ''}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {configs.map(({ label, href, action }) => (
                    // 3. O menu agora usa links ou a função de logout
                    <MenuItem key={label} onClick={action === 'logout' ? handleLogout : handleCloseUserMenu}>
                      <Typography
                        textAlign="center"
                        component="a"
                        href={action !== 'logout' ? href : undefined}
                        sx={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
                      >
                        {label}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              // Se o usuário NÃO EXISTE (não está logado)
              <Stack direction="row" sx={{ display: { xs: 'none', md: 'inherit' } }}>
                <Button color="inherit" component="a" href='/cadastro-usuario'>Cadastrar</Button>
                <Button color="inherit" component="a" href='/login'>Login</Button>
              </Stack>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}