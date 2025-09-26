import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';

// Array com os links do rodapé
const footerLinks = [
  { name: 'Sobre Nós', href: '/sobre' },
  { name: 'Dúvidas', href: '/faq' },
  { name: 'Termos de Uso', href: '/termos' },
  { name: 'Políticas de Privacidade', href: '/privacidade' },
];

function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'primary.main', // Cor de fundo primária do seu tema MUI
        color: 'white',          // Cor do texto
        py: 3,                   // Padding vertical (top e bottom)
        mt: 'auto',              // Garante que o footer fique no final da página (Sticky Footer)
        width: '100%',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          
          {/* Links do Rodapé */}
          <Grid item xs={12} sm="auto">
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, // Coluna no mobile, Linha no desktop
                gap: { xs: 1, sm: 3 },                     // Espaçamento entre os links
                alignItems: 'center',                      // Centraliza os itens no eixo cruzado
                justifyContent: 'center',                  // Centraliza os itens no eixo principal
              }}
            >
              {footerLinks.map((link) => (
                <Link 
                  color="inherit" 
                  href={link.href} 
                  underline="hover" 
                  key={link.name}
                  sx={{ 
                    // Estilos adicionais para os links
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    textAlign: 'center', // Garante que o texto do link esteja centralizado
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Linha Divisória (opcional) */}
          <Grid item xs={12}>
            <Box sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)', my: 2 }} />
          </Grid>
          
          {/* Direitos Autorais */}
          <Grid item xs={12}>
            <Typography 
              variant="body2" 
              color="inherit" 
              align="center"
              sx={{ opacity: 0.8 }}
            >
              &copy; {new Date().getFullYear()} Miaudote. Todos os direitos reservados.
            </Typography>
          </Grid>
          
        </Grid>
      </Container>
    </Box>
  );
}

export default Footer;