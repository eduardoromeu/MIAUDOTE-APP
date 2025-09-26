import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Grid } from '@mui/material';
import PetCard from '../components/PetCard/PetCard';
import { useOutletContext } from 'react-router';
import { db } from '../firebase'; // Usando o firebase do cliente
import { doc, getDoc, query, where, collection, getDocs, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";

export default function MyPets() {
  const { user } = useOutletContext();
  const [registeredPets, setRegisteredPets] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Lógica de busca de dados de volta para o useEffect
  useEffect(() => {
    if (!user) {
      setRegisteredPets([]);
      return;
    }

    const fetchData = async () => {
      // Busca os pets do usuário
      const petsQuery = query(collection(db, "pets"), where("ownerId", "==", user.uid));
      const petsSnapshot = await getDocs(petsQuery);
      const userPets = petsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRegisteredPets(userPets);

      // Busca a lista de favoritos para saber o status do coração
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setFavorites(userDocSnap.data().favorites || []);
      }
    };

    fetchData();
  }, [user]);
  
  const handleToggleFavorite = async (petId) => {
    const userDocRef = doc(db, "users", user.uid);
    const isCurrentlyFavorite = favorites.includes(petId);
    try {
      if (isCurrentlyFavorite) {
        await updateDoc(userDocRef, { favorites: arrayRemove(petId) });
        setFavorites(prev => prev.filter(id => id !== petId));
      } else {
        await updateDoc(userDocRef, { favorites: arrayUnion(petId) });
        setFavorites(prev => [...prev, petId]);
      }
    } catch (error) {
      console.error("Erro ao atualizar favoritos: ", error);
    }
  };

  // Tela de carregamento
  if (registeredPets === null) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  return (
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
                isFavorite={favorites.includes(pet.id)}
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
  );
}