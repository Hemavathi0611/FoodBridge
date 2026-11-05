import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, MapPin, Clock, Truck, CheckCircle } from "lucide-react";
import pickupService from "../../services/pickupService";

const VolunteerPickups = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState({});

  const loadPickups = async () => {
    try {
      const response = await pickupService.getMyPickups();
      setPickups(response.pickups || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load assigned pickups.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPickups();
  }, []);

  const updateStatus = async (pickupId, status) => {
    setError("");
    setSuccess("");
    setUpdatingId(pickupId);

    try {
      await pickupService.updatePickupStatus(pickupId, {
        status,
        deliveryNotes: deliveryNotes[pickupId] || "",
      });

      setSuccess(
        status === "PICKED_UP"
          ? "Food marked as picked up successfully."
          : "Food marked as delivered successfully."
      );

      await loadPickups();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update pickup status.");
    } finally {
      setUpdatingId("");
    }
  };

  const formatDate = (value) => {
    if (!value) return "Not scheduled";
    return new Date(value).toLocaleString();
  };

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <span className="eyebrow">VOLUNTEER WORKSPACE</span>
          <h1>Pickup & Delivery</h1>
          <p>Track your assigned food collections and deliveries.</p>
        </div>

        <Link to="/volunteer" className="btn btn-outline">
          <ArrowLeft size={17} /> Dashboard
        </Link>
      </div>

      {error && <div className="form-error">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <section className="content-card">
        <div className="content-card-heading">
          <div>
            <h2>My Assigned Pickups</h2>
            <p>{pickups.length} pickup assignment(s)</p>
          </div>
        </div>

        {loading ? (
          <p className="empty-message">Loading assigned pickups...</p>
        ) : pickups.length === 0 ? (
          <div className="empty-state">
            <Package size={40} />
            <h3>No assigned pickups</h3>
            <p>New assignments from NGOs will appear here.</p>
          </div>
        ) : (
          <div className="pickup-list">
            {pickups.map((pickup) => {
              const donation = pickup.donation;
              const status = pickup.status;

              return (
                <article className="pickup-card" key={pickup._id}>
                  <div className="pickup-card-header">
                    <div>
                      <span className="eyebrow">FOOD DONATION</span>
                      <h3>{donation?.foodName || "Donation details unavailable"}</h3>
                    </div>
                    <span className={`status-badge ${status.toLowerCase()}`}>
                      {status.replaceAll("_", " ")}
                    </span>
                  </div>

                  <div className="pickup-details-grid">
                    <div className="pickup-detail">
                      <Package size={18} />
                      <div>
                        <span>Quantity</span>
                        <strong>
                          {donation
                            ? `${donation.quantity} ${donation.unit}`
                            : "Not available"}
                        </strong>
                      </div>
                    </div>

                    <div className="pickup-detail">
                      <MapPin size={18} />
                      <div>
                        <span>Pickup Address</span>
                        <strong>{donation?.pickupAddress || "Not available"}</strong>
                      </div>
                    </div>

                    <div className="pickup-detail">
                      <Clock size={18} />
                      <div>
                        <span>Scheduled Pickup</span>
                        <strong>{formatDate(pickup.scheduledAt)}</strong>
                      </div>
                    </div>

                    <div className="pickup-detail">
                      <Truck size={18} />
                      <div>
                        <span>NGO</span>
                        <strong>{pickup.ngo?.organizationName || "NGO"}</strong>
                      </div>
                    </div>
                  </div>

                  {status === "ASSIGNED" && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={updatingId === pickup._id}
                      onClick={() => updateStatus(pickup._id, "PICKED_UP")}
                    >
                      <Package size={17} />
                      {updatingId === pickup._id ? "Updating..." : "Mark as Picked Up"}
                    </button>
                  )}

                  {status === "PICKED_UP" && (
                    <div className="delivery-action">
                      <label htmlFor={`notes-${pickup._id}`}>Delivery Notes</label>
                      <textarea
                        id={`notes-${pickup._id}`}
                        rows="3"
                        placeholder="Enter delivery details (optional)"
                        value={deliveryNotes[pickup._id] || ""}
                        onChange={(event) =>
                          setDeliveryNotes((previous) => ({
                            ...previous,
                            [pickup._id]: event.target.value,
                          }))
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={updatingId === pickup._id}
                        onClick={() => updateStatus(pickup._id, "DELIVERED")}
                      >
                        <CheckCircle size={17} />
                        {updatingId === pickup._id ? "Updating..." : "Mark as Delivered"}
                      </button>
                    </div>
                  )}

                  {status === "DELIVERED" && (
                    <p className="delivery-complete">
                      <CheckCircle size={17} /> Delivery completed
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default VolunteerPickups;
