import { useRoutes } from "react-router-dom";
import StoreData from "./components/StoreData/StoreData";

function App() {
  const routes = useRoutes([
    {
      path: "/",
      element: <StoreData />,
    },
    {
      path: "/cart",
    },
  ]);

  return routes;
}

export default App;
