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
        boardArea: 81,
        row: 9,
        column: 9,
        hiddenMines: 10,
        difficulty: "easy",
      };
    case "MEDIUM":
      return {
        ...state,
        boardArea: 256,
        row: 16,
        column: 16,
        hiddenMines: 40,
        difficulty: "medium",
      };
    case "HARD":
      return {
        ...state,
        boardArea: 480,
        row: 16,
        column: 30,
        hiddenMines: 99,
        difficulty: "hard",
      };
    default:
      return state;
  }
};
