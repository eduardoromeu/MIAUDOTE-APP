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

//miaudote
import { useState, useEffect } from "react";
import PawPrint from "./images/White_paw_print.png";
import NavBar from "./src/components/NavBar/NavBar";
const userModel = {
  logado: false,
  password:"123",
  name: "Thiago Frango",
  phone: "+55 11 99999-9999",
  email: "email@example.com",
  avatar: PawPrint, // Link da imagem do avatar
  favorites: [
    {
      name: "Luna",
      description: "Uma gata branca muito carinhosa.",
      image: "https://example.com/luna.jpg",
    },
    {
      name: "Rex",
      description: "Cachorro labrador enérgico.",
      image: "https://example.com/rex.jpg",
    },
  ]
};

export function Layout({ children }) {

    const LogOut = () => {
      if (typeof window !== "undefined" && window.localStorage) {
        const user = JSON.parse(localStorage.getItem("user"));
        if(user){
          user.logado = false;
          localStorage.setItem("user", JSON.stringify(user));
        }
        window.location.href = "/MIAUDOTE/";
      }
      return (<></>);
    }
  
    let user = null;
    if (typeof window !== "undefined" && window.localStorage) {
      user = JSON.parse(localStorage.getItem("user"));
    }
    const [isOpenModal, setOpenModal] = useState(false);

    // Synchronize modal state after mount to avoid hydration mismatch
    useEffect(() => {
      let user = null;
      if (typeof window !== "undefined" && window.localStorage) {
        user = JSON.parse(localStorage.getItem("user"));
      }
      setOpenModal(!user || !user.logado);
    }, []);

  return (
    <html lang="pt-br">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <NavBar isOpenModal={isOpenModal} setOpenModal={setOpenModal} />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }) {
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
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
