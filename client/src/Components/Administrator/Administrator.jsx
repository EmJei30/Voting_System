import React, { useState, useContext, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import './Administrator.css';
import Marquee from 'react-fast-marquee';
/**Context */
import { VotingContext } from '../../Context/Voting';
/**image */
import logo from '../../assets/logo2big.png';

const Administrator = () =>{
	const {assignedURL, isLoggedIn, setisLoggedIn, usersName, setUsersName} = useContext(VotingContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const nav = useNavigate();

    
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     // Handle login logic here
    //     console.log('Logging in with username:', username, 'and password:', password);
    //     if (username === 'admin' && password === 'admin') {
    //         sessionStorage.setItem('isLoggedIn', true);
    //         sessionStorage.setItem('usersName', 'Admin');
    //         setisLoggedIn(true);
    //         setUsersName('Admin');
    //         nav('/admin-maintenance');
    //     }else{
    //         // sessionStorage.setItem('isLoggedIn', true);
    //         // sessionStorage.setItem('usersName', 'Admin');
    //         // setisLoggedIn(true);
    //         // setUsersName('Admin');
    //         // nav('/voting-system');
    //         alert('Invalid credentials. Please check username or password...')
    //     }
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const response = await fetch(`${assignedURL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
    
        if (response.ok) {
            const data = await response.json();
            if (data) {
                sessionStorage.setItem('isLoggedIn', true);
                sessionStorage.setItem('usersName', data.username);
                setisLoggedIn(true);
                setUsersName(data.username);
                nav('/admin-maintenance');
            } else if (response.status === 401) {
                // Display alert for specific error message from backend for 400 status code
                const responseData = await response.json();
                if (responseData.error) {
                    alert(responseData.error);
                } else {
                    alert('User not found');
                }
            }else {
                alert('Invalid credentials. Please check username or password...');
            }
        } else {
            alert('Failed to login. Please try again later...');
        }
    };
    const handleBackToLogin = () =>{
        nav('/log-in');
    }
    return(
        <div className="Administrator-container">
             <div className="background-template2"><div className="background-template-inner2"></div></div>
             <div className="login-logo-container">
                 <img src={logo} alt="Example" className="home-logo" />
                 <div className="login-logo-container2">
                    <div><span>Election Day</span></div>
                    <div><span>March 25, 2024</span></div>
                 </div>
                
            </div>
            <form className="Administrator-form" onSubmit={handleSubmit}>
                <h2>Login as Administrator</h2>
                <div className="Administrator-form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoComplete="off"
                        autoFocus
                    />
                </div>
                <div className="Administrator-form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {/* <div className="form-group-otp">
                    <span className="link-to-otp" onClick={handleOTPGeneration}>Get OTP Code?</span>
                </div> */}
                  <div className="Administrator-form-group-button">
                  <button type="submit" className="Administrator-button">Login</button>
                </div>
                
                <div className="Administrator-form-group-otp-back">
                    <span className="link-to-otp-back" onClick={handleBackToLogin}>Back to login</span>
                </div>
            </form>
            <div className="marque-con">
                <div className="marque-content">
                    <Marquee direction="left" gradient={false} speed={50}>
                            <span>Powered by Datasmart</span>
                    </Marquee>
                </div>
            </div>
        </div>
    );
};

export default Administrator;