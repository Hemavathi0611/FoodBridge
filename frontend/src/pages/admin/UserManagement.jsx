import { useEffect, useState } from "react";
import { RefreshCw, Users } from "lucide-react";
import adminService from "../../services/adminService";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminService.getAllUsers();
      setUsers(response.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="dashboard-content">
      <div className="dashboard-page-header">
        <div>
          <h1>User Management</h1>
          <p>View all registered FoodBridge users.</p>
        </div>
        <button className="refresh-button" onClick={loadUsers}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-heading">
          <div className="admin-table-title">
            <Users size={20} />
            <h2>Registered Users</h2>
          </div>
          <span>{users.length} users</span>
        </div>

        {loading ? (
          <p className="admin-table-message">Loading users...</p>
        ) : error ? (
          <div className="admin-table-message">
            <p>{error}</p>
            <button className="refresh-button" onClick={loadUsers}>
              Try again
            </button>
          </div>
        ) : users.length === 0 ? (
          <p className="admin-table-message">No users found.</p>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Account Status</th>
                  <th>Registered On</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || "—"}</td>
                    <td>
                      <span className={`role-badge ${user.role?.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`account-badge ${user.isActive ? "active" : "inactive"}`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
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

export default UserManagement;
