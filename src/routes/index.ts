import authRouter from "./authRoute";
import baseRouter from "./baseRoute";
import dishRouter from "./dishRoute";
import ingredientRouter from "./ingredientRoutes";
import nutritionRouter from "./nutritionRoute";
import typeDishRouter from "./typeDishRoute";

const routes = [
  authRouter,
  nutritionRouter,
  ingredientRouter,
  baseRouter,
  typeDishRouter,
  dishRouter,
];

export default routes;
