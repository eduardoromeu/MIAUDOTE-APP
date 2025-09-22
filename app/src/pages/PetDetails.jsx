import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {
    Container, Typography, Card, CardMedia, CardContent, Button,
    Box, IconButton, Divider, List, ListItem, ListItemIcon,
    ListItemText, CardActions, CircularProgress
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PetsIcon from '@mui/icons-material/Pets';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import StraightenIcon from '@mui/icons-material/Straighten';

import { useOutletContext } from 'react-router';
// Import the necessary Firestore functions
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from '../firebase'; // Ensure this path is correct

// The old hardcoded 'pets' array has been completely removed.

function PetDetails() {
    const { petId } = useParams(); // Gets the pet's ID from the URL
    const { user } = useOutletContext();

    // 1. State for pet data, loading status, and favorites
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorited, setIsFavorited] = useState(false);
    const [loadingFavorite, setLoadingFavorite] = useState(true);

    // 2. useEffect to fetch the pet data from Firestore
    useEffect(() => {
        const fetchPet = async () => {
            try {
                // Create a reference to the specific pet document in the 'pets' collection
                const petDocRef = doc(db, "pets", petId);
                const petDocSnap = await getDoc(petDocRef);

                if (petDocSnap.exists()) {
                    // If the pet is found, save its data to the state
                    setPet({ id: petDocSnap.id, ...petDocSnap.data() });
                } else {
                    // If no document is found, pet remains null
                    console.log("No such pet found in the database!");
                }
            } catch (error) {
                console.error("Error fetching pet details:", error);
            } finally {
                setLoading(false); // Stop the main loading indicator
            }
        };

        fetchPet();
    }, [petId]); // This effect runs whenever the petId in the URL changes

    // useEffect for checking favorite status (almost the same, but with a fix)
    useEffect(() => {
        const checkFavoriteStatus = async () => {
          if (!user || !pet) { // Also wait until pet data is loaded
            setLoadingFavorite(false);
            return;
          }
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            // FIX: Firestore IDs are strings, so we don't need Number()
            if (userData.favorites && userData.favorites.includes(pet.id)) {
              setIsFavorited(true);
            }
          }
          setLoadingFavorite(false);
        };
        checkFavoriteStatus();
    }, [user, pet]); // Now depends on 'user' and 'pet' objects

    const handleFavorite = async () => {
        if (!user) {
            alert("Você precisa estar logado para favoritar um pet!");
            window.location.href = '/login';
            return;
        }
        const userDocRef = doc(db, "users", user.uid);
        if (isFavorited) {
            // FIX: Use the pet's string ID
            await updateDoc(userDocRef, { favorites: arrayRemove(pet.id) });
            setIsFavorited(false);
        } else {
            // FIX: Use the pet's string ID
            await updateDoc(userDocRef, { favorites: arrayUnion(pet.id) });
            setIsFavorited(true);
        }
    };
    
    // Display a loading spinner while fetching data
    if (loading) {
        return <Container sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Container>;
    }
    
    // Display the "not found" message if the pet object is still null after loading
    if (!pet) {
        return <Container><Typography variant="h4" color="error">Pet não encontrado!</Typography></Container>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Card>
                <CardMedia component="img" height="400" image={pet.imageUrl} alt={pet.name} />
                <CardContent>
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
                        {/* You can add more fields from your database here */}
                        <ListItem><ListItemIcon><PetsIcon /></ListItemIcon><ListItemText primary="Raça" secondary={pet.breed} /></ListItem>
                    </List>
                </CardContent>
                <CardActions sx={{ p: 2, justifyContent: 'center' }}>
                    <Button variant="contained" color="success" size="large">Quero Adotar!</Button>
                </CardActions>
            </Card>
        </Container>
    );
}

export default PetDetails;