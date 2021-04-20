import { Link } from "react-router-dom";
import styles from "./styles.modules.scss";

function Menu() {
  return (
    <div className={styles.Menu}>
      <Link className={styles.Item} to="/">
        Setup
      </Link>

      <Link className={styles.Item} to="/scores">
        Scores
      </Link>
    </div>
  );
}

export default Menu;
