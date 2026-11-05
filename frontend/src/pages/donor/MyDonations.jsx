import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, PlusCircle, Package } from "lucide-react";
import donationService from "../../services/donationService";

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDonations = async () => {
      try {
        const response = await donationService.getMyDonations();
        setDonations(response.donations || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load donations.");
      } finally {
        setLoading(false);
      }
    };

    loadDonations();
  }, []);

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <span className="eyebrow">DONOR WORKSPACE</span>
          <h1>My Donations</h1>
          <p>View and track all the food donations you have submitted.</p>
        </div>

        <div className="heading-actions">
          <Link to="/donor" className="btn btn-outline">
            <ArrowLeft size={17} /> Dashboard
          </Link>
          <Link to="/donor/create-donation" className="btn btn-primary">
            <PlusCircle size={18} /> New Donation
          </Link>
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      <section className="content-card">
        <div className="content-card-heading">
          <div>
            <h2>Donation History</h2>
            <p>{donations.length} donation(s) submitted</p>
          </div>
        </div>

        {loading ? (
          <p className="empty-message">Loading donations...</p>
        ) : donations.length === 0 ? (
          <div className="empty-state">
            <Package size={40} />
            <h3>No donations found</h3>
            <p>Your submitted donations will appear here.</p>
            <Link to="/donor/create-donation" className="btn btn-primary">
              Create Your First Donation
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Food Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Pickup Address</th>
                  <th>Expiry Date</th>
                  <th>Pickup Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation._id}>
                    <td><strong>{donation.foodName}</strong></td>
                    <td>{donation.foodType}</td>
                    <td>{donation.quantity} {donation.unit}</td>
                    <td>{donation.pickupAddress}</td>
                    <td>{new Date(donation.expiryDate).toLocaleString()}</td>
                    <td>{new Date(donation.pickupDeadline).toLocaleString()}</td>
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

export default MyDonations;
