import { Link } from "react-router-dom";

function Menu() {
  return (
    <>
      <Link to="/">Setup</Link>
      <Link to="/board">Board</Link>
      <Link to="/scores">Scores</Link>
    </>
  );
}

export default Menu;
