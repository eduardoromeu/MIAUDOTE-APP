import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, CircularProgress, Button, Box, Paper } from '@mui/material';
import Carousel from 'react-material-ui-carousel'; // 1. NOVO: Importa o componente Carousel
import PetCard from '../components/PetCard/PetCard';
import SuccessStories from "../pages/SuccessStories";
import { useOutletContext } from 'react-router';
import { collection, getDocs, query, orderBy, limit, where, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from '../firebase';

// URL da imagem no Firebase Storage
const BANNER_IMAGE_URL = 'https://firebasestorage.googleapis.com/v0/b/miaudote-a9379.firebasestorage.app/o/Banner%2Fbanner_1.png?alt=media&token=437eab38-0a08-4323-a09c-d84fbb681193';

// 2. NOVO: Componente funcional para renderizar o banner
function Banner(props) {
  return (
    // O componente Paper adiciona um fundo e elevação (sombra) ao banner
    <Paper
      sx={{
        height: { xs: 150, sm: 250, md: 350 }, // Altura responsiva
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5', // Cor de fundo suave
        borderRadius: 2,
        overflow: 'hidden',
        mb: 4, // Margem inferior para separar do conteúdo abaixo
      }}
      elevation={4} // Elevação para destacar o banner
      component="a"
      href={props.item.href}
    >
      <Box
        component="img"
        src={props.item.url}
        alt={props.item.alt}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover', // Garante que a imagem cubra todo o Box
          borderRadius: 2,
        }}
      />
    </Paper>
  )
}

function Home() {
  // ... (Seus estados e hooks)
  const { user } = useOutletContext();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFavorites, setUserFavorites] = useState([]);

  // 3. NOVO: Array de itens para o Carousel (pode adicionar mais banners aqui)
  const bannerItems = [
    {
      url: BANNER_IMAGE_URL,
      alt: "Banner de Adoção de Pets",
      href: "/search-pets"
      // Se houver um link de destino, adicione aqui
      // link: "/adotar" 
    },
    // Adicione mais banners se houver mais imagens no futuro
    // {
    //     url: 'OUTRA_URL',
    //     alt: "Outro Banner",
    // },
  ];


  // ... (Seus useEffects e funções)
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
    <Container sx={{ minHeight: "120vh", py: 4 }}>

      {/* 4. NOVO: Seção do Carousel/Banner */}
      <Carousel
        animation="slide" // Tipo de animação: "slide" ou "fade"
        navButtonsAlwaysVisible={true} // Mostrar botões de navegação
        indicatorContainerProps={{
          style: {
            marginTop: '10px', // Espaçamento entre o banner e os indicadores
          }
        }}
      >
        {
          bannerItems.map((item, i) => <Banner key={i} item={item} />)
        }
      </Carousel>

      {/* --- Separador Visual (opcional) --- */}
      <Box sx={{ mt: 5 }} />

      {/* Conteúdo de 'Últimos pets cadastrados' (existente) */}
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

      {/* Seção SuccessStories (existente) */}
      <Container sx={{ mt: '5em' }}>
        <SuccessStories cardsLimit={3} showMoreButton={true} />
      </Container>
    </Container>
  );
}

export default Home;