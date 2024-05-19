import axios from "axios";
import React, { useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";

export const Bank = () => {
  const [user, setUser] = useState("");
  const [balance, setBalance] = useState("");
  const [account_number, setAccountNumber] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState([]);
  const {userId} = useParams();
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    document.title = "Home";
    return () => {
      document.title = "Default Page"; 
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/bank", {
          withCredentials: true,
        });
        setUser(response.data.username);
        setBalance(response.data.balance);
        console.log("User ID:", response.data.userId);
        setAccounts(response.data.accounts); // Update state with accounts
        setError("");
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Not Authenticated");
      }
    };

    const fetchTransactions = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/user-transactions', {
          withCredentials: true,
        });
        setTransactions(res.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('Failed to fetch transactions');
      }
    };

  
    fetchUser();
    fetchTransactions();
  }, []);

  const handleCloseAccount = async () => {
    try {
      console.log("userId:", userId);
        navigate(`/close-account`);
    } catch (error) {
        console.error("Error navigating to close account page:", error);
    }
};


  
  const handleViewAccounts = () => {
    navigate('/user-accounts'); 
  };

  const handleOpenAccount = () => {
    navigate('/create-account'); 
  };

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
        <h3>Welcome Back {user}</h3>
      </header>

      <section className="sidebar">
        <h2>Frank Financial Funds</h2>
        <ul>
          <li>
            <a href="/Bank">
              <i className="fa-solid fa-house"></i> Home
            </a>
          </li>
          <li>
            <a href="/Transfer">
              <i className="fa-solid fa-check-to-slot"></i> Transfer Funds
            </a>
          </li>
          <li>
            <a href="/Deposit">
              <i className="fa-solid fa-check-to-slot"></i> Deposit
            </a>
          </li>
          <li>
            <button onClick={handleViewAccounts}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i> View Accounts
            </button>
          </li>
          <li>
            <button onClick={handleLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i> Log Out
            </button>
          </li>
        </ul>
      </section>
      <main className="main">
        <div className="card">
          <h5>Available Balance</h5>
          {/* Display account information */}
          {accounts.map((account) => (
            <div key={account.account_number}>
              <p><h6>Account Number: {account.account_number}</h6></p>
              <p><h6>Balance: {account.balance}</h6></p>
            </div>
          ))}
        </div>
        <div className="card">
          <h5>Open/Close Accounts</h5>
          <button className="open-close-account-button" onClick={handleCloseAccount}>Close Account</button>
          <br></br>
          <button className="open-close-account-button" onClick={handleOpenAccount}>Open Account</button>
        </div>
        <div className="card">
          <h4>Recent Transactions</h4>
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Account Number</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.transaction_id}</td>
                  <td>{transaction.account_number}</td>
                  <td>{transaction.transaction_type}</td>
                  <td>${transaction.amount.toFixed(2)}</td>
                  <td>{transaction.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Bank;
