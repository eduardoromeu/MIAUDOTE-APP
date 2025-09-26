import React, { useState, useEffect } from 'react';
import { Container, Typography, Avatar, Box, TextField, Stack, Button, CircularProgress, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PetCard from '../components/PetCard/PetCard';

import { useOutletContext } from 'react-router';
import { signOut, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, query, documentId, where, collection, getDocs, setDoc } from "firebase/firestore";

export default function Profile() {
  const { user } = useOutletContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user ? user.displayName : '');
  const [favorites, setFavorites] = useState(null); // Iniciar como null para o estado de loading
  const [userDescription, setUserDescription] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();

        // Define a descrição do usuário vinda do Firestore
        setUserDescription(userData.description || '');

        // Lógica para buscar os pets favoritos
        if (userData.favorites && userData.favorites.length > 0) {
          
          // ===================================================================
          // ✨ CORREÇÃO APLICADA AQUI ✨
          // Converte todos os IDs do array para string para evitar o erro do Firebase.
          const favoritesIds = userData.favorites.map(id => String(id));
          // ===================================================================

          const chunks = [];
          // O Firestore só permite buscar até 10 itens por vez com o operador "in"
          for (let i = 0; i < favoritesIds.length; i += 10) {
            chunks.push(favoritesIds.slice(i, i + 10));
          }
          const queries = chunks.map(chunk =>
            getDocs(query(collection(db, "pets"), where(documentId(), "in", chunk)))
          );
          const snapshots = await Promise.all(queries);
          const favPets = snapshots.flatMap(snap =>
            snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          );
          setFavorites(favPets);
        } else {
          setFavorites([]); // Define como array vazio se não houver favoritos
        }
      } else {
        // Caso o documento do usuário ainda não exista no Firestore
        setFavorites([]);
        setUserDescription('');
      }
    };

    fetchUserData();
  }, [user]);

  // Exibe o loading enquanto o usuário ou os favoritos não foram carregados
  if (!user || favorites === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleEdit = () => {
    setEditedName(user.displayName || '');
    setEditedDescription(userDescription);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editedName.trim()) return;
    try {
      const userDocRef = doc(db, "users", user.uid);

      // Executa as duas atualizações em paralelo
      await Promise.all([
        updateProfile(auth.currentUser, {
          displayName: editedName,
        }),
        setDoc(userDocRef, { description: editedDescription }, { merge: true })
      ]);

      // Atualiza o estado local para refletir a mudança instantaneamente
      setUserDescription(editedDescription);
      setIsEditing(false);

    } catch (error) {
      console.error("Erro ao atualizar o perfil: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <Container>
      <Stack direction="column" alignItems="center" spacing={2} sx={{ my: 4, width: 'fit-content', mx: 'auto' }}>
        <Avatar sx={{ width: 100, height: 100, p: 1.5, bgcolor: 'primary.main', fontSize: '3rem' }}>
          {user.displayName ? user.displayName.charAt(0).toUpperCase() : ''}
        </Avatar>

        {isEditing ? (
          // MODO DE EDIÇÃO
          <Stack spacing={2} component="form" onSubmit={(e) => { e.preventDefault(); handleSave(); }} alignItems="center" sx={{width: '100%', maxWidth: '400px'}}>
            <TextField
              label="Nome"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
            />
            <TextField
              label="Descrição"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              variant="outlined"
              size="small"
              multiline
              rows={3}
              fullWidth
              placeholder="Fale um pouco sobre você..."
            />
            <Typography variant="body1" color="text.secondary">{user.email}</Typography>
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
          // MODO DE VISUALIZAÇÃO
          <Stack alignItems="center" spacing={1}>
            <Typography variant="h4">{user.displayName}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
              {userDescription || 'Adicione uma descrição para o seu perfil.'}
            </Typography>
            <Typography variant="body2">{user.email}</Typography>
            <Button startIcon={<EditIcon />} variant="outlined" sx={{ mt: 1 }} onClick={handleEdit}>
              Editar Perfil
            </Button>
          </Stack>
        )}
        <Button variant="contained" color="error" onClick={handleLogout} sx={{ mt: 2 }}>
          Sair (Logout)
        </Button>
      </Stack>

      <hr />

      {/* Seção de Pets Favoritos */}
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
          Pets Favoritos
        </Typography>
        {favorites.length > 0 ? (
          <Grid container spacing={4} justifyContent="center">
            {favorites.map(pet => (
              <Grid item key={pet.id} xs={12} sm={6} md={4}>
                <PetCard petData={pet} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mt: 5 }}>
            Você ainda não favoritou nenhum pet. <br /> Clique no ícone <FavoriteBorderIcon sx={{ verticalAlign: 'middle' }} /> nos cards para adicionar.
          </Typography>
        )}
      </Container>
    </Container>
  );
}