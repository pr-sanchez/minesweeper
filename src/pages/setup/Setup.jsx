import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import MinesweeperContext from "../../context/minesweeperContext";
import Button from "../../components/button";
import styles from "./styles.modules.scss";

function Setup() {
  const [row, setRow] = useState(0);
  const [column, setColumn] = useState(0);
  const [hiddenMines, setHiddenMines] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const minesweeperContext = useContext(MinesweeperContext);
  const history = useHistory();

  const [isCustom, setIsCustom] = useState(false);

  //  //////////////////////////////////
  //  //////////////////////////////////
  //  ////// PRIVATE FUNCTIONS /////////
  //  //////////////////////////////////
  //  //////////////////////////////////

  useEffect(() => {
    dispatch("RESET");
  }, []);

  function dispatch(type, payload) {
    minesweeperContext.dispatch({ type, payload });

    if (type !== "RESET") {
      history.push("/board");
    }
  }
  //  //////////////////////////////////
  //  //////////////////////////////////
  //  //////// EVENT HANDLERS //////////
  //  //////////////////////////////////
  //  //////////////////////////////////

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

    if (row === 0 || column === 0 || hiddenMines === 0) {
      setErrorMessage("None of the options could be in blank");
    } else if (boardArea > 1000) {
      setErrorMessage(
        "set board area that is calculated with row * column less than 1000"
      );
    } else {
      const payload = {
        boardArea,
        row: Number(row),
        column: Number(column),
        hiddenMines: Number(hiddenMines),
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

  function handleSetHiddenMines(e) {
    setHiddenMines(e.target.value);
  }

  //  //////////////////////////////////
  //  //////////////////////////////////
  //  ////////// RENDERERS /////////////
  //  //////////////////////////////////
  //  //////////////////////////////////

  function renderCustomSetup() {
    if (!isCustom) {
      return null;
    }

    return (
      <div className={styles.CustomSetupContainer}>
        <h3 className={styles.ErrorMessage}>{errorMessage}</h3>
        <h4> please enter the numbers of rows:</h4>
        <input
          className={styles.Input}
          onChange={handleSetRow}
          value={row}
          type="number"
          min="1"
          max="100"
        />

        <h4> please enter the numbers of columns:</h4>
        <input
          className={styles.Input}
          onChange={handleSetColumn}
          value={column}
          type="number"
          min="1"
          max="100"
        />

        <h4> please enter the number of hidden mines:</h4>
        <input
          className={styles.Input}
          onChange={handleSetHiddenMines}
          value={hiddenMines}
          type="number"
          min="1"
          max={row * column - 2}
        />

        <Button className={styles.Button} onClick={handleSubmitCustomSetup}>
          SUBMIT
        </Button>
      </div>
    );
  }

  function renderLevelButtons() {
    return (
      <div className={styles.ButtonsContainer}>
        <h2> SELECT LEVEL</h2>
        <Button className={styles.Button} onClick={handleSelectEasy}>
          EASY
        </Button>
        <Button className={styles.Button} onClick={handleSelectMedium}>
          MEDIUM
        </Button>
        <Button className={styles.Button} onClick={handleSelectHard}>
          HARD
        </Button>
        <Button className={styles.Button} onClick={handleSetIsCustom}>
          CUSTOM
        </Button>
      </div>
    );
  }

  return (
    <div>
      {renderLevelButtons()}
      {renderCustomSetup()}
    </div>
  );
}
export default Setup;
