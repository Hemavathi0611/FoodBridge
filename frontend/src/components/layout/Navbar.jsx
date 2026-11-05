import { Link, useNavigate } from "react-router-dom";
import { HeartHandshake, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="public-navbar">
      <Link to="/" className="navbar-brand">
        <HeartHandshake size={30} />
        <span>FoodBridge</span>
      </Link>

      <nav className="navbar-links">
        <Link to="/">Home</Link>
        <a href="/#about">About</a>
        <a href="/#how-it-works">How It Works</a>
      </nav>

      <div className="navbar-actions">
        {user ? (
          <>
            <Link to="/dashboard" className="btn btn-primary">
              <LayoutDashboard size={17} />
              Dashboard
            </Link>
            <button onClick={handleLogout} className="btn btn-outline">
              <LogOut size={17} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
