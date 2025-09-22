import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Container, Stack } from "@mui/material";
import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router';

// 1. IMPORTS ATUALIZADOS
// Funções da Autenticação do Firebase (como antes)
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// Funções do Banco de Dados Firestore
import { doc, setDoc } from "firebase/firestore"; 
// Instâncias do 'auth' e 'db' (banco de dados) do seu arquivo de configuração
import { auth, db } from "../firebase"; 

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function Cadastro() {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        // Após o cadastro, o usuário já estará logado e seus dados salvos.
        // Redirecionamos para a página de perfil.
        window.location.href = '/profile';
    };

    // Estados do formulário (sem alterações)
    const [nome, setNome] = React.useState("");
    const [telefone, setTelefone] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [senha, setSenha] = React.useState("");
    const [error, setError] = React.useState("");

    // 2. FUNÇÃO CADASTRAR ATUALIZADA
    async function Cadastrar(e) {
        e.preventDefault();
        setError("");

        if (!nome || !email || !senha) {
            setError("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        try {
            // ETAPA 1: Criar o usuário no sistema de Autenticação (como antes)
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;

            // ETAPA 2: Adicionar o nome ao perfil de Autenticação (como antes)
            await updateProfile(user, {
                displayName: nome,
            });

            // ETAPA 3: Salvar as informações extras no banco de dados (Firestore)
            // Cria uma referência a um "documento" na "coleção" de usuários.
            // O nome do documento será o ID único do usuário (user.uid), ligando os dois sistemas.
            const userDocRef = doc(db, "users", user.uid);

            // Salva um objeto com os dados nesse documento.
            await setDoc(userDocRef, {
                uid: user.uid,
                displayName: nome,
                email: email,
                phoneNumber: telefone,
                favorites: [] // Prepara o campo para a funcionalidade de "favoritos"
            });

            console.log("Usuário criado na Autenticação e dados salvos no Firestore!");
            handleOpen(); // Abre o modal de sucesso

        } catch (err) {
            // Tratamento de erros (sem alterações)
            console.error("Erro no cadastro:", err.code);
            if (err.code === 'auth/email-already-in-use') {
                setError("Este e-mail já está cadastrado.");
            } else if (err.code === 'auth/weak-password') {
                setError("A senha precisa ter no mínimo 6 caracteres.");
            } else {
                setError("Ocorreu um erro ao realizar o cadastro. Tente novamente.");
            }
        }
    }

    // O return com o formulário e o modal permanecem exatamente iguais.
    return (
        <Container maxWidth="xs">
            <Typography variant="h6" component="h2">CADASTRO DE USUÁRIO</Typography>
            <Stack
                component="form"
                sx={{ display: "flex", alignItems: "center", '& .MuiTextField-root': { m: 1, width: '25ch' } }}
                onSubmit={Cadastrar}
            >
                {/* ... Seus TextFields para nome, telefone, email, senha ... */}
                <TextField id="outlined-name" label="Nome" required sx={{minWidth: '100%'}} value={nome} onChange={e => { setNome(e.target.value) }}/>
                <TextField id="outlined-tel" label="Telefone" type="tel" required sx={{minWidth: '100%'}} value={telefone} onChange={e => { setTelefone(e.target.value) }}/>
                <TextField id="outlined-email" label="Email" type="email" required sx={{minWidth: '100%'}} value={email} onChange={e => { setEmail(e.target.value) }}/>
                <TextField id="outlined-password-input" label="Senha" type="password" autoComplete="new-password" required sx={{minWidth: '100%'}} value={senha} onChange={e => { setSenha(e.target.value) }}/>
                {error && (<Typography color="error" variant="body2" textAlign="center" sx={{ my: 1 }}>{error}</Typography>)}
                <Button variant="contained" type="submit" fullWidth>Confirmar</Button>
            </Stack>
            <div>
                <Modal open={open} onClose={handleClose}>
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">Parabéns!</Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>Seu cadastro foi realizado com sucesso!</Typography>
                        <Button variant='contained' onClick={handleClose} sx={{ mt: 2 }}>Ir para o Perfil</Button>
                    </Box>
                </Modal>
            </div>
        </Container>
    );
}