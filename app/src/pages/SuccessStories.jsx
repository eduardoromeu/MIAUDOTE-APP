import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, CircularProgress, Button } from '@mui/material';
import PetCard from '../components/PetCard/PetCard';

// 1. IMPORTS DO FIREBASE PARA LER DADOS
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db } from '../firebase'; // Verifique se o caminho está correto

export default function SuccessStories(props) {
  // 3. ESTADOS PARA GUARDAR OS PETS E CONTROLAR O CARREGAMENTO
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(props.showMoreButton);
  // 4. useEffect PARA BUSCAR OS DADOS QUANDO A PÁGINA CARREGA
  useEffect(() => {
    const fetchPets = async () => {
      try {
        // Cria uma consulta para buscar todos os documentos da coleção 'pets'
        // e ordena pelos mais recentes primeiro.
        const q = query(
          collection(db, "pets"),
          where("adopted", "==", true),
          orderBy("createdAt", "desc"),
          limit(props.cardsLimit)
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
    <Container>
      {/* Exibe a lista de pets ou uma mensagem se não houver nenhum */}
      {pets.length > 0 ? (
        <Container sx={{ mx: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Adoções Concluídas
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {pets.map(pet => (
              <Grid item key={pet.id} xs={12} sm={6} md={4}>
                {/* 6. PASSA OS DADOS DE CADA PET PARA O PetCard */}
                <PetCard petData={pet} showOwner={true} />
              </Grid>
            ))}
          </Grid>
          {props.showMoreButton ? (
            <Button variant='outlined' size='large' sx={{ mt: "1em", alignSelf: 'center' }} component="a" href="/success-stories">
              Ver mais adoções concluídas
            </Button>
          ) : (<></>)}
        </Container>
      ) : (
        <Container sx={{ mx: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mt: 5 }}>
            Nenhuma adoção concluída, seja o primeiro a adotar!
          </Typography>
          <Button
            variant='contained' size='large' sx={{ mt: "1em", flex: 0, alignSelf: "center" }}
            component="a" href="/search-pets"
          >
            Ver pets para adoção
          </Button>
        </Container>
      )}
    </Container>
  );
}


