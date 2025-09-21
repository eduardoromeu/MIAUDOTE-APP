//AppBar: Uma barra de navegação fixa no topo da página.
//Drawer: Um menu lateral que abre ao clicar no ícone de menu.
//Box: Um contêiner que contém as rotas principais e respeita o layout responsivo.
"use client";
// Packages
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import { CssBaseline, Box, Container, Typography } from '@mui/material';
// Images
import PawPrint from '../images/White_paw_print.png'
// Pages
import Home from './pages/Home';
import Profile from './pages/Profile';
import RegisterPet from './pages/RegisterPet';
import SearchPets from './pages/SearchPets';
import SuccessStories from './pages/SuccessStories';
import Cadastro from './pages/Cadastro/Cadastro';
import PetDetails from './pages/PetDetails';
//Components
import NavBar from './components/NavBar/NavBar';

import './App.css';

const userModel = {
  logado: false,
  password:"123",
  name: "Thiago Frango",
  phone: "+55 11 99999-9999",
  email: "email@example.com",
  avatar: PawPrint, // Link da imagem do avatar
  favorites: [
    {
      name: "Luna",
      description: "Uma gata branca muito carinhosa.",
      image: "https://example.com/luna.jpg",
    },
    {
      name: "Rex",
      description: "Cachorro labrador enérgico.",
      image: "https://example.com/rex.jpg",
    },
  ]
};

function Miaudote() {

  const LogOut = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      const user = JSON.parse(localStorage.getItem("user"));
      if(user){
        user.logado = false;
        localStorage.setItem("user", JSON.stringify(user));
      }
      window.location.href = "/MIAUDOTE/";
    }
    return (<></>);
  }

  let user = null;
  if (typeof window !== "undefined" && window.localStorage) {
    user = JSON.parse(localStorage.getItem("user"));
  }
  const [isOpenModal, setOpenModal] = useState((user === null || user === undefined) ? true : !user?.logado ?? true);

  return (
    <Router basename='/'>
        <CssBaseline />
        {/* <Header titulo="MIAUDOTE" /> */}
        <NavBar isOpenModal={isOpenModal} setOpenModal={setOpenModal} />

        {/* Rotas */}
        <Box component="main" sx={{ p: 3, mt: 8 }}>
          <Routes>
            <Route path="/MIAUDOTE/" element={<Home isOpenModal={isOpenModal} setOpenModal={setOpenModal} />} />
            <Route path="/MIAUDOTE/pet/:petId" element={<PetDetails />} />
            <Route path="/MIAUDOTE/profile" element={<Profile />} />
            <Route path="/MIAUDOTE/register-pet" element={<RegisterPet />} />
            <Route path="/MIAUDOTE/search-pets" element={<SearchPets />} />
            <Route path="/MIAUDOTE/success-stories" element={<SuccessStories />} />
            <Route path="/MIAUDOTE/cadastro-usuario" element={<Cadastro />} />
            <Route path="/MIAUDOTE/logout" element={<LogOut />} />
            <Route path="*" element={<Home isOpenModal={isOpenModal} setOpenModal={setOpenModal} />} />
            <Route path="/MIAUDOTE/*" element={
              <Container>
                <Typography variant='h2'>404 - Página não encontrada</Typography>
              </Container>
          } />
          </Routes>
        </Box>
      </Router>
  );
}


export default Miaudote;


/*
// https://www.svgrepo.com/collection/pet-hotel/
*/
