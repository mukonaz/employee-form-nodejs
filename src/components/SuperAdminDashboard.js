import React from "react";
import { Link } from "react-router-dom";

const SuperAdminDashboard = () => {
  return (
    <div>
      <h2>Super Admin Dashboard</h2>
      <p>Welcome, Super Admin!</p>
      <h3>Manage Admins:</h3>
      <Link to="/add-employee">Add Employee</Link>
      <Link to="/employee-list">View Employees</Link>
      {/* Add more functionalities as needed */}
    </div>
  );
};

export default SuperAdminDashboard;
