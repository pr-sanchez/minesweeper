import { Link } from "react-router-dom";
import styles from "./styles.modules.scss";

function Menu() {
  return (
    <div className={styles.Menu}>
      <div className={styles.ItemsContainer}>
        <Link className={styles.Item} to="/">
          Setup
        </Link>

        <Link className={styles.Item} to="/scores">
          Scores
        </Link>
      </div>

      <div className={styles.GithuLink}>
        <a
          target="_blank"
          href="https://github.com/pr-sanchez/minesweeper"
          rel="noreferrer"
        >
          Github
        </a>
      </div>
    </div>
  );
}

export default Menu;
