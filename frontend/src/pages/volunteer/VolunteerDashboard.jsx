import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, CheckCircle, Clock, Truck, ArrowRight } from "lucide-react";
import api from "../../services/api";

const VolunteerDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/volunteers/me");
        setProfile(response.data.volunteer || response.data.profile || null);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load volunteer profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <span className="eyebrow">VOLUNTEER WORKSPACE</span>
          <h1>Volunteer Dashboard</h1>
          <p>Help deliver surplus food safely to people who need it.</p>
        </div>

        <Link to="/volunteer/pickups" className="btn btn-primary">
          <Truck size={18} /> View Pickups
        </Link>
      </div>

      {error && <div className="form-error">{error}</div>}

      {loading ? (
        <p className="empty-message">Loading volunteer profile...</p>
      ) : (
        <>
          <div className="stats-grid">
            <article className="stat-card">
              <div className="stat-icon blue"><Package /></div>
              <div>
                <p>Total Deliveries</p>
                <h2>{profile?.totalDeliveries ?? 0}</h2>
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-icon green"><CheckCircle /></div>
              <div>
                <p>Verification</p>
                <h2>{profile?.isVerified ? "Verified" : "Pending"}</h2>
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-icon purple"><Clock /></div>
              <div>
                <p>Availability</p>
                <h2>{profile?.availability ? "Available" : "Unavailable"}</h2>
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-icon orange"><Truck /></div>
              <div>
                <p>Vehicle</p>
                <h2>{profile?.vehicleType || "Not specified"}</h2>
              </div>
            </article>
          </div>

          <section className="content-card">
            <div className="content-card-heading">
              <div>
                <h2>Pickup and Delivery</h2>
                <p>Manage your assigned food pickups and delivery updates.</p>
              </div>
            </div>

            {!profile?.isVerified ? (
              <div className="empty-state">
                <Clock size={40} />
                <h3>Verification pending</h3>
                <p>Your account must be verified by an administrator before you can manage pickups.</p>
              </div>
            ) : (
              <div className="empty-state">
                <Truck size={40} />
                <h3>Ready to make a difference?</h3>
                <p>Open your pickup list to manage assigned deliveries.</p>
                <Link to="/volunteer/pickups" className="btn btn-primary">
                  Manage Pickups <ArrowRight size={17} />
                </Link>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default VolunteerDashboard;
