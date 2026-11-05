import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  Package,
  CheckCircle,
  Clock,
  Utensils,
  ArrowRight,
} from "lucide-react";
import donationService from "../../services/donationService";

const DonorDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDonations = async () => {
      try {
        const response = await donationService.getMyDonations();
        setDonations(response.donations || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load your donations."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDonations();
  }, []);

  const total = donations.length;
  const available = donations.filter(
    (item) => item.status === "AVAILABLE"
  ).length;
  const delivered = donations.filter(
    (item) => item.status === "DELIVERED"
  ).length;
  const active = donations.filter((item) =>
    ["ACCEPTED", "PICKUP_ASSIGNED", "PICKED_UP"].includes(item.status)
  ).length;

  const stats = [
    { label: "Total Donations", value: total, icon: <Package />, color: "blue" },
    { label: "Available", value: available, icon: <Clock />, color: "orange" },
    { label: "In Progress", value: active, icon: <Utensils />, color: "purple" },
    { label: "Delivered", value: delivered, icon: <CheckCircle />, color: "green" },
  ];

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <span className="eyebrow">DONOR WORKSPACE</span>
          <h1>Donor Dashboard</h1>
          <p>Manage your food donations and follow their progress.</p>
        </div>

        <Link to="/donor/create-donation" className="btn btn-primary">
          <PlusCircle size={18} /> Create Donation
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
            <h2>Recent Donations</h2>
            <p>Your latest food donation activity.</p>
          </div>
          <Link to="/donor/donations" className="text-link">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <p className="empty-message">Loading donations...</p>
        ) : donations.length === 0 ? (
          <div className="empty-state">
            <Package size={38} />
            <h3>No donations yet</h3>
            <p>Create your first donation to help someone in need.</p>
            <Link to="/donor/create-donation" className="btn btn-primary">
              Create Donation
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Food Item</th>
                  <th>Quantity</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {donations.slice(0, 5).map((donation) => (
                  <tr key={donation._id}>
                    <td>{donation.foodName}</td>
                    <td>{donation.quantity} {donation.unit}</td>
                    <td>{new Date(donation.expiryDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${donation.status.toLowerCase()}`}>
                        {donation.status.replaceAll("_", " ")}
                      </span>
                    </td>
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

export default DonorDashboard;
