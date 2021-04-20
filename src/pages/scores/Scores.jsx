import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import Button from "../../components/button";
import styles from "./styles.modules.scss";

function Scores() {
  const [gameHistory, setGameHistory] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const games = getGameHistory();
    setGameHistory(games);
  }, []);

  // //////////////////////////////////
  // //////////////////////////////////
  // ////// PRIVATE FUNCTIONS /////////
  // //////////////////////////////////
  // //////////////////////////////////

  function sortGameHistory(games) {
    const sortedGameHistory = games.sort((a, b) => {
      if (a.difficulty > b.difficulty) {
        return 1;
      }
      if (a.difficulty < b.difficulty) {
        return -1;
      }
      if (a.timeSpent > b.timeSpent) {
        return 1;
      }
      if (a.timeSpent < b.timeSpent) {
        return -1;
      }
      return 0;
    });

    return sortedGameHistory;
  }

  function getGameHistory() {
    const parsedGameHistory = JSON.parse(localStorage.getItem("gameHistory"));
    const sortedGameHistory =
      parsedGameHistory !== null ? sortGameHistory(parsedGameHistory) : [];

    return sortedGameHistory;
  }

  function reloadPage() {
    history.go(0);
  }

  function hasGameHistory() {
    return gameHistory.length > 0;
  }
  //  //////////////////////////////////
  //  //////////////////////////////////
  //  //////// EVENT HANDLERS //////////
  //  //////////////////////////////////
  //  //////////////////////////////////

  function handleClearScores() {
    localStorage.removeItem("gameHistory");
    reloadPage();
  }

  function setStatusClassname(status) {
    if (status.toLowerCase() === "lost") {
      return styles.GameLost;
    }
    return styles.GameWin;
  }

  //  //////////////////////////////////
  //  //////////////////////////////////
  //  ////////// RENDERERS /////////////
  //  //////////////////////////////////
  //  //////////////////////////////////

  function renderScores() {
    if (!hasGameHistory()) {
      return <h1>No games found! Go and play some games buddy!</h1>;
    }

    const mappedGameHistory = gameHistory.map(
      ({ id, startTime, endTime, difficulty, timeSpent, status }) => (
        <ul key={id} className={styles.Match}>
          <li className={styles.MatchData}>
            <b>start time:</b>
            <div> {startTime}</div>
          </li>
          <li className={styles.MatchData}>
            <b>end time: </b>
            <div> {endTime}</div>
          </li>
          <li className={styles.MatchData}>
            <b>difficulty:</b>
            <div> {difficulty}</div>
          </li>
          <li className={styles.MatchData}>
            <b>Total time spent:</b>
            <div> {timeSpent}</div>
          </li>
          <li className={styles.MatchData}>
            <b>Status:</b>
            <div className={setStatusClassname(status)}>{status}</div>
          </li>
        </ul>
      )
    );
    return mappedGameHistory;
  }

  function renderClearButton() {
    if (!hasGameHistory()) {
      return null;
    }

    return (
      <Button className={styles.Button} onClick={handleClearScores}>
        Clear game history
      </Button>
    );
  }

  return (
    <div className={styles.ScoreTable}>
      {renderScores()}
      {renderClearButton()}
    </div>
  );
}
export default Scores;
