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
      if (tile.hasBomb) {
        return "💣";
      }

      return "✅";
    }

    if (tile.nearBombsCount > 0) {
      return tile.nearBombsCount;
    }

    if (tile.hasFlag) {
      return "🚩";
    }

    return null;
  }

  return (
    <div
      key={tile.key}
      className={styles.Tile}
      onClick={handleTileClick}
      onContextMenu={handleSetFlag}
    >
      {renderTileMessage()}
    </div>
  );
}

export default Tile;
