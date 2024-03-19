import React, { useState, useContext, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import './Authentication.css';
import io from 'socket.io-client';
import Marquee from 'react-fast-marquee';
import moment from 'moment';

/**Context */
import { VotingContext } from '../../Context/Voting';
/**image */
import logo from '../../assets/logo2big.png';
const Authentication = () =>{
	const {assignedURL, isLoggedIn, setisLoggedIn, usersName, setUsersName, membersInfo, setMembersInfo, VoteTransactions, setVoteTransactions,
            usersID, setUsersID, voteRecords, setVoteRecords, countDown, setCountDown, otpCode, setOtpCode} = useContext(VotingContext);
    
    const [OTPCodePerInput, setOTPCodePerInput] = useState(['', '', '', '', '']);
    const [OTPCode, setOTPCode] = useState('');
    const [password, setPassword] = useState('');
    const [isVotingOpen, setIsVotingOpen] = useState(false);
    const [dayTimer, setDayTimer]= useState('');
    const [hourTimer, setHourTimer]= useState('');
    const [minTimer, setMinTimer]= useState('');
    const [secTimer, setSecTimer]= useState('');

    const nav = useNavigate();
    useEffect(() => {
        fetchVotingTransactions();
    }, []);

    useEffect(() => {
        if(VoteTransactions.length > 0){
            const timer = setInterval(() => {
                calculateCountdown();
            }, 1000);
            return () => clearInterval(timer);
        }
      
    }, [VoteTransactions]);

    useEffect(()=>{

        const socket = io(`${assignedURL}`);
        socket.on('InsertedVoteRecords', (newRecord) => {
            console.log('voteRecordssdadas', newRecord)
        });
        
        socket.on('UpdatedMemberRecord', (newRecord) => {
            console.log('UpdatedMemberRecord', newRecord)
            
            setMembersInfo(prevData =>
                prevData.map(record =>
                    record.id === newRecord.id &&  record.Member_Id === newRecord.Member_Id ? { ...newRecord } : record
                )
            );
        });
        socket.on('OpenVotingTransactions',(newRecord) =>{
            console.log('newRecord',newRecord)
            if(newRecord.length >0){
                const voteStatus = newRecord.filter(rec => rec.Voting_Status === 'Open');
                setVoteTransactions(voteStatus)
                console.log('newRecord',newRecord)
                // console.log('voteStatus',voteStatus)
                console.log('voteStatus',voteStatus)
            }
         
        });
        socket.on('CloseVotingTransactions',(newRecord) =>{
            setVoteTransactions([])
            setIsVotingOpen(false)
        });
        return () => {
            socket.disconnect();
        };
    
    },[]);
    useEffect(() => {
        // Check if all digits are entered
        const isAllDigitsEntered = OTPCodePerInput.every((digit) => digit !== '');

        if (isAllDigitsEntered) {
            const concatenatedOTP = OTPCodePerInput.join('');
            console.log('Concatenated OTP:', concatenatedOTP); // Log the concatenated OTP
            setOTPCode(concatenatedOTP);
        }else{
            setOTPCode('');
        }
    }, [OTPCodePerInput]);



    const handleSubmit = (e) => {
        e.preventDefault();
        if(!isVotingOpen && VoteTransactions.length <= 0){
            alert('No voting transaction created...')
            return
        }
        if(!isVotingOpen && VoteTransactions.length > 0){
            alert('Voting is closed...')
            return
        }
        // Handle login logic here
        // console.log('Logging in with username:', username, 'and password:', password);
        if (OTPCode === 'smart') {
            sessionStorage.setItem('isLoggedIn', true);
            sessionStorage.setItem('usersName', 'smart');
            setisLoggedIn(true);
            setUsersName('smart');
            setUsersID('smart')
            nav('/voting-system');
        }else{
            const memberLoggedIn = membersInfo.find(info => info.OTP_Code === OTPCode);
          
            if(memberLoggedIn){
                const votersValidation = memberLoggedIn.Voting_Status ==='Done' ? true : false;
                // console.log('votersValidation',votersValidation)
                if(votersValidation){
                    alert(`OTP already used or done voting...`);
                }else{
                    const votersValidationLoggedin = memberLoggedIn.Voting_Status ==='Loggedin' ? true : false;

                    if(votersValidationLoggedin){
                        alert(`OTP already logged in...`);
                    }else{
                        updateLoginStatus(memberLoggedIn.Member_Id, 'Loggedin')
                        sessionStorage.setItem('isLoggedIn', true);
                        sessionStorage.setItem('usersName', memberLoggedIn.Member_Name);
                        sessionStorage.setItem('usersID', memberLoggedIn.Member_Id);
                        sessionStorage.setItem('OTP', OTPCode);
                        setOtpCode(OTPCode);
                        console.log('OTPCode',OTPCode)
                        setisLoggedIn(true);
                        setUsersName( memberLoggedIn.Member_Name);
                        setUsersID(memberLoggedIn.Member_Id)
                        nav('/voting-system');
                    }
                }
                
            }else{
                alert(`Incorrect OTP, Please try again...`);
            }
        }
    };

    const updateLoginStatus = async(memberID, memberStatus) =>{
        const updatedMemberStatus = {
            memberID: memberID,
            memberStatus: memberStatus
        }
        try {
			const response = await fetch(`${assignedURL}/update_member_status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedMemberStatus),
            });

            if (response.ok) {
              
                // setCandidates(prevCandidates => [...prevCandidates, ...updatedCandidatesWithVotersName]);
            } else {
                console.error('Error updating records:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating records:', error);
        }
    }
    const handleOTPGeneration = () =>{
        nav('/verification');
    }
    const handleLoginAsAdmin = () =>{
        nav('/administrator');
    }
    // useEffect(()=>{
    //     if(VoteTransactions.length > 0){
    //         const openTransactions  = VoteTransactions.filter( rec => rec.Voting_Status === 'Open')
    //         console.log('vote transactions',openTransactions);
    //         setVoteTransactions(openTransactions);
    //     }
    // },[])


    const calculateCountdown = () => {
        if (VoteTransactions && VoteTransactions.length > 0) {
            const startDate = moment(VoteTransactions[0].Voting_Start_Date).local();
            const endDate = moment(VoteTransactions[0].Voting_End_Date).local();
    
            // Concatenate local dates with times
            const startTime = moment(`${startDate.format('YYYY-MM-DD')}T${VoteTransactions[0].Voting_Start_Time}`);
            const endTime = moment(`${endDate.format('YYYY-MM-DD')}T${VoteTransactions[0].Voting_End_Time}`);
    
            const currentTime = moment();
    
            // console.log('End Time:', endTime);
            // console.log('startTime:', startTime);
            // console.log('Current Time:', currentTime);
    
            let timeDifference;
            let countdownMessage;
            // console.log('End Date String:', `${VoteTransactions[0].Voting_End_Date}T${VoteTransactions[0].Voting_End_Time}`);
            // console.log('Current Date String:', currentTime.format());
            
            if (currentTime < startTime) {
                timeDifference = startTime.diff(currentTime, 'seconds');
                countdownMessage = "Voting starts in:";
                setIsVotingOpen(false);
            } else {
                timeDifference = endTime.diff(currentTime, 'seconds');
                countdownMessage = "Voting ends in:";
                setIsVotingOpen(true);

                if (timeDifference <= 0) {
                    setIsVotingOpen(false);
                    countdownMessage = "Voting has ended";
                    if(VoteTransactions.length>0){
                        updateVoteTransaction();
                    }
                 
                    console.log("Voting has ended.");
                    return;
                }
            }
    
       
            // console.log('timeDifference', timeDifference);
            const duration = moment.duration(timeDifference, 'seconds');
            const days = duration.days().toString().padStart(2, '0'); // Ensure two digits with leading zeros
            const hours = duration.hours().toString().padStart(2, '0'); // Ensure two digits with leading zeros
            const minutes = duration.minutes().toString().padStart(2, '0'); // Ensure two digits with leading zeros
            const seconds = duration.seconds().toString().padStart(2, '0'); // Ensure two digits with leading zeros
            
           const countDown = (countdownMessage);
           console.log('countDown',countDown)
           setDayTimer(days);
           setHourTimer(hours);
           setMinTimer(minutes);
           setSecTimer(seconds);
           setCountDown(countDown)
        }else{
            let countdownMessage;
            countdownMessage = "No Vote transaction is openned.";
            setCountDown(countdownMessage);
        }
    };
    
    
console.log('VoteTransactions',VoteTransactions)

    const handleChange = (index, value) => {
        const newOTPCode = [...OTPCodePerInput];
        newOTPCode[index] = value;
        setOTPCodePerInput(newOTPCode);
    };
    const fetchVotingTransactions = async () => {
        try {
            const response = await fetch(`${assignedURL}/get_voting_transactions`);
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    console.log('vote transactions function',data);
					// const openTransactions  = data.filter( rec => rec.Voting_Status === 'Open')
					// console.log('vote transactions',openTransactions);
                   setVoteTransactions(data);
                //    calculateCountdown();
                } else {
                    console.log('No Records')
                }
            } else {
                console.error('Error:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    const updateVoteTransaction = async() =>{
        const updatedMemberStatus = {
            VoteTransactions: VoteTransactions,
        }
        try {
			const response = await fetch(`${assignedURL}/close_vote_transaction`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedMemberStatus),
            });

            if (response.ok) {
              
                // setCandidates(prevCandidates => [...prevCandidates, ...updatedCandidatesWithVotersName]);
            } else {
                console.error('Error updating records:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating records:', error);
        }
    }
    return(
        <div className="login-container">
            <div className="background-template2"><div className="background-template-inner2"></div></div>
            <div className="login-logo-container">
                 <img src={logo} alt="Example" className="home-logo" />
                 <div className="login-logo-container2">
                    <div><span>Election Day</span></div>
                    <div><span>March 25, 2024</span></div>
                 </div>
            </div>
            <form className="login-form" onSubmit={handleSubmit}>
             
                <h2 className="login-title"></h2>
                <div className="countdown-timer-con">
                  
                        <div className="countdown-msg" style={{color: !isVotingOpen && 'red'}}> {VoteTransactions.length > 0 ? countDown : 'Voting is Closed...'}</div>
                        <div className="countdown-count-con">
                            <div className="countdown-timer">
                                {VoteTransactions.length > 0 && <>
                                    <span className="countdown-timer-number" style={{color: !isVotingOpen && 'red'}}>{dayTimer}</span>
                                    <span className="countdown-timer-text">Day</span>
                                </>}
                            </div>
                            <div className="countdown-timer">
                                {VoteTransactions.length > 0 && <>
                                    <span className="countdown-timer-number" style={{color: !isVotingOpen && 'red'}}>{hourTimer}</span>
                                    <span className="countdown-timer-text">Hours</span>
                                </>}
                            </div>
                            <div className="countdown-timer">
                                {VoteTransactions.length > 0 && <>
                                    <span className="countdown-timer-number" style={{color: !isVotingOpen && 'red'}}>{minTimer}</span>
                                    <span className="countdown-timer-text">Minutes</span>
                                </>}
                           </div>
                          
                            <div className="countdown-timer">
                            {VoteTransactions.length > 0 && <>
                                <span className="countdown-timer-number" style={{color: !isVotingOpen && 'red'}}>{secTimer}</span>
                                <span className="countdown-timer-text">Seconds</span>
                                </>}
                            </div>
                        
                        </div>
                   
                </div>
                <div className="login-form-group">
                    <label htmlFor="otp">OTP Code:</label>
                    <div className="block-input-container">
                        {[...Array(5)].map((_, index) => (
                            <input
                                key={index}
                                type="text"
                                disabled ={isVotingOpen ? false: true}
                                maxLength={1}
                                autoFocus={index === 0} // autofocus on the first input
                                className={isVotingOpen ? 'block-input' : 'disabled-input'}
                                value={OTPCodePerInput[index]}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    handleChange(index, newValue);

                                    // If backspace key is pressed and current input is empty
                                    if (e.nativeEvent.inputType === 'deleteContentBackward' && newValue === '') {
                                        // Move focus to the previous input field
                                        if (index > 0 && e.target.previousSibling) {
                                            e.target.previousSibling.focus();
                                        }
                                    } else {
                                        // Move focus to the next input field
                                        if (newValue && e.target.nextSibling) {
                                            e.target.nextSibling.focus();
                                        }
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>
                {/* <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div> */}
                {/* <div className="form-group-otp">
                    <span className="link-to-otp" onClick={handleOTPGeneration}>Get OTP Code?</span>
                </div> */}
                <div className="form-group-otp">
                    <span className="link-to-otp" onClick={handleLoginAsAdmin}>Login as administrator</span>
                </div>
                <div className="form-group-login">
                    <button type="submit" className="login-button">Login</button>
                </div>
                {/* <button type="submit" className="login-button">Login</button> */}
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

export default Authentication;