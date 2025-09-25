import React, { Fragment } from 'react';
import { Box, Container, MenuItem, Typography } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

function Notification({ text = undefined, userName, petName, timestamp }) {

  const dataNotif = new Date(timestamp);
  const data = dataNotif.toLocaleDateString("pt-BR"); // "25/09/2025"
  const hora = dataNotif.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }); // "11:37"

  return (
    <Box sx={{ display: 'flex' }}>
      <PetsIcon sx={{ mr: 1 }} />
      <Box>
        <Typography sx={{ textWrap: 'wrap' }}>
          {text ? text : `${userName} te enviou uma proposta de adoção para o pet ${petName}`}
        </Typography>
        <Typography variant='caption' sx={{ textWrap: 'wrap' }}>
          {data} {hora}
        </Typography>
      </Box>
    </Box>
  );
}

export default Notification;