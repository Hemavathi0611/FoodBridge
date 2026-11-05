import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin, Phone, FileText, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import profileService from "../../services/profileService";

const CompleteProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    organizationName: "",
    registrationNumber: "",
    description: "",
    contactPerson: user?.name || "",
    contactPhone: user?.phone || "",
    address: "",
    city: "",
    vehicleType: "BIKE",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isNGO = user?.role === "NGO";
  const isVolunteer = user?.role === "VOLUNTEER";

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isNGO) {
        await profileService.registerNGO(formData);
        navigate("/ngo");
      } else if (isVolunteer) {
        await profileService.registerVolunteer({
          address: formData.address,
          city: formData.city,
          vehicleType: formData.vehicleType,
        });
        navigate("/volunteer");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isNGO && !isVolunteer) {
    return <div className="auth-page">This profile page is only for NGOs and volunteers.</div>;
  }

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-brand">
          <Building2 size={35} />
          <span>Complete Your Profile</span>
        </div>

        <div className="auth-heading">
          <h1>{isNGO ? "NGO Details" : "Volunteer Details"}</h1>
          <p>Provide the additional information required for your account.</p>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {isNGO && (
            <>
              <label htmlFor="organizationName">Organization Name</label>
              <div className="input-wrapper">
                <Building2 size={19} />
                <input id="organizationName" name="organizationName"
                  placeholder="NGO name" value={formData.organizationName}
                  onChange={handleChange} required />
              </div>

              <label htmlFor="registrationNumber">Registration Number</label>
              <div className="input-wrapper">
                <FileText size={19} />
                <input id="registrationNumber" name="registrationNumber"
                  placeholder="Official registration number"
                  value={formData.registrationNumber}
                  onChange={handleChange} required />
              </div>

              <label htmlFor="description">Organization Description</label>
              <textarea id="description" name="description"
                placeholder="Briefly describe your organization"
                value={formData.description} onChange={handleChange} rows={3} />

              <label htmlFor="contactPerson">Contact Person</label>
              <input id="contactPerson" name="contactPerson"
                value={formData.contactPerson} onChange={handleChange} required />

              <label htmlFor="contactPhone">Contact Phone</label>
              <div className="input-wrapper">
                <Phone size={19} />
                <input id="contactPhone" name="contactPhone" type="tel"
                  value={formData.contactPhone} onChange={handleChange} required />
              </div>
            </>
          )}

          {isVolunteer && (
            <>
              <label htmlFor="vehicleType">Vehicle Type</label>
              <select id="vehicleType" name="vehicleType"
                value={formData.vehicleType} onChange={handleChange}>
                <option value="BICYCLE">Bicycle</option>
                <option value="BIKE">Bike</option>
                <option value="CAR">Car</option>
                <option value="VAN">Van</option>
                <option value="NONE">No Vehicle</option>
              </select>
            </>
          )}

          <label htmlFor="address">Address</label>
          <div className="input-wrapper">
            <MapPin size={19} />
            <input id="address" name="address" placeholder="Full address"
              value={formData.address} onChange={handleChange} required />
          </div>

          <label htmlFor="city">City</label>
          <input id="city" name="city" placeholder="City"
            value={formData.city} onChange={handleChange} required />

          <button type="submit" className="btn btn-primary auth-submit"
            disabled={loading}>
            <Save size={18} />
            {loading ? "Saving Profile..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
