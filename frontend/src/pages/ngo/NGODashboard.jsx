import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, CheckCircle, Clock, Search, ArrowRight } from "lucide-react";
import donationService from "../../services/donationService";

const NGODashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDonations = async () => {
      try {
        const response = await donationService.getAvailableDonations();
        setDonations(response.donations || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load available donations.");
      } finally {
        setLoading(false);
      }
    };

    loadDonations();
  }, []);

  const stats = [
    { label: "Available Donations", value: donations.length, icon: <Package />, color: "blue" },
    { label: "Food Categories", value: new Set(donations.map((item) => item.foodType)).size, icon: <Search />, color: "purple" },
    { label: "Total Food Quantity", value: donations.reduce((sum, item) => sum + item.quantity, 0), icon: <Clock />, color: "orange" },
    { label: "Ready to Accept", value: donations.length, icon: <CheckCircle />, color: "green" },
  ];

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <span className="eyebrow">NGO WORKSPACE</span>
          <h1>NGO Dashboard</h1>
          <p>Discover surplus food donations available for your community.</p>
        </div>

        <Link to="/ngo/available-donations" className="btn btn-primary">
          <Search size={18} /> Find Donations
        </Link>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="stats-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
            <div>
              <p>{stat.label}</p>
              <h2>{loading ? "..." : stat.value}</h2>
            </div>
          </article>
        ))}
      </div>

      <section className="content-card">
        <div className="content-card-heading">
          <div>
            <h2>Available Food Donations</h2>
            <p>Recently listed food that may help your community.</p>
          </div>
          <Link to="/ngo/available-donations" className="text-link">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <p className="empty-message">Loading available donations...</p>
        ) : donations.length === 0 ? (
          <div className="empty-state">
            <Package size={40} />
            <h3>No available donations</h3>
            <p>New food donations will appear here when they are listed.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Food Name</th>
                  <th>Quantity</th>
                  <th>Donor</th>
                  <th>Pickup Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {donations.slice(0, 5).map((donation) => (
                  <tr key={donation._id}>
                    <td><strong>{donation.foodName}</strong></td>
                    <td>{donation.quantity} {donation.unit}</td>
                    <td>{donation.donor?.name || "Donor"}</td>
                    <td>{new Date(donation.pickupDeadline).toLocaleString()}</td>
                    <td><span className="status-badge available">AVAILABLE</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default NGODashboard;
