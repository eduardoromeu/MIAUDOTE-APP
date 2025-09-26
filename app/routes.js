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

  // --- ROTAS PROTEGIDAS ---
  route(null, "./src/components/ProtectedRoute.jsx", [
    route("/register-pet", "./src/pages/RegisterPet.jsx"),
    
    // ATENÇÃO: Havia um erro na sua rota de proposal antiga, corrigi abaixo
    // route("/proposal:proposalIndex", "./src/pages/AdoptionProposal.jsx"), // Forma antiga incorreta
   
    route("/profile", "./src/pages/Profile.jsx"), 
    route("/my-favorites", "./src/pages/MyFavorites.jsx"),
    route("/my-pets", "./src/pages/MyPets.jsx"),
    
    // 👇 ADICIONE A ROTA PARA A PÁGINA DE PROPOSTA AQUI 👇
    route("/proposal/:proposalId", "./src/pages/AdoptionProposal.jsx"),
  ]),
];