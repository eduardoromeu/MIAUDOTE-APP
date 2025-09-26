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
import { auth, db } from '../../firebase'; // Verifique o caminho
import Notification from '../Notification';

// 1. IMPORTS ADICIONAIS DO FIRESTORE PARA BUSCA EM TEMPO REAL
import { collection, query, where, onSnapshot } from "firebase/firestore";

const paginas = [
  { label: "Cadastrar Pet", href: "/register-pet", requireLogin: true },
  { label: "Buscar Pets", href: "/search-pets", requireLogin: false },
  { label: "Adoções Concluídas", href: "/success-stories", requireLogin: false },
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

  // 2. NOVO ESTADO PARA ARMAZENAR AS NOTIFICAÇÕES
  const [notifications, setNotifications] = React.useState([]);

  // 3. NOVO useEffect PARA BUSCAR NOTIFICAÇÕES EM TEMPO REAL
  React.useEffect(() => {
    // Se o usuário estiver logado, cria o "ouvinte" de notificações
    if (user) {
      const q = query(
        collection(db, "proposals"),
        where("ownerId", "==", user.uid),
        where("status", "==", "pending")
      );

      // onSnapshot escuta por mudanças em tempo real no banco de dados
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notifs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotifications(notifs);
      });

      // Limpa o "ouvinte" quando o componente é desmontado ou o usuário faz logout
      return () => unsubscribe();
    } else {
      setNotifications([]); // Limpa as notificações se não houver usuário
    }
  }, [user]); // Este efeito roda sempre que o 'user' mudar

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
          {/* ... (código dos menus mobile e desktop - sem alterações) ... */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {paginas.map(({ label, href, requireLogin }) => (
              (requireLogin && !user) ? null :
                <Button
                  key={href}
                  onClick={handleCloseNavMenu}
                  sx={{ mt: ".2em", color: 'white', display: 'block' }}
                  component="a"
                  href={href}
                >
                  {label}
                </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                {/* 4. ATUALIZAÇÃO: Ícone de notificação agora é dinâmico */}
                <Tooltip title="Notificações">
                  <IconButton onClick={handleOpenNotif} sx={{ mr: '.25em' }}>
                    <Badge badgeContent={notifications.length} color="error">
                      {notifications.length > 0 ? <NotificationsIcon htmlColor='white' /> : <NotificationsNoneIcon htmlColor='white' />}
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-notif"
                  anchorEl={anchorElNotif}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted
                  open={Boolean(anchorElNotif)}
                  onClose={handleCloseNotif}
                >
                  {/* 5. ATUALIZAÇÃO: Menu agora mostra as notificações reais */}
                  <Stack spacing={0} divider={<Divider orientation="horizontal" flexItem />}>
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <MenuItem 
                          key={notif.id} 
                          onClick={handleCloseNotif}
                          component="a"
                          href={`/proposal/${notif.id}`}
                        >
                          <Notification 
                            userName={notif.proposerName} 
                            petName={notif.petName} 
                            timestamp={notif.createdAt?.toDate()} 
                          />
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        <Typography sx={{ p: 2 }}>Nenhuma nova notificação.</Typography>
                      </MenuItem>
                    )}
                  </Stack>
                </Menu>

                {/* ... (Menu do Perfil do usuário - sem alterações) ... */}
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
              // ... (Botões de Login/Cadastro - sem alterações)
              <Stack direction="row" sx={{ display: { xs: 'none', md: 'inherit' } }}>
                <Button color="inherit" component="a" href='/cadastro-usuario'>Cadastrar<AppRegistrationIcon sx={{ ml: ".5em" }} /></Button>
                <Button color="inherit" component="a" href='/login'>Login<LoginIcon sx={{ ml: ".5em" }} /></Button>
              </Stack>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}