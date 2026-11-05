import { useEffect, useState } from "react";
import { Building2, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import adminService from "../../services/adminService";

function NGOApproval() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [processingId, setProcessingId] = useState("");

  const loadNGOs = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminService.getPendingNGOs();
      setNgos(response.ngos || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load pending NGO applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNGOs();
  }, []);

  const handleApproval = async (ngoId, status) => {
    const action = status === "APPROVED" ? "approve" : "reject";

    if (!window.confirm(`Are you sure you want to ${action} this NGO?`)) {
      return;
    }

    try {
      setProcessingId(ngoId);
      setMessage("");
      await adminService.updateNGOApproval(ngoId, { status });
      setNgos((current) => current.filter((ngo) => ngo._id !== ngoId));
      setMessage(`NGO application ${action}d successfully.`);
    } catch (err) {
      setMessage(err.response?.data?.message || `Unable to ${action} NGO.`);
    } finally {
      setProcessingId("");
    }
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-page-header">
        <div>
          <h1>NGO Approval</h1>
          <p>Review and manage pending NGO registration applications.</p>
        </div>
        <button className="refresh-button" onClick={loadNGOs}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {message && <p className="admin-feedback-message">{message}</p>}

      {loading ? (
        <p className="admin-table-message">Loading NGO applications...</p>
      ) : error ? (
        <div className="admin-table-message">
          <p>{error}</p>
          <button className="refresh-button" onClick={loadNGOs}>Try again</button>
        </div>
      ) : ngos.length === 0 ? (
        <div className="admin-empty-state">
          <CheckCircle size={38} />
          <h2>No pending applications</h2>
          <p>All NGO registration applications have been reviewed.</p>
        </div>
      ) : (
        <div className="ngo-approval-grid">
          {ngos.map((ngo) => (
            <article className="ngo-approval-card" key={ngo._id}>
              <div className="ngo-card-heading">
                <div className="ngo-card-icon"><Building2 size={23} /></div>
                <span className="pending-badge">Pending</span>
              </div>

              <h2>{ngo.organizationName}</h2>
              <p className="ngo-registration-number">
                Registration No: {ngo.registrationNumber}
              </p>

              <div className="ngo-card-details">
                <p><strong>Contact:</strong> {ngo.contactPerson}</p>
                <p><strong>Phone:</strong> {ngo.contactPhone}</p>
                <p><strong>City:</strong> {ngo.city}</p>
                <p><strong>Address:</strong> {ngo.address}</p>
                {ngo.description && (
                  <p><strong>Description:</strong> {ngo.description}</p>
                )}
                {ngo.user?.email && (
                  <p><strong>Email:</strong> {ngo.user.email}</p>
                )}
              </div>

              <div className="ngo-card-actions">
                <button
                  className="ngo-approve-button"
                  disabled={processingId === ngo._id}
                  onClick={() => handleApproval(ngo._id, "APPROVED")}
                >
                  <CheckCircle size={16} /> Approve
                </button>
                <button
                  className="ngo-reject-button"
                  disabled={processingId === ngo._id}
                  onClick={() => handleApproval(ngo._id, "REJECTED")}
                >
                  <XCircle size={16} /> Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default NGOApproval;
