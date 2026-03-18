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
    if (!isGameOver) {
      setWinnedGame();
    }
  }, [revealedTiles]);

  useEffect(() => {
    if (boardArea === 0) {
      history.push("/");
    }

    startTimer();
    setTotalMines(hiddenMines);

    const filledTiles = getFilledTiles();
    const tilesWithRandomlyPlacedBombs = getTilesWithRandomlyPlacedBombs(
      filledTiles
    );
    const board = setBoardMatriz(tilesWithRandomlyPlacedBombs);
    const boardWithCounts = computeNearBombsCounts(board);

    setTiles(boardWithCounts);
  }, []);

  function getFilledTiles() {
    const filledTiles = [];

    for (let index = 0; index < boardArea; index += 1) {
      filledTiles.push({
        key: index,
        hasBomb: false,
        hasFlag: false,
        nearBombsCount: 0,
      });
    }

    return filledTiles;
  }

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

  function getNeighbors(board, tileKey) {
    const neighbors = [];
    for (let r = 0; r < board.length; r += 1) {
      const col = board[r].findIndex((t) => t.key === tileKey);
      if (col !== -1) {
        for (let dr = -1; dr <= 1; dr += 1) {
          for (let dc = -1; dc <= 1; dc += 1) {
            if (dr === 0 && dc === 0) continue;
            const neighbor = board[r + dr]?.[col + dc];
            if (neighbor) neighbors.push(neighbor);
          }
        }
        break;
      }
    }
    return neighbors;
  }

  function computeNearBombsCounts(board) {
    return board.map((rowArr) =>
      rowArr.map((tile) => {
        if (tile.hasBomb) return tile;
        const neighbors = getNeighbors(board, tile.key);
        const nearBombsCount = neighbors.filter((n) => n.hasBomb).length;
        return { ...tile, nearBombsCount };
      })
    );
  }

  function getTilesWithRandomlyPlacedBombs(filledTiles) {
    const filledTilesCopy = [...filledTiles];

    // Fisher-Yates shuffle for uniform random distribution
    for (let i = filledTilesCopy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [filledTilesCopy[i], filledTilesCopy[j]] = [filledTilesCopy[j], filledTilesCopy[i]];
    }
    const shuffledFilledTiles = filledTilesCopy;

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

    return tilesWithRandomlyPlacedBombs;
  }


  function revealTiles(tile) {
    const newRevealed = [];
    const visited = new Set(revealedTiles);
    const queue = [tile];

    while (queue.length > 0) {
      const current = queue.shift();
      if (visited.has(current.key) || current.hasBomb) {
        continue;
      }
      visited.add(current.key);
      newRevealed.push(current.key);

      if (current.nearBombsCount === 0) {
        const neighbors = getNeighbors(tiles, current.key);
        for (let i = 0; i < neighbors.length; i += 1) {
          if (!visited.has(neighbors[i].key)) {
            queue.push(neighbors[i]);
          }
        }
      }
    }

    setRevealedTiles([...revealedTiles, ...newRevealed]);
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

  //  //////////////////////////////////
  //  //////////////////////////////////
  //  //////// EVENT HANDLERS //////////
  //  //////////////////////////////////
  //  //////////////////////////////////

  function handleRevealTile(tile) {
    if (tile.hasBomb) {
      // Reveal all bombs on game over
      const allBombKeys = tiles.flat()
        .filter((t) => t.hasBomb)
        .map((t) => t.key);
      setRevealedTiles([...revealedTiles, ...allBombKeys]);
    } else if (tile.nearBombsCount === 0) {
      revealTiles(tile);
    } else {
      // Numbered tile — reveal just this tile
      setRevealedTiles([...revealedTiles, tile.key]);
    }
  }

  function hanldeSetFlag(tile) {
    if (!isTileInRevealedTiles(tile)) {
      const tilesCopy = [...tiles];

      const mappedTiles = tilesCopy.map((container) =>
        container.map((currentTile) => {
          if (currentTile.key === tile.key) {
            if (currentTile.hasFlag) {
              setTotalMines(totalMines + 1);
              return {
                ...currentTile,
                hasFlag: false,
              };
            }
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
