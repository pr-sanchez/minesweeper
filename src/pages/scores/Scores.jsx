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
        <div key={id} className={styles.Match}>
          <div>start time: {startTime}</div>
          <div>end time: {endTime}</div>
          <div>difficulty: {difficulty}</div>
          <div>Total time spent: {timeSpent}</div>
          <div>Status: {status}</div>
        </div>
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
