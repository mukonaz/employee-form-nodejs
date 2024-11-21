// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import AddEmployeeForm from "./components/AddEmployeeForm";
// import EmployeeList from "./components/EmployeeList";
// import "./App.css";

// const App = () => {
//   return (
//     <Router>
//       <div className="app">
//         <header className="header">
//           <h1>Employee Management System</h1>
//           <nav>
//             <Link to="/" className="nav-link">Home</Link>
//             <Link to="/add-employee" className="nav-link">Add Employee</Link>
//             <Link to="/employee-list" className="nav-link">Employee List</Link>
//           </nav>
//         </header>
//         <main className="main-content">
//           <Routes>
//             <Route path="/" element={<h2>Welcome to the Employee Management System</h2>} />
//             <Route path="/add-employee" element={<AddEmployeeForm />} />
//             <Route path="/employee-list" element={<EmployeeList />} />
//           </Routes>
//         </main>
//       </div>
//     </Router>
//   );
// };

// export default App;
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import AddEmployeeForm from "./components/AddEmployeeForm";
import EmployeeList from "./components/EmployeeList";
import LoginPage from "./components/LoginPage";  // New login page component
import SuperAdminDashboard from "./components/SuperAdminDashboard";  // New Super Admin Dashboard
import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(""); // User role (e.g., 'super-admin', 'general-admin')
  
  // This checks if the user is logged in and is a super-admin
  const checkAdminAccess = (element) => {
    if (!isLoggedIn || userRole !== 'super-admin') {
      return <Navigate to="/" />;
    }
    return element;
  };

  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1>Employee Management System</h1>
          <nav>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/add-employee" className="nav-link">Add Employee</Link>
            <Link to="/employee-list" className="nav-link">Employee List</Link>
            <Link to="/login" className="nav-link">Login</Link> {/* Login link */}
          </nav>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<h2>Welcome to the Employee Management System</h2>} />
            <Route path="/add-employee" element={isLoggedIn ? <AddEmployeeForm /> : <Navigate to="/login" />} />
            <Route path="/employee-list" element={isLoggedIn ? <EmployeeList /> : <Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} /> {/* Login page */}
            {/* Super Admin Dashboard */}
            <Route path="/super-admin-dashboard" element={checkAdminAccess(<SuperAdminDashboard />)} /> 
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
