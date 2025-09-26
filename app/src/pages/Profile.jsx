import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Avatar, Box, TextField, Stack, Button, 
  CircularProgress, Grid, Paper, FormControl, InputLabel, Select, 
  MenuItem, FormControlLabel, Checkbox 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useOutletContext } from 'react-router';
import { signOut, updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Profile() {
  const { user } = useOutletContext();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  // 1. GERENCIAMENTO DE ESTADO CENTRALIZADO
  // Um objeto para os dados exibidos e outro para os dados sendo editados
  const [profileData, setProfileData] = useState({});
  const [editedData, setEditedData] = useState({});
  const [newImageFile, setNewImageFile] = useState(null); // Para a nova foto de perfil

  // 2. BUSCA DE DADOS ABRANGENTE
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      setLoading(true);
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        // Inclui dados do Auth e do Firestore
        const fullProfile = {
          displayName: user.displayName || '',
          email: user.email,
          profilePictureUrl: user.photoURL || '',
          ...data,
        };
        setProfileData(fullProfile);
      } else {
        // Perfil básico se não houver dados no Firestore
        setProfileData({
          displayName: user.displayName || '',
          email: user.email,
          profilePictureUrl: user.photoURL || '',
        });
      }
      setLoading(false);
    };
    fetchUserData();
  }, [user]);
  
  const handleEdit = () => {
    // Ao entrar no modo de edição, copia os dados atuais para o formulário
    setEditedData(profileData);
    setNewImageFile(null); // Reseta a seleção de imagem
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewImageFile(e.target.files[0]);
    }
  };

  // 3. LÓGICA DE UPLOAD DE IMAGEM E SALVAMENTO
  const handleSave = async () => {
    if (!editedData.displayName?.trim()) return;
    setSaveLoading(true);

    try {
      let imageUrl = profileData.profilePictureUrl;
      // Se uma nova imagem foi selecionada, faz o upload
      if (newImageFile) {
        const imageRef = ref(storage, `profilePictures/${user.uid}/${newImageFile.name}`);
        const uploadResult = await uploadBytes(imageRef, newImageFile);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }

      // Atualiza os dados no Firebase Auth (nome e foto)
      await updateProfile(auth.currentUser, {
        displayName: editedData.displayName,
        photoURL: imageUrl,
      });

      // Prepara os dados para salvar no Firestore (sem os dados do Auth)
      const { displayName, email, profilePictureUrl, ...firestoreData } = editedData;
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { ...firestoreData, profilePictureUrl: imageUrl }, { merge: true });

      // Atualiza o estado local para refletir as mudanças
      setProfileData(prev => ({ ...prev, ...editedData, profilePictureUrl: imageUrl }));
      setIsEditing(false);

    } catch (error) {
      console.error("Erro ao atualizar o perfil: ", error);
    }
    setSaveLoading(false);
  };

  const handleLogout = async () => { /* ... sem alterações ... */ };

  if (loading || !user) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  return (
    <Container>
      <Stack direction="column" alignItems="center" spacing={2} sx={{ my: 4, width: 'fit-content', mx: 'auto' }}>
        
        {/* 4. MODO DE EXIBIÇÃO (NÃO-EDIÇÃO) */}
        {!isEditing ? (
          <Paper sx={{ p: 3, width: '100%', maxWidth: '700px' }}>
            <Stack alignItems="center" spacing={2}>
              <Avatar src={profileData.profilePictureUrl} sx={{ width: 120, height: 120 }} />
              <Typography variant="h4">{profileData.displayName}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                {profileData.description || 'Adicione uma descrição para o seu perfil.'}
              </Typography>
              <Typography variant="body2">{profileData.email}</Typography>
              <Grid container spacing={2} sx={{ mt: 2, textAlign: 'left' }}>
                <Grid item xs={12} sm={6}><Typography><strong>Localização:</strong> {profileData.locationCity || 'N/A'}, {profileData.locationState || 'N/A'}</Typography></Grid>
                <Grid item xs={12} sm={6}><Typography><strong>Tipo de Doador:</strong> {profileData.donorType || 'N/A'}</Typography></Grid>
                {profileData.donorType === 'Abrigo/ONG' && (
                  <Grid item xs={12}><Typography><strong>Instituição:</strong> {profileData.institutionName || 'N/A'}</Typography></Grid>
                )}
                <Grid item xs={12}><Typography><strong>Minha história:</strong> {profileData.myStory || 'Não informado.'}</Typography></Grid>
              </Grid>
              <Button startIcon={<EditIcon />} variant="outlined" sx={{ mt: 2 }} onClick={handleEdit}> Editar Perfil </Button>
              <Button variant="contained" color="error" onClick={handleLogout} sx={{ mt: 1 }}> Sair (Logout) </Button>
            </Stack>
          </Paper>
        ) : (
          // 5. MODO DE EDIÇÃO (FORMULÁRIO COMPLETO)
          <Paper sx={{ p: 3, width: '100%', maxWidth: '700px' }}>
            <Stack spacing={2} component="form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <Typography variant="h5" textAlign="center">Editando Perfil</Typography>
              
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={newImageFile ? URL.createObjectURL(newImageFile) : profileData.profilePictureUrl} sx={{ width: 80, height: 80 }} />
                <Button variant="outlined" component="label" startIcon={<PhotoCamera />}>
                  Trocar Foto
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>
              </Stack>

              <TextField name="displayName" label="Nome" value={editedData.displayName || ''} onChange={handleFieldChange} variant="outlined" size="small" fullWidth required />
              <TextField name="description" label="Descrição Curta" value={editedData.description || ''} onChange={handleFieldChange} variant="outlined" size="small" multiline rows={3} fullWidth placeholder="Fale um pouco sobre você..." />
              <TextField name="myStory" label="Minha História com Pets" value={editedData.myStory || ''} onChange={handleFieldChange} variant="outlined" size="small" multiline rows={4} fullWidth placeholder="Como você começou a ajudar animais?" />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}><TextField name="locationCity" label="Cidade" value={editedData.locationCity || ''} onChange={handleFieldChange} size="small" fullWidth /></Grid>
                <Grid item xs={12} sm={6}><TextField name="locationState" label="Estado (UF)" value={editedData.locationState || ''} onChange={handleFieldChange} size="small" fullWidth /></Grid>
              </Grid>

              <FormControl fullWidth size="small">
                <InputLabel>Tipo de Doador</InputLabel>
                <Select name="donorType" value={editedData.donorType || ''} label="Tipo de Doador" onChange={handleFieldChange}>
                  <MenuItem value="Tutor Individual">Tutor Individual</MenuItem>
                  <MenuItem value="Abrigo/ONG">Abrigo/ONG</MenuItem>
                  <MenuItem value="Resgatista Independente">Resgatista Independente</MenuItem>
                </Select>
              </FormControl>

              {editedData.donorType === 'Abrigo/ONG' && (
                <>
                  <TextField name="institutionName" label="Nome da Instituição" value={editedData.institutionName || ''} onChange={handleFieldChange} size="small" fullWidth />
                  <TextField name="cnpj" label="CNPJ (Opcional)" value={editedData.cnpj || ''} onChange={handleFieldChange} size="small" fullWidth />
                  <TextField name="website" label="Website / Rede Social" value={editedData.website || ''} onChange={handleFieldChange} size="small" fullWidth />
                </>
              )}

              <FormControlLabel
                control={<Checkbox name="commitmentCheck" checked={editedData.commitmentCheck || false} onChange={handleFieldChange} />}
                label="Declaro que as informações são verdadeiras e concordo com as políticas do site."
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <Button startIcon={<CancelIcon />} variant="outlined" onClick={handleCancel}> Cancelar </Button>
                <Button startIcon={<SaveIcon />} variant="contained" type="submit" disabled={saveLoading}>
                  {saveLoading ? <CircularProgress size={22} color="inherit" /> : 'Salvar'}
                </Button>
              </Box>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}