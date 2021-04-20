import { BrowserRouter } from "react-router-dom";
import { render } from "react-dom";
import MinesweeperProvider from "./context/MinesweeperProvider";
import App from "./App";

render(
  <MinesweeperProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MinesweeperProvider>,
  document.getElementById("root")
);
