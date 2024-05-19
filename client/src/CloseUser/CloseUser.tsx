import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export const CloseAccount = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const navigate = useNavigate();
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    document.title = "Close Account";
    return () => {
      document.title = "Default Page"; 
    };
  }, []);

  const handleSubmitClose = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/close-account', {
     accountNumber
    }, {
      withCredentials: false
    });
      setRegistrationMessage(response.data.message);
      setErrorMessage('');
      console.log("success")
      navigate('/bank')

    }
      catch {
        console.log("fail")
    }
  }


  return (
    <>
      <div className = "transfer-wrapper">
      <div className="gridcontainer">
      <header className="header">
          <h3>Close Accounts</h3>
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
          </ul>
        </section>
        <main className="main">
          <div className="transfer-card">
            <div className="transfer-container">
              <div className="login-container">
              <form className='login' onSubmit={handleSubmitClose}>
              <div className="inputs">
                <div className="input">
                  <input
                    type="text"
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="textField"
                    placeholder=""
                    required
                  />              
                  <span></span>
                  <label className = "label">Enter Account Number</label>
                </div>
                <div className="transfer-submit">
                  <button className='transfer-btn' type="submit">Close Account</button>
                </div>
                </div>
              </form>
            </div>
          </div>
          </div>
          <div className="transfer-card-description">
            <p className="transfer-description">To remove an account that you have made, please enter the accounter number that you wish to remove. Please allocate and move any assets within that account to other accounts or withdraw them as deleting the account will also cause these assets to be discarded and lost. This action is also IRREVERSIBLE so ensure that this account is the correct on you wish to remove. Thank you!</p>
          </div>
        </main>
        </div> 
      </div>
    </>
  );
};