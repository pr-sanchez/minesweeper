export default (state, action) => {
  switch (action.type) {
    case "RESET":
      return {
        ...state,
        boardArea: 0,
        row: 0,
        column: 0,
      };
    case "CUSTOM":
      return {
        ...state,
        boardArea: action.payload.boardArea,
        row: action.payload.row,
        column: action.payload.column,
      };
    case "EASY":
      return {
        ...state,
        boardArea: 25,
        row: 5,
        column: 5,
      };
    case "MEDIUM":
      return {
        ...state,
        boardArea: 36,
        row: 6,
        column: 6,
      };
    case "HARD":
      return {
        ...state,
        boardArea: 49,
        row: 7,
        column: 7,
      };
    default:
      return state;
  }
};
