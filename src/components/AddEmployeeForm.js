import React, { useState, useEffect } from "react";
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from "../services/api";
import "../App.css"

const AddEmployeeForm = () => {
  const [employees, setEmployees] = useState([]); // To store employees list
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [age, setAge] = useState("");
  const [id, setId] = useState("");
  const [photo, setPhoto] = useState("");
  const [role, setRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");

  // Fetch employees when the component loads
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const data = await getEmployees();
    setEmployees(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Form ID:", id); // Log the ID
    console.log("Edit ID:", editId); 
    console.log("Edit ID:", editId); 
    
    if (!name || !surname || !age || !id || !role) {
      alert("Please fill out all fields");
      return;
    }
  
    // Ensure idNumber is added if missing
    let idNumber = id; // Use the id value as idNumber by default
  
    if (!idNumber) {
      alert("ID Number is required");
      return;
    }
  
    // Ensure age is a number
    const numericAge = isNaN(age) ? age : Number(age);
  
    const employeeData = { 
      name, 
      surname, 
      age: numericAge, 
      id, 
      idNumber, // Make sure idNumber is defined here
      photo, 
      role 
    };
  
    try {
      if (isEditing) {
        await updateEmployee(editId, employeeData);
        alert("Employee updated successfully");
      } else {
        await addEmployee(employeeData);
        alert("Employee added successfully");
      }
  
      resetForm();
      fetchEmployees();
    } catch (error) {
      console.error("Error submitting employee data:", error);
      alert("Failed to submit employee data");
    }
  };
  
  
  const handleEdit = (employee) => {
    setIsEditing(true);
    setEditId(employee.id);
    setName(employee.name);
    setSurname(employee.surname);
    setAge(employee.age);
    setId(employee.id);
    setPhoto(employee.photo || ""); // Handle cases where no photo is present
    setRole(employee.role);
  };

  const handleDelete = async (employeeId) => {
    try {
      await deleteEmployee(employeeId);
      alert("Employee deleted successfully");
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee");
    }
  };

  const resetForm = () => {
    setName("");
    setSurname("");
    setAge("");
    setId("");
    setPhoto("");
    setRole("");
    setIsEditing(false);
    setEditId("");
  };

  return (
    <div>
      <h2>{isEditing ? "Edit Employee" : "Add Employee"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
          disabled={isEditing} // Prevent editing the ID when updating
        />
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
              setPhoto(reader.result); // Save photo as Base64
            };
            reader.readAsDataURL(file);
          }}
        />
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
        <button type="submit">{isEditing ? "Save Changes" : "Add Employee"}</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <h3>Existing Employees</h3>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            {employee.name} {employee.surname}
            <button onClick={() => handleEdit(employee)}>Edit</button>
            <button onClick={() => handleDelete(employee.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddEmployeeForm;
