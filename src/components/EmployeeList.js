// EmployeeList.js
import React, { useEffect, useState } from "react";
import { getEmployees } from "../services/api";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const data = await getEmployees();
      setEmployees(data);
    };
    fetchEmployees();
  }, []);

  return (
    <div>
      <h1>Employee List</h1>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            <div>
              <img
                src={employee.photo}
                alt={`${employee.name} ${employee.surname}`}
                style={{ width: "100px", height: "100px" }}
              />
              <p>{employee.name} {employee.surname}</p>
              <p>{employee.role}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
