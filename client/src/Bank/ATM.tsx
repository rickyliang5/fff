import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Link } from "react-router-dom";
import "./stylesheet.css";
import axios from "axios";
axios.defaults.withCredentials = true;

export const ATM = () => {
  const [amount, setAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [balance, setBalance] = useState("");
  const [account, setAccountnumber] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ATM";
    return () => {
      document.title = "Default Page"; 
    };
  }, []);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/ATM", {
          withCredentials: true,
        });
        setBalance(response.data.balance);
        setAccountnumber(response.data.account_number);
      } catch (error) {   
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const numAmount = parseFloat(amount);
    const numBalance = parseFloat(balance);
    if (numBalance > numAmount) {
      const newBalance = numBalance - numAmount;
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/ATMupdate",
          {
            newBalance,
          },
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          const transactionDataOutgoing = {
              account_number: account,
              transaction_type: 'Widthdraw',
              amount: -amount
          };
          const res1 = await axios.post("http://127.0.0.1:5000/Transactions", transactionDataOutgoing);
          console.log(res1.data);
        }
        console.log("success");

        setBalance(newBalance.toString());
      } catch {
        console.log("fail");
      }
    } else alert("Error: Not enough balance");
  };

  const handleSubmitDeposit = async (event) => {
    event.preventDefault();
    const numAmount = parseFloat(depositAmount);
    const numBalance = parseFloat(balance);
    const newBalance = numBalance + numAmount;
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/ATMupdate",
        {
          newBalance,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        const transactionDataOutgoing = {
            account_number: account,
            transaction_type: 'Deposit',
            amount: depositAmount
        };
        const res1 = await axios.post("http://127.0.0.1:5000/Transactions", transactionDataOutgoing);
        console.log(res1.data);
      }
      console.log("success");

      setBalance(newBalance.toString());
    } catch {
      console.log("fail");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/logout", {
        withCredentials: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <div className="gridcontainer">
        <header className="header">
          <h3>ATM Withdrawal</h3>
        </header>

        <section className="sidebar">
          <h2>Frank Financial Funds</h2>
          <ul>
            <li>
              <a href="/" onClick={handleLogout}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i> Log Out
              </a>
            </li>
          </ul>
        </section>
        <main className="main-atm">
          <div className="card">
            <h5>Enter the amount you wish to Withdraw</h5>
            <h5>Balance: {balance}</h5>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="Amount" style={{ color: "white" }}>
                  Amount
                </label>
                <div className='amountmargin'></div>
                <input
                  type="text" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                ></input>
              </div>
              <div className='depositbuttonmargin'></div>
              <button className="btnATM" type="submit">
                Withdraw
              </button>
            </form>
          </div>
          <div className="card">
            <h5>Enter the amount you wish to Deposit</h5>
            <h5>Balance: {balance}</h5>
            <form onSubmit={handleSubmitDeposit}>
              <div>
                <label htmlFor="Amount" style={{ color: "white" }}>
                  Amount
                </label>
                <div className='amountmargin'></div>
                <input
                  type="text" 
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                ></input>
              </div>
              <div className='depositbuttonmargin'></div>
              <button className="btnATM" type="submit">
                Deposit
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default ATM;