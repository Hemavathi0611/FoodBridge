import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartHandshake, Mail, Lock, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(formData);
      const role = response.user.role;

      const dashboards = {
        ADMIN: "/admin",
        DONOR: "/donor",
        NGO: "/ngo",
        VOLUNTEER: "/volunteer",
      };

      navigate(dashboards[role] || "/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <HeartHandshake size={35} />
          <span>FoodBridge</span>
        </Link>

        <div className="auth-heading">
          <h1>Welcome Back</h1>
          <p>Sign in to continue making a difference.</p>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="email">Email Address</label>
          <div className="input-wrapper">
            <Mail size={19} />
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <Lock size={19} />
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            <LogIn size={18} />
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create Account</Link>
        </p>

        <Link to="/" className="back-home">Back to Home</Link>
      </div>
    </div>
  );
};

export default Login;
