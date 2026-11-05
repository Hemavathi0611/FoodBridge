import { useEffect, useState } from "react";
import {
  Users,
  Heart,
  Building2,
  Truck,
  Clock,
  CheckCircle,
  Utensils,
  RefreshCw,
} from "lucide-react";
import adminService from "../../services/adminService";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminService.getDashboardStats();
      setStats(response.stats);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "blue",
    },
    {
      title: "Total Donors",
      value: stats?.totalDonors ?? 0,
      icon: Heart,
      color: "green",
    },
    {
      title: "Registered NGOs",
      value: stats?.totalNGOs ?? 0,
      icon: Building2,
      color: "purple",
    },
    {
      title: "Volunteers",
      value: stats?.totalVolunteers ?? 0,
      icon: Truck,
      color: "orange",
    },
    {
      title: "Pending NGOs",
      value: stats?.pendingNGOs ?? 0,
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Total Donations",
      value: stats?.totalDonations ?? 0,
      icon: Utensils,
      color: "blue",
    },
    {
      title: "Available Donations",
      value: stats?.availableDonations ?? 0,
      icon: Heart,
      color: "green",
    },
    {
      title: "Delivered Donations",
      value: stats?.deliveredDonations ?? 0,
      icon: CheckCircle,
      color: "purple",
    },
  ];

  if (loading) {
    return <div className="dashboard-content">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="dashboard-content">
        <p>{error}</p>
        <button onClick={loadDashboard}>
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="dashboard-page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Monitor and manage the FoodBridge platform.</p>
        </div>

        <button className="refresh-button" onClick={loadDashboard}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="admin-stats-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div className="admin-stat-card" key={card.title}>
              <div className={`admin-stat-icon ${card.color}`}>
                <Icon size={23} />
              </div>

              <div>
                <p>{card.title}</p>
                <h2>{card.value}</h2>
              </div>
            </div>
          );
        })}
      </div>

      <div className="redistribution-card">
        <div className="redistribution-icon">
          <Utensils size={28} />
        </div>

        <div>
          <p>Total Food Redistributed</p>
          <h2>{stats?.totalFoodRedistributed ?? 0} kg</h2>
          <span>Food successfully delivered through FoodBridge</span>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
