import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import "./Transfer.css";
import axios from "axios";

export const Transfer = ({ users }) => {   
    const [initialAccount, setInitialAccount] = useState("");
    const [pin, setPin] = useState("");
    const [destinationAccount, setdestinationAccount] = useState("");
    const [deposit, setDeposit] = useState("");
    const [registrationMessage, setRegistrationMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
  
    const handleViewAccounts = () => {
      navigate('/user-accounts'); 
    }

    const navigate = useNavigate();
    useEffect(() => {
      document.title = "Transfer Funds";
      return () => {
        document.title = "Default Page"; 
      };
    }, []);

    const handleLogout = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/logout", {
          withCredentials: true,
        });
        console.log(response.data.message); 
        navigate("/login");
      } catch (error) {
        console.error("Error logging out:", error);
        setErrorMessage("Failed to log out");
      }
    };

    const handleSubmit = async (event) => {
      event.preventDefault();

    const transferData = {
        initialAccount,
        pin,
        destinationAccount,
        deposit,
    };
  
    try {
      const response = await axios.post("http://127.0.0.1:5000/Transfer", transferData);
      console.log(response.data);
  
      if (response.status === 200) {
          const transactionDataOutgoing = {
              account_number: initialAccount,
              transaction_type: 'Transfer',
              amount: -deposit
          };
          const res1 = await axios.post("http://127.0.0.1:5000/Transactions", transactionDataOutgoing);
          console.log(res1.data);
  
          const transactionDataIncoming = {
              account_number: destinationAccount,
              transaction_type: 'Transfer',
              amount: deposit
          };
          const res2 = await axios.post("http://127.0.0.1:5000/Transactions", transactionDataIncoming);
          console.log(res2.data);
      }
  
      navigate('/Success');
  } catch (error) {
      console.error(error);
      setErrorMessage('Transfer Failed. Please try again.');
  }
};
return (
    <div className = "transfer-wrapper">
     <div className="gridcontainer">
     <header className="header">
        <h3>Transfer Funds</h3>
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
   <div className="transfer-card">
    <div className="transfer-container">
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="login-container">
        <form className="login" onSubmit={handleSubmit}>
          <div className="inputs">
            <div className="input">
              <input
                className = "textField"
                type="text"
                placeholder=""
                required
                onChange={(e) => setInitialAccount(e.target.value)}
              ></input>
              <span></span>
              <label className = "label">Please enter the Account Number to transfer from</label>
            </div>
            <div className="input">
              <input 
                className = "textField"
                type="pin"
                placeholder=""
                required
                onChange={(e) => setPin(e.target.value)}
              ></input>
              <span></span>
              <label className = "label">Please enter your Account Pin</label>
            </div>
            <div className="input">
              <input 
                className = "textField"
                type="text"
                placeholder=""
                required
                onChange={(e) => setdestinationAccount(e.target.value)}
              ></input>
              <span></span>
              <label className = "label">Please enter the Account Number to transfer to</label>
            </div>
            <div className="input">
              <input 
                className = "textField"
                type="pin"
                placeholder=""
                required
                onChange={(e) => setDeposit(e.target.value)}
              ></input>
              <span></span>
              <label className = "label">Please enter the amount to transfer</label>
            </div>
            <div className="transfer-submit">
              <button className="transfer-btn" type="submit">Enter</button>
            </div>
          </div>
        </form>
      </div>
    </div>
      </div>
        <div className="transfer-card-description">
        <p className="transfer-description">Note: You may transfer money from your own personal accounts to eachother or to outside accounts affiliated with Frank Financial Funds. Ensure that you have the suffcient funds to transfer from the source account or else the tranfer will not go through.</p>
        </div>
      </main>
    </div> 
    
    </div>
  );
};
export default Transfer;
