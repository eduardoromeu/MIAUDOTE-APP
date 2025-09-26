import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Stack, CircularProgress, Alert, Paper, Avatar } from "@mui/material";
import { useParams } from 'react-router';
import { doc, getDoc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from '../firebase';
import { useOutletContext } from 'react-router';

export default function AdoptionProposal() {
  const { proposalId } = useParams();
  const { user } = useOutletContext();
  const [proposal, setProposal] = useState(null);

  // 1. NOVO ESTADO: para guardar os dados do perfil de quem fez a proposta
  const [proposerProfile, setProposerProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!proposalId || !user) return;

    const fetchProposalData = async () => {
      setLoading(true);
      try {
        // Busca a proposta
        const proposalRef = doc(db, "proposals", proposalId);
        const proposalSnap = await getDoc(proposalRef);

        if (proposalSnap.exists()) {
          const proposalData = { id: proposalSnap.id, ...proposalSnap.data() };

          // Validação de segurança: o usuário logado é o dono do pet?
          if (user.uid === proposalData.ownerId) {
            setProposal(proposalData);
            
            // 2. BUSCA ADICIONAL: Com o ID da proposta, busca o perfil do interessado
            const proposerRef = doc(db, "users", proposalData.proposerId);
            const proposerSnap = await getDoc(proposerRef);
            if(proposerSnap.exists()) {
              setProposerProfile(proposerSnap.data());
            }

          } else {
            setError("Você não tem permissão para ver esta proposta.");
          }
        } else {
          setError("Proposta de adoção não encontrada.");
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Não foi possível carregar os dados da proposta.");
      }
      setLoading(false);
    };

    fetchProposalData();
  }, [proposalId, user]);

  // Função handleDecision (sem alterações)
  const handleDecision = async (decision) => {
    setLoading(true);
    const batch = writeBatch(db);
    const proposalRef = doc(db, "proposals", proposalId);
    batch.update(proposalRef, { status: decision });
    if (decision === 'accepted') {
      const petRef = doc(db, "pets", proposal.petId);
      batch.update(petRef, { adopted: true });
    }
    try {
      await batch.commit();
      setProposal(prev => ({ ...prev, status: decision }));
    } catch (err) {
      console.error("Erro ao processar a decisão: ", err);
      setError("Ocorreu um erro. Tente novamente.");
    }
    setLoading(false);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }
  
  if (error) {
    return <Container><Alert severity="error">{error}</Alert></Container>;
  }

  return (
    <Container sx={{ py: 4 }}>
      {proposal && (
        <>
          <Typography variant="h4" gutterBottom textAlign="center">Proposta de Adoção</Typography>
          <Typography variant="h6" sx={{ mt: 2 }} textAlign="center">
            Você recebeu uma proposta para o pet <strong>{proposal.petName}</strong>.
          </Typography>
          
          {/* 3. NOVA SEÇÃO: Card com informações do interessado */}
          <Paper elevation={3} sx={{ p: 3, mt: 4, maxWidth: '600px', mx: 'auto' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Informações do Interessado
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ width: 56, height: 56 }}>
                {proposal.proposerName ? proposal.proposerName.charAt(0).toUpperCase() : ''}
              </Avatar>
              <Box>
                <Typography variant="h6">{proposal.proposerName}</Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>Contato:</strong> {proposal.proposerEmail}
                </Typography>
              </Box>
            </Stack>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom><strong>Descrição do perfil:</strong></Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', pl: 1, borderLeft: '3px solid', borderColor: 'divider' }}>
                {proposerProfile?.description || "O usuário não adicionou uma descrição ao perfil."}
              </Typography>
            </Box>
          </Paper>

          {/* Seção de decisão (sem alterações na lógica) */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            {proposal.status === 'pending' ? (
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button variant="contained" color="success" size="large" onClick={() => handleDecision('accepted')}>
                  Aceitar Adoção
                </Button>
                <Button variant="contained" color="error" size="large" onClick={() => handleDecision('rejected')}>
                  Recusar
                </Button>
              </Stack>
            ) : (
              <Alert severity={proposal.status === 'accepted' ? 'success' : 'info'} sx={{ mt: 4, justifyContent: 'center' }}>
                Você já respondeu a esta proposta. Status: {proposal.status.toUpperCase()}
              </Alert>
            )}
          </Box>
        </>
      )}
    </Container>
  );
}