import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, CircularProgress, Button, Box } from '@mui/material';
import PetCard from '../components/PetCard/PetCard';
import SuccessStories from "../pages/SuccessStories";
import SideMenu from '../components/SideMenu/SideMenu.jsx'; 
import { useOutletContext } from 'react-router';
import { collection, getDocs, query, orderBy, limit, where, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from '../firebase';

function Home() {
  const { user } = useOutletContext();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFavorites, setUserFavorites] = useState([]);

  // MUDANÇA AQUI: O estado agora inicia como 'false' (minimizado)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // ... (o restante do seu código continua exatamente igual)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const petsQuery = query(
          collection(db, "pets"),
          where("adopted", "==", false),
          orderBy("createdAt", "desc"),
          limit(3)
        );
        const petsSnapshot = await getDocs(petsQuery);
        const petsList = petsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPets(petsList);

        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserFavorites(userDocSnap.data().favorites || []);
          }
        } else {
          setUserFavorites([]);
        }

      } catch (error) {
        console.error("Erro ao buscar dados: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleToggleFavorite = async (petId) => {
    if (!user) {
      window.location.href = '/login'; 
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const isCurrentlyFavorite = userFavorites.includes(petId);
    
    try {
      if (isCurrentlyFavorite) {
        await updateDoc(userDocRef, {
          favorites: arrayRemove(petId)
        });
        setUserFavorites(prevFavorites => prevFavorites.filter(id => id !== petId));
      } else {
        await updateDoc(userDocRef, {
          favorites: arrayUnion(petId)
        });
        setUserFavorites(prevFavorites => [...prevFavorites, petId]);
      }
    } catch (error) {
      console.error("Erro ao atualizar favoritos: ", error);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Grid container spacing={2} sx={{ minHeight: "120vh", mt: 2 }}>
      
      <Grid item xs={12} md={isMenuOpen ? 3 : 1} sx={{ transition: 'all 0.3s ease-in-out' }}>
        <SideMenu isOpen={isMenuOpen} onToggle={handleToggleMenu} />
      </Grid>

      <Grid item xs={12} md={isMenuOpen ? 9 : 11} sx={{ transition: 'all 0.3s ease-in-out' }}>
        {pets.length > 0 ? (
          <>
            <Typography variant="h4" component="h1" align='center' gutterBottom>
              Últimos pets cadastrados
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              {pets.map(pet => (
                <Grid item key={pet.id} xs={12} sm={6} md={4}>
                  <PetCard
                    petData={pet}
                    showOwner={true}
                    isFavorite={userFavorites.includes(pet.id)}
                    onFavoriteToggle={() => handleToggleFavorite(pet.id)}
                  />
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: "1em" }}>
                <Button 
                    variant='contained' 
                    size='large'
                    component="a" 
                    href="/search-pets"
                >
                    Ver mais pets
                </Button>
            </Box>
          </>
        ) : (
          <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h4" component="h1" align='center' gutterBottom>
              Nenhum pet cadastrado no momento.
            </Typography>
          </Container>
        )}

        <Container sx={{ mt: '5em' }}>
          <SuccessStories cardsLimit={3} showMoreButton={true} />
        </Container>
      </Grid>
    </Grid>
  );
}

export default Home;