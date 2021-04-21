import { render, cleanup, fireEvent } from "@testing-library/react";
import Setup from "../src/pages/setup";

import MinesweeperProvider from "../src/context/MinesweeperProvider";
import minesweeperContext from "../src/context/minesweeperContext";

function renderWithContext(component) {
  return {
    ...render(
      <MinesweeperProvider value={minesweeperContext}>
        {component}
      </MinesweeperProvider>
    ),
  };
}

afterEach(cleanup);

it("renders the custom setup", () => {
  const { queryByTitle } = renderWithContext(<Setup />);
  fireEvent.click(queryByTitle("customSetupButton"));
  expect(queryByTitle("customSetupForm")).toBeTruthy();
});

describe("fill the board fields", () => {
  it("onChange", () => {
    const { queryByTitle } = renderWithContext(<Setup />);
    fireEvent.click(queryByTitle("customSetupButton"));

    const boardRow = queryByTitle("boardRow");
    const boardColumn = queryByTitle("boardColumn");
    const boardHiddenMines = queryByTitle("boardHiddenMines");

    fireEvent.change(boardRow, { target: { value: 5 } });
    expect(boardRow.value).toBe("5");
    fireEvent.change(boardColumn, { target: { value: 5 } });
    expect(boardColumn.value).toBe("5");
    fireEvent.change(boardHiddenMines, { target: { value: 3 } });
    expect(boardHiddenMines.value).toBe("3");
  });
});
