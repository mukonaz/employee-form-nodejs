import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SuperAdminDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    age: "",
    idNumber: "",
    photo: "",
    role: "generaladmin",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to access this page.");
      navigate("/login");
    }
  }, []);

  // Fetch general admins on page load
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Assuming the token is stored in localStorage after login
      if (!token) {
        alert("You are not authorized to view this resource.");
        return;
      }
  
      const response = await axios.get("http://localhost:5000/admins", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
      alert("Failed to fetch admins. Please check your permissions.");
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    const { name, surname, age, idNumber, photo, role, email, password } = formData;

    if (!name || !surname || !age || !idNumber || !photo || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/add-admin", {
        name,
        surname,
        age,
        idNumber,
        photo,
        role,
        email,
        password,
      });
      alert("Admin added successfully");
      fetchAdmins();
      setFormData({
        name: "",
        surname: "",
        age: "",
        idNumber: "",
        photo: "",
        role: "generaladmin",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error("Error adding admin:", error);
      alert("Failed to add admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Super Admin Dashboard</h2>

      <h3>Add General Admin</h3>
      <form onSubmit={handleAddAdmin}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="surname"
          placeholder="Surname"
          value={formData.surname}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="idNumber"
          placeholder="ID Number"
          value={formData.idNumber}
          onChange={handleInputChange}
          required
        />
        <input type="file" onChange={handlePhotoUpload} required />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add General Admin"}
        </button>
      </form>

      <h3>General Admins List</h3>
      {admins.length > 0 ? (
        <ul>
          {admins.map((admin) => (
            <li key={admin.id}>
              <p>
                <strong>{admin.name} {admin.surname}</strong>
              </p>
              <p>Email: {admin.email}</p>
              <p>Role: {admin.role}</p>
              <img src={admin.photo} alt={`${admin.name} photo`} width="100" />
            </li>
          ))}
        </ul>
      ) : (
        <p>No general admins found</p>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
