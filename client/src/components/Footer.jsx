import { Link } from "react-router-dom";

function Footer() {
  return (
  <div className="footer-list">
    <ul>
      <li><Link to="/about">About</Link></li>
    </ul>
  </div>
  );
}

export default Footer