import React, { useState } from "react";
import { FormControl, Typography, Button, Stack, Link, Box } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import IconInput from "../IconInput/IconInput";
// 1. Importar o necessário do Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"; // Verifique se o caminho para seu firebase.ts está correto

export default function LoginForm() {
    // Mantemos os estados para e-mail (login) e senha
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    // 2. Adicionar um estado para mensagens de erro
    const [error, setError] = useState("");
    
    // 3. Modificar a função Logar para usar Firebase
    async function Logar() {
        setError(""); // Limpa erros anteriores

        if (!login || !password) {
            setError("Por favor, preencha o e-mail e a senha.");
            return;
        }

        try {
            // Tenta fazer o login com o e-mail e senha fornecidos
            const userCredential = await signInWithEmailAndPassword(auth, login, password);
            console.log("Login bem-sucedido!", userCredential.user);
            
            // Redireciona o usuário para a página principal após o login
            window.location.href = "/MIAUDOTE/";

        } catch (err) {
            // 4. Captura e exibe erros de autenticação
            console.error("Erro no login:", err.message);
            setError("E-mail ou senha incorretos. Tente novamente!");
        }
    }

    return (
        <FormControl as={Stack} spacing={2}>
            <Typography id="modal-modal-title" variant="h5" component="h2">
                Entrar
            </Typography>
            <IconInput
                label="Usuário"
                placeholder="Email" // Alterado para ser mais claro
                required
                value={login} // Controlar o valor do input
                onChange={e => { setLogin(e.target.value) }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: "flex-end" }}>
                <IconInput
                    label="Senha"
                    placeholder="Insira sua senha"
                    type="password"
                    icon={<LockIcon />}
                    required
                    value={password} // Controlar o valor do input
                    onChange={e => { setPassword(e.target.value) }}
                />
                <Link href="#" underline="hover" variant="subtitle2">Esqueci minha senha</Link>
            </Box>

            {/* 5. Exibir a mensagem de erro, se houver */}
            {error && (
                <Typography color="error" variant="body2" textAlign="center">
                    {error}
                </Typography>
            )}

            <Button variant="contained" onClick={Logar}>Continuar</Button>
            <Button component="a" href="/MIAUDOTE/cadastro-usuario" variant="outlined">Não sou cadastrado</Button>
        </FormControl>
    )
}