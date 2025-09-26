import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function TermosDeUso() {
  const platformName = "Miaudote";

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Termos de Uso do {platformName}
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
          Última atualização: 26/Setembro/2025
        </Typography>
        
        {/* --- Seção 1: Aceitação --- */}
        <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 1 }}>
          1. Aceitação dos Termos
        </Typography>
        <Typography variant="body1" paragraph>
          Ao acessar e utilizar a plataforma Miaudote, você concorda integralmente com estes Termos de Uso e com a nossa Política de Privacidade. Se você não concorda com qualquer disposição, você não deve utilizar a plataforma.
        </Typography>

        {/* --- Seção 2: Natureza do Serviço e Limitação de Responsabilidade (A Essência) --- */}
        <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 1 }}>
          2. Natureza e Responsabilidade da Plataforma
        </Typography>
        <Typography variant="body1" paragraph>
          O Miaudote é uma plataforma que atua exclusivamente como um canal de conexão digital entre Protetores, ONGs, e Pessoas Interessadas em Adotar (Adotantes).
        </Typography>
        
        <Typography variant="body1" sx={{ fontWeight: 'bold' }} paragraph>
          O {platformName} NÃO é responsável por:
        </Typography>
        
        <Box component="ul" sx={{ ml: 3, mt: -2 }}>
            <Typography component="li" variant="body1" paragraph>
                A veracidade ou precisão das informações fornecidas por usuários (sejam protetores ou adotantes).
            </Typography>
            <Typography component="li" variant="body1" paragraph>
                A saúde, temperamento ou histórico médico de qualquer animal anunciado.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
                Qualquer dano ou prejuízo resultante da transação de adoção ou da convivência futura com o pet.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
                O cumprimento integral dos termos do contrato de adoção (Termo de Posse Responsável) firmado entre as partes.
            </Typography>
        </Box>
        <Typography variant="body1" paragraph>
            A responsabilidade pela verificação das condições e das informações é exclusiva das partes envolvidas na adoção (Protetor/ONG e Adotante).
        </Typography>


        {/* --- Seção 3: Conduta do Usuário --- */}
        <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 1 }}>
          3. Obrigações e Conduta do Usuário
        </Typography>
        <Typography variant="body1" paragraph>
          Ao utilizar o {platformName}, você se compromete a agir com boa-fé, transparência e responsabilidade. É proibido postar informações falsas, induzir ao erro, ou usar a plataforma para fins comerciais, exceto se você for uma ONG ou Protetor devidamente registrado e aprovado.
        </Typography>

        {/* --- Seção 4: Disposições Finais --- */}
        <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 1 }}>
          4. Foro
        </Typography>
        <Typography variant="body1" paragraph>
          Fica eleito o Foro da Comarca de [Sua Cidade/Estado de Sede], com exclusão de qualquer outro, por mais privilegiado que seja, para dirimir quaisquer dúvidas oriundas do presente Termo de Uso.
        </Typography>
        
        <Typography variant="subtitle2" sx={{ mt: 5, mb: 1 }} align="center">
          O uso contínuo da plataforma {platformName} constitui a aceitação de todas as alterações nestes Termos de Uso.
        </Typography>

      </Box>
    </Container>
  );
}

export default TermosDeUso;