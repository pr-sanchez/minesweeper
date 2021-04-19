import classNames from "classnames";
import styles from "./styles.modules.scss";
function Button({ className, onClick, children }) {
  function handleClick() {
    onClick();
  }
  return (
    <button
      onClick={handleClick}
      className={classNames(styles.Button, className)}
    >
      {children}
    </button>
  );
}
export default Button;
