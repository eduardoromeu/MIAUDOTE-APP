import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, CircularProgress, Button } from '@mui/material';
import PetCard from '../components/PetCard/PetCard';
import SuccessStories from "../pages/SuccessStories";
import { useOutletContext } from 'react-router';
// import { useNavigate } from 'react-router-dom'; // 1. REMOVIDO

// Importe as funções necessárias do Firebase
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  where, 
  doc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove 
} from "firebase/firestore";
import { db } from '../firebase';

function Home() {
  const { user } = useOutletContext();
  // const navigate = useNavigate(); // 2. REMOVIDO

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFavorites, setUserFavorites] = useState([]);

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
      // 3. SUBSTITUÍDO: Redireciona usando a API padrão do navegador
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
    <Container sx={{ minHeight: "120vh" }}>
      {pets.length > 0 ? (
        <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
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
          
          <Button 
            variant='contained' size='large' sx={{ mt: "1em", flex: 0, alignSelf: "center" }}
            component="a" href="/search-pets"
          >
            Ver mais pets
          </Button>

          <Container sx={{ mt: '5em', mx: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h4" component="h1" align='center' gutterBottom>
              Deseja cadastrar um pet para adoção?
            </Typography>
            <Button variant='contained' size='large' component="a" href="/register-pet">
              Cadastrar novo pet
            </Button>
          </Container>
        </Container>
      ) : (
        <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4" component="h1" align='center' gutterBottom>
            Nenhum pet cadastrado no momento. Seja o primeiro a adicionar um!
          </Typography>
          <Button variant='contained' size='large' component="a" href="/register-pet">
            Cadastrar novo pet
          </Button>
        </Container>
      )}

      <Container sx={{ mt: 'em', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <SuccessStories cardsLimit={3} showMoreButton={true} />
      </Container>
    </Container>
  );
}

export default Home;