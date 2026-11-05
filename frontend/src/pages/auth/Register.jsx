import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartHandshake, User, Mail, Lock, Phone, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "DONOR",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await register(formData);
      navigate(
        response.user.role === "DONOR" ? "/donor" : "/complete-profile"
      );
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <Link to="/" className="auth-brand">
          <HeartHandshake size={35} />
          <span>FoodBridge</span>
        </Link>

        <div className="auth-heading">
          <h1>Create Account</h1>
          <p>Join our mission to reduce food waste and fight hunger.</p>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="name">Full Name</label>
          <div className="input-wrapper">
            <User size={19} />
            <input id="name" name="name" placeholder="Full name"
              value={formData.name} onChange={handleChange} required />
          </div>

          <label htmlFor="register-email">Email Address</label>
          <div className="input-wrapper">
            <Mail size={19} />
            <input id="register-email" type="email" name="email"
              placeholder="Email address" value={formData.email}
              onChange={handleChange} required />
          </div>

          <label htmlFor="phone">Phone Number</label>
          <div className="input-wrapper">
            <Phone size={19} />
            <input id="phone" type="tel" name="phone"
              placeholder="Phone number" value={formData.phone}
              onChange={handleChange} required />
          </div>

          <label htmlFor="register-password">Password</label>
          <div className="input-wrapper">
            <Lock size={19} />
            <input id="register-password" type="password" name="password"
              placeholder="Minimum 8 characters" minLength={8}
              value={formData.password} onChange={handleChange} required />
          </div>

          <label htmlFor="role">Register As</label>
          <select id="role" name="role" value={formData.role}
            onChange={handleChange} required>
            <option value="DONOR">Food Donor</option>
            <option value="NGO">NGO Organization</option>
            <option value="VOLUNTEER">Volunteer</option>
          </select>

          <button type="submit" className="btn btn-primary auth-submit"
            disabled={loading}>
            <UserPlus size={18} />
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>

        <Link to="/" className="back-home">Back to Home</Link>
      </div>
    </div>
  );
};

export default Register;
