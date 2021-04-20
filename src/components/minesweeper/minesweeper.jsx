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
  const [timer, setTimer] = useState([]);
  const minesweeperContext = useContext(MinesweeperContext);
  const {
    boardArea,
    row,
    column,
    hiddenMines,
    difficulty,
  } = minesweeperContext;
  const history = useHistory();

  // //////////////////////////////////
  // //////////////////////////////////
  // ////// PRIVATE FUNCTIONS /////////
  // //////////////////////////////////
  // //////////////////////////////////

  useEffect(() => {
    if (isGameOver || isGameWon) {
      saveGame();
    }
  }, [isGameOver, isGameWon]);

  useEffect(() => {
    setWinnedGame();
  }, [revealedTiles]);

  useEffect(() => {
    if (boardArea === 0) {
      history.push("/");
    }

    startTimer();
    setTotalMines(hiddenMines);
    setRevealedTiles([]);

    const filledTiles = [];

    for (let index = 0; index < boardArea; index += 1) {
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
    const tableRowList = [];
    let tableColumns = [];
    let tilesCount = 0;

    for (let index = 0; index < row; index += 1) {
      for (let iterator = 0; iterator < column; iterator += 1) {
        const tile = tilesCopy[tilesCount];
        tableColumns = [...tableColumns, tile];
        tilesCount += 1;
      }
      tableRowList.push(tableColumns);
      tableColumns = [];
    }

    return tableRowList;
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
    const coords = [];

    function pushInCoordsAndSumBombCount(coord) {
      if (coord != null) {
        coords.push(coord.key);
        if (coord.hasBomb && !isTileInRevealedTiles(coord)) {
          nearBombsCount += 1;
        }
      }
    }

    for (let index = 0; index < tiles.length; index += 1) {
      const tilesContainer = tiles[index];
      const nextRow = tiles[index + 1];
      const previousRow = tiles[index - 1];
      const tilePosition = tilesContainer.findIndex(
        (item) => item.key === tile.key
      );

      if (tilePosition !== -1) {
        for (
          let incremental = 0;
          incremental < tilesContainer.length;
          incremental += 1
        ) {
          upperLeftDiagonal = previousRow?.[tilePosition - 1];
          aboveTile = previousRow?.[tilePosition];
          upperRightDiagonal = previousRow?.[tilePosition + 1];
          nextPosition = tilesContainer[tilePosition + 1];
          lowerRightDiagonal = nextRow?.[tilePosition + 1];
          belowTile = nextRow?.[tilePosition];
          lowerLeftDiagonal = nextRow?.[tilePosition - 1];
          previousPosition = tilesContainer[tilePosition - 1];

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
      coords,
      nearBombsCount,
    };
  }

  function findTileByKey(array, key) {
    let findedTile;
    for (let index = 0; index < array.length; index += 1) {
      const container = array[index];
      for (let z = 0; z < container.length; z += 1) {
        const currentTile = container[z];
        if (currentTile.key === key) {
          findedTile = currentTile;
          break;
        }
      }
    }

    return findedTile;
  }

  function revealTiles(tile) {
    const coordsAndNearBombsCount = getCoords(tile);
    const { nearBombsCount, coords } = coordsAndNearBombsCount;

    const updateRevealedTiles = [];

    if (!isTileInRevealedTiles(tile) && !tile.hasFlag) {
      updateRevealedTiles.push(tile.key);
    }

    if (nearBombsCount === 0) {
      for (let index = 0; index < coords.length; index += 1) {
        const revealedTile = coords[index];
        const findedTile = findTileByKey(tiles, revealedTile);

        if (!isTileInRevealedTiles(findedTile) && !findedTile.hasFlag) {
          updateRevealedTiles.push(revealedTile);
        }
      }
    }

    setRevealedTiles([...revealedTiles, ...updateRevealedTiles]);
  }

  function getTileWithNearBombs(tile) {
    const tilesCopy = [...tiles];
    const coordsAndNearBombsCount = getCoords(tile);
    const { nearBombsCount } = coordsAndNearBombsCount;

    const tileWithNearBombs = tilesCopy.map((container) =>
      container.map((currentTile) => {
        if (currentTile.key === tile.key) {
          return {
            ...currentTile,
            nearBombsCount,
          };
        }
        return currentTile;
      })
    );

    return tileWithNearBombs;
  }

  function formatDate(date) {
    const formattedDate = date.toLocaleString("en-US", { hour12: true }); // safari it's not a good browser and fails reading date with the "-" so i let this with / instead -
    return formattedDate;
  }

  function getTimeSpent(start, stop) {
    const timeSpent = (stop - start) / 1000;
    return timeSpent;
  }

  function saveGame() {
    const id = Date.now();
    const startTime = formatDate(timer[0]);
    const endTime = formatDate(timer[1]);
    const timeSpent = `${getTimeSpent(timer[0], timer[1])} seconds`;
    const status = isGameOver ? "Lost" : "Won";

    const gameScore = {
      id,
      startTime,
      endTime,
      difficulty,
      timeSpent,
      status,
    };

    const gameHistory = localStorage.getItem("gameHistory");
    const parsedGameHistory = JSON.parse(gameHistory) ?? [];
    parsedGameHistory.push(gameScore);
    const stringifiedGameHistory = JSON.stringify(parsedGameHistory);
    localStorage.setItem("gameHistory", stringifiedGameHistory);
  }

  function setWinnedGame() {
    const flattedTiles = tiles.flat();
    const tilesCount = flattedTiles.length;
    const revealedTilesCount = revealedTiles.length;

    if (tilesCount - revealedTilesCount === hiddenMines) {
      stopTimer();
      setIsGameWon(true);
    }
  }

  function isTileInRevealedTiles(tile) {
    return revealedTiles.includes(tile.key);
  }

  function startTimer() {
    const start = new Date();
    setTimer([...timer, start]);
  }

  function stopTimer() {
    const stop = new Date();
    setTimer([...timer, stop]);
  }

  console.log(timer);

  //  //////////////////////////////////
  //  //////////////////////////////////
  //  //////// EVENT HANDLERS //////////
  //  //////////////////////////////////
  //  //////////////////////////////////

  function handleRevealTile(tile) {
    if (!tile.hasFlag) {
      if (!isTileInRevealedTiles(tile) && !tile.hasFlag) {
        setRevealedTiles([...revealedTiles, tile.key]);
      }

      if (!tile.hasBomb) {
        revealTiles(tile);
        const tilesWithNearBombs = getTileWithNearBombs(tile);
        setTiles(tilesWithNearBombs);
      }
    }
  }

  function hanldeSetFlag(tile) {
    if (!isTileInRevealedTiles(tile)) {
      const tilesCopy = [...tiles];

      const mappedTiles = tilesCopy.map((container) =>
        container.map((currentTile) => {
          if (currentTile.hasFlag && currentTile.key === tile.key) {
            setTotalMines(totalMines + 1);

            return {
              ...currentTile,
              hasFlag: false,
            };
          }

          if (currentTile.key === tile.key) {
            setTotalMines(totalMines - 1);

            return {
              ...currentTile,
              hasFlag: true,
            };
          }

          return currentTile;
        })
      );

      setTiles(mappedTiles);
    }
  }

  function handleSetGameOver() {
    setIsGameOver(true);
    stopTimer();
  }

  function handleClickRetry() {
    history.push("/");
  }

  function handleClickScores() {
    history.push("/scores");
  }

  //  //////////////////////////////////
  //  //////////////////////////////////
  //  ////////// RENDERERS /////////////
  //  //////////////////////////////////
  //  //////////////////////////////////

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
    if (tiles.length > 0 === false) {
      return null;
    }

    const board = tiles.map((container, iterator) => {
      const renderedRow = container.map((currentTile) =>
        renderTableColumn(currentTile)
      );
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
