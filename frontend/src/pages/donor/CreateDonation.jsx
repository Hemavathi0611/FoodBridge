import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, PackagePlus } from "lucide-react";
import donationService from "../../services/donationService";

const CreateDonation = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    foodName: "",
    foodType: "COOKED",
    description: "",
    quantity: "",
    unit: "KG",
    expiryDate: "",
    pickupAddress: "",
    pickupDeadline: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await donationService.createDonation({
        ...formData,
        quantity: Number(formData.quantity),
        expiryDate: new Date(formData.expiryDate).toISOString(),
        pickupDeadline: new Date(formData.pickupDeadline).toISOString(),
      });

      navigate("/donor/donations");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to create donation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <span className="eyebrow">DONOR WORKSPACE</span>
          <h1>Create Food Donation</h1>
          <p>Provide accurate details about the surplus food you want to share.</p>
        </div>
        <Link to="/donor" className="btn btn-outline">
          <ArrowLeft size={17} /> Back to Dashboard
        </Link>
      </div>

      <section className="content-card form-card">
        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="dashboard-form">
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="foodName">Food Name *</label>
              <input id="foodName" name="foodName" value={formData.foodName}
                onChange={handleChange} placeholder="Example: Vegetable Rice" required />
            </div>

            <div className="form-field">
              <label htmlFor="foodType">Food Category *</label>
              <select id="foodType" name="foodType" value={formData.foodType}
                onChange={handleChange}>
                <option value="COOKED">Cooked Food</option>
                <option value="RAW">Raw Food</option>
                <option value="PACKAGED">Packaged Food</option>
                <option value="BAKERY">Bakery</option>
                <option value="FRUITS">Fruits</option>
                <option value="VEGETABLES">Vegetables</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="quantity">Quantity *</label>
              <input id="quantity" name="quantity" type="number" min="0.1"
                step="0.1" value={formData.quantity} onChange={handleChange}
                placeholder="Enter quantity" required />
            </div>

            <div className="form-field">
              <label htmlFor="unit">Unit *</label>
              <select id="unit" name="unit" value={formData.unit}
                onChange={handleChange}>
                <option value="KG">Kilograms (KG)</option>
                <option value="LITRE">Litres</option>
                <option value="PACKETS">Packets</option>
                <option value="MEALS">Meals</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="expiryDate">Food Expiry Date and Time *</label>
              <input id="expiryDate" name="expiryDate" type="datetime-local"
                value={formData.expiryDate} onChange={handleChange} required />
            </div>

            <div className="form-field">
              <label htmlFor="pickupDeadline">Pickup Deadline *</label>
              <input id="pickupDeadline" name="pickupDeadline" type="datetime-local"
                value={formData.pickupDeadline} onChange={handleChange} required />
            </div>

            <div className="form-field full-width">
              <label htmlFor="pickupAddress">Pickup Address *</label>
              <input id="pickupAddress" name="pickupAddress"
                value={formData.pickupAddress} onChange={handleChange}
                placeholder="Complete pickup address" required />
            </div>

            <div className="form-field full-width">
              <label htmlFor="description">Food Description</label>
              <textarea id="description" name="description" rows={4}
                value={formData.description} onChange={handleChange}
                placeholder="Mention preparation time, storage conditions, allergens, etc." />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <PackagePlus size={18} />
              {loading ? "Submitting..." : "Submit Donation"}
            </button>
            <Link to="/donor" className="btn btn-outline">Cancel</Link>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CreateDonation;
