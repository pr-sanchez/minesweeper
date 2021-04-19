export default (state, action) => {
  switch (action.type) {
    case "RESET":
      return {
        ...state,
        boardArea: 0,
        row: 0,
        column: 0,
        hiddenMines: 0,
      };
    case "CUSTOM":
      return {
        ...state,
        boardArea: action.payload.boardArea,
        row: action.payload.row,
        column: action.payload.column,
        hiddenMines: action.payload.hiddenMines,
      };
    case "EASY":
      return {
        ...state,
        boardArea: 25,
        row: 5,
        column: 5,
        hiddenMines: 3,
      };
    case "MEDIUM":
      return {
        ...state,
        boardArea: 36,
        row: 6,
        column: 6,
        hiddenMines: 10,
      };
    case "HARD":
      return {
        ...state,
        boardArea: 49,
        row: 7,
        column: 7,
        hiddenMines: 20,
      };
    default:
      return state;
  }
};
