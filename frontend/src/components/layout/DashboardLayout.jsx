import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { HeartHandshake, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navigation = {
    ADMIN: [
      { label: "Dashboard", path: "/admin" },
      { label: "User Management", path: "/admin/users" },
      { label: "NGO Approval", path: "/admin/ngos" },
      { label: "Volunteer Management", path: "/admin/volunteers" },
      { label: "Reports", path: "/admin/reports" },
    ],
    DONOR: [
      { label: "Dashboard", path: "/donor" },
      { label: "Create Donation", path: "/donor/donations/new" },
      { label: "My Donations", path: "/donor/donations" },
    ],
    NGO: [
      { label: "Dashboard", path: "/ngo" },
      { label: "Available Donations", path: "/ngo/donations" },
      { label: "Manage Pickups", path: "/ngo/pickups" },
    ],
    VOLUNTEER: [
      { label: "Dashboard", path: "/volunteer" },
      { label: "My Pickups", path: "/volunteer/pickups" },
    ],
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <HeartHandshake size={30} />
          <span>FoodBridge</span>
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-label">WORKSPACE</p>

          <NavLink to="/" end>Home</NavLink>

          {(navigation[user?.role] || []).map((item) => (
            <NavLink key={item.path} to={item.path}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>Connecting food with those in need.</p>
          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>FoodBridge Dashboard</h2>
          <span>{user?.name || user?.role}</span>
        </header>

        <section className="dashboard-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;
