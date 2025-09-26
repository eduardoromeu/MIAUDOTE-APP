import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function PoliticasDePrivacidade() {
  const platformName = "Miaudote";

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Política de Privacidade do {platformName}
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
          Última atualização: 26/Setembro/2025
        </Typography>
        
        {/* --- Seção 1: Coleta de Informações --- */}
        <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 1 }}>
          1. Informações Coletadas
        </Typography>
        <Typography variant="body1" paragraph>
          Coletamos informações essenciais para operacionalizar o processo de adoção responsável. Isso inclui:
        </Typography>

        <Box component="ul" sx={{ ml: 3, mt: -2 }}>
            <Typography component="li" variant="body1" paragraph>
                Dados de Cadastro: Nome completo, endereço de e-mail e informações de contato.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
                Dados de Perfil/Adoção: Informações demográficas, endereço residencial (necessário para a visita prévia de adoção), e as respostas fornecidas no Questionário de Pré-Adoção (sobre rotina, experiência com pets, tipo de moradia).
            </Typography>
            <Typography component="li" variant="body1" paragraph>
                Dados Técnicos: Endereço IP, dados de localização e informações de dispositivo para aprimoramento e segurança da plataforma.
            </Typography>
        </Box>

        {/* --- Seção 2: Finalidade e Compartilhamento de Informações --- */}
        <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 1 }}>
          2. Uso e Compartilhamento de Informações (O Core da Adoção)
        </Typography>
        <Typography variant="body1" paragraph>
          As informações que coletamos têm como objetivo principal facilitar a adoção responsável e garantir o bem-estar do pet.
        </Typography>

        <Typography variant="body1" sx={{ fontWeight: 'bold' }} paragraph>
          Compartilhamento para Adoção:
        </Typography>
        <Typography variant="body1" paragraph>
          Ao manifestar interesse em um pet, você concorda que seus dados de contato e as respostas do Questionário de Pré-Adoção serão compartilhados diretamente com a ONG, o Protetor ou o responsável pelo animal. Este compartilhamento é necessário para que eles possam conduzir a entrevista, a visita e finalizar o processo de adoção.
        </Typography>
        <Typography variant="body1" paragraph>
          Utilizamos também suas informações para: fornecer e manter o serviço; personalizar a experiência do usuário (sugerindo pets compatíveis); e comunicar sobre atualizações da plataforma.
        </Typography>
        
        {/* --- Seção 3: Segurança dos Dados --- */}
        <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 1 }}>
          3. Segurança e Direitos do Usuário
        </Typography>
        <Typography variant="body1" paragraph>
          Nós nos esforçamos para proteger suas Informações Pessoais com medidas técnicas e administrativas. No entanto, lembre-se que nenhuma transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro.
        </Typography>
        <Typography variant="body1" paragraph>
          Você tem o direito de acessar, corrigir ou solicitar a exclusão de seus dados. Para exercer esses direitos, entre em contato conosco através do nosso canal de suporte. A exclusão de dados pode inviabilizar sua participação em processos de adoção futuros.
        </Typography>
        
      </Box>
    </Container>
  );
}

export default PoliticasDePrivacidade;