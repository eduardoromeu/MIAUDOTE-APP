# Miaudote: Plataforma de Adoção de Animais

`Miaudote` é uma aplicação web dedicada a conectar animais de estimação que precisam de um lar com pessoas que desejam adotá-los. A plataforma oferece uma interface amigável para que os usuários possam cadastrar animais para adoção, navegar pelos perfis dos pets, e gerenciar todo o processo de candidatura de forma simples e segura.

---

<div align="center">

## 🚀 **Projeto de Atividade Extensionista Universitária** 🚀

<br>

<p>Esta plataforma foi cuidadosamente desenvolvida pelos alunos <strong>Eugênio Domingues</strong> e <strong>Eduardo Romeu</strong>.</p>

<p>O projeto faz parte da disciplina de <strong>Atividade Extensionista</strong>, representando a aplicação prática e o compromisso acadêmico com o</p>

<h3>🎓 Centro Universitário Internacional UNINTER 🎓</h3>

</div>

---

## ✨ Principais Funcionalidades

* **Autenticação de Usuário:** Sistema completo de cadastro, login e logout.
* **Perfis de Usuário:** Área de perfil onde os usuários podem gerenciar suas informações e atividades.
* **Cadastro de Pets:** Usuários logados podem cadastrar animais para adoção, incluindo detalhes como fotos, espécie, raça, idade e descrição.
* **Busca e Filtragem:** Ferramenta de busca para encontrar pets com base em diferentes critérios.
* **Detalhes do Pet:** Página dedicada com todas as informações sobre um animal específico.
* **Proposta de Adoção:** Os usuários podem enviar propostas de adoção para os pets que desejam acolher.
* **Favoritos:** Funcionalidade para salvar perfis de pets em uma lista de favoritos.
* **Gerenciamento Pessoal:** Páginas para o usuário visualizar "Meus Pets Cadastrados"  e "Meus Favoritos".
* **Rotas Protegidas:** Acesso a determinadas páginas somente para usuários autenticados.
* **Páginas Informativas:** Seções de FAQ, Sobre, Políticas de Privacidade, Termos de Uso e Histórias de Sucesso.

## 🚀 Tecnologias Utilizadas

* **Frontend:**
    * **React:** Biblioteca principal para a construção da interface de usuário.
    * **JavaScript / TypeScript:** Linguagem de programação para a lógica do frontend.
* **Backend & Banco de Dados:**
    * **Firebase:** Utilizado para autenticação de usuários, banco de dados (Firestore ou Realtime Database) e armazenamento de arquivos (Firebase Storage), e Google Cloud Provider

## 📂 Estrutura do Projeto

O código-fonte está organizado da seguinte maneira para manter a clareza e a escalabilidade:

```bash
src/
|
|-- components/      # Componentes reutilizáveis (Botões, Cards, Modais, etc.)
|-- pages/           # Componentes que representam as páginas da aplicação (Home, Login, Perfil, etc.)
|-- contexts/        # Provedores de contexto para gerenciamento de estado global
|-- firebase.ts      # Arquivo de configuração e inicialização do Firebase
|-- UserClass.js     # Classe ou módulo para manipulação de dados do usuário
...

```

## ⚙️ Instalação e Execução

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### **Pré-requisitos**

* [Node.js](https://nodejs.org/) (versão 18 ou superior)
* [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
* Uma conta no [Firebase](https://firebase.google.com/) para configurar o backend.

### **Passo a Passo**

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
    cd seu-repositorio
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```
    ou
    ```bash
    yarn install
    ```

3.  **Configure o Firebase:**
    * Crie um novo projeto no [console do Firebase] (https://console.firebase.google.com/).
    * Na visão geral do projeto, adicione um novo aplicativo da Web.
    * Copie as credenciais de configuração do Firebase (`apiKey`, `authDomain`, etc.).
    * Cole suas credenciais no arquivo `src/firebase.ts`.

    **Exemplo do `src/firebase.ts`:**
    ```typescript
    import { initializeApp } from "firebase/app";
    import { getAuth } from "firebase/auth";
    import { getFirestore } from "firebase/firestore";
    import { getStorage } from "firebase/storage";

    // Suas credenciais do Firebase
    const firebaseConfig = {
      apiKey: "SUA_API_KEY",
      authDomain: "SEU_AUTH_DOMAIN",
      projectId: "SEU_PROJECT_ID",
      storageBucket: "SEU_STORAGE_BUCKET",
      messagingSenderId: "SEU_MESSAGING_SENDER_ID",
      appId: "SEU_APP_ID"
    };

    // Inicializa o Firebase
    const app = initializeApp(firebaseConfig);
    export const auth = getAuth(app);
    export const db = getFirestore(app);
    export const storage = getStorage(app);
    ```

4.  **Execute a aplicação:**
    ```bash
    npm start
    ```
    ou
    ```bash
    yarn start
    ```

5.  Abra seu navegador e acesse `http://localhost:3000` para ver a aplicação em funcionamento.

