import { useEffect, useState } from "react";
import { RefreshCw, Truck, CheckCircle, Clock } from "lucide-react";
import adminService from "../../services/adminService";

function VolunteerManagement() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [processingId, setProcessingId] = useState("");

  const loadVolunteers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminService.getAllVolunteers();
      setVolunteers(response.volunteers || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load volunteers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVolunteers();
  }, []);

  const handleVerification = async (volunteerId, isVerified) => {
    const action = isVerified ? "verify" : "remove verification from";

    if (!window.confirm(`Are you sure you want to ${action} this volunteer?`)) {
      return;
    }

    try {
      setProcessingId(volunteerId);
      setMessage("");

      await adminService.updateVolunteerVerification(volunteerId, {
        isVerified,
      });

      setVolunteers((current) =>
        current.map((volunteer) =>
          volunteer._id === volunteerId
            ? { ...volunteer, isVerified }
            : volunteer
        )
      );

      setMessage(
        isVerified
          ? "Volunteer verified successfully."
          : "Volunteer verification removed."
      );
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Unable to update volunteer verification."
      );
    } finally {
      setProcessingId("");
    }
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-page-header">
        <div>
          <h1>Volunteer Management</h1>
          <p>Review volunteer profiles and manage verification.</p>
        </div>
        <button className="refresh-button" onClick={loadVolunteers}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {message && <p className="admin-feedback-message">{message}</p>}

      <div className="admin-table-card">
        <div className="admin-table-heading">
          <div className="admin-table-title">
            <Truck size={20} />
            <h2>Registered Volunteers</h2>
          </div>
          <span>{volunteers.length} volunteers</span>
        </div>

        {loading ? (
          <p className="admin-table-message">Loading volunteers...</p>
        ) : error ? (
          <div className="admin-table-message">
            <p>{error}</p>
            <button className="refresh-button" onClick={loadVolunteers}>
              Try again
            </button>
          </div>
        ) : volunteers.length === 0 ? (
          <p className="admin-table-message">No volunteers found.</p>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Vehicle</th>
                  <th>Deliveries</th>
                  <th>Verification</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((volunteer) => (
                  <tr key={volunteer._id}>
                    <td>{volunteer.user?.name || "—"}</td>
                    <td>{volunteer.user?.email || "—"}</td>
                    <td>{volunteer.user?.phone || "—"}</td>
                    <td>{volunteer.city || "—"}</td>
                    <td>{volunteer.vehicleType || "—"}</td>
                    <td>{volunteer.totalDeliveries ?? 0}</td>
                    <td>
                      <span className={`account-badge ${volunteer.isVerified ? "active" : "inactive"}`}>
                        {volunteer.isVerified ? (
                          <><CheckCircle size={12} /> Verified</>
                        ) : (
                          <><Clock size={12} /> Pending</>
                        )}
                      </span>
                    </td>
                    <td>
                      <button
                        className={volunteer.isVerified ? "ngo-reject-button" : "ngo-approve-button"}
                        disabled={processingId === volunteer._id}
                        onClick={() =>
                          handleVerification(volunteer._id, !volunteer.isVerified)
                        }
                      >
                        {volunteer.isVerified ? "Unverify" : "Verify"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default VolunteerManagement;
