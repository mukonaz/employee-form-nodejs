import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";  // Import only the needed Firebase methods

const LoginPage = ({ setIsLoggedIn, setUserRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const auth = getAuth();  // Initialize Firebase Authentication

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Once logged in, get the ID token
      const idToken = await user.getIdToken();

      localStorage.setItem("authToken", idToken);  // Store the token
      setIsLoggedIn(true);

      // Get the user role (super-admin or other roles) using ID token claims
      const decodedToken = await user.getIdTokenResult();
      setUserRole(decodedToken.claims.role);  // Assuming role is stored in the token claims
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
