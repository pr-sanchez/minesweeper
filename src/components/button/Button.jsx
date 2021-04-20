import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./styles.modules.scss";

const defaultProps = {
  className: null,
  onClick: () => {},
};

const propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

function Button({ className, onClick, children }) {
  function handleClick() {
    onClick();
  }
  return (
    <button
      type="button"
      onClick={handleClick}
      className={classNames(styles.Button, className)}
    >
      {children}
    </button>
  );
}
Button.propTypes = propTypes;
Button.defaultProps = defaultProps;
export default Button;
