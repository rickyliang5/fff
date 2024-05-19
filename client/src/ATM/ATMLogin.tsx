import React, { useState, useEffect } from "react";
import "./ATMLogin.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom'


export const ATMLogin = ({ users }) => {   
  const [number, setNumber] = useState("");
  const [pin, setPin] = useState("");
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ATM Login";
    return () => {
      document.title = "Default Page"; 
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/ATMlogin', {
          number,
          pin,
      });
      
      setRegistrationMessage(response.data.message);
      setErrorMessage('');
      console.log("account:", number)
      navigate('/ATM')

    }
      catch {
        console.log("fail")
        setErrorMessage('Login failed, please try again.');
    }
  }
  const GotoMain = () => {
    navigate('/'); 
  };


  return (
    <div className = "wrapper">
    <div className="container">
      <div className="header">ATM Login</div>
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
                onChange={(e) => setNumber(e.target.value)}
              ></input>
              <span></span>
              <label className = "label">Account Number</label>
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
              <label className = "label">Pin</label>
            </div>
            <div className="submit">
              <button className="btn" type="submit">Enter</button>
            </div>
            <div className="submit">
              <button className="btn"  onClick={GotoMain} >Go Back Home</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};