import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Stack 
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

function AboutUs() {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ my: 4, p: 4, borderRadius: 2 }}>
        <Stack spacing={3} alignItems="center">
          
          {/* Header */}
          <PetsIcon sx={{ fontSize: 60, color: 'primary.main' }} />
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ fontWeight: 'bold' }}
          >
            Sobre o Miaudote
          </Typography>

          {/* Core Mission Text */}
          <Typography variant="h5" component="p" align="center" color="text.secondary" sx={{ mb: 2 }}>
            Conectando corações, transformando vidas.
          </Typography>

          {/* Detailed Narrative */}
          <Box sx={{ textAlign: 'left', width: '100%' }}>
            <Typography variant="body1" paragraph>
              O Miaudote nasceu em 2025 de um sonho simples, mas poderoso: dar um lar cheio de amor a cada pet que precisa. Percebemos que, muitas vezes, o obstáculo entre um animal resgatado e sua família eterna é apenas a falta de uma conexão eficiente. Foi com muito amor, dedicação e tecnologia que desenvolvemos esta plataforma.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Mais do que um site de classificados, o Miaudote é uma comunidade. Somos a ponte digital que liga ONGs, protetores independentes e, o mais importante, futuros tutores com o desejo sincero de adotar. Acreditamos na adoção responsável como o ato de carinho mais profundo.
            </Typography>

            <Typography variant="body1" paragraph>
              Nossa missão é garantir que o processo de adoção seja seguro, transparente e emocionante. Cada perfil de pet é criado para destacar sua personalidade única, facilitando o 'match' perfeito. Junte-se a nós nesta jornada para mudar a vida de um cão ou gato, e descubra como eles podem mudar a sua.
            </Typography>

            <Typography variant="body2" color="text.secondary" align="right" sx={{ mt: 3, fontStyle: 'italic' }}>
              Miaudote: Adotar é um ato de amor.
            </Typography>
          </Box>
          
          {/* Call to Action */}
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            startIcon={<PetsIcon />}
            sx={{ mt: 3 }}
          >
            Encontre seu novo amigo!
          </Button>

        </Stack>
      </Paper>
    </Container>
  );
}

export default AboutUs;