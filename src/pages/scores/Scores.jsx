import { useEffect } from "react";

function Scores() {
  useEffect(() => {
    console.log(getGameHistory());
  }, []);

  function getGameHistory() {
    const parsedGameHistory = JSON.parse(localStorage.getItem("gameHistory"));
    return parsedGameHistory;
  }

  function clearScores() {
    localStorage.removeItem("gameHistory");
  }

  return "scores";
}
export default Scores;
// Start Time. Format: MM-DD-YYYY hh:mm (12hr format)
// End Time: Format: MM-DD-YYYY hh:mm (12hr format)
// Difficulty
// Total time spent
// Status: Won/Lost
