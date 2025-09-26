import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {
  Container, Typography, Card, CardMedia, CardContent, Button,
  Box, IconButton, Divider, List, ListItem, ListItemIcon,
  ListItemText, CardActions, CircularProgress, Alert
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PetsIcon from '@mui/icons-material/Pets';
import CakeIcon from '@mui/icons-material/Cake';
import PersonIcon from '@mui/icons-material/Person';
import { useOutletContext } from 'react-router';

// 1. IMPORTS ADICIONAIS DO FIRESTORE
import { 
  doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, 
  addDoc, serverTimestamp, query, where, getDocs 
} from "firebase/firestore";
import { db } from '../firebase';

function PetDetails() {
  const { petId } = useParams();
  const { user } = useOutletContext();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(true);

  // 2. NOVOS ESTADOS PARA CONTROLAR A PROPOSTA
  const [proposalLoading, setProposalLoading] = useState(false);
  const [proposalStatus, setProposalStatus] = useState(null); // 'pending', 'none', etc.

  // useEffect para buscar os dados do pet (sem alterações)
  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true);
      try {
        const petDocRef = doc(db, "pets", petId);
        const petDocSnap = await getDoc(petDocRef);
        if (petDocSnap.exists()) {
          setPet({ id: petDocSnap.id, ...petDocSnap.data() });
        } else {
          console.log("Pet não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do pet:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [petId]);

  // useEffect para verificar status de favorito e proposta
  useEffect(() => {
    const checkStatus = async () => {
      if (!user || !pet) {
        setLoadingFavorite(false);
        return;
      }
      
      // Checa status de favorito
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData.favorites && userData.favorites.includes(pet.id)) {
          setIsFavorited(true);
        }
      }
      setLoadingFavorite(false);

      // 3. NOVA LÓGICA: Checa se já existe uma proposta pendente
      const q = query(
        collection(db, "proposals"),
        where("petId", "==", pet.id),
        where("proposerId", "==", user.uid),
        where("status", "==", "pending")
      );
      const existingProposals = await getDocs(q);
      if (!existingProposals.empty) {
        setProposalStatus('pending'); // Já existe uma proposta pendente
      } else {
        setProposalStatus('none'); // Nenhuma proposta pendente
      }
    };
    checkStatus();
  }, [user, pet]);

  // handleFavorite (sem alterações)
  const handleFavorite = async () => {
    if (!user) {
        alert("Você precisa estar logado para favoritar um pet!");
        window.location.href = '/login';
        return;
    }
    const userDocRef = doc(db, "users", user.uid);
    if (isFavorited) {
        await updateDoc(userDocRef, { favorites: arrayRemove(pet.id) });
        setIsFavorited(false);
    } else {
        await updateDoc(userDocRef, { favorites: arrayUnion(pet.id) });
        setIsFavorited(true);
    }
  };

  // 4. NOVA FUNÇÃO: Para criar a proposta de adoção
  const handleProposeAdoption = async () => {
    // Verificações de segurança
    if (!user) {
      alert("Você precisa estar logado para propor uma adoção.");
      window.location.href = '/login';
      return;
    }
    if (user.uid === pet.ownerId) {
      alert("Você não pode adotar seu próprio pet.");
      return;
    }
    if (proposalStatus === 'pending') {
      alert("Você já enviou uma proposta para este pet.");
      return;
    }

    setProposalLoading(true);
    try {
      await addDoc(collection(db, "proposals"), {
        petId: pet.id,
        petName: pet.name,
        ownerId: pet.ownerId,
        proposerId: user.uid,
        proposerName: user.displayName,
        proposerEmail: user.email,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setProposalStatus('pending'); // Atualiza o status na tela
      alert("Proposta de adoção enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar proposta: ", error);
      alert("Ocorreu um erro ao enviar sua proposta.");
    }
    setProposalLoading(false);
  };

  // ... (Telas de loading e pet não encontrado - sem alterações)
  if (loading) {
    return <Container sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Container>;
  }
  if (!pet) {
    return <Container><Typography variant="h4" color="error">Pet não encontrado!</Typography></Container>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card>
        <CardMedia component="img" height="400" image={pet.imageUrl} alt={pet.name} />
        <CardContent>
          {/* ... (Conteúdo do card - sem alterações) ... */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography gutterBottom variant="h3" component="div">{pet.name}</Typography>
            <IconButton onClick={handleFavorite} color="error" disabled={loadingFavorite}>
              {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
          <Typography variant="body1" color="text.secondary" paragraph>{pet.description}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" component="h2" gutterBottom>Sobre o Pet</Typography>
          <List>
            <ListItem><ListItemIcon><CakeIcon /></ListItemIcon><ListItemText primary="Idade" secondary={pet.age} /></ListItem>
            <ListItem><ListItemIcon><PetsIcon /></ListItemIcon><ListItemText primary="Raça" secondary={pet.breed} /></ListItem>
            <ListItem><ListItemIcon><PersonIcon /></ListItemIcon><ListItemText primary="Tutor(a)" secondary={pet.ownerName} /></ListItem>
          </List>
        </CardContent>
        
        {/* 5. ATUALIZAÇÃO: Lógica do botão de adoção */}
        {user && !pet.adopted && user.uid !== pet.ownerId && (
          <CardActions sx={{ p: 2, justifyContent: 'center' }}>
            {proposalStatus === 'pending' ? (
              <Button variant="contained" disabled>
                Proposta Enviada
              </Button>
            ) : (
              <Button variant="contained" color="success" size="large" onClick={handleProposeAdoption} disabled={proposalLoading}>
                {proposalLoading ? <CircularProgress size={24} color="inherit" /> : 'Quero Adotar!'}
              </Button>
            )}
          </CardActions>
        )}
        {pet.adopted && (
            <Alert severity="success" sx={{ justifyContent: 'center', m: 2}}>Este pet já encontrou um lar!</Alert>
        )}
      </Card>
    </Container>
  );
}

export default PetDetails;