import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActions, Box, IconButton } from '@mui/material';
import PetHouseIcon from '../../../images/dog-house.png';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

/**
 * PetCard agora é um componente controlado.
 * @param {object} petData - Os dados do pet.
 * @param {boolean} showOwner - Se deve ou não mostrar o dono.
 * @param {boolean} isFavorite - Controla se o ícone de coração está preenchido.
 * @param {function} onFavoriteToggle - Função a ser executada ao clicar no ícone de coração.
 */
export default function PetCard({ petData, showOwner = false, isFavorite, onFavoriteToggle }) {

  if (!petData) {
    return null;
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative', width: '100%', paddingTop: '0%', height: '150px' }}>
        <CardMedia
          component="img"
          image={petData.imageUrl}
          alt={petData.name}
          sx={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            objectFit: 'cover', backgroundColor: '#b3e5fc', maxHeight: '150px'
          }}
          onError={(ev) => { ev.target.src = PetHouseIcon; }}
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
            overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
            WebkitLineClamp: '3', WebkitBoxOrient: 'vertical',
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

      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button component="a" href={`/pet/${petData.id}`} size="small">
          Ver Mais
        </Button>
        
        {/* O IconButton agora usa as props recebidas do componente pai */}
        <IconButton aria-label="toggle favorite" onClick={onFavoriteToggle}>
          {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
      </CardActions>
    </Card>
  );
}