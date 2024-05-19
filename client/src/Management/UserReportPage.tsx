import axios from "axios";
import React, { useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";

export const MGMTUserAccounts = () => {
  const [user, setUser] = useState("");
  const [balance, setBalance] = useState("");
  const [account_Number, setAccountNumber] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  const {accountNumber} = useParams();
  console.log(accountNumber);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    document.title = "Home";
    return () => {
      document.title = "Default Page"; 
    };
  }, []);

  useEffect(() => {
    const fetchUserAndTransactions = async () => {
      try {
        // Fetch user and account details
        const userDetailsResponse = await axios.get(`http://127.0.0.1:5000/runReport/${accountNumber}`, {
          withCredentials: true,
        });
        setUser(userDetailsResponse.data.username);
        setBalance(userDetailsResponse.data.balance);
        setAccounts(userDetailsResponse.data.accounts); // Assuming this endpoint also gives accounts
  
        // Fetch transactions for the user or an account (modify URL as needed)
        const transactionsResponse = await axios.get(`http://127.0.0.1:5000/management/transactions/${accountNumber}`, {
          withCredentials: true,
        });
        setTransactions(transactionsResponse.data);  // Assuming the data is an array of transactions
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Not Authenticated");
      }
    };
  
    if (accountNumber) {
      fetchUserAndTransactions();
    }
  }, [accountNumber]);

  const handleCloseAccount = async () => {
    try {
      console.log("userId:", accountNumber);
        navigate(`/mgmt-close-account`);
    } catch (error) {
        console.error("Error navigating to close account page:", error);
    }
};


  


  const handleOpenAccount = () => {
    navigate(`/mgmt-create-account/${accountNumber}`); 
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
      navigate("/MGMTLogin");
    } catch (error) {
      console.error("Error logging out:", error);
      setError("Failed to log out");
    }
  };

  return (
    <div className="gridcontainer">
      <header className="header">
        <h3>Report for {user}</h3>
      </header>

      <section className="sidebar">
        <h2>Frank Financial Funds</h2>
        <ul>
          <li>
            <a href="/user-table">
              <i className="fa-solid fa-house"></i> Management Home
            </a>
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
            <h5>Recent Transactions</h5>
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
                  <tr key={transaction.transaction_id}>
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

