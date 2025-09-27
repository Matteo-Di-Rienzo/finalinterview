import { Link } from "react-router-dom";

function Header() {
  return (
  <div className="header-list">
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/about">About</Link></li>
    </ul>
  </div>
  );
}

export default Header