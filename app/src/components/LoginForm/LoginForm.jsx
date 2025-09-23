import React, { useState } from "react";
import { FormControl, Typography, Button, Stack, Link, Box } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import IconInput from "../IconInput/IconInput";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

// A importação do 'useNavigate' foi completamente REMOVIDA.

export default function LoginForm() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    async function Logar() {
        setError(""); 
        console.log("Login...");

        if (!login || !password) {
            setError("Por favor, preencha o e-mail e a senha.");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, login, password);
            console.log("Login bem-sucedido!");
            
            // Redireciona para a página de perfil usando o método padrão do navegador
            window.location.href = '/profile';

        } catch (err) {
            console.error("Erro no login:", err.message);
            setError("E-mail ou senha incorretos. Tente novamente!");
        }
    }

    return (
        // Adicionado onSubmit ao formulário para funcionar com a tecla Enter
        <FormControl component="form" onSubmit={(e) => { e.preventDefault(); Logar(); }}>
          <Stack spacing={2}>
            <Typography id="modal-modal-title" variant="h5" component="h2">
                Entrar
            </Typography>
            <IconInput
                label="Usuário"
                placeholder="Email"
                required
                value={login}
                onChange={e => { setLogin(e.target.value) }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: "flex-end" }}>
                <IconInput
                    label="Senha"
                    placeholder="Insira sua senha"
                    type="password"
                    icon={<LockIcon />}
                    required
                    value={password}
                    onChange={e => { setPassword(e.target.value) }}
                />
                <Link href="#" underline="hover" variant="subtitle2">Esqueci minha senha</Link>
            </Box>

            {error && (
                <Typography color="error" variant="body2" textAlign="center">
                    {error}
                </Typography>
            )}

            <Button variant="contained" type="submit">Continuar</Button>
            <Button component="a" href="/cadastro-usuario" variant="outlined">Não sou cadastrado</Button>
          </Stack>
        </FormControl>
    );
}