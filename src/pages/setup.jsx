import { useContext, useEffect, useState } from "react";
import MinesweeperContext from "../context/minesweeperContext";
import { useHistory } from "react-router-dom";

function Setup() {
  const [row, setRow] = useState(0);
  const [column, setColumn] = useState(0);
  const minesweeperContext = useContext(MinesweeperContext);
  const history = useHistory();

  const [isCustom, setIsCustom] = useState(false);

  ////////////////////////////////////
  ////////////////////////////////////
  //////// PRIVATE FUNCTIONS /////////
  ////////////////////////////////////
  ////////////////////////////////////

  useEffect(() => {
    dispatch("RESET");
  }, []);

  function dispatch(type, payload) {
    minesweeperContext.dispatch({ type, payload });

    if (type !== "RESET") {
      history.push("/board");
    }
  }
  ////////////////////////////////////
  ////////////////////////////////////
  ////////// EVENT HANDLERS //////////
  ////////////////////////////////////
  ////////////////////////////////////

  function handleSelectEasy() {
    dispatch("EASY");
  }
  function handleSelectMedium() {
    dispatch("MEDIUM");
  }
  function handleSelectHard() {
    dispatch("HARD");
  }

  function handleSubmitCustomSetup() {
    const boardArea = row * column;
    if (boardArea > 1000) {
      console.log(
        "set board area that is calculated with row * column less than 1000"
      );
    } else {
      const payload = {
        boardArea: boardArea,
        row: parseInt(row),
        column: parseInt(column),
      };

      dispatch("CUSTOM", payload);
    }
  }

  function handleSetRow(e) {
    setRow(e.target.value);
  }
  function handleSetColumn(e) {
    setColumn(e.target.value);
  }

  function handleSetIsCustom() {
    setIsCustom(true);
  }

  ////////////////////////////////////
  ////////////////////////////////////
  //////////// RENDERERS /////////////
  ////////////////////////////////////
  ////////////////////////////////////

  function renderCustomSetup() {
    if (!isCustom) {
      return null;
    }

    return (
      <>
        please enter the numbers of rows:{" "}
        <input
          onChange={handleSetRow}
          value={row}
          type="number"
          min="1"
          max="100"
        />
        please enter the numbers of columns:{" "}
        <input
          onChange={handleSetColumn}
          value={column}
          type="number"
          min="1"
          max="100"
        />
        <button onClick={handleSubmitCustomSetup}>SUBMIT</button>
      </>
    );
  }

  return (
    <div>
      select difficulty:
      <button onClick={handleSelectEasy}>EASY</button>
      <button onClick={handleSelectMedium}>MEDIUM</button>
      <button onClick={handleSelectHard}>HARD</button>
      <button onClick={handleSetIsCustom}>CUSTOM</button>
      {renderCustomSetup()}
    </div>
  );
}
export default Setup;
