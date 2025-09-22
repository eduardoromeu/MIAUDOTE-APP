import React, { useState } from 'react';
import { Container, Typography, Stack, TextField, Button, Box, Modal, CircularProgress, Alert } from '@mui/material';
import { useOutletContext } from 'react-router'; // Mantemos este que funciona

// Imports do Firebase (sem alterações)
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from '../firebase';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function RegisterPet() {
    const { user } = useOutletContext();
    // A linha com 'useNavigate' FOI REMOVIDA

    const [petName, setPetName] = useState('');
    const [description, setDescription] = useState('');
    const [age, setAge] = useState('');
    const [breed, setBreed] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageError, setImageError] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                setImageFile(file);
                setImageError('');
            } else {
                setImageFile(null);
                setImageError('Por favor, selecione um arquivo de imagem (jpg, png, etc).');
            }
        }
    };

    const handleRegisterPet = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            setImageError('A foto do pet é obrigatória.');
            return;
        }
        if (!petName || !description || !age || !breed) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const imageRef = ref(storage, `pets/${Date.now()}-${imageFile.name}`);
            const uploadResult = await uploadBytes(imageRef, imageFile);
            const downloadURL = await getDownloadURL(uploadResult.ref);

            await addDoc(collection(db, "pets"), {
                name: petName,
                description: description,
                age: age,
                breed: breed,
                ownerId: user.uid,
                ownerName: user.displayName,
                createdAt: serverTimestamp(),
                imageUrl: downloadURL
            });

            setLoading(false);
            setOpenModal(true);

        } catch (err) {
            console.error("Erro ao cadastrar o pet: ", err);
            setError('Ocorreu um erro. Tente novamente.');
            setLoading(false);
        }
    };
    
    const handleCloseModal = () => {
        setOpenModal(false);
        // CORREÇÃO: Usa a navegação padrão do navegador
        window.location.href = '/search-pets';
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Cadastrar um Novo Pet
            </Typography>
            <Stack component="form" onSubmit={handleRegisterPet} spacing={2}>
                <Button variant="outlined" component="label">
                    Selecionar Foto do Pet
                    <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                </Button>
                {imageFile && <Typography variant="body2">Arquivo: {imageFile.name}</Typography>}
                {imageError && <Alert severity="error">{imageError}</Alert>}

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