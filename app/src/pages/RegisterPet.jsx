// app/src/pages/RegisterPet.jsx

import React, { useState } from 'react';
import { Container, Typography, Stack, TextField, Button, Box, Modal, CircularProgress } from '@mui/material';
import { useOutletContext, useNavigate } from 'react-router';

// Imports do Firebase para adicionar dados
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase'; // Verifique o caminho

const style = { /* ... seu estilo do modal ... */ };

export default function RegisterPet() {
    const { user } = useOutletContext(); // Pega o usuário logado
    const navigate = useNavigate();

    const [petName, setPetName] = useState('');
    const [description, setDescription] = useState('');
    const [age, setAge] = useState('');
    const [breed, setBreed] = useState('');
    // Adicione mais 'useState' para outros campos se precisar (gênero, porte, etc.)

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const handleRegisterPet = async (e) => {
        e.preventDefault();
        setError('');

        if (!petName || !description || !age || !breed) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        setLoading(true);

        try {
            // Cria uma referência para a coleção 'pets'
            const petsCollectionRef = collection(db, "pets");

            // Adiciona um novo documento (um novo pet) à coleção
            await addDoc(petsCollectionRef, {
                name: petName,
                description: description,
                age: age,
                breed: breed,
                ownerId: user.uid, // Associa o pet ao usuário logado
                ownerName: user.displayName,
                createdAt: serverTimestamp(), // Adiciona a data de criação
                // Futuramente, aqui você adicionará a URL da imagem
                imageUrl: 'https://via.placeholder.com/400' 
            });

            console.log("Pet cadastrado com sucesso!");
            setLoading(false);
            setOpenModal(true); // Abre o modal de sucesso

        } catch (err) {
            console.error("Erro ao cadastrar o pet: ", err);
            setError('Ocorreu um erro. Tente novamente.');
            setLoading(false);
        }
    };
    
    const handleCloseModal = () => {
        setOpenModal(false);
        navigate('/search-pets'); // Redireciona para a página de busca após o sucesso
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Cadastrar um Novo Pet
            </Typography>
            <Stack component="form" onSubmit={handleRegisterPet} spacing={2}>
                <TextField label="Nome do Pet" value={petName} onChange={e => setPetName(e.target.value)} required />
                <TextField label="Descrição" value={description} onChange={e => setDescription(e.target.value)} multiline rows={4} required />
                <TextField label="Idade" value={age} onChange={e => setAge(e.target.value)} required />
                <TextField label="Raça" value={breed} onChange={e => setBreed(e.target.value)} required />
                
                {error && <Typography color="error">{error}</Typography>}

                <Button type="submit" variant="contained" size="large" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Cadastrar Pet'}
                </Button>
            </Stack>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={style}>
                    <Typography variant="h6">Sucesso!</Typography>
                    <Typography sx={{ mt: 2 }}>O pet foi cadastrado e já está disponível para adoção.</Typography>
                    <Button onClick={handleCloseModal} sx={{ mt: 2 }}>Ver Pets</Button>
                </Box>
            </Modal>
        </Container>
    );
}