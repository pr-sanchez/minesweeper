import { useState } from "react";

function Setup() {
  const [selectedLevel, setSelectedLevel] = useState("easy");

  function handleSelectLevel(e) {
    setSelectedLevel(e.target.value);
  }

  return (
    <div>
      select difficulty:
      <select value={selectedLevel} onChange={handleSelectLevel}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>
  );
}
export default Setup;
