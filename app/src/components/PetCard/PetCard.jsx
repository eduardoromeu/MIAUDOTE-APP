import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActions } from '@mui/material';
import PetHouseIcon from '../../../images/dog-house.png';

// 1. O componente agora recebe uma única prop: 'petData'
export default function PetCard({ petData }) {
  
  // 2. Verificação para o caso de dados incompletos
  if (!petData) {
    return null; // Não renderiza nada se não houver dados
  }

  return (
    // O Grid item foi removido daqui e deve ficar na página SearchPets,
    // tornando este componente mais reutilizável.
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="140"
        // 3. Usa os campos do objeto petData
        image={petData.imageUrl} 
        alt={petData.name}
        sx={{backgroundColor: '#b3e5fc'}}
        onError={(ev) => {
          ev.target.src = PetHouseIcon;
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {petData.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {/* Mostra os primeiros 100 caracteres da descrição */}
          {petData.description ? `${petData.description.substring(0, 100)}...` : 'Nenhuma descrição disponível.'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          // 4. Usa um link 'a' padrão para máxima compatibilidade
          component="a" 
          href={`/pet/${petData.id}`} 
          size="small"
        >
          Ver Mais
        </Button>
      </CardActions>
    </Card>
  );
}