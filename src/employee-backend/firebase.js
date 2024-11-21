const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth()
db.settings({ ignoreUndefinedProperties: true });

async function updateMissingIdNumbers() {
  const employeesRef = db.collection("employees");
  const snapshot = await employeesRef.get();

  snapshot.forEach(async (doc) => {
    const employee = doc.data();
    if (!employee.idNumber) {
      // If idNumber is missing, set it to id
      await doc.ref.update({ idNumber: employee.id });
      console.log(`Updated idNumber for employee with id: ${employee.id}`);
    }
  });
}

updateMissingIdNumbers().catch(console.error);

module.exports = {db, auth};
