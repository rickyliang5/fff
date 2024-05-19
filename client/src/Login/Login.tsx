import React, { useState, useEffect} from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom'


export const Login = ({ users }) => {   
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login";
    return () => {
      document.title = "Default Page"; 
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', {
          username,
          password,
      });
      
      setRegistrationMessage(response.data.message);
      setErrorMessage('');
      console.log("success")
      navigate('/bank')

    }
      catch {
        console.log("fail")
        setErrorMessage('Login failed, please try again.');
    }
  }
  const GotoSignup = () => {
    navigate('/signup'); 
  };
  const GotoATM = () => {
    navigate('/ATMLogin'); 
  };

  return (
    <div className = "wrapper">
    <div className="container">
      <div className="header">Login</div>
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
                onChange={(e) => setUsername(e.target.value)}
              ></input>
              <span></span>
              <label className = "label">Username</label>
            </div>
            <div className="input">
              <input 
                className = "textField"
                type="password"
                placeholder=""
                required
                onChange={(e) => setPassword(e.target.value)}
              ></input>
              <span></span>
              <label className = "label">Password</label>
            </div>
            <div className="submit">
              <button className="btn" type="submit">Login</button>
            </div>
            <div className="submit">
            <button className="btn" onClick={GotoSignup}>No account? Sign Up!</button>
            </div>
            <div className="submit">
            <button className="btn" onClick={GotoATM}>Virtual ATM!</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};
