import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./styles.modules.scss";

const defaultProps = {
  className: null,
  onClick: () => {},
  title: "",
};

const propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

function Button({ className, onClick, title, children }) {
  function handleClick() {
    onClick();
  }
  return (
    <button
      title={title}
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
