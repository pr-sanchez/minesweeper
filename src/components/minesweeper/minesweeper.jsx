import classNames from "classnames";
import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import MinesweeperContext from "../../context/minesweeperContext";
import Tile from "./Tile";
import Button from "../button";
import styles from "./minesweeper.module.scss";

function Minesweeper() {
  const [tiles, setTiles] = useState([]);
  const [revealedTiles, setRevealedTiles] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [totalMines, setTotalMines] = useState(0);
  const minesweeperContext = useContext(MinesweeperContext);
  const { boardArea, row, column, hiddenMines } = minesweeperContext;
  const history = useHistory();

  ////////////////////////////////////
  ////////////////////////////////////
  //////// PRIVATE FUNCTIONS /////////
  ////////////////////////////////////
  ////////////////////////////////////

  useEffect(() => {
    const flattedTiles = tiles.flat();
    const tilesCount = flattedTiles.length;
    const revealedTilesCount = revealedTiles.length;

    if (tilesCount - revealedTilesCount === hiddenMines) {
      setIsGameWon(true);

      const gameScore = {
        startTime: null,
        endTime: null,
        difficulty: null,
        totalTime: null,
        status: "won",
      };

      const gameHistory = localStorage.getItem("gameHistory");
      const parsedGameHistory = JSON.parse(gameHistory) ?? [];
      parsedGameHistory.push(gameScore);
      localStorage.setItem("gameHistory", parsedGameHistory);
      //save game to localstorage with
      // Start Time. Format: MM-DD-YYYY hh:mm (12hr format)
      // End Time: Format: MM-DD-YYYY hh:mm (12hr format)
      // Difficulty
      // Total time spent
      // Status: Won/Lost
    }
  }, [revealedTiles]);

  useEffect(() => {
    if (boardArea === 0) {
      history.push("/");
    }
    setTotalMines(hiddenMines);
    setRevealedTiles([]);

    let filledTiles = [];

    for (let index = 0; index < boardArea; index++) {
      filledTiles.push({
        key: index,
        data: "some configuration",
        hasBomb: false,
        hasFlag: false,
        nearBombsCount: 0,
      });
    }

    const filledTilesCopy = [...filledTiles];
    const shuffledFilledTiles = filledTilesCopy.sort(() => 0.5 - Math.random());

    const randomPickOurTilesWithBombs = shuffledFilledTiles.slice(
      0,
      hiddenMines
    );

    const tilesWithRandomlyPlacedBombs = filledTiles.map((tile) => {
      const findedTile = randomPickOurTilesWithBombs.find(
        (item) => item.key === tile.key
      );
      if (findedTile != null) {
        return {
          ...findedTile,
          hasBomb: true,
        };
      }
      return tile;
    });

    const board = setBoardMatriz(tilesWithRandomlyPlacedBombs);
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
    let nearBombsCount = 0;
    let coords = [];

    function pushInCoordsAndSumBombCount(tile) {
      if (tile != null) {
        coords.push(tile.key);
        if (tile.hasBomb && !revealedTiles.includes(tile.key)) {
          nearBombsCount++;
        }
      }
    }

    for (let index = 0; index < tiles.length; index++) {
      const row = tiles[index];
      const nextRow = tiles[index + 1];
      const previousRow = tiles[index - 1];
      const tilePosition = row.findIndex((column) => column.key === tile.key);

      if (tilePosition != -1) {
        for (let incremental = 0; incremental < row.length; incremental++) {
          upperLeftDiagonal = previousRow?.[tilePosition - 1];
          aboveTile = previousRow?.[tilePosition];
          upperRightDiagonal = previousRow?.[tilePosition + 1];
          nextPosition = row[tilePosition + 1];
          lowerRightDiagonal = nextRow?.[tilePosition + 1];
          belowTile = nextRow?.[tilePosition];
          lowerLeftDiagonal = nextRow?.[tilePosition - 1];
          previousPosition = row[tilePosition - 1];

          pushInCoordsAndSumBombCount(upperLeftDiagonal);
          pushInCoordsAndSumBombCount(aboveTile);
          pushInCoordsAndSumBombCount(upperRightDiagonal);
          pushInCoordsAndSumBombCount(nextPosition);
          pushInCoordsAndSumBombCount(lowerRightDiagonal);
          pushInCoordsAndSumBombCount(belowTile);
          pushInCoordsAndSumBombCount(lowerLeftDiagonal);
          pushInCoordsAndSumBombCount(previousPosition);

          break;
        }
        break;
      }
    }

    return {
      coords: coords,
      nearBombsCount: nearBombsCount,
    };
  }

  function findTileByKey(array, key) {
    let findedTile;
    for (let index = 0; index < array.length; index++) {
      const row = array[index];
      for (let z = 0; z < row.length; z++) {
        const column = row[z];
        if (column.key === key) {
          findedTile = column;
          break;
        }
      }
    }

    return findedTile;
  }

  function getTilesWithNearBombs(tile) {
    const tilesCopy = [...tiles];
    const coordsAndNearBombsCount = getCoords(tile);
    const { nearBombsCount, coords } = coordsAndNearBombsCount;

    let updateRevealedTiles = [];

    if (!revealedTiles.includes(tile.key) && !tile.hasFlag) {
      updateRevealedTiles.push(tile.key);
    }

    if (nearBombsCount === 0) {
      for (let index = 0; index < coords.length; index++) {
        const column = coords[index];
        const findedTile = findTileByKey(tiles, column);

        if (!revealedTiles.includes(findedTile.key) && !findedTile.hasFlag) {
          updateRevealedTiles.push(column);
        }
      }
      setRevealedTiles([...revealedTiles, ...updateRevealedTiles]);
    }

    const tilesWithNearBombs = tilesCopy.map((row) => {
      return row.map((column) => {
        if (coords.includes(column.key)) {
          return {
            ...column,
            nearBombsCount: nearBombsCount,
          };
        }
        return column;
      });
    });

    return tilesWithNearBombs;
  }
  ////////////////////////////////////
  ////////////////////////////////////
  ////////// EVENT HANDLERS //////////
  ////////////////////////////////////
  ////////////////////////////////////

  function handleRevealTile(tile) {
    if (!tile.hasFlag) {
      if (!revealedTiles.includes(tile.key) && !tile.hasFlag) {
        setRevealedTiles([...revealedTiles, tile.key]);
      }

      const tilesWithNearBombs = getTilesWithNearBombs(tile);

      setTiles(tilesWithNearBombs);
    }
  }

  function hanldeSetFlag(tile) {
    const tilesCopy = [...tiles];

    const mappedTiles = tilesCopy.map((row) => {
      return row.map((column) => {
        if (column.hasFlag && column.key === tile.key) {
          setTotalMines(totalMines + 1);

          return {
            ...column,
            hasFlag: false,
          };
        }

        if (column.key === tile.key) {
          setTotalMines(totalMines - 1);

          return {
            ...column,
            hasFlag: true,
          };
        }

        return column;
      });
    });

    setTiles(mappedTiles);
  }

  function handleSetGameOver() {
    setIsGameOver(true);
  }

  function handleClickRetry() {
    history.push("/");
  }

  function handleClickScores() {
    history.push("/scores");
  }

  ////////////////////////////////////
  ////////////////////////////////////
  //////////// RENDERERS /////////////
  ////////////////////////////////////
  ////////////////////////////////////

  function renderTableRow(tableColumn, index) {
    return (
      <div className={styles.Row} key={index}>
        {tableColumn}
      </div>
    );
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

    return <div className={styles.Board}>{board}</div>;
  }

  function renderRetryAndScoreButtons() {
    return (
      <>
        <Button className={styles.Button} onClick={handleClickRetry}>
          Retry
        </Button>
        <Button className={styles.Button} onClick={handleClickScores}>
          Scores
        </Button>
      </>
    );
  }

  function renderModal(text, className) {
    return (
      <div className={classNames(styles.Modal, className)}>
        <h2 className={styles.Text}>{text}</h2>
        <div className={styles.Buttons}>{renderRetryAndScoreButtons()}</div>
      </div>
    );
  }

  function renderYouWonModal() {
    if (!isGameWon) {
      return null;
    }

    return renderModal("YOU WON!");
  }

  function renderGameOverModal() {
    if (!isGameOver) {
      return null;
    }

    return renderModal("GAME OVER");
  }

  function renderTotalMines() {
    return (
      <div className={styles.TotalMines}>
        <h1>Total Mines: {totalMines}</h1>
      </div>
    );
  }

  return (
    <div>
      {renderGameOverModal()}
      {renderYouWonModal()}

      {renderTotalMines()}
      {renderBoard()}
    </div>
  );
}
export default Minesweeper;
