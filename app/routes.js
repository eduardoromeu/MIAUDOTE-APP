import { index, route } from "@react-router/dev/routes";

export default [
	index("src/pages/home.jsx"),
  route("/search-pets", "src/pages/SearchPets.jsx"),
	route("/register-pet", "src/pages/RegisterPet.jsx"),
  route("/success-stories", "src/pages/SuccessStories.jsx"),
  route("/cadastro-usuario", "src/pages/Cadastro.jsx"),
  route("/login", "src/pages/Login.jsx"),
];
