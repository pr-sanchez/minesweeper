import { useReducer } from "react";
import PropTypes from "prop-types";
import MinesweeperContext from "./minesweeperContext";
import minesweeperReducer from "./minesweeperReducer";

const propTypes = {
  children: PropTypes.node.isRequired,
};

const MinesweeperProvider = (props) => {
  const initialState = {
    boardArea: 0,
    row: 0,
    column: 0,
    hiddenMines: 0,
    difficulty: "",
  };

  const [state, dispatch] = useReducer(minesweeperReducer, initialState);
  const { children } = props;

  return (
    <MinesweeperContext.Provider
      value={{
        boardArea: state.boardArea,
        row: state.row,
        column: state.column,
        hiddenMines: state.hiddenMines,
        difficulty: state.difficulty,
        dispatch,
      }}
    >
      {children}
    </MinesweeperContext.Provider>
  );
};

MinesweeperProvider.propTypes = propTypes;
export default MinesweeperProvider;
