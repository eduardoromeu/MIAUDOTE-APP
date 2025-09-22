import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Container, Stack } from "@mui/material";
import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router';

// 1. Importar o necessário do Firebase
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase"; // Verifique se o caminho está correto

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
        // Após o cadastro, o usuário já estará logado,
        // então o redirecionamos para a página principal.
        navigate("/");
    };

    // Forms - Mantemos os estados para os campos
    const [nome, setNome] = React.useState("");
    const [telefone, setTelefone] = React.useState(""); // Nota sobre o telefone abaixo
    const [email, setEmail] = React.useState("");
    const [senha, setSenha] = React.useState("");
    // 2. Adicionar um estado para mensagens de erro
    const [error, setError] = React.useState("");

    // 3. Modificar a função Cadastrar para usar Firebase
    async function Cadastrar(e) {
        e.preventDefault();
        setError(""); // Limpa erros anteriores

        if (!nome || !email || !senha) {
            setError("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        try {
            // Cria o usuário com e-mail e senha
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;

            // Adiciona o nome do usuário ao perfil do Firebase
            await updateProfile(user, {
                displayName: nome,
            });

            console.log("Usuário cadastrado com sucesso:", user);
            handleOpen(); // Abre o modal de sucesso

        } catch (err) {
            // 4. Captura e exibe erros comuns do Firebase
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

    return (
        <Container maxWidth="xs">
            <Typography variant="h6" component="h2">CADASTRO DE USUÁRIO</Typography>
            <Stack
                component="form"
                sx={{ display: "flex", alignItems: "center", '& .MuiTextField-root': { m: 1, width: '25ch' } }}
                onSubmit={Cadastrar}
            >
                <TextField
                    id="outlined-name"
                    label="Nome"
                    required
                    sx={{minWidth: '100%'}}
                    value={nome}
                    onChange={e => { setNome(e.target.value) }}
                />

                <TextField
                    id="outlined-tel"
                    label="Telefone"
                    type="tel"
                    required
                    sx={{minWidth: '100%'}}
                    value={telefone}
                    onChange={e => { setTelefone(e.target.value) }}
                />

                <TextField
                    id="outlined-email"
                    label="Email"
                    type="email" // Corrigido de 'mail' para 'email'
                    required
                    sx={{minWidth: '100%'}}
                    value={email}
                    onChange={e => { setEmail(e.target.value) }}
                />

                <TextField
                    id="outlined-password-input"
                    label="Senha"
                    type="password"
                    autoComplete="new-password" // Melhor para cadastro
                    required
                    sx={{minWidth: '100%'}}
                    value={senha}
                    onChange={e => { setSenha(e.target.value) }}
                />

                {/* 5. Exibir a mensagem de erro, se houver */}
                {error && (
                    <Typography color="error" variant="body2" textAlign="center" sx={{ my: 1 }}>
                        {error}
                    </Typography>
                )}

                <Button variant="contained" type="submit" fullWidth>Confirmar</Button>
            </Stack>
            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Parabéns!
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Seu cadastro foi realizado com sucesso!
                        </Typography>
                        <Button variant='contained' onClick={handleClose} sx={{ mt: 2 }}>Fechar</Button>
                    </Box>
                </Modal>
            </div>
        </Container>
    );
}