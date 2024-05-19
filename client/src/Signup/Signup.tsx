import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signup.css';

export const Signup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registrationMessage, setRegistrationMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Sign Up";
        return () => {
          document.title = "Default Page"; 
        };
      }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/signup', {
                email,
                username,
                password,
            });
            setRegistrationMessage(response.data.message);
            setErrorMessage('');
            navigate('/');
        } catch (error: any) {
            console.error('Error:', error);
            if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message) {
                console.log('Error message:', error.response.data.message);
                setErrorMessage(error.response.data.message);
            } else {
                console.log('Unknown error occurred');
                setErrorMessage('An error occurred while processing your request.');
            }
            setRegistrationMessage('');
        }
    };
    const GotoLogin = () => {
        navigate('/Login'); 
    };
      const GotoATM = () => {
        navigate('/ATMLogin'); 
      };


    return (
        <div className='wrapper'>
            <div className='container-signup'>
                <div className='login-container'>
                    <form className="signup-form" onSubmit={handleSubmit}>
                        <h2 className='header'>Sign Up</h2>
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                        <div className="input">
                            <input
                                className="textField"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <span></span>
                            <label className='label'>Email</label>
                        </div>
                        <div className="input">
                            <input
                                className="textField"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <span></span>
                            <label className='label'>Username</label>
                        </div>
                        <div className="input">
                            <input
                                className="textField"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span></span>
                            <label className='label'>Password</label>
                        </div>
                        <button className='btn' type="submit">Sign Up</button>
                        <div className="submit">
                        <button className="btn" onClick={GotoLogin}>Already Signed Up? Log In!</button>
                        </div>
                        <div className="submit">
                        <button className="btn" onClick={GotoATM}>Virtual ATM</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};