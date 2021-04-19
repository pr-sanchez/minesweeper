import { BrowserRouter } from "react-router-dom";
import { render } from "react-dom";
import App from "./App";
import MinesweeperProvider from "./context/minesweeperProvider";

render(
  <MinesweeperProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MinesweeperProvider>,
  document.getElementById("root")
);
