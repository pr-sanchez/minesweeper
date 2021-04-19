import { Switch, Route } from "react-router-dom";
import Setup from "../pages/setup/Setup";
import Board from "../pages/Board/Board";
import Scores from "../pages/scores/Scores";

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
