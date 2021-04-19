import { Switch, Route } from "react-router-dom";
import Setup from "../pages/Setup";
import Board from "../pages/Board";
import Scores from "../pages/Scores";

function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Setup />
      </Route>
      <Route path="/board">
        <Board />
      </Route>
      <Route path="/scores">
        <Scores />
      </Route>
    </Switch>
  );
}

export default Routes;
