// Login.jsx
import React from 'react';
import { Box } from "@mui/material";
import LoginForm from '../components/LoginForm/LoginForm';

export default function Login() {
    // A página agora só tem a responsabilidade de exibir o formulário.
    return (
      <Box sx={{
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh' // Garante que o form fique centralizado na tela
      }}>
        <LoginForm />
      </Box>
    );
}