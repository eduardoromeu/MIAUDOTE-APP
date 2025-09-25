import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActions, Box } from '@mui/material'; // Importe o Box
import PetHouseIcon from '../../../images/dog-house.png';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function PetCard({ petData, showOwner = false }) {

  if (!petData) {
    return null;
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* MUDANÇA PRINCIPAL AQUI */}
      {/* 1. Criamos um container (Box) que vai ser a nossa "moldura" quadrada. */}
      <Box sx={{
        position: 'relative',
        width: '100%',
        paddingTop: '100%' // Isso cria um quadrado perfeito (altura = 100% da largura)
      }}>
        {/* 2. A imagem (CardMedia) é posicionada para preencher essa moldura. */}
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
            objectFit: 'cover', // A imagem cobre a moldura sem distorcer
            backgroundColor: '#b3e5fc',
          }}
          onError={(ev) => {
            ev.target.src = PetHouseIcon;
          }}
        />
      </Box>

      {/* O resto do card permanece igual */}
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

      <CardActions>
        <Button component="a" href={`/pet/${petData.id}`} size="small">
          Ver Mais
        </Button>
      </CardActions>
    </Card>
  );
}