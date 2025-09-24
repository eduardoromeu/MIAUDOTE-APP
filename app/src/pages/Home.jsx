import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, CircularProgress, Button } from '@mui/material'; // Usando Grid do core, é mais comum
import PetCard from '../components/PetCard/PetCard';
import SuccessStories from "../pages/SuccessStories";

// 1. IMPORTS DO FIREBASE PARA LER DADOS
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db } from '../firebase'; // Verifique se o caminho está correto

function Home() {
  // 3. ESTADOS PARA GUARDAR OS PETS E CONTROLAR O CARREGAMENTO
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // 4. useEffect PARA BUSCAR OS DADOS QUANDO A PÁGINA CARREGA
  useEffect(() => {
    const fetchPets = async () => {
      try {
        // Cria uma consulta para buscar todos os documentos da coleção 'pets'
        // e ordena pelos mais recentes primeiro.
        const q = query(
          collection(db, "pets"),
          where("adopted", "==", false),
          orderBy("createdAt", "desc"),
          limit(3)
        );

        // Executa a consulta
        const querySnapshot = await getDocs(q);

        // Mapeia os resultados, adicionando o ID do documento a cada objeto de pet
        const petsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setPets(petsList);

      } catch (error) {
        console.error("Erro ao buscar pets: ", error);
      } finally {
        // Garante que o 'loading' termine, mesmo se der erro
        setLoading(false);
      }
    };

    fetchPets();
  }, []); // O array vazio [] garante que esta função rode apenas uma vez.

  // 5. RENDERIZAÇÃO CONDICIONAL
  // Exibe um spinner de carregamento enquanto os dados são buscados
  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ minHeight: "120vh" }}>

      {/* Exibe a lista de pets ou uma mensagem se não houver nenhum */}
      {pets.length > 0 ? (
        <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <Typography variant="h4" component="h1" align='center' gutterBottom>
            Útilmos pets cadastrados
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {pets.map(pet => (
              <Grid item key={pet.id} xs={12} sm={6} md={4}>
                {/* 6. PASSA OS DADOS DE CADA PET PARA O PetCard */}
                <PetCard petData={pet} key={pet.id} />
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

      {/* TODO Fazer buscar pets com adopted = true na database */}
      <Container sx={{ mt: '5em', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <SuccessStories cardsLimit={3} showMoreButton={true} />
      </Container>
    </Container>
  );
}

export default Home;