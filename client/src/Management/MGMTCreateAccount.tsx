import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const MGMTCreateAccount: React.FC = () => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Open Account";
    return () => {
      document.title = "Default Page";
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(pin)) {
      setError("PIN must be a 4-digit number.");
      return;
    }
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/mgmt-create-account", // Adjusted to your management endpoint
        { pin },
        { withCredentials: true }
      );
      if (response.data.message) {
        console.log(response.data.message);
        navigate("/user-accounts"); // Redirects to the user accounts page
      }
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred while creating the account.");
      console.error("Error creating account:", error);
    }
  };

  return (
    <div className="grid-container-no-scroll">
      <header className="header">
        <h3>Create New Account</h3>
      </header>

      <section className="sidebar">
        <ul>
          <li>
              <a href="/Bank">
                <i className="fa-solid fa-house"></i> Home
              </a>
          </li>
          <li>
            <Link to="/user-accounts">User Accounts</Link>
          </li>
        </ul>
      </section>

      <main className="main-new-account">
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label htmlFor="pin">Enter PIN:</label>
              <input
                type="password"
                id="pin"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(""); 
                }}
                className="new-account-input"
                required
              />
            </div>
            {error && <p className="error">{error}</p>} {''}
            <button className="create-account-btn" type="submit">Create Account</button>
          </form>
        </div>
        <p className="form-card-instructions">To create a new Account, simply add a 4 digit pin of your desired choice. You may view all of your accounts by clicking on the "User Accounts" button located on the sidebar of this page or "View Accounts" on the home page </p>
      </main>
    </div>
  );
};

export default MGMTCreateAccount;
