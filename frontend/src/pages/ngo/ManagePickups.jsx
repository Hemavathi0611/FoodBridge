import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Users,
  CalendarClock,
  Truck,
  CheckCircle,
} from "lucide-react";
import donationService from "../../services/donationService";
import volunteerService from "../../services/volunteerService";
import pickupService from "../../services/pickupService";

const ManagePickups = () => {
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [selections, setSelections] = useState({});
  const [schedules, setSchedules] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [assigningId, setAssigningId] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [donationResponse, volunteerResponse] = await Promise.all([
        donationService.getMyAcceptedDonations(),
        volunteerService.getAvailableVolunteers(),
      ]);

      setDonations(donationResponse.donations || []);
      setVolunteers(volunteerResponse.volunteers || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load accepted donations and available volunteers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssign = async (donationId) => {
    setError("");
    setSuccess("");

    const volunteerId = selections[donationId];
    const scheduledAt = schedules[donationId];

    if (!volunteerId) {
      setError("Please select a volunteer for this donation.");
      return;
    }

    if (!scheduledAt) {
      setError("Please select a pickup date and time.");
      return;
    }

    if (new Date(scheduledAt).getTime() <= Date.now()) {
      setError("Pickup must be scheduled for a future date and time.");
      return;
    }

    setAssigningId(donationId);

    try {
      await pickupService.assignVolunteer(donationId, {
        volunteerId,
        scheduledAt: new Date(scheduledAt).toISOString(),
      });

      setSuccess("Volunteer assigned and pickup scheduled successfully.");

      setDonations((current) =>
        current.filter((donation) => donation._id !== donationId)
      );

      setVolunteers((current) =>
        current.filter((volunteer) => volunteer._id !== volunteerId)
      );

      setSelections((current) => {
        const updated = { ...current };
        delete updated[donationId];
        return updated;
      });

      setSchedules((current) => {
        const updated = { ...current };
        delete updated[donationId];
        return updated;
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to assign this pickup."
      );
    } finally {
      setAssigningId("");
    }
  };

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <span className="eyebrow">NGO WORKSPACE</span>
          <h1>Manage Pickups</h1>
          <p>Assign verified volunteers and schedule accepted food donations.</p>
        </div>

        <Link to="/ngo" className="btn btn-outline">
          <ArrowLeft size={17} /> Dashboard
        </Link>
      </div>

      {error && <div className="form-error">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {loading ? (
        <section className="content-card">
          <p className="empty-message">Loading pickup information...</p>
        </section>
      ) : (
        <>
          <section className="content-card">
            <div className="content-card-heading">
              <div>
                <h2>
                  <Package size={20} /> Accepted Donations
                </h2>
                <p>{donations.length} donation(s) awaiting volunteer assignment</p>
              </div>
            </div>

            {donations.length === 0 ? (
              <div className="empty-state">
                <CheckCircle size={40} />
                <h3>No pending assignments</h3>
                <p>Donations accepted by your NGO will appear here.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Food</th>
                      <th>Quantity</th>
                      <th>Donor</th>
                      <th>Pickup Address</th>
                      <th>Pickup Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation) => (
                      <tr key={donation._id}>
                        <td><strong>{donation.foodName}</strong></td>
                        <td>{donation.quantity} {donation.unit}</td>
                        <td>{donation.donor?.name || "Donor"}</td>
                        <td>{donation.pickupAddress}</td>
                        <td>
                          {donation.pickupDeadline
                            ? new Date(donation.pickupDeadline).toLocaleString()
                            : "Not specified"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="content-card">
            <div className="content-card-heading">
              <div>
                <h2>
                  <Users size={20} /> Volunteer Assignment
                </h2>
                <p>
                  {volunteers.length} verified and available volunteer(s)
                </p>
              </div>
            </div>

            {donations.length > 0 && volunteers.length === 0 ? (
              <div className="empty-state">
                <Users size={40} />
                <h3>No available volunteers</h3>
                <p>
                  Please wait until an administrator verifies volunteers or
                  an assigned volunteer completes a delivery.
                </p>
              </div>
            ) : donations.length > 0 ? (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Donation</th>
                      <th>Volunteer</th>
                      <th>Vehicle</th>
                      <th>Pickup Schedule</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation) => (
                      <tr key={donation._id}>
                        <td>
                          <strong>{donation.foodName}</strong>
                          <br />
                          {donation.quantity} {donation.unit}
                        </td>
                        <td>
                          <select
                            className="form-input"
                            value={selections[donation._id] || ""}
                            onChange={(event) =>
                              setSelections((current) => ({
                                ...current,
                                [donation._id]: event.target.value,
                              }))
                            }
                          >
                            <option value="">Select volunteer</option>
                            {volunteers.map((volunteer) => (
                              <option
                                key={volunteer._id}
                                value={volunteer._id}
                              >
                                {volunteer.user?.name || "Volunteer"} -{" "}
                                {volunteer.user?.phone || "No phone"}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          {selections[donation._id]
                            ? volunteers.find(
                                (volunteer) =>
                                  volunteer._id === selections[donation._id]
                              )?.vehicleType || "Not specified"
                            : "Select a volunteer"}
                        </td>
                        <td>
                          <input
                            type="datetime-local"
                            className="form-input"
                            value={schedules[donation._id] || ""}
                            onChange={(event) =>
                              setSchedules((current) => ({
                                ...current,
                                [donation._id]: event.target.value,
                              }))
                            }
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-primary btn-small"
                            onClick={() => handleAssign(donation._id)}
                            disabled={assigningId === donation._id}
                          >
                            <Truck size={16} />
                            {assigningId === donation._id
                              ? "Assigning..."
                              : "Assign Pickup"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="empty-message">
                Accept a donation first to assign a volunteer.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default ManagePickups;
