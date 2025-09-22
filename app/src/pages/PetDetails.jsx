import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {
    Container, Typography, Card, CardMedia, CardContent, Button,
    Box, IconButton, Divider, List, ListItem, ListItemIcon,
    ListItemText, CardActions
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PetsIcon from '@mui/icons-material/Pets';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import StraightenIcon from '@mui/icons-material/Straighten';

import { useOutletContext } from 'react-router';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
// AQUI ESTÁ A CORREÇÃO:
import { db, auth } from '../firebase'; 

import Rufus from '../../images/rufus.avif';

const pets = [
    { id: 1, name: 'Fofinho', /* ... */ image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKy5Zq3nDNcIKQEtTvd1iJTSzxQk4UO53QrA&s', age: '2 anos', gender: 'Macho', size: 'Médio', breed: 'SRD (Sem Raça Definida)'},
    { id: 2, name: 'Rex', /* ... */ image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTekrqEm8Pps8NR1x2kRA2N2WTL23Q9R9nVbw&s', age: '1 ano e 6 meses', gender: 'Macho', size: 'Grande', breed: 'Labrador Retriever'},
    { id: 3, name: 'Rufus', /* ... */ image: Rufus, age: '3 anos', gender: 'Macho', size: 'Médio', breed: 'Golden Retriever'}
];

function PetDetails() {
  const { petId } = useParams();
  // O useNavigate não é usado aqui, então foi removido para evitar confusão
  const pet = pets.find(p => p.id == petId);
  const { user } = useOutletContext();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(true);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user) {
        setLoadingFavorite(false);
        return;
      }
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData.favorites && userData.favorites.includes(Number(petId))) {
          setIsFavorited(true);
        }
      }
      setLoadingFavorite(false);
    };
    checkFavoriteStatus();
  }, [user, petId]);

  const handleFavorite = async () => {
    if (!user) {
      alert("Você precisa estar logado para favoritar um pet!");
      window.location.href = '/login'; // Redireciona para o login
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    if (isFavorited) {
      await updateDoc(userDocRef, { favorites: arrayRemove(Number(petId)) });
      setIsFavorited(false);
    } else {
      await updateDoc(userDocRef, { favorites: arrayUnion(Number(petId)) });
      setIsFavorited(true);
    }
  };

  const handleAdopt = () => {
    alert(`Pedido de adoção para ${pet.name} enviado! O dono será notificado.`);
  };

  if (!pet) {
    return <Container><Typography variant="h4" color="error">Pet não encontrado!</Typography></Container>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card>
        <CardMedia component="img" height="400" image={pet.image} alt={pet.name} />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography gutterBottom variant="h3" component="div">{pet.name}</Typography>
            <IconButton onClick={handleFavorite} color="error" aria-label="adicionar aos favoritos" disabled={loadingFavorite}>
              {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
          {/* ... O resto do seu JSX permanece igual ... */}
          <Typography variant="body1" color="text.secondary" paragraph>{pet.description}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" component="h2" gutterBottom>Sobre o Pet</Typography>
          <List>
            <ListItem><ListItemIcon><CakeIcon /></ListItemIcon><ListItemText primary="Idade" secondary={pet.age} /></ListItem>
            <ListItem><ListItemIcon><WcIcon /></ListItemIcon><ListItemText primary="Sexo" secondary={pet.gender} /></ListItem>
            <ListItem><ListItemIcon><StraightenIcon /></ListItemIcon><ListItemText primary="Porte" secondary={pet.size} /></ListItem>
            <ListItem><ListItemIcon><PetsIcon /></ListItemIcon><ListItemText primary="Raça" secondary={pet.breed} /></ListItem>
          </List>
        </CardContent>
        <CardActions sx={{ p: 2, justifyContent: 'center' }}>
          <Button onClick={handleAdopt} variant="contained" color="success" size="large">Quero Adotar!</Button>
        </CardActions>
      </Card>
    </Container>
  );
}

export default PetDetails;