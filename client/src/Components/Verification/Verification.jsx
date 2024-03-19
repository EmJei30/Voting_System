import React, { useState, useContext, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import './Verification.css';

/**Context */
import { VotingContext } from '../../Context/Voting';

const Verification = () =>{
	const {assignedURL, isLoggedIn, setisLoggedIn, usersName, setUsersName, membersInfo, setMembersInfo} = useContext(VotingContext);
    const [memberID, setMemberID] = useState('');
    const [memberName, setMemberName] = useState('');
    const [generatedOTP, setGeneratedOTP] = useState('');
    const [OTP, setOTP] = useState(1357);
    const [notificationMsg, setNotificationMsg] = useState('');
    const [isVerification,setIsVerification] = useState('');
    const nav = useNavigate(); 
    // useEffect(()=>{
    //     fetchMembersInfo();
    // },[]);
    useEffect(() => {
        const memberInfo = membersInfo.find(info => info.Member_Id === memberID )
    
        if (memberInfo) { // Check if memberInfo is not undefined or null
            setMemberName(memberInfo.Member_Name);
            // const newVerificationCode1 = generateRandomAlphaNumeric1(4);
            setOTP(OTP + 2);
        }else{
            setMemberName('');
            // setOTP('')
            setGeneratedOTP('');
        } 
    }, [memberID]); // This useEffect will only run when the 'memberID' state changes

    // const fetchMembersInfo = async () => {
	// 	try {
	// 		const response = await fetch(`${assignedURL}/get_members_info`);
	// 		if (response.ok) {
	// 			const data = await response.json();
	// 			if (data.length > 0) {
	// 				setMembersInfo(data);
	// 			} else {
	// 				console.log('No Records')
	// 			}
	// 		} else {
	// 			console.error('Error:', response.status);
	// 		}
	// 	} catch (error) {
	// 		console.error('Error:', error);
	// 	}
	// }
    console.log('OTP', OTP)

    const handleSubmit = (e) => {
        e.preventDefault();
        setGeneratedOTP(OTP)
        if ((memberID !== '' || memberName !== '') && OTP !== '') {
           setNotificationMsg('Member verified...')
           setIsVerification('Success')
           
            const newData = {
                Member_Id: memberID,
                Member_Name: memberName,
                OTP_Code: OTP
            }
            // console.log(newData)
        }else{
            setNotificationMsg('Member ID does not exist...');
            setIsVerification('Failed')
        }
        setTimeout(() => {
            setNotificationMsg('');   
        }, 3000);
    };
    const handleBackToLogin = () =>{
        setMemberID('');
        setMemberName('');
        setGeneratedOTP('');
        nav('/log-in');
    };
    // const generateRandomAlphaNumeric1 = (length) => {
	// 	const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	// 	let result = '';
	// 	for (let i = 0; i < length; i++) {
	// 		const randomIndex = Math.floor(Math.random() * charset.length);
	// 		console.log(randomIndex)
	// 		result += charset[randomIndex];
	// 	}
	// 	return result;
	// };
    return(
        <div className="Verification-container">
            <form className="Verification-form" onSubmit={handleSubmit}>
                <h2>Verification</h2>
                <div className="Verification-notification">
                    {notificationMsg && isVerification === 'Success' &&
                        <div className="Verification-notification-message">
                            <span>{notificationMsg}</span>
                        </div>
                    }
                     {notificationMsg && isVerification === 'Failed' &&
                        <div className="Verification-notification-message-failed">
                            <span>{notificationMsg}</span>
                        </div>
                    }
                </div>
                <div className="Verification-form-group">
                    <label htmlFor="username">Member ID:</label>
                    <input
                        type="text"
                        id="username"
                        value={memberID}
                        onChange={(e) => setMemberID(e.target.value)}
                        required
                        autoComplete="off"
                    />
                </div>
                <div className="Verification-form-group">
                    <label htmlFor="password">Member Name:</label>
                    <input
                        type="text"
                        id="password"
                        disabled = {true}
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        required
                    />
                </div>
                
                <button type="submit" className="Verification-button">Verify</button>
                <div className="Verification-form-group">
                    <label htmlFor="password">Generated OTP:</label>
                    <input
                        type="text"
                        id="otp"
                        disabled = {true}
                        value={generatedOTP}
                        onChange={(e) => setGeneratedOTP(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group-otp-back">
                    <span className="link-to-otp-back" onClick={handleBackToLogin}>Back to login</span>
                </div>
            </form>
        </div>
    );
};

export default Verification;