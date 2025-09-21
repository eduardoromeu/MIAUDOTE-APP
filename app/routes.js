import { index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.jsx"),
	route("/search-pets", "src/pages/SearchPets.jsx"),
];
