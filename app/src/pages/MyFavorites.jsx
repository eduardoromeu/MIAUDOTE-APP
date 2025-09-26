import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Grid } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PetCard from '../components/PetCard/PetCard';
import ConfirmationDialog from '../components/ConfirmationDialog/ConfirmationDialog';
import { useOutletContext } from 'react-router';
import { db } from '../firebase'; // Usando o firebase do cliente, como no resto do app
import { doc, getDoc, query, documentId, where, collection, getDocs, updateDoc, arrayRemove } from "firebase/firestore";

export default function MyFavorites() {
  const { user } = useOutletContext();
  const [favorites, setFavorites] = useState(null); // Inicia como null para indicar loading
  const [dialogOpen, setDialogOpen] = useState(false);
  const [petToRemove, setPetToRemove] = useState(null);

  // Lógica de busca de dados de volta para o useEffect
  useEffect(() => {
    // Se não há usuário, não faz nada (ou define favoritos como array vazio)
    if (!user) {
      setFavorites([]);
      return;
    }

    const fetchFavorites = async () => {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists() && userDocSnap.data().favorites?.length > 0) {
        const favoritesIds = userDocSnap.data().favorites.map(id => String(id));
        const chunks = [];
        for (let i = 0; i < favoritesIds.length; i += 10) {
          chunks.push(favoritesIds.slice(i, i + 10));
        }
        const queries = chunks.map(chunk => getDocs(query(collection(db, "pets"), where(documentId(), "in", chunk))));
        const snapshots = await Promise.all(queries);
        const favPets = snapshots.flatMap(snap => snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setFavorites(favPets);
      } else {
        setFavorites([]); // Define como array vazio se não houver favoritos
      }
    };

    fetchFavorites();
  }, [user]); // Roda sempre que o objeto 'user' mudar

  const handleOpenConfirmDialog = (petId) => { setPetToRemove(petId); setDialogOpen(true); };
  const handleCloseDialog = () => { setPetToRemove(null); setDialogOpen(false); };
  const handleConfirmRemove = async () => { if (!petToRemove) return; try { const userDocRef = doc(db, "users", user.uid); await updateDoc(userDocRef, { favorites: arrayRemove(petToRemove) }); setFavorites(prev => prev.filter(pet => pet.id !== petToRemove)); } catch (error) { console.error("Erro ao remover favorito: ", error); } finally { handleCloseDialog(); } };

  // Tela de carregamento enquanto 'favorites' for null
  if (favorites === null) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  return (
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
      ) : (
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mt: 5 }}>
          Você ainda não favoritou nenhum pet. <br /> Clique no ícone <FavoriteBorderIcon sx={{ verticalAlign: 'middle' }} /> nos cards para adicionar.
        </Typography>
      )}
      <ConfirmationDialog open={dialogOpen} onClose={handleCloseDialog} onConfirm={handleConfirmRemove} title="Confirmar Remoção" message={`Tem certeza que deseja remover este pet dos seus favoritos?`} />
    </Container>
  );
}