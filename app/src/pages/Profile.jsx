import React, { useState, useEffect } from 'react';
import { Container, Typography, Avatar, Box, TextField, Stack, Button, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useOutletContext } from 'react-router';
import { signOut, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";

// Esta página agora é focada apenas no perfil do usuário.
export default function Profile() {
  const { user } = useOutletContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [userDescription, setUserDescription] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setEditedName(user.displayName || '');

    const fetchUserData = async () => {
      setLoading(true);
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setUserDescription(userDocSnap.data().description || '');
      }
      setLoading(false);
    };

    fetchUserData();
  }, [user]);
  
  const handleEdit = () => { setEditedDescription(userDescription); setIsEditing(true); };
  const handleCancel = () => { setIsEditing(false); };
  const handleSave = async () => { if (!editedName.trim()) return; try { const userDocRef = doc(db, "users", user.uid); await Promise.all([ updateProfile(auth.currentUser, { displayName: editedName }), setDoc(userDocRef, { description: editedDescription }, { merge: true }) ]); setUserDescription(editedDescription); setIsEditing(false); } catch (error) { console.error("Erro ao atualizar o perfil: ", error); } };
  const handleLogout = async () => { try { await signOut(auth); window.location.href = '/'; } catch (error) { console.error("Error signing out: ", error); } };

  if (loading || !user) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  return (
    <Container>
      <Stack direction="column" alignItems="center" spacing={2} sx={{ my: 4, width: 'fit-content', mx: 'auto' }}>
        <Avatar sx={{ width: 100, height: 100, p: 1.5, bgcolor: 'primary.main', fontSize: '3rem' }}>{user.displayName ? user.displayName.charAt(0).toUpperCase() : ''}</Avatar>
        {isEditing ? (
          <Stack spacing={2} component="form" onSubmit={(e) => { e.preventDefault(); handleSave(); }} alignItems="center" sx={{width: '100%', maxWidth: '400px'}}>
            <TextField label="Nome" value={editedName} onChange={(e) => setEditedName(e.target.value)} variant="outlined" size="small" fullWidth />
            <TextField label="Descrição" value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} variant="outlined" size="small" multiline rows={3} fullWidth placeholder="Fale um pouco sobre você..."/>
            <Typography variant="body1" color="text.secondary">{user.email}</Typography>
            <Box>
              <Button startIcon={<SaveIcon />} variant="contained" type="submit" sx={{ mr: 1 }}> Salvar </Button>
              <Button startIcon={<CancelIcon />} variant="outlined" onClick={handleCancel}> Cancelar </Button>
            </Box>
          </Stack>
        ) : (
          <Stack alignItems="center" spacing={1}>
            <Typography variant="h4">{user.displayName}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
              {userDescription || 'Adicione uma descrição para o seu perfil.'}
            </Typography>
            <Typography variant="body2">{user.email}</Typography>
            <Button startIcon={<EditIcon />} variant="outlined" sx={{ mt: 1 }} onClick={handleEdit}> Editar Perfil </Button>
          </Stack>
        )}
        <Button variant="contained" color="error" onClick={handleLogout} sx={{ mt: 2 }}> Sair (Logout) </Button>
      </Stack>
    </Container>
  );
}