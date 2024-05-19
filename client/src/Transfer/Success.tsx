import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import "./Transfer.css";
import axios from "axios";

export const Success = () => {

    const [user, setUser] = useState("");
  const [balance, setBalance] = useState("");
  const [account_number, setAccountNumber] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    document.title = "Successful Transfer!";
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
        setAccountNumber(response.data.id);
        setAccounts(response.data.accounts); 
        setError("");
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Not Authenticated");
      }
    };

    fetchUser();
  }, []);

 
  
  const handleViewAccounts = () => {
    navigate('/user-accounts'); 
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/logout", {
        withCredentials: true,
      });
      console.log(response.data.message);
 
      setUser("");
      setBalance("");
      setAccountNumber("");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      setError("Failed to log out");
    }
  };

      
    return(
    <div className="gridcontainer">
    <header className="header">
        <h3>Transfer Success</h3>
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
                <a href="/Transaction">
                <i className="fa-solid fa-money-bill"></i> Transaction
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
                <button onClick={handleLogout}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i> Log Out
                </button>
            </li>
            <li>
                <button onClick={handleViewAccounts}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i> View Accounts
                </button>
            </li>
            </ul>
        </section>
        <main className="main">
          <div className="transfer-card">
            <div className="transfer-container">
            <p style = {{fontSize: '30px', lineHeight:'1.5', textAlign:'center'}}>Your transfer successfully went through! Your current account balance will be reflected from your transaction and be displayed on your home page. <br /> Thank you again for using Frank Financial Funds!</p>
            </div>
          </div>
        </main>
        
    </div>

    );
}

export default Success;