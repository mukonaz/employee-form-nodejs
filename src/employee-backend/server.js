const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Increase payload size limit
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Initialize Firebase
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const adminsCollection = db.collection("admins");

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(403).send("No token provided");
    }
  
    try {
      const decodedToken = await auth().verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      res.status(403).send("Invalid or expired token");
    }
  };
  
  // Protect route to add admin
  app.post("/add-admin", async (req, res) => {
        if (req.user.role !== "super-admin") {
      return res.status(403).send("Only super-admins can add other admins");
    }
    try {
      const { name, surname, age, idNumber, photo, role, email, password } = req.body;
  
      // Validate required fields
      if (!name || !surname || !age || !idNumber || !photo || !role || !email || !password) {
        return res.status(400).send("Missing required fields");
      }
  
      // Check if email already exists
      const snapshot = await adminsCollection.where("email", "==", email).get();
      if (!snapshot.empty) {
        return res.status(400).send("Email already exists");
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newAdmin = {
        name,
        surname,
        age: parseInt(age, 10),
        idNumber,
        photo,
        role,
        email,
        password: hashedPassword, // Store hashed password
      };
  
      await adminsCollection.add(newAdmin);
      res.status(201).send("General Admin added successfully");
    } catch (error) {
      console.error("Error adding admin:", error);
      res.status(500).send("Error adding admin");
    }
  });

        
// Route to fetch all General Admins
app.get("/admins", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).send("Access denied. No token provided.");
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    if (decodedToken.role !== "superadmin") {
      return res.status(403).send("Access denied. Not a superadmin.");
    }

    const snapshot = await db.collection("admins").get();
    const admins = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).send("Error fetching admins.");
  }
});


// Route to fetch a specific General Admin by ID
app.get("/admin/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await adminsCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).send("Admin not found");
    }

    const adminData = doc.data();

    // Exclude the password from the response
    const { password, ...adminWithoutPassword } = adminData;

    res.json({ id: doc.id, ...adminWithoutPassword });
  } catch (error) {
    console.error("Error fetching admin:", error);
    res.status(500).send("Error fetching admin");
  }
});

// Route to get all employees
app.get("/employees", async (req, res) => {
  try {
    const snapshot = await db.collection("employees").get();
    const employees = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(employees);
  } catch (error) {
    res.status(500).send("Error fetching employees: " + error);
  }
});

// Route to add a new employee
app.post("/employee", async (req, res) => {
    try {
        const { name, surname, age, id, photo, role } = req.body;

        // Debugging step: Log all fields
        console.log("Received data:", { name, surname, age, id, photo, role });

        if (!name || !surname || !age || !id || !photo || !role) {
            return res.status(400).send("Missing required fields");
        }

        // Ensure that idNumber is the same as id when adding a new employee
        const idNumber = id;  // Ensure idNumber matches id

        const newEmployee = { 
            name, 
            surname, 
            age, 
            id, 
            idNumber,  // Set idNumber to match id
            photo, 
            role 
        };

        // Add the new employee to Firestore
        await db.collection("employees").add(newEmployee);
        res.status(201).send("Employee added successfully");
    } catch (error) {
        console.error("Error adding employee:", error);
        res.status(500).send("Error adding employee: " + error.message);
    }
});

  

// Route to update an existing employee
app.put("/employee/:id", async (req, res) => {
    try {
      const { id } = req.params; // Get the employee ID from URL
      console.log("Updating employee with ID:", id); // Log the ID being passed
      const updatedData = req.body; // Get the data from the request body
      console.log("Updated Data:", updatedData); // Log the updated data
  
      // Ensure data is provided
      if (!updatedData || Object.keys(updatedData).length === 0) {
        return res.status(400).send("No data provided for update");
      }
  
      // Reference the employee document in Firestore
      const employeeRef = db.collection("employees").doc(id);
      const employeeDoc = await employeeRef.get();
  
      // If document does not exist, return 404
      if (!employeeDoc.exists) {
        return res.status(404).send(`Employee with ID ${id} not found`);
      }
  
      // If the employee exists, update the document
      await employeeRef.update(updatedData);
      res.status(200).send("Employee updated successfully");
  
    } catch (error) {
      console.error("Error updating employee:", error.message);
      res.status(500).send("Error updating employee: " + error.message);
    }
  });
  
  
// Route to delete an employee
app.delete("/employee/:id", async (req, res) => {
  try {
    const employeeRef = db.collection("employees").doc(req.params.id);
    await employeeRef.delete();
    res.send("Employee deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting employee: " + error);
  }
});

// Route to get a specific employee by ID
app.get("/employee/:id", async (req, res) => {
  try {
    const employeeRef = db.collection("employees").doc(req.params.id);
    const doc = await employeeRef.get();
    if (!doc.exists) {
      return res.status(404).send("Employee not found");
    }
    res.json(doc.data());
  } catch (error) {
    res.status(500).send("Error retrieving employee: " + error);
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
