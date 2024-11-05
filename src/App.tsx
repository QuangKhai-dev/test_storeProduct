import { useRoutes } from "react-router-dom";
import StoreData from "./components/StoreData/StoreData";
import Cart from "./components/Cart/Cart";

function App() {
  const routes = useRoutes([
    {
      path: "/",
      element: <StoreData />,
    },
    {
      path: "/cart",
      element: <Cart />,
    },
  ]);

  return routes;
}

export default App;
