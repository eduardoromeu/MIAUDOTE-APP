import React, { useState } from 'react';
import { Container, Typography, Avatar, Box, TextField, Stack, Button, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// 1. Import from 'react-router' WHICH YOUR PROJECT ALREADY USES
import { useOutletContext } from 'react-router';
import { signOut, updateProfile } from 'firebase/auth';
import { auth } from '../firebase'; // Make sure this path is correct

export default function Profile() {
  // 2. This now correctly gets the user from root.jsx
  const { user } = useOutletContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user ? user.displayName : '');

  // PETS favoritos
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);

  // Display a loading indicator if the user data hasn't arrived yet
  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleEdit = () => {
    setEditedName(user.displayName || '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editedName.trim()) return;
    try {
      await updateProfile(auth.currentUser, {
        displayName: editedName,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // 3. Use standard browser navigation for redirection
      window.location.href = '/';
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <Container>
      <Stack direction="column" alignItems="center" spacing={2} sx={{ mb: 4, width: 'fit-content', mx: 'auto' }}>
        <Avatar sx={{ width: 100, height: 100, p: 1.5, bgcolor: 'orange', fontSize: '3rem' }}>
          {user.displayName ? user.displayName.charAt(0).toUpperCase() : ''}
        </Avatar>

        {isEditing ? (
          <Stack spacing={2} component="form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <TextField
              label="Nome"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              variant="outlined"
              size="small"
            />
            <Typography variant="body1">{user.email}</Typography>
            <Box>
              <Button startIcon={<SaveIcon />} variant="contained" type="submit" sx={{ mr: 1 }}>
                Salvar
              </Button>
              <Button startIcon={<CancelIcon />} variant="outlined" onClick={handleCancel}>
                Cancelar
              </Button>
            </Box>
          </Stack>
        ) : (
          <Stack alignItems="center" spacing={1}>
            <Typography variant="h4">{user.displayName}</Typography>
            <Typography variant="body1">{user.email}</Typography>
            <Button startIcon={<EditIcon />} variant="outlined" sx={{ mt: 1 }} onClick={handleEdit}>
              Editar Perfil
            </Button>
          </Stack>
        )}
        <Button variant="contained" color="error" onClick={handleLogout} sx={{ mt: 2 }}>
          Sair (Logout)
        </Button>
      </Stack>

      {/* Your favorite pets section can remain here */}
      {(!user.favorites) ? (
          <Container sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <Typography variant="h5" sx={{ textAlign: 'center', mt: 5 }}>
                Nenhum pet favorito. Adicione clicando no ícone <FavoriteBorderIcon />
              </Typography>
            {/* <CircularProgress /> */}
          </Container>
        ) : (
          <Container sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <Typography variant="h4" sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
              Pets Favoritos
            </Typography>
            {/* Exibe a lista de pets ou uma mensagem se não houver nenhum */}
            {user.favorites.length > 0 ? (
              <Grid container spacing={4} justifyContent="center">
                {user.favorites.map(pet => (
                  <></>
                ))}
              </Grid>
            ) : (
              <Typography variant="h5" sx={{ textAlign: 'center', mt: 5 }}>
                Nenhum pet favorito. Adicione clicando no ícone <FavoriteBorderIcon />
              </Typography>
            )}
          </Container>
        )
      }

    </Container>
  );
}