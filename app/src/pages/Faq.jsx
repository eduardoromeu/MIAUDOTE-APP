import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Dúvidas Frequentes focadas no Processo de Adoção
const faqs = [
  { 
    question: "Qual é o primeiro passo para adotar um pet?", 
    answer: "O primeiro passo é completar seu cadastro e preencher o 'Questionário de Pré-Adoção' em seu perfil. Isso nos ajuda a entender seu estilo de vida e garantir o 'match' perfeito com o pet certo." 
  },
  { 
    question: "A adoção tem algum custo?", 
    answer: "Não. Adoção é um ato de amor e não tem custo. No entanto, algumas ONGs ou protetores podem solicitar uma 'Taxa de Adoção Responsável' (simbólica) para cobrir custos iniciais como vacinas, vermífugos e castração, garantindo que o pet está saudável e apto para ir para casa." 
  },
  { 
    question: "O pet que eu escolher já vem castrado, vacinado e vermifugado?", 
    answer: "Sim, na grande maioria dos casos. O Miaudote incentiva e exige que os pets disponíveis para adoção (com idade adequada) estejam com a castração e a primeira dose de vacinas e vermífugos em dia, conforme a legislação local e a política da ONG/Protetor." 
  },
  { 
    question: "O que acontece após eu manifestar interesse na adoção?", 
    answer: "Após o interesse, seus dados são enviados para o responsável pelo pet (ONG ou Protetor). Eles entrarão em contato para uma entrevista, visita prévia (se necessário) e para dar seguimento ao 'Termo de Adoção' e à entrega do pet." 
  },
  { 
    question: "Sou obrigado(a) a fazer uma visita domiciliar?", 
    answer: "Sim. A visita domiciliar (ou entrevista por vídeo/visita ao local) é uma etapa crucial do processo de adoção responsável. Ela garante a segurança do pet e do adotante, confirmando que o ambiente é adequado e seguro." 
  },
];

function Faq() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Dúvidas sobre o Processo de Adoção
        </Typography>
        <Typography variant="subtitle1" component="p" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Tudo que você precisa saber para encontrar e acolher seu novo amigo de forma responsável.
        </Typography>
        <Box sx={{ mt: 4 }}>
          {faqs.map((faq, index) => (
            <Accordion key={index} elevation={1} sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}a-content`}
                id={`panel${index}a-header`}
              >
                <Typography variant="h6">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Container>
  );
}

export default Faq;