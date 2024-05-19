import React, { useState, useEffect} from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./stylesheet.css";

export const Deposit = () => {
  const [file, setFile] = useState(null);
  const [amount, setAmount] = useState("");
  const [number, setNumber] = useState("");
  const [user, setUser] = useState("");
  const [balance, setBalance] = useState("");
  const [account_number, setAccountNumber] = useState("");
  const {userId} = useParams();
  const navigate = useNavigate();

  const handleViewAccounts = () => {
    navigate('/user-accounts'); 
  }

  useEffect(() => {
    document.title = "Deposit";
    return () => {
      document.title = "Default Page"; 
    };
  }, []);

  const onImageChange = (event) => {
    setFile(event.target.files[0]);
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
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault(); 
    const formData = new FormData();
    formData.append("file", file);
    formData.append("amount", amount);
    formData.append("number", number);
    axios.post("http://127.0.0.1:5000/upload", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => alert("Balance Updated"))
    .catch((error) => {
      alert("Error uploading file: " + error.response.data);
    });
  };

  return (
    <>
    <title>hi</title>
    <div className = "transfer-wrapper">
      <div className="gridcontainer">
        <header className="header">
          <h3>Deposit</h3>
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
              <div className="login-container">
                <form className='login' onSubmit={handleSubmit}>
                  <div className="inputs">
                  <input type="file" name="image" onChange={onImageChange}></input>
                  <div className="input">
                  <input
                    className="textField"
                    type="text"
                    name="amount"
                    placeholder=""
                    onChange={(e) => setAmount(e.target.value)}
                  ></input>
                  <span></span>
                  <label className = "label">Confirm Amount</label>
                </div>
                <div className="input">
                  <input
                    className="textField"
                    type="text"
                    name="number"
                    placeholder=""
                    onChange={(e) => setNumber(e.target.value)}
                  ></input>
                  <span></span>
                  <label className = "label">Account Number</label>
                </div>
                  <input type="submit"></input>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
        </div>
      </div>
    </>
  );
};
export default Deposit;
