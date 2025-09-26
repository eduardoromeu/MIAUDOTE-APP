import React, { useState, useEffect } from 'react';
import { Container, Typography, Avatar, Box, TextField, Stack, Button, CircularProgress, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PetCard from '../components/PetCard/PetCard';
import ConfirmationDialog from '../components/ConfirmationDialog/ConfirmationDialog';

import { useOutletContext } from 'react-router';
import { signOut, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, query, documentId, where, collection, getDocs, setDoc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";

export default function Profile() {
  const { user } = useOutletContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user ? user.displayName : '');
  const [favorites, setFavorites] = useState(null);
  const [userDescription, setUserDescription] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [registeredPets, setRegisteredPets] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [petToRemove, setPetToRemove] = useState(null);

  useEffect(() => {
    if (!user) return;

    // Função para buscar favoritos e dados do perfil
    const fetchUserData = async () => {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUserDescription(userData.description || '');
        
        if (userData.favorites && userData.favorites.length > 0) {
          // CORREÇÃO: Restaurada a lógica robusta de busca
          // 1. Garante que todos os IDs são strings
          const favoritesIds = userData.favorites.map(id => String(id));

          // 2. Divide a busca em pedaços de 10 para evitar limites do Firestore
          const chunks = [];
          for (let i = 0; i < favoritesIds.length; i += 10) {
            chunks.push(favoritesIds.slice(i, i + 10));
          }

          // 3. Executa uma query para cada pedaço e junta os resultados
          const queries = chunks.map(chunk => 
            getDocs(query(collection(db, "pets"), where(documentId(), "in", chunk)))
          );
          
          const snapshots = await Promise.all(queries);
          const favPets = snapshots.flatMap(snap => 
            snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          );

          setFavorites(favPets);
        } else {
          setFavorites([]);
        }
      } else {
        setFavorites([]);
        setUserDescription('');
      }
    };

    const fetchRegisteredPets = async () => {
      const q = query(collection(db, "pets"), where("ownerId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const userPets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRegisteredPets(userPets);
    };

    fetchUserData();
    fetchRegisteredPets();
  }, [user]);
  
  // O restante do arquivo continua exatamente o mesmo...
  const handleEdit = () => { setEditedName(user.displayName || ''); setEditedDescription(userDescription); setIsEditing(true); };
  const handleCancel = () => { setIsEditing(false); };
  const handleSave = async () => { if (!editedName.trim()) return; try { const userDocRef = doc(db, "users", user.uid); await Promise.all([ updateProfile(auth.currentUser, { displayName: editedName, }), setDoc(userDocRef, { description: editedDescription }, { merge: true }) ]); setUserDescription(editedDescription); setIsEditing(false); } catch (error) { console.error("Erro ao atualizar o perfil: ", error); } };
  const handleLogout = async () => { try { await signOut(auth); window.location.href = '/'; } catch (error) { console.error("Error signing out: ", error); } };
  const handleOpenConfirmDialog = (petId) => { setPetToRemove(petId); setDialogOpen(true); };
  const handleCloseDialog = () => { setPetToRemove(null); setDialogOpen(false); };
  const handleConfirmRemove = async () => { if (!petToRemove) return; try { const userDocRef = doc(db, "users", user.uid); await updateDoc(userDocRef, { favorites: arrayRemove(petToRemove) }); setFavorites(prevFavorites => prevFavorites.filter(pet => pet.id !== petToRemove)); } catch (error) { console.error("Erro ao remover favorito: ", error); } finally { handleCloseDialog(); } };

  const handleToggleFavorite = async (petId) => {
    const userDocRef = doc(db, "users", user.uid);
    const isCurrentlyFavorite = favorites.some(pet => pet.id === petId);
    try {
      if (isCurrentlyFavorite) {
        await updateDoc(userDocRef, { favorites: arrayRemove(petId) });
        setFavorites(prev => prev.filter(pet => pet.id !== petId));
      } else {
        await updateDoc(userDocRef, { favorites: arrayUnion(petId) });
        const petDoc = await getDoc(doc(db, "pets", petId));
        if(petDoc.exists()) {
          setFavorites(prev => [...prev, { id: petDoc.id, ...petDoc.data() }]);
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar favoritos: ", error);
    }
  };

  if (!user || favorites === null || registeredPets === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Stack direction="column" alignItems="center" spacing={2} sx={{ my: 4, width: 'fit-content', mx: 'auto' }}>
        <Avatar sx={{ width: 100, height: 100, p: 1.5, bgcolor: 'primary.main', fontSize: '3rem' }}>{user.displayName ? user.displayName.charAt(0).toUpperCase() : ''}</Avatar>
        {isEditing ? (
          <Stack spacing={2} component="form" onSubmit={(e) => { e.preventDefault(); handleSave(); }} alignItems="center" sx={{width: '100%', maxWidth: '400px'}}>
            <TextField label="Nome" value={editedName} onChange={(e) => setEditedName(e.target.value)} variant="outlined" size="small" fullWidth />
            <TextField label="Descrição" value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} variant="outlined" size="small" multiline rows={3} fullWidth placeholder="Fale um pouco sobre você..."/>
            <Typography variant="body1" color="text.secondary">{user.email}</Typography>
            <Box>
              <Button startIcon={<SaveIcon />} variant="contained" type="submit" sx={{ mr: 1 }}> Salvar </Button>
              <Button startIcon={<CancelIcon />} variant="outlined" onClick={handleCancel}> Cancelar </Button>
            </Box>
          </Stack>
        ) : (
          <Stack alignItems="center" spacing={1}>
            <Typography variant="h4">{user.displayName}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
              {userDescription || 'Adicione uma descrição para o seu perfil.'}
            </Typography>
            <Typography variant="body2">{user.email}</Typography>
            <Button startIcon={<EditIcon />} variant="outlined" sx={{ mt: 1 }} onClick={handleEdit}> Editar Perfil </Button>
          </Stack>
        )}
        <Button variant="contained" color="error" onClick={handleLogout} sx={{ mt: 2 }}> Sair (Logout) </Button>
      </Stack>
      <hr />

      <Container sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}> Pets Favoritos </Typography>
        {favorites.length > 0 ? (
          <Grid container spacing={4} justifyContent="center">
            {favorites.map(pet => (
              <Grid item key={pet.id} xs={12} sm={6} md={4}>
                <PetCard petData={pet} isFavorite={true} onFavoriteToggle={() => handleOpenConfirmDialog(pet.id)} />
              </Grid>
            ))}
          </Grid>
        ) : ( <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mt: 5 }}> Você ainda não favoritou nenhum pet. <br /> Clique no ícone <FavoriteBorderIcon sx={{ verticalAlign: 'middle' }} /> nos cards para adicionar. </Typography>)}
      </Container>
      <hr />

      <Container sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
          Meus Pets Cadastrados para Adoção
        </Typography>
        {registeredPets.length > 0 ? (
          <Grid container spacing={4} justifyContent="center">
            {registeredPets.map(pet => (
              <Grid item key={pet.id} xs={12} sm={6} md={4}>
                <PetCard 
                  petData={pet} 
                  isFavorite={favorites.some(favPet => favPet.id === pet.id)}
                  onFavoriteToggle={() => handleToggleFavorite(pet.id)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mt: 5 }}>
            Você ainda não cadastrou nenhum pet para adoção.
          </Typography>
        )}
      </Container>

      <ConfirmationDialog open={dialogOpen} onClose={handleCloseDialog} onConfirm={handleConfirmRemove} title="Confirmar Remoção" message={`Tem certeza que deseja remover este pet dos seus favoritos?`} />
    </Container>
  );
}