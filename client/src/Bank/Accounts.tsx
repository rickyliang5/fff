import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

interface Account {
  id: number;
  account_number: string;
  balance: number;
}

const UserAccounts: React.FC = () => {
  const [userAccounts, setUserAccounts] = useState<Account[]>([]);
  const location = useLocation();
  const accountId = new URLSearchParams(location.search).get("accountId");
  const [pin, setPin] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "User Accounts";
    fetchUserAccounts();
  }, []);

  const fetchUserAccounts = async () => {
    try {
      const response = await axios.get<Account[]>("http://127.0.0.1:5000/user-accounts", {
        withCredentials: true,
      });
      setUserAccounts(response.data);
    } catch (error) {
      console.error("Error fetching user accounts:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/logout", {
        withCredentials: true,
      });
      console.log(response.data.message); // Optionally handle a success message
      // Clear user-related state
      setUserAccounts([]);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      setErrorMessage("Failed to log out");
    }
  };

  return (
    <div className="gridcontainer">
      <header className="header">
        <h3>User Accounts</h3>
      </header>
      <section className="sidebar">
        <h2>Frank Financial Funds</h2>
        <ul>
          <li>
            <Link to="/Bank">
              <i className="fa-solid fa-house"></i> Home
            </Link>
          </li>
  
          <li>
            <Link to="/Transfer">
              <i className="fa-solid fa-check-to-slot"></i> Transfer Funds
            </Link>
          </li>
          <li>
            <Link to="/Deposit">
              <i className="fa-solid fa-check-to-slot"></i> Deposit
            </Link>
          </li>
          <li>
            <Link to="/user-accounts">
              <i className="fa-solid fa-arrow-right-from-bracket"></i> View Accounts
            </Link>
          </li>
          <li>
            <button onClick={handleLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i> Log Out
            </button>
          </li>
        </ul>
      </section>
      <main className="main">
        <div className="account-card">
          <table>
            <thead>
              <tr>
                <th>
                  <td>Account Number</td>
                </th>
                <th>
                  <td>Balance</td>
                </th>
                <th>
                  <td>Action</td>
                </th>{" "}
                {/* New column for delete button */}
              </tr>
            </thead>
            <tbody>
              {userAccounts.map((account) => (
                <tr key={account.id}>
                  <td>
                    <td>{account.account_number}</td>
                  </td>
                  <td>
                    <td>{account.balance}</td>
                  </td>
                  <td>
                    <Link
                      to={`/close-account`}
                      className="delete-button"
                    >
                      Delete
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default UserAccounts;
