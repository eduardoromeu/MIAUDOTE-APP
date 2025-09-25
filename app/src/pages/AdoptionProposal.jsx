import React from 'react';
import { Box, Container } from "@mui/material";
import { useParams } from 'react-router';

export default function AdoptionProposal() {
  
  const { propIndex } = useParams(); // Gets the pet's ID from the URL

  return (
    <Container>
      {propIndex}
    </Container>
  );
}