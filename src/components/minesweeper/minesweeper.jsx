import { useEffect, useLayoutEffect, useState } from "react";
import { randomBoolean } from "../../utils";
import styles from "./minesweeper.module.scss";
import Tile from "./tile";

function test() {
  const [row, setRow] = useState(0);
  const [column, setColumn] = useState(0);
  const [tiles, setTiles] = useState([]);
  const [revealedTiles, setRevealedTiles] = useState([]);

  ////////////////////////////////////
  ////////////////////////////////////
  //////// PRIVATE FUNCTIONS /////////
  ////////////////////////////////////
  ////////////////////////////////////

  useLayoutEffect(() => {
    const calculatedArea = row * column;
    let filledTiles = [];

    for (let index = 0; index < calculatedArea; index++) {
      filledTiles.push({
        key: index,
        data: "some configuration",
        hasBomb: randomBoolean(),
        hasFlag: false,
      });
    }

    setRevealedTiles([]);
    setTiles(filledTiles);
  }, [row, column]);

  ////////////////////////////////////
  ////////////////////////////////////
  ////////// EVENT HANDLERS //////////
  ////////////////////////////////////
  ////////////////////////////////////

  function handleSetRow(e) {
    setRow(e.target.value);
  }
  function handleSetColumn(e) {
    setColumn(e.target.value);
  }

  function handleRevealTile(tile) {
    if (!revealedTiles.includes(tile.key) && !tile.hasFlag) {
      setRevealedTiles([...revealedTiles, tile.key]);
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

  ////////////////////////////////////
  ////////////////////////////////////
  //////////// RENDERERS /////////////
  ////////////////////////////////////
  ////////////////////////////////////

  function renderTableRow(tableColumn, index) {
    return <tr key={index}>{tableColumn}</tr>;
  }

  function renderTableColumn(tile) {
    //thinking logic for uncover near safe area

    console.log(tiles.length % row);

    return (
      <Tile
        key={tile.key}
        tile={tile}
        onHandleRevealTile={handleRevealTile}
        onHandleSetFlag={hanldeSetFlag}
        revealedTiles={revealedTiles}
      />
    );
  }

  function renderBoard() {
    if (tiles.length > 0 == false) {
      return null;
    }

    if (tiles.length !== row * column) {
      return null;
    }

    const tilesCopy = [...tiles];
    let tableRowList = [];
    let tableColumns = [];
    let tilesCount = 0;

    for (let index = 0; index < row; index++) {
      for (let iterator = 0; iterator < column; iterator++) {
        const tile = tilesCopy[tilesCount];
        tableColumns = [...tableColumns, renderTableColumn(tile)];
        tilesCount++;
      }
      tableRowList.push(renderTableRow(tableColumns, index));
      tableColumns = [];
    }

    return (
      <table>
        <tbody>{tableRowList}</tbody>
      </table>
    );
  }

  return (
    <div>
      please enter the numbers of rows:{" "}
      <input onChange={handleSetRow} value={row} />
      please enter the numbers of columns:{" "}
      <input onChange={handleSetColumn} value={column} />
      <div className={styles.Board}>{renderBoard()}</div>
    </div>
  );
}
export default test;
