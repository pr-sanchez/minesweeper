export default (state, action) => {
  switch (action.type) {
    case "RESET":
      return {
        ...state,
        boardArea: 0,
        row: 0,
        column: 0,
        hiddenMines: 0,
        difficulty: "",
      };
    case "CUSTOM":
      return {
        ...state,
        boardArea: action.payload.boardArea,
        row: action.payload.row,
        column: action.payload.column,
        hiddenMines: action.payload.hiddenMines,
        difficulty: "custom",
      };
    case "EASY":
      return {
        ...state,
        boardArea: 25,
        row: 5,
        column: 5,
        hiddenMines: 3,
        difficulty: "easy",
      };
    case "MEDIUM":
      return {
        ...state,
        boardArea: 36,
        row: 6,
        column: 6,
        hiddenMines: 10,
        difficulty: "medium",
      };
    case "HARD":
      return {
        ...state,
        boardArea: 49,
        row: 7,
        column: 7,
        hiddenMines: 20,
        difficulty: "hard",
      };
    default:
      return state;
  }
};
