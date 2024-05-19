import { Link } from 'react-router-dom';
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState} from "react";
import axios from "axios";


export const Transaction = () => {

  const [user, setUser] = useState("");
  const [balance, setBalance] = useState("");
  const [account_number, setAccountNumber] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  const {userId} = useParams();
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/logout", {
        withCredentials: true,
      });
      console.log(response.data.message);  // Optionally handle a success message
      // Clear user-related state
      setUser("");
      setBalance("");
      setAccountNumber("");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      setError("Failed to log out");
    }
  };

  return (
    <div className="gridcontainer">
      <header className="header">
        <h3>Transactions</h3>
      </header>

      <section className="sidebar">
        <h2>Frank Financial Funds</h2>
        <ul>
          <li><Link to="/Bank"><i className="fa-solid fa-house"></i> Home</Link></li>
          <li><Link to="/Transaction"><i className="fa-solid fa-money-bill"></i> Transaction</Link></li>
          <li><Link to="/Transfer"><i className="fa-solid fa-check-to-slot"></i> Transfer Funds</Link></li>
          <li><Link to="/Deposit"><i className="fa-solid fa-check-to-slot"></i> Deposit</Link></li>
          <li><Link to="/user-accounts"><i className="fa-solid fa-arrow-right-from-bracket"></i> View Accounts</Link></li>
          <li>
            <button onClick={handleLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i> Log Out
            </button>
          </li>
        </ul>
      </section>

      <main className="main-atm">
        <div className="card">
          <table>
            <caption>Transaction Details</caption>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Debit|Credit</th>
              <th>Balance</th>
            </tr>
            <tr>
              <td>Hi</td>
              <td>Hi</td>
              <td>Hi</td>
              <td>Hi</td>
              <td>Hi</td>
            </tr>
            <tr>
              <td>Hi</td>
              <td>Hi</td>
              <td>Hi</td>
              <td>Hi</td>
              <td>Hi</td>
            </tr>
            <tr>
              <td>Hi</td>
              <td>Hi</td>
              <td>Hi</td>
              <td>Hi</td>
              <td>Hi</td>
            </tr>
          </table>
        </div>
      </main>
    </div>
  );
};
