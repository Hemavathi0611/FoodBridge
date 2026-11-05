import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, CheckCircle } from "lucide-react";
import donationService from "../../services/donationService";

const AvailableDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [acceptingId, setAcceptingId] = useState("");

  const loadDonations = async () => {
    try {
      const response = await donationService.getAvailableDonations();
      setDonations(response.donations || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load donations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const handleAccept = async (donationId) => {
    setError("");
    setSuccess("");
    setAcceptingId(donationId);

    try {
      await donationService.acceptDonation(donationId);
      setSuccess("Donation accepted successfully.");
      await loadDonations();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to accept this donation.");
    } finally {
      setAcceptingId("");
    }
  };

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <span className="eyebrow">NGO WORKSPACE</span>
          <h1>Available Donations</h1>
          <p>Find suitable surplus food and accept donations for your community.</p>
        </div>

        <Link to="/ngo" className="btn btn-outline">
          <ArrowLeft size={17} /> Dashboard
        </Link>
      </div>

      {error && <div className="form-error">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <section className="content-card">
        <div className="content-card-heading">
          <div>
            <h2>Food Donation Listings</h2>
            <p>{donations.length} available donation(s)</p>
          </div>
        </div>

        {loading ? (
          <p className="empty-message">Loading donations...</p>
        ) : donations.length === 0 ? (
          <div className="empty-state">
            <Package size={40} />
            <h3>No available donations</h3>
            <p>Please check again later for new food listings.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Food</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Donor</th>
                  <th>Pickup Address</th>
                  <th>Pickup Deadline</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation._id}>
                    <td><strong>{donation.foodName}</strong></td>
                    <td>{donation.foodType}</td>
                    <td>{donation.quantity} {donation.unit}</td>
                    <td>{donation.donor?.name || "Donor"}</td>
                    <td>{donation.pickupAddress}</td>
                    <td>{new Date(donation.pickupDeadline).toLocaleString()}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary btn-small"
                        onClick={() => handleAccept(donation._id)}
                        disabled={acceptingId === donation._id}
                      >
                        <CheckCircle size={16} />
                        {acceptingId === donation._id ? "Accepting..." : "Accept"}
                      </button>
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

export default AvailableDonations;
