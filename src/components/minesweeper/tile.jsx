import styles from "./minesweeper.module.scss";

function Tile({ tile, onHandleRevealTile, onHandleSetFlag, revealedTiles }) {
  function handleTileClick() {
    return onHandleRevealTile(tile);
  }

  function handleSetFlag(e) {
    e.preventDefault();
    return onHandleSetFlag(tile);
  }

  function renderTileMessage() {
    if (tile.hasFlag) {
      return "Flag";
    }

    if (revealedTiles.includes(tile.key)) {
      return tile.hasBomb ? "Bomb" : "Safe!";
    }

    return "Check";
  }

  return (
    <td
      key={tile.key}
      className={styles.Tile}
      onClick={handleTileClick}
      onContextMenu={handleSetFlag}
    >
      {renderTileMessage()}
    </td>
  );
}

export default Tile;
