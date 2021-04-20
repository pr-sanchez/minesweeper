import { useState, useEffect } from "react";
import styles from "./styles.modules.scss";

function Scores() {
  const [gameHistory, setGameHistory] = useState([]);

  useEffect(() => {
    const games = getGameHistory();
    setGameHistory(games);
  }, []);

  function getGameHistory() {
    const parsedGameHistory = JSON.parse(localStorage.getItem("gameHistory"));
    return parsedGameHistory;
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
