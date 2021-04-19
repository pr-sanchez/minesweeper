import styles from "./minesweeper.module.scss";

function Tile({ tile, onRevealTile, onSetFlag, onSetGameOver, revealedTiles }) {
  function handleTileClick() {
    onRevealTile(tile);
    if (tile.hasBomb) {
      onSetGameOver(true);
    }
  }

  function handleSetFlag(e) {
    e.preventDefault();
    onSetFlag(tile);
  }

  function renderTileMessage() {
    if (revealedTiles.includes(tile.key)) {
      if (tile.hasFlag) {
        return "Flag";
      }
      return tile.hasBomb ? "💣" : "";
    }

    if (tile.nearBombsCount > 0) {
      return tile.nearBombsCount;
    }

    return "[ ]";
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
