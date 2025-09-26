"use client";
import * as React from 'react';
import {
  AppBar, Box, Toolbar, IconButton, Typography, Menu,
  Container, Avatar, Button, Tooltip, MenuItem, Stack, Divider, Badge
} from '@mui/material';
import AppLogo from '../AppLogo/AppLogo';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import Notification from '../Notification';
import { collection, query, where, onSnapshot } from "firebase/firestore";

const paginas = [
  { label: "Buscar Pets", href: "/search-pets", requireLogin: false },
  { label: "Adoções Concluídas", href: "/success-stories", requireLogin: false },
  // { label: "Meus Favoritos", href: "/my-favorites", requireLogin: true },
  { label: "Meus Pets", href: "/my-pets", requireLogin: true },
  { label: "Cadastrar Pet", href: "/register-pet", requireLogin: true },
];

const configs = [
  { label: "Perfil", href: "/profile" },
  { label: "Meus Favoritos", href: "/my-favorites" },
  { label: "Meus Pets", href: "/my-pets" },
  { label: "Sair", action: "logout" },
];

export default function NavBar({ user }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElNotif, setAnchorElNotif] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "proposals"),
        where("ownerId", "==", user.uid),
        where("status", "==", "pending")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notifs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotifications(notifs);
      });
      return () => unsubscribe();
    } else {
      setNotifications([]);
    }
  }, [user]);

  // O resto do código (handlers, etc.) permanece o mesmo...
  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleOpenNotif = (event) => setAnchorElNotif(event.currentTarget);
  const handleCloseNotif = () => setAnchorElNotif(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      handleCloseUserMenu();
      window.location.href = '/';
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };


  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* ... (Logo e Menus - sem alterações) ... */}
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
          
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar-mobile"
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {paginas.map(({ label, href, requireLogin }) => (
                (requireLogin && !user) ? null :
                  <MenuItem key={href} component="a" href={href} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{label}</Typography>
                  </MenuItem>
              ))}
            </Menu>
          </Box>
          
          <Typography variant='h6' component="a" href="/" sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1, fontFamily: 'monospace', color: 'inherit', textDecoration: 'none' }}>
            MIAUDOTE
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {paginas.map(({ label, href, requireLogin }) => (
              (requireLogin && !user) ? null :
                <Button key={href} sx={{ my: 2, color: 'white', display: 'block' }} component="a" href={href}>
                  {label}
                </Button>
            ))}
          </Box>
          
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                {/* ... (Menu de notificações - sem alterações) ... */}
                <Tooltip title="Notificações">
                  <IconButton onClick={handleOpenNotif} sx={{ mr: '.25em' }}>
                    <Badge badgeContent={notifications.length} color="error">
                      {notifications.length > 0 ? <NotificationsIcon htmlColor='white' /> : <NotificationsNoneIcon htmlColor='white' />}
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  anchorEl={anchorElNotif}
                  open={Boolean(anchorElNotif)}
                  onClose={handleCloseNotif}
                >
                  <Stack spacing={0} divider={<Divider orientation="horizontal" flexItem />}>
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <MenuItem key={notif.id} onClick={handleCloseNotif} component="a" href={`/proposal/${notif.id}`}>
                          <Notification userName={notif.proposerName} petName={notif.petName} timestamp={notif.createdAt?.toDate()} />
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled><Typography sx={{ p: 2 }}>Nenhuma nova notificação.</Typography></MenuItem>
                    )}
                  </Stack>
                </Menu>

                <Tooltip title="Abrir configurações">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {/* 👇 MUDANÇA PRINCIPAL AQUI 👇 */}
                    <Avatar 
                      alt={user.displayName || ''} 
                      src={user.photoURL} // Usa a URL da foto do usuário
                    >
                      {/* O Avatar mostra a letra inicial se não houver foto */}
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : ''}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {configs.map(({ label, href, action }) => (
                    <MenuItem key={label} onClick={action === 'logout' ? handleLogout : handleCloseUserMenu}>
                      <Typography textAlign="center" component="a" href={action !== 'logout' ? href : undefined} sx={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                        {label}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
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