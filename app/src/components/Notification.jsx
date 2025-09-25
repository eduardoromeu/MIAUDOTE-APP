import React, { Fragment } from 'react';
import { Box, Container, MenuItem, Typography } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

const Notification = ({ text }) => (
  <Box sx={{display: 'flex'}}>
    <PetsIcon sx={{ mr: 1 }} />
    <Box>
      <Typography sx={{textWrap: 'wrap'}}>
        {text}
      </Typography>
    </Box>
  </Box>
);

export default Notification;