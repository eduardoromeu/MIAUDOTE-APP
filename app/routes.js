// routes.js
import { index, route } from "@react-router/dev/routes";

export default [
  // --- ROTAS PÚBLICAS ---
  index("./src/pages/Home.jsx"),
  route("/login", "./src/pages/Login.jsx"),
  route("/cadastro-usuario", "./src/pages/Cadastro.jsx"),
  route("/search-pets", "./src/pages/SearchPets.jsx"),
  route("/success-stories", "./src/pages/SuccessStories.jsx"),
  route("/pet/:petId", "./src/pages/PetDetails.jsx"),
  route("/logout", "./src/pages/LogOut.jsx"),

  // --- NOVAS ROTAS DO RODAPÉ ---
  route("/sobre", "./src/pages/Sobre.jsx"), 
  route("/faq", "./src/pages/Faq.jsx"),
  route("/termos", "./src/pages/TermosDeUso.jsx"),
  route("/privacidade", "./src/pages/PoliticasDePrivacidade.jsx"),

  // --- ROTAS PROTEGIDAS ---
  route(null, "./src/components/ProtectedRoute.jsx", [
    route("/register-pet", "./src/pages/RegisterPet.jsx"),
    
    // Corrigida: Uso correto de parâmetros de rota
    route("/proposal/:proposalId", "./src/pages/AdoptionProposal.jsx"),
    
    route("/profile", "./src/pages/Profile.jsx"), 
    route("/my-favorites", "./src/pages/MyFavorites.jsx"),
    route("/my-pets", "./src/pages/MyPets.jsx"),
  ]),
];