import styles from "./minesweeper.module.scss";

function Tile({ tile, onHandleRevealTile, revealedTiles }) {
  function handleTileClick() {
    return onHandleRevealTile(tile);
  }

  function renderTileMessage() {
    if (revealedTiles.includes(tile.key)) {
      return tile.hasBomb ? "Bomb" : "Safe!";
    }

    return "Check";
  }

  return (
    <td key={tile.key} className={styles.Tile} onClick={handleTileClick}>
      {renderTileMessage()}
    </td>
  );
}

export default Tile;
