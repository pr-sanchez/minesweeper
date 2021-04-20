import PropTypes from "prop-types";
import styles from "./minesweeper.module.scss";

const propTypes = {
  tile: PropTypes.shape({
    hasBomb: PropTypes.bool,
    key: PropTypes.number,
    nearBombsCount: PropTypes.number,
    hasFlag: PropTypes.bool,
  }).isRequired,
  revealedTiles: PropTypes.arrayOf(PropTypes.number).isRequired,
  onRevealTile: PropTypes.func.isRequired,
  onSetFlag: PropTypes.func.isRequired,
  onSetGameOver: PropTypes.func.isRequired,
};

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

      if (tile.nearBombsCount > 0) {
        return tile.nearBombsCount;
      }

      return "✅";
    }

    if (tile.hasFlag) {
      return "🚩";
    }

    return null;
  }

  return (
    <button
      type="button"
      key={tile.key}
      className={styles.Tile}
      onClick={handleTileClick}
      onContextMenu={handleSetFlag}
      onKeyPress={handleTileClick}
    >
      {renderTileMessage()}
    </button>
  );
}

Tile.propTypes = propTypes;
export default Tile;
