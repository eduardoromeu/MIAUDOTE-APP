import React, { useState, useEffect } from 'react';
import { Container, Typography, Avatar, Box, TextField, Stack, Button, CircularProgress, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PetCard from '../components/PetCard/PetCard';

// 1. Import from 'react-router' WHICH YOUR PROJECT ALREADY USES
import { useOutletContext } from 'react-router';
import { signOut, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase'; // Make sure this path is correct
import { doc, getDoc, query, documentId, where, collection, getDocs } from "firebase/firestore";

export default function Profile() {
  // 2. This now correctly gets the user from root.jsx
  const { user } = useOutletContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user ? user.displayName : '');
  const [favorites, setFavorites] = useState({});

  // Get user favorites
  useEffect(() => {
    const checkFavorites = async () => {
      if (!user) return;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();

        if (userData.favorites && userData.favorites.length > 0) {
          const favorites = userData.favorites;
          const chunks = [];

          // divide em grupos de até 10
          for (let i = 0; i < favorites.length; i += 10) {
            chunks.push(favorites.slice(i, i + 10));
          }

          // dispara as queries em paralelo
          const queries = chunks.map(chunk =>
            getDocs(
              query(
                collection(db, "pets"),
                where(documentId(), "in", chunk)
              )
            )
          );

          const snapshots = await Promise.all(queries);

          // junta todos os resultados em um único array
          const favPets = snapshots.flatMap(snap =>
            snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          );

          setFavorites(favPets);
          console.log(favPets);
        } else {
          setFavorites([]);
        }
      }
    };

    checkFavorites();
  }, [user, db]);



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
      {(!favorites) ? (
        <Container sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Container>
      ) : (
        <Container sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          {/* Exibe a lista de pets ou uma mensagem se não houver nenhum */}
          {favorites.length > 0 ? (
            <Container>
              <Typography variant="h4" sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
                Pets Favoritos
              </Typography>
              <Grid container spacing={4} justifyContent="center">
                {favorites.map(pet => (
                  <PetCard petData={pet} key={pet.id} />
                ))}
              </Grid>
            </Container>
          ) : (
            <Typography variant="h5" sx={{ textAlign: 'center', mt: 5 }}>
              Nenhum pet favorito. <br /> Adicione clicando no ícone <FavoriteBorderIcon />
            </Typography>
          )}
        </Container>
      )
      }

    </Container>
  );
}