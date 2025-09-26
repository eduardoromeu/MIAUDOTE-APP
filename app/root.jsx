"use client";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import "./app.css";

// 1. IMPORTAÇÃO DO FOOTER
import Footer from "./src/components/Footer/Footer"; // 👈 Ajuste o caminho conforme a localização do seu arquivo Footer.jsx

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

import { Container, Typography, CssBaseline, Box, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import NavBar from "./src/components/NavBar/NavBar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/firebase";

// A função Layout agora retorna um Documento HTML completo e correto
export function Layout({ children }) {
  const [isOpenModal, setOpenModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Layout: useEffect foi ativado.");

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Firebase: onAuthStateChanged retornou.", currentUser);
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      console.log("Layout: Limpando o useEffect.");
      unsubscribe();
    }
  }, []);

  // O estado de loading agora fica dentro do body
  if (loading) {
    return (
      <html lang="pt-br">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <Container sx={{ 
            height: "100%", display: "flex", flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center'
            }}>
            <CircularProgress />
          </Container>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    );
  }

  return (
    <html lang="pt-br">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      {/* 2. ESTRUTURA PARA STICKY FOOTER */}
      <Box
          component="body"
          sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh', // Garante que a altura mínima seja a da viewport
              margin: 0, // Remove margens padrão do body
              padding: 0, // Remove padding padrão do body
          }}
      >
        <CssBaseline />

        <NavBar
          user={user}
          isOpenModal={isOpenModal}
          setOpenModal={setOpenModal}
        />
        
        {/* Conteúdo Principal: flexGrow: 1 garante que ele ocupe o espaço restante */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            mt: 8,
            width: '100%', // Para garantir a largura total
          }}
        >
          <Outlet context={{ user }} />
        </Box>
        
        {/* 3. ADIÇÃO DO FOOTER */}
        <Footer />
        
        <ScrollRestoration />
        <Scripts />
      </Box>
    </html>
  );
}

// A função 'App' e 'ErrorBoundary' permanecem sem alteração
export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }) {
  // ... seu código de ErrorBoundary ...
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <Container>
      <Typography variant='h2'>404 - Página não encontrada</Typography>
      <main className="pt-16 p-4 container mx-auto">
        <h1>{message}</h1>
        <p>{details}</p>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto">
            <code>{stack}</code>
          </pre>
        )}
      </main>
    </Container>
  );
}