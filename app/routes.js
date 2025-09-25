// routes.js
import { index, route } from "@react-router/dev/routes";

export default [
  // --- ROTAS PÚBLICAS ---
  // Acessíveis mesmo sem login
  index("./src/pages/Home.jsx"),
  route("/login", "./src/pages/Login.jsx"),
  route("/cadastro-usuario", "./src/pages/Cadastro.jsx"),
  route("/search-pets", "./src/pages/SearchPets.jsx"),
  route("/success-stories", "./src/pages/SuccessStories.jsx"),
  route("/pet/:petId", "./src/pages/PetDetails.jsx"),
  route("/logout", "./src/pages/LogOut.jsx"),

  // --- ROTAS PROTEGIDAS ---
  // Cria um grupo de rotas que usarão o "segurança"
  route(null, "./src/components/ProtectedRoute.jsx", [
    // Todas as rotas aqui dentro exigirão login
    route("/register-pet", "./src/pages/RegisterPet.jsx"),
    route("/proposal:proposalIndex", "./src/pages/AdoptionProposal.jsx"),
   
    route("/profile", "./src/pages/Profile.jsx"), 
  ]),
];