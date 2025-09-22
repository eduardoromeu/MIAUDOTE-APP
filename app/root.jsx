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

import { Container, Typography, CssBaseline, Box } from "@mui/material";
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
    console.log("Layout: useEffect foi ativado."); // <-- PONTO DE VERIFICAÇÃO 1

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Firebase: onAuthStateChanged retornou.", currentUser); // <-- PONTO DE VERIFICAÇÃO 2
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      console.log("Layout: Limpando o useEffect."); // <-- PONTO DE VERIFICAÇÃO 3
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
                Carregando...
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
      <body>
        <NavBar
          user={user}
          isOpenModal={isOpenModal}
          setOpenModal={setOpenModal}
        />
        <CssBaseline />
        <Box component="main" sx={{ p: 3, mt: 8 }}>
          {children}
        </Box>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// A função 'App' não precisa ser envolvida por um 'Document' aqui
export default function App() {
  return <Outlet />;
}

// Sua ErrorBoundary continua a mesma
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

// A declaração DOCTYPE deve estar no nível superior do arquivo para ser renderizada primeiro.
// Como estamos em JSX, a forma de fazer isso é ter um componente 'Document' que retorna a estrutura HTML completa.
// A função Layout agora faz esse papel.