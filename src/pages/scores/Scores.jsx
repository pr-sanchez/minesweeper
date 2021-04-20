import { useState, useEffect } from "react";
import styles from "./styles.modules.scss";

function Scores() {
  const [gameHistory, setGameHistory] = useState([]);

  useEffect(() => {
    const games = getGameHistory();
    setGameHistory(games);
  }, []);

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
    const sortedGameHistory = sortGameHistory(parsedGameHistory);

    return sortedGameHistory;
  }

  // function clearScores() {
  //   localStorage.removeItem("gameHistory");
  // }

  function renderScores() {
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

  return <div className={styles.ScoreTable}>{renderScores()}</div>;
}
export default Scores;
