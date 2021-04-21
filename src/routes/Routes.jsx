import { Switch, Route } from "react-router-dom";
import Setup from "../pages/setup";
import Board from "../pages/board";
import Scores from "../pages/scores";

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
