import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import MinesweeperContext from "../../context/minesweeperContext";
import { randomBoolean } from "../../utils";
import Tile from "./Tile";

import styles from "./minesweeper.module.scss";

function Minesweeper() {
  const [tiles, setTiles] = useState([]);
  const [revealedTiles, setRevealedTiles] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const minesweeperContext = useContext(MinesweeperContext);
  const { boardArea, row, column } = minesweeperContext;
  const history = useHistory();

  ////////////////////////////////////
  ////////////////////////////////////
  //////// PRIVATE FUNCTIONS /////////
  ////////////////////////////////////
  ////////////////////////////////////

  useEffect(() => {
    if (boardArea === 0) {
      history.push("/");
    }

    setRevealedTiles([]);
    let filledTiles = [];

    for (let index = 0; index < boardArea; index++) {
      filledTiles.push({
        key: index,
        data: "some configuration",
        hasBomb: randomBoolean(),
        hasFlag: false,
        nearBombsCount: 0,
      });
    }

    const board = setBoardMatriz(filledTiles);
    setTiles(board);
  }, []);

  function setBoardMatriz(filledTiles) {
    const tilesCopy = [...filledTiles];
    let tableRowList = [];
    let tableColumns = [];
    let tilesCount = 0;

    for (let index = 0; index < row; index++) {
      for (let iterator = 0; iterator < column; iterator++) {
        const tile = tilesCopy[tilesCount];
        tableColumns = [...tableColumns, tile];
        tilesCount++;
      }
      tableRowList.push(tableColumns);
      tableColumns = [];
    }

    if (tableRowList.length > 0) {
      return tableRowList;
    }
  }

  function getCoords(tile) {
    let nextPosition;
    let previousPosition;
    let upperRightDiagonal;
    let upperLeftDiagonal;
    let lowerRightDiagonal;
    let lowerLeftDiagonal;
    let aboveTile;
    let belowTile;

    for (let index = 0; index < tiles.length; index++) {
      const row = tiles[index];
      const nextRow = tiles[index + 1];
      const previousRow = tiles[index - 1];
      const tilePosition = row.findIndex((column) => column.key === tile.key);

      if (tilePosition != -1) {
        for (let incremental = 0; incremental < row.length; incremental++) {
          nextPosition = row[tilePosition + 1];
          previousPosition = row[tilePosition - 1];
          upperRightDiagonal = previousRow?.[tilePosition + 1];
          upperLeftDiagonal = previousRow?.[tilePosition - 1];
          lowerRightDiagonal = nextRow?.[tilePosition + 1];
          lowerLeftDiagonal = nextRow?.[tilePosition - 1];
          aboveTile = previousRow?.[tilePosition];
          belowTile = nextRow?.[tilePosition];

          break;
        }
        break;
      }
    }

    const coords = [];

    if (aboveTile != null) {
      coords.push(aboveTile.key);
    }

    if (belowTile != null) {
      coords.push(belowTile.key);
    }
    if (upperRightDiagonal != null) {
      coords.push(upperRightDiagonal.key);
    }
    if (upperLeftDiagonal != null) {
      coords.push(upperLeftDiagonal.key);
    }
    if (lowerRightDiagonal != null) {
      coords.push(lowerRightDiagonal.key);
    }
    if (lowerLeftDiagonal != null) {
      coords.push(lowerLeftDiagonal.key);
    }

    if (nextPosition != null) {
      coords.push(nextPosition.key);
    }

    if (previousPosition != null) {
      coords.push(previousPosition.key);
    }

    return coords;
  }

  ////////////////////////////////////
  ////////////////////////////////////
  ////////// EVENT HANDLERS //////////
  ////////////////////////////////////
  ////////////////////////////////////

  function handleRevealTile(tile) {
    // if (!isGameOver) {
    if (!revealedTiles.includes(tile.key) && !tile.hasFlag) {
      setRevealedTiles([...revealedTiles, tile.key]);

      const coords = getCoords(tile);
      let nearBombsCount = 0;

      const tilesWithNearBombs = tiles.map((row) => {
        return row.map((column) => {
          nearBombsCount = 0;
          if (coords.includes(column.key)) {
            if (column.hasBomb) {
              nearBombsCount++;
            }
            return {
              ...column,
              nearBombsCount,
            };
          }

          return column;
        });
      });
      setTiles(tilesWithNearBombs);
    }
  }

  function hanldeSetFlag(tile) {
    const tilesCopy = [...tiles];

    const mappedTiles = tilesCopy.map((tileItem) => {
      if (tileItem.hasFlag) {
        return {
          ...tileItem,
          hasFlag: false,
        };
      }

      if (tileItem.key === tile.key) {
        return {
          ...tileItem,
          hasFlag: true,
        };
      }
      return tileItem;
    });

    setTiles(mappedTiles);
  }

  function handleSetGameOver() {
    setIsGameOver(true);
  }

  ////////////////////////////////////
  ////////////////////////////////////
  //////////// RENDERERS /////////////
  ////////////////////////////////////
  ////////////////////////////////////

  function renderTableRow(tableColumn, index) {
    return <tr key={index}>{tableColumn}</tr>;
  }

  function renderTableColumn(tile) {
    return (
      <Tile
        key={tile.key}
        tile={tile}
        onRevealTile={handleRevealTile}
        onSetFlag={hanldeSetFlag}
        onSetGameOver={handleSetGameOver}
        revealedTiles={revealedTiles}
      />
    );
  }

  function renderBoard() {
    if (tiles.length > 0 == false) {
      return null;
    }

    const board = tiles.map((row, iterator) => {
      const renderedRow = row.map((column) => renderTableColumn(column));
      return renderTableRow(renderedRow, iterator);
    });

    return (
      <table>
        <tbody>{board}</tbody>
      </table>
    );
  }

  function renderGameOver() {
    if (!isGameOver) {
      return null;
    }
    return <div>Game Over!</div>;
  }

  return (
    <div disabled={isGameOver ? true : false}>
      {renderGameOver()}
      <div className={styles.Board}>{renderBoard()}</div>
    </div>
  );
}
export default Minesweeper;
