import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const GeneralAdminDashboard = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const snapshot = await getDocs(collection(db, "employees"));
      const employeesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEmployees(employeesData);
    };

    fetchEmployees();
  }, []);

  return (
    <div>
      <h1>General Admin Dashboard</h1>
      <h2>Employee Data</h2>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            {employee.name} - {employee.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GeneralAdminDashboard;
