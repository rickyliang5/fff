import React, {useEffect} from 'react'
import { ReactTyped } from "react-typed";
import { useNavigate } from 'react-router-dom'
import './Home.css'

export const Home = () => {
  
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Welcome to Frank Financial Funds";
    return () => {
      document.title = "Default Page"; 
    };
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/signup'); 
  };
  const handleATMClick = () => {
    navigate('/ATMLogin'); 
  };
  const handleMGMTClick = () => {
    navigate('/MGMTLogin');
  };
 

  return (
    <div className='home-page-grid'>
      <nav className='home-navbar'>
        <div className='home-navbar-div'>
          <a className='home-logo'>FFF</a>
          <div className='button-container'>
          <ul>
            <button className="login-button" onClick={handleLoginClick}>Log In</button>
            <button className="signup-button" onClick={handleSignUpClick}>Sign Up</button>
            <button className="login-button" onClick={handleATMClick}>ATM</button>
            <button className="login-button" onClick={handleMGMTClick}>Management</button>
          </ul>
        </div>
        </div>
      </nav>
      <main className="home-main-content">
          <h1 className='intro'>Frank Financial Funds   
          </h1>
          <div className='content-beneath-intro'>
          {" "}
            <ReactTyped 
            strings={["Fast", "Fluid", "Formidable"]}
            typeSpeed={120}
            loop
            backSpeed={90}
            cursorChar=""
            showCursor={true}
            style={{ fontSize: "60px"}}
            />
          </div>
          <p className='description'></p>
      </main>
    </div>
  );
}
