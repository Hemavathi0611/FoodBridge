import { useState } from "react";
import {
  FileSpreadsheet,
  RefreshCw,
  Download,
  BarChart3,
} from "lucide-react";
import reportService from "../../services/reportService";

const reportOptions = [
  { id: "donations", label: "Donation Listings" },
  { id: "pickups", label: "Pickup Status" },
  { id: "food", label: "Food Quantity Redistributed" },
  { id: "donors", label: "Donor Activity" },
];

const reportFunctions = {
  donations: reportService.getDonationListings,
  pickups: reportService.getPickupStatus,
  food: reportService.getFoodRedistributed,
  donors: reportService.getDonorActivity,
};

const reportColumns = {
  donations: [
    { key: "foodName", label: "Food Name" },
    { key: "foodType", label: "Food Type" },
    { key: "quantity", label: "Quantity" },
    { key: "unit", label: "Unit" },
    { key: "donor.name", label: "Donor" },
    { key: "acceptedBy.name", label: "Accepted By" },
    { key: "status", label: "Status" },
    { key: "pickupAddress", label: "Pickup Address" },
    { key: "expiryDate", label: "Expiry Date" },
  ],
  pickups: [
    { key: "donation.foodName", label: "Food Name" },
    { key: "donation.quantity", label: "Quantity" },
    { key: "donation.unit", label: "Unit" },
    { key: "ngo.organizationName", label: "NGO" },
    { key: "volunteer.user.name", label: "Volunteer" },
    { key: "volunteer.vehicleType", label: "Vehicle" },
    { key: "scheduledAt", label: "Scheduled At" },
    { key: "status", label: "Status" },
    { key: "pickedUpAt", label: "Picked Up At" },
    { key: "deliveredAt", label: "Delivered At" },
    { key: "deliveryNotes", label: "Delivery Notes" },
  ],
  food: [
    { key: "unit", label: "Unit" },
    { key: "totalQuantity", label: "Total Quantity" },
    { key: "totalDonations", label: "Total Donations" },
  ],
  donors: [
    { key: "name", label: "Donor Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "totalDonations", label: "Total Donations" },
    { key: "deliveredDonations", label: "Delivered Donations" },
    { key: "totalFoodQuantity", label: "Total Food Quantity" },
    { key: "joinedAt", label: "Joined Date" },
  ],
};

const getValue = (row, path) =>
  path.split(".").reduce((value, key) => value?.[key], row);

const formatValue = (value, key) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (
    ["expiryDate", "pickupDeadline", "scheduledAt", "pickedUpAt",
      "deliveredAt", "joinedAt"].includes(key)
  ) {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? String(value)
      : date.toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        });
  }

  return String(value);
};

function ReportsDashboard() {
  const [selectedReport, setSelectedReport] = useState("donations");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const columns = reportColumns[selectedReport];

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");
      setLoaded(false);

      const response = await reportFunctions[selectedReport]();
      const data = response.report || response.data || response;

      const reportRows = Array.isArray(data)
        ? data
        : Array.isArray(data.rows)
          ? data.rows
          : [];

      setRows(reportRows);
      setLoaded(true);
    } catch (err) {
      setRows([]);
      setError(
        err.response?.data?.message || "Unable to load this report."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReportChange = (reportId) => {
    setSelectedReport(reportId);
    setRows([]);
    setError("");
    setLoaded(false);
  };

  const exportCSV = () => {
    if (!rows.length) return;

    const escapeCSV = (value) =>
      '"' + String(value ?? "").replace(/"/g, '""') + '"';

    const csv = [
      columns.map((column) => escapeCSV(column.label)).join(","),
      ...rows.map((row) =>
        columns
          .map((column) =>
            escapeCSV(formatValue(getValue(row, column.key), column.key))
          )
          .join(",")
      ),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedReport}-report.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => window.print();

  return (
    <div className="dashboard-content">
      <div className="dashboard-page-header">
        <div>
          <h1>Reports Dashboard</h1>
          <p>View and export FoodBridge platform reports.</p>
        </div>
        <BarChart3 size={30} color="#168044" />
      </div>

      <div className="report-selector-card">
        <label htmlFor="reportType">Select Report</label>

        <select
          id="reportType"
          value={selectedReport}
          onChange={(event) => handleReportChange(event.target.value)}
        >
          {reportOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          className="refresh-button"
          onClick={loadReport}
          disabled={loading}
        >
          <RefreshCw size={16} />
          {loading ? "Loading..." : "Generate Report"}
        </button>
      </div>

      <div className="admin-table-card report-results">
        <div className="admin-table-heading">
          <div className="admin-table-title">
            <FileSpreadsheet size={20} />
            <h2>
              {reportOptions.find(
                (item) => item.id === selectedReport
              )?.label}
            </h2>
          </div>

          {loaded && <span>{rows.length} records</span>}
        </div>

        {loading ? (
          <p className="admin-table-message">Generating report...</p>
        ) : error ? (
          <p className="admin-table-message report-error">{error}</p>
        ) : !loaded ? (
          <p className="admin-table-message">
            Select a report and click Generate Report.
          </p>
        ) : rows.length === 0 ? (
          <p className="admin-table-message">
            No records found for this report.
          </p>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-users-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key}>{column.label}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((row, index) => (
                  <tr key={row._id || index}>
                    {columns.map((column) => (
                      <td key={column.key}>
                        {formatValue(
                          getValue(row, column.key),
                          column.key
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {loaded && rows.length > 0 && (
        <div className="report-actions">
          <button className="refresh-button" onClick={exportCSV}>
            <Download size={16} /> Export CSV
          </button>

          <button className="refresh-button" onClick={printReport}>
            Print Report
          </button>
        </div>
      )}
    </div>
  );
}

export default ReportsDashboard;
