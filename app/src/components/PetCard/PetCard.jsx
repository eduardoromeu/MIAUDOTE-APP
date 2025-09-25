import React, { useState } from 'react'; // Importe o useState
import { Card, CardContent, CardMedia, Typography, Button, CardActions, Box, IconButton } from '@mui/material'; // Importe IconButton
import PetHouseIcon from '../../../images/dog-house.png';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // Ícone de coração vazio
import FavoriteIcon from '@mui/icons-material/Favorite'; // Ícone de coração preenchido

export default function PetCard({ petData, showOwner = false }) {
  // 1. Adicionamos um estado para controlar se o pet foi "curtido" ou não
  const [isLiked, setIsLiked] = useState(false);

  if (!petData) {
    return null;
  }

  // 2. Função para alternar o estado de "curtido"
  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    // Em um aplicativo real, você faria uma chamada à API aqui para salvar o like.
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <Box sx={{
        position: 'relative',
        width: '100%',
        paddingTop: '100%' 
      }}>
        <CardMedia
          component="img"
          image={petData.imageUrl}
          alt={petData.name}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            backgroundColor: '#b3e5fc',
          }}
          onError={(ev) => {
            ev.target.src = PetHouseIcon;
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {petData.name}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '3',
            WebkitBoxOrient: 'vertical',
          }}
        >
          {petData.description || 'Nenhuma descrição disponível.'}
        </Typography>

        {showOwner && (
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: '1em' }}>
            <AccountCircleIcon sx={{ mr: ".25em" }} /> {petData.ownerName}
          </Typography> 
        )}
      </CardContent>

      {/* MUDANÇA NAS AÇÕES DO CARD */}
      <CardActions sx={{ justifyContent: 'space-between' }}> {/* Alinha os itens nas pontas */}
        <Button component="a" href={`/pet/${petData.id}`} size="small">
          Ver Mais
        </Button>

        {/* 3. Adicionamos o IconButton para o like */}
        <IconButton aria-label="add to favorites" onClick={handleLikeClick}>
          {/* 4. Renderiza o ícone com base no estado 'isLiked' */}
          {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
      </CardActions>
    </Card>
  );
}