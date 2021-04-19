import React, { useReducer } from "react";
import MinesweeperContext from "./minesweeperContext";
import minesweeperReducer from "./minesweeperReducer";

const MinesweeperProvider = (props) => {
  const initialState = {
    boardArea: 0,
    row: 0,
    column: 0,
    hiddenMines: 0,
  };

  const [state, dispatch] = useReducer(minesweeperReducer, initialState);

  return (
    <MinesweeperContext.Provider
      value={{
        boardArea: state.boardArea,
        row: state.row,
        column: state.column,
        hiddenMines: state.hiddenMines,
        dispatch: dispatch,
      }}
    >
      {props.children}
    </MinesweeperContext.Provider>
  );
};

export default MinesweeperProvider;
