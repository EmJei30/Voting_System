import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Voting.css';
import io from 'socket.io-client';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FaXmark } from "react-icons/fa6";
import { FaQuestion } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
/**Context */
import { VotingContext } from '../../Context/Voting';
/**icon */
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import KeyboardArrowLeftSharpIcon from '@mui/icons-material/KeyboardArrowLeftSharp';
import KeyboardArrowRightSharpIcon from '@mui/icons-material/KeyboardArrowRightSharp';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';

/**image */
import warning from '../../assets/warning.png';
/**image */
import logo from '../../assets/logo2.png';
import logobig from '../../assets/logo2big.png';
const Voting = () => {
    const { assignedURL, isLoggedIn, setisLoggedIn, usersName, setUsersName, candidates, setCandidates,  usersID, setUsersID, setVoteRecords, membersInfo, setMembersInfo, otpCode, setOtpCode } = useContext(VotingContext);
    const [uploadedCsvFile, setUploadedCsvFile] = useState([]);
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [groupedCandidates, setGroupedCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState([]);
    const [maxCandidatesPerPositionState, setMaxCandidatesPerPositionState] =  useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [alertMessage, setAlertMessage]= useState('');
    const [isSubmitConfirmation, setIsSubmitConfirmation] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isNotification, setIsNotification] = useState(false);
    const [notificationMSG, setNotificationMSG] = useState('');
    const [notificationMSG2, setNotificationMSG2] = useState('');
    const [isError, setIsError]= useState(false);
    const [isSuccess, setIsSuccess]= useState(false);
    const [isConfirmSubmit, setIsConfirmSubmit]= useState(false);

    const [timer, setTimer] = useState(0);
    const [intervalId, setIntervalId] = useState(null);


    const [dataForConfirmation, setDataForConfirmation] = useState([]);
    const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
    const positions = Object.keys(groupedCandidates);

    const currentPosition = positions[currentPositionIndex];
    const nav = useNavigate();

    console.log('membersInfo',membersInfo)
    useEffect(() => {
        fetchCandidates();
        fetchCandidatesMaxCount();
        const selectedCandidateJSON = localStorage.getItem('selectedCandidate');
        const selectedcandidate = selectedCandidateJSON ? JSON.parse(selectedCandidateJSON) : {}; 

        const selectedRecordsJSON = localStorage.getItem('selectedRecords');
        const selectedrecords = selectedRecordsJSON ? JSON.parse(selectedRecordsJSON) : {}; 

        const otp =  sessionStorage.getItem('OTP');
        setOtpCode(otp);

        const issubmitted = localStorage.getItem('isSubmitted');
        setSelectedRecords(selectedrecords)
        setIsSubmitted(issubmitted);
        setSelectedCandidate(selectedcandidate)
    }, []);

    useEffect(()=>{

        const socket = io(`${assignedURL}`);
        
        socket.on('UpdatedMemberRecord', (newRecord) => {
            console.log('UpdatedMemberRecord', newRecord)
            setMembersInfo(prevData =>
                prevData.map(record =>
                    record.id === newRecord.id &&  record.Member_Id === newRecord.Member_Id ? { ...newRecord } : record
                )
            );
        });
        return () => {
            socket.disconnect();
        };
    
    },[]);


    /**UseEffect for Timer */
    useEffect(() => {
        if(!isSubmitted){
            const id = setInterval(() => {
                setTimer(prevTimer => prevTimer + 1);
            }, 1000); // Update the timer every second
    
            setIntervalId(id); // Store the interval ID in state
    
            return () => clearInterval(id); // Clear the interval on component unmount
        }
      
    }, []);

    const handleNextPosition = () => {
        setCurrentPositionIndex(prevIndex => (prevIndex + 1) % positions.length);
    };

    const handlePreviousPosition = () => {
        setCurrentPositionIndex(prevIndex => (prevIndex - 1 + positions.length) % positions.length);
    };


    const fetchCandidates = async () => {
        try {
            const response = await fetch(`${assignedURL}/get_candidates_info`);
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    console.log(data);
                    const list = CandidatesList(data);
                    console.log('grouped', list);
                    setGroupedCandidates(list);
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
    const fetchCandidatesMaxCount = async () => {
        try {
            const response = await fetch(`${assignedURL}/get_candidates_max_count`);
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    console.log('get_candidates_max_count',data);
                    setMaxCandidatesPerPositionState(data)
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
    const CandidatesList = (candidatesData) => {
        const groupedCandidates = {};

        candidatesData.forEach(candidate => {
            const pos = candidate.Candidate_Position;
            if (!groupedCandidates[pos]) {
                groupedCandidates[pos] = [];
            }
            groupedCandidates[pos].push(candidate);
        });

        return groupedCandidates;
    };
    const handleLogout = () => {
        const UpdatedCandidates = Object.values(selectedCandidate).flat();
        if(UpdatedCandidates.length > 0 && !isSubmitted){
            setShowAlert(true);
            setAlertMessage('You are about to leave this page without submitting. All selected candidates will be reset. Do you really want to leave without submitting?');
            return
        }
       
        if(!isSubmitted){
            updateLoginStatus(usersID, '')
        }
      
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('usersName');
        sessionStorage.removeItem('usersID');
        sessionStorage.removeItem('OTP');
        localStorage.removeItem('selectedCandidate');
        localStorage.removeItem('isSubmitted');
        localStorage.removeItem('selectedRecords');
      
        setOtpCode('');
        setSelectedRecords([])
        setisLoggedIn(false);
        setIsSubmitted(false)
        setUsersName('');
        setUsersID('');
        setGroupedCandidates([]);
        setSelectedCandidate([]);
        setShowAlert(false)
        setAlertMessage('');
        nav('/');
        setisLoggedIn(false);
    }
    
    const handleConfirmLogout = () => {
        if(!isSubmitted){
            updateLoginStatus(usersID, '')
        }
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('usersName');
        sessionStorage.removeItem('usersID');
        sessionStorage.removeItem('OTP');
        localStorage.removeItem('selectedCandidate');
        localStorage.removeItem('isSubmitted');
        localStorage.removeItem('selectedRecords');
        setOtpCode('');
        setSelectedRecords([])
        setIsSubmitted(false)
        setisLoggedIn(false);
        setUsersName('');
        setUsersID('');
        setGroupedCandidates([]);
        setSelectedCandidate([]);
        setShowAlert(false)
        setAlertMessage('');
        nav('/');
        setisLoggedIn(false);
    }
  
    const handleChooseCandidate = (pos, can) => {
        if(isSubmitted){
            setIsNotification(true);
            setNotificationMSG('Vote already submitted ..')
            setNotificationMSG2('Unable to update records...');
            setIsError(true)
            return
        }
        // Check if the candidate is already selected
        if (selectedCandidate[pos]?.find(candidate => candidate.id === can.id)) {
            // If the candidate is already selected, do nothing
            // alert(`Candidate already chosen.`);
            setIsNotification(true);
            setNotificationMSG('Candidate already choosen...')
            setNotificationMSG('Please select another candidate...')
            setIsError(true)
            return;
        }

        // Assuming maxCandidatesData is the array containing candidate counts and positions
        const maxCandidatesPerPosition = {};
    
        // Extract position and candidate count from each candidate object and populate maxCandidatesPerPosition
        maxCandidatesPerPositionState.forEach(candidate => {
            maxCandidatesPerPosition[candidate.Candidate_Position] = candidate.Candidate_Count;
        });
    
        // Check if the maximum limit for the position has been reached
        if (!selectedCandidate[pos] || selectedCandidate[pos].length < maxCandidatesPerPosition[pos]) {
            // Update the candidate's Vote_Count property
            const updatedCandidate = { ...can, Vote_Count: can.Vote_Count + 1 };
    
            setSelectedCandidate(prevState => {
                const updatedCandidates = { ...prevState };
    
                // If the maximum limit is not reached and the candidate doesn't exist, add the candidate
                if (!updatedCandidates[pos]) {
                    updatedCandidates[pos] = [];
                }
                updatedCandidates[pos] = [...updatedCandidates[pos], updatedCandidate]; // Add candidate to array
    
                localStorage.setItem('selectedCandidate', JSON.stringify(updatedCandidates))

                // Check if selectedRecords exists and is an array
                    const initialSelectedRecords = Array.isArray(selectedRecords) ? selectedRecords : [];

                    // Check if the candidate is already selected based on its ID
                    const isCandidateSelected = initialSelectedRecords.some(record => record.id === can.id);

                    // If the candidate is not already selected
                    if (!isCandidateSelected) {
                        // Create a new array with the previous selectedRecords and the new candidate
                        const updatedSelectedRecords = [...initialSelectedRecords, can];
                        
                        // Update the selectedRecords state
                        setSelectedRecords(updatedSelectedRecords);
                        
                        // Store the updated selectedRecords state in localStorage
                        localStorage.setItem('selectedRecords', JSON.stringify(updatedSelectedRecords));
                    }

                return updatedCandidates;
            });
        
        } else {
            // If the maximum limit is reached, display an alert
            // alert(`Maximum number of candidates (${maxCandidatesPerPosition[pos]}) reached for position ${pos}.`);
            setIsNotification(true);
            setNotificationMSG(`Maximum number of candidates (${maxCandidatesPerPosition[pos]}) reached for position ${pos}...`)
            setIsError(true)
        }
    };
    
    /**Function to remove candidate */
    const handleRemoveCandidate = (pos, can) => {
        if(isSubmitted){
            setIsNotification(true);
            setNotificationMSG('Vote already submitted...');
            setNotificationMSG2('Unable to update records...');
            setIsError(true)
            return
        }
            
        // Check if selectedRecords exists and is an array
        const initialSelectedRecords = Array.isArray(selectedRecords) ? selectedRecords : [];

        // Check if the candidate is already selected based on its ID
        const isCandidateSelected = initialSelectedRecords.some(record => record.id === can.id);

            // If the candidate is already selected, remove it from the selectedRecords state
            if (isCandidateSelected) {
                const updatedSelectedRecords = initialSelectedRecords.filter(record => record.id !== can.id);
                
                // Update the selectedRecords state
                setSelectedRecords(updatedSelectedRecords);
                
                // Store the updated selectedRecords state in localStorage
                localStorage.setItem('selectedRecords', JSON.stringify(updatedSelectedRecords));
            }
            
        

        setSelectedCandidate(prevState => {
            const updatedCandidates = { ...prevState };
    
            // If the position exists in the selected candidates
            if (updatedCandidates[pos]) {
                // Remove the candidate from the selected candidates for the position
                updatedCandidates[pos] = updatedCandidates[pos].filter(candidate => candidate.id !== can.id);
            }
            localStorage.setItem('selectedCandidate', JSON.stringify(updatedCandidates))
            return updatedCandidates;
        });
    };
    // const handleRemoveCandidate = (pos, can) => {
    //     setSelectedCandidate(prevState => {
    //         const updatedCandidates = { ...prevState };
    
    //         // If the position exists in the selected candidates
    //         if (updatedCandidates[pos]) {
    //             // Remove the candidate from the selected candidates for the position
    //             updatedCandidates[pos] = updatedCandidates[pos].filter(candidate => {
    //                 if (candidate.id === can.id) {
    //                     // Update the candidate's Vote_Count property
    //                     candidate.Vote_Count -= 1;
    //                 }
    //                 return candidate.id !== can.id;
    //             });
    //         }
    //         return updatedCandidates;
    //     });
    // };
    
    /**Function to submit vote */
    const handleSubmitVote = async() =>{
        const positionsWithNoCandidates = [];

        // Iterate over maxCandidatesPerPositionState
        for (const positionData of maxCandidatesPerPositionState) {
            const positionExists = Object.keys(selectedCandidate).includes(positionData.Candidate_Position);
            if (!positionExists) {
                // If the Candidate_Position doesn't exist in selectedCandidate, add it to positionsWithNoCandidates
                positionsWithNoCandidates.push(positionData.Candidate_Position);
            }
        }

        // console.log('Positions with no candidates:', positionsWithNoCandidates);

        // Now you can proceed with the rest of your logic
        // Iterate over the entries of selectedCandidate to check for positions with no candidates and handle them accordingly
        for (const [position, candidates] of Object.entries(selectedCandidate)) {
            // Check if the length of candidates array is less than 1
            if (candidates.length < 1) {
                // If found, add the position to the array
                positionsWithNoCandidates.push(position);
            }
        }
        console.log('submit vote', positionsWithNoCandidates);
        // Check if there are positions with no candidates
        if (positionsWithNoCandidates.length > 0) {
            // Display an alert with all positions that have no candidates selected
            setIsNotification(true);
            setNotificationMSG(`No candidates selected for positions: ${positionsWithNoCandidates.join(', ')}`)
            setIsError(true)
            return; // Exit the function
        }
    

        /**Update the state to destruction into the group */
        const UpdatedCandidates = Object.values(selectedCandidate).flat();

        /**add property and value to the state */
        const updatedCandidatesWithVotersName = UpdatedCandidates.map(candidate => ({
            ...candidate,
            Voters_Name: usersName,
            Voters_Id: usersID 
        }));
        
       /**create a group for Candidate Position */
        const grouped = maxCandidatesPerPositionState.reduce((acc, candidate) => {
            const position = candidate.Candidate_Position;
            acc[position] = []; // Initialize each position with an empty array
            return acc;
        }, {});
         
        /**iterate through all the selected candidate
         * check for matching group based on Candidate_Position then push if any
         */
        UpdatedCandidates.filter(candidate => {
            const position = candidate.Candidate_Position;
            if (grouped[position]) {
                grouped[position].push(candidate); // Push candidate into the matching group
                return false; // Remove the candidate from UpdatedCandidates
            }
            return true; // Keep the candidate in UpdatedCandidates
        });
         /**Set the grouped data for confirmation and printing */
          setDataForConfirmation(grouped);
        if(updatedCandidatesWithVotersName.length > 0){
            setShowConfirmation(true)
        }else{
            // alert(`No vote to be submitted...`);
            setIsNotification(true);
            setNotificationMSG(`No vote to be submitted...`)
            setIsError(true)
        }
       
    }
    // console.log('submit vote', timer)
    const handleSubmitVoteFinal = async() =>{
        console.log('submit vote', selectedCandidate)
        
        /**Update the state to destruction into the group */
        const UpdatedCandidates = Object.values(selectedCandidate).flat();

        /**add property and value to the state */
        const updatedCandidatesWithVotersName = UpdatedCandidates.map(candidate => ({
            ...candidate,
            Voters_Name: usersName,
            Voters_Id: usersID ,
            Voting_Duration: timer
        }));
    
        try {
			const response = await fetch(`${assignedURL}/update_vote`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedCandidatesWithVotersName),
            });

            if (response.ok) {
                clearInterval(intervalId);
                setVoteRecords(prevVoteRecors => [...prevVoteRecors,...updatedCandidatesWithVotersName ])
                setIsSubmitted(true)
                localStorage.setItem('isSubmitted', true)
                setIsSubmitConfirmation(true)  
                setShowConfirmation(false)
                // setNotificationMSG(`Vote successfully submitted ?...`)
                // setIsSuccess(true);
                // setTimeout(() => {
                    setNotificationMSG('');
                    setNotificationMSG2('');
                //     setIsSuccess(false);
                    setIsNotification(false);
                // }, 5000);
                // setCandidates(prevCandidates => [...prevCandidates, ...updatedCandidatesWithVotersName]);
            } else {
                console.error('Error updating records:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating records:', error);
        }
    }
    const handlePrintReceipt = () =>{
        console.log('print');
    }
    const handleDownloadReceipt = () =>{
        console.log('asdadasdas')
        generatePDF(dataForConfirmation);
    }
    const generatePDF = (dataForConfirmation) => {
        const doc = new jsPDF({
            orientation: 'p', // portrait orientation
            unit: 'pt', // points
            format: 'letter', // letter size
            putOnlyUsedFonts: true,
            floatPrecision: 16, // Precision of coordinates and dimensions
            compress: true // Compress output
        });
    
        // Set margins
        const marginLeft = 20; // Adjust left margin
        const marginRight = 20; // Adjust right margin
        const marginTop = 20; // Adjust top margin
        const marginBottom = 20; // Adjust bottom margin
    
        // Set the page width and height considering the margins
        const pageWidth = doc.internal.pageSize.getWidth() - marginLeft - marginRight;
        const pageHeight = doc.internal.pageSize.getHeight() - marginTop - marginBottom;
    
        // Set up initial y-position for content
        let yPos = marginTop;
    
        // Add "Voter's Copy" label on the left side
        doc.setFontSize(12);
        doc.setTextColor(0); // Set text color to black
        doc.text(`Voter's Copy`, 40, yPos);
        yPos += 20; // Adjust vertical spacing
    
        // Add user's name on the left side
        doc.text(`Name: ${usersName}`, 40, yPos);
        yPos += 20; // Adjust vertical spacing
    
        // Add additional text on the left side
        doc.text(`Reference No: ${otpCode}`, 40, yPos);
        yPos += 20; // Adjust vertical spacing
    
        // Iterate over each position in dataForConfirmation
        for (const position in dataForConfirmation) {
            const candidates = dataForConfirmation[position];
            const lastCandidateIndex = candidates.length - 1; // Index of the last candidate
    
            // Add position header on the left side
            doc.setFontSize(12);
            doc.setTextColor(0); // Set text color to black
            doc.text(`${position} :`, 40, yPos); // Print position name
            yPos += 20;
    
            // Add candidates under the position on the left side
            candidates.forEach((candidate, index) => {
                doc.text(`- ${candidate.Candidate_Name}`, 60, yPos);
                yPos += 15; // Adjust vertical spacing between candidates
    
                // Draw a horizontal line after the last candidate
                if (index === lastCandidateIndex) {
                    doc.line(40, yPos, pageWidth / 2 - 40, yPos);
                    yPos += 5; // Adjust vertical spacing after the line
                }
            });
    
            // Remove line between positions
            yPos += 10; // Add some extra spacing between positions
        }
    
        // Add "Company Copy" label on the right side
        doc.text(`Company Copy`, pageWidth / 2 + 40, marginTop);
        yPos = marginTop + 20; // Reset yPos for the right side
    
        // Add user's name on the right side
        doc.text(`Name: ${usersName}`, pageWidth / 2 + 40, yPos);
        yPos += 20; // Adjust vertical spacing
    
        // Add additional text on the right side
        doc.text(`Reference No: ${otpCode}`, pageWidth / 2 + 40, yPos);
        yPos += 20; // Adjust vertical spacing
    
        // Iterate over each position in dataForConfirmation (same as left side)
        for (const position in dataForConfirmation) {
            const candidates = dataForConfirmation[position];
            const lastCandidateIndex = candidates.length - 1; // Index of the last candidate
    
            // Add position header on the right side
            doc.setFontSize(12);
            doc.setTextColor(0); // Set text color to black
            doc.text(`${position} :`, pageWidth / 2 + 40, yPos); // Print position name
            yPos += 20;
    
            // Add candidates under the position on the right side
            candidates.forEach((candidate, index) => {
                doc.text(`- ${candidate.Candidate_Name}`, pageWidth / 2 + 60, yPos);
                yPos += 15; // Adjust vertical spacing between candidates
    
                // Draw a horizontal line after the last candidate
                if (index === lastCandidateIndex) {
                    doc.line(pageWidth / 2 + 40, yPos, pageWidth - 40, yPos);
                    yPos += 5; // Adjust vertical spacing after the line
                }
            });
    
            // Remove line between positions
            yPos += 10; // Add some extra spacing between positions
        }
    
        // Save or print the document
        doc.save(`voting_receipt_${usersName}.pdf`);
    
        // Save the PDF as a blob
        const pdfBlob = doc.output('blob');
    
        // Create a URL for the blob
        const pdfURL = URL.createObjectURL(pdfBlob);
    
        // Open the PDF in a new window
        window.open(pdfURL, '_blank');
    };
    
    const handleClose = () =>{
        setIsSubmitConfirmation(false);
    }
    console.log('dataForConfirmation', dataForConfirmation);
    const HandelResetVote = () =>{
        if(isSubmitted){
            // alert('Vote already submitted...')
            setIsNotification(true);
            setNotificationMSG('Vote already submitted...')
            setNotificationMSG2('Final vote will not be editted...')
            setIsError(true)
            
            return
        }
        setSelectedCandidate([]);
        setSelectedRecords([]);
        setDataForConfirmation([]);
        localStorage.removeItem('selectedCandidate');
        localStorage.removeItem('selectedRecords');

    }
    /**function to close notification */
    const handleCloseNotification = () =>{
        setIsNotification(false);
        setNotificationMSG('');
        setIsError(false)
        setIsSuccess(false)
        setIsNotification(false);
        setIsConfirmSubmit(false);
        setIsConfirmSubmit(false);
        setNotificationMSG2('');
    }

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
    const handleConfirmNotification = () =>{
        if(isSubmitted){
            // alert(`Vote records already submitted...`);
            setIsNotification(true);
            setNotificationMSG(`Vote records already submitted...`)
            setIsError(true)
            
            return
        }
        setIsNotification(true)
        setIsConfirmSubmit(true);
        setNotificationMSG(`Confirm to Submit vote...`)
        setNotificationMSG2(`Please take note that after submitting, votes will not be editted. ...`)
    }
    const confirmSubmit = () =>{
        handleSubmitVoteFinal();
        setIsConfirmSubmit(false);
       
       
    }
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      };
    return (
        <div className="Voting-Home_Con">
             {/* <div className="background-template"><div className="background-template-inner"></div></div> */}
              {/* Pop up message when log out but already select candidates*/}
            {showAlert && (
                <div className="Voting-Home_Con-alert">
                    <div className="alert">
                        <div className="alert-line">
                        </div>
                        <div className="alert-content">
                            <div className="alert-content-icon">
                                <img src={warning} alt="Example" className="home-logo" />
                            </div>
                            <div className="alert-content-message">
                                <p>Unsubmitted changes</p>
                                <p className="msg">{alertMessage}</p>
                            </div>
                        </div>
                        <div className="alert-buttons">
                            <button onClick={handleConfirmLogout} className="alert-buttons1">Leave without submitting</button>
                            <button onClick={() => setShowAlert(false)} className="alert-buttons2">Continue voting</button>
                        </div>


                    </div>
                </div>
             )} 
             {/* Pop up message to view votes*/}
             {showConfirmation && (
                 <div className="Voting-Home_Con-confirmation">
                    <div className="Voting-confirmation">
                        <div className="Voting-confirmation-details-box"></div>
                            <div className="Voting-confirmation-voter">
                               
                                <div className="Voting-confirmation-voter-span"> 
                                    <span >Summary of your vote</span> 
                                </div>
                                <div className="Voting-logo-container">
                                    <span>{formatTime(timer)}</span>
                                    <img src={logo} alt="Example" className="home-logo" />
                                </div>
                              
                                {/* <span className="Voters-name">Name : &nbsp;{usersName}</span> */}
                            </div>
                            <div className="Voting-confirmation-details">
                            
                                {Object.entries(dataForConfirmation).map(([position, candidates]) => (
                                    <div key={`${position}-group`} className="Voting-confirmation-details-container">
                                      <span  className="Voting-confirmation-details-h2">{position}</span>
                                        <div className="Voting-confirmation-details-content">
                                            <div className="Voting-confirmation-position-list">
                                                {/* <ul>
                                                {candidates.map(candidate => (
                                                    <li key={`${candidate.Candidate_Position}-${candidate.id}`}>{candidate.Candidate_Name}</li>
 
                                                ))}
                                            </ul> */}

                                        {candidates.map(candidate => (
                                            <div key={`${position}-${candidate.id}`} className="Voting-confirmation-candidate-list-selected">
                                            
                                                    <div className="candidate-image-container2">
                                                        <img src={`${assignedURL}/images/${candidate.Image_File}`} alt={candidate.Candidate_Name} className='candidate-image'  />
                                                    </div>
                                                
                                                    <div className="candidate-name-container3"><p>{candidate.Candidate_Name}</p></div>
                                            
                                            </div>
                                        ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="confirmation-buttons-con">
                                <div className="confirmation-buttons">
                                    {!isSubmitted && <button onClick={handleConfirmNotification}  className="confirmation-buttons2">Submit</button>}
                                    {/* <button onClick={handlePrintReceipt}  className="confirmation-buttons2">Print</button> */}
                                  
                                    {isSubmitted &&  <button onClick={handleDownloadReceipt}  className="confirmation-buttons2" disabled={isSubmitted ? false: true}>Print Vote</button>}
                                    {/* <button onClick={HandelResetVote} className="confirmation-buttons2">Reset Vote</button> */}
                                    <button onClick={() => setShowConfirmation(false)}  className="confirmation-buttons2">Cancel</button>
                                </div>
                        </div>
                    </div>
                   
                </div>
             )} 
            {/* Pop up message to confirm when the vote is submitted*/}
              {isSubmitConfirmation && (
                 <div className="Voting-Confirmation-container">
                    <div className="confirmation-print">
                        <div className="confirmation-print-area">
                                <div className="confirmation-print-area-outer">
                                    <div className="confirmation-print-area-inner">
                                        <div className="confirmation-print-area-inner1">
                                            <div>
                                                <p>THANK YOU</p>
                                                <p>for</p>
                                                <p>VOTING</p>
                                            </div>  
                                        </div>
                                        <div className="confirmation-print-area-inner2">
                                            <div>
                                                <p>Your Vote is Confidential and safe with us,</p>
                                                <p>Want to have a copy of your vote? </p>
                                                <p>please click below</p>
                                            </div>  
                                        </div>
                                    </div>
                                    <div className="confirmation-print-area-button">
                                         <button onClick={handleDownloadReceipt}  className="confirmation-buttons2">PRINT VOTE</button>
                                    </div>
                                </div>
                        </div>
                        <div className="confirmation-print-logo">
                                <div className="confirmation-print-header">
                                    <CancelIcon fontSize="large" className="confirmation-print-header-close" onClick={handleClose}/>
                                </div>
                                <div className="confirmation-logo-container">
                                    <img src={logobig} alt="Example" className="home-logo" />
                                </div>
                                <div className="confirmation-logo-container2">
                                    <button onClick={handleLogout}  className="confirmation-buttons2" style={{backgroundColor: '#bf1a00', border: 'none'}}>Exit</button>
                                </div>
                        </div>
                   </div>
                </div>
             )} 
                 {/* Pop up message to notify for errors*/}
              {isNotification && (
                 <div className="Voting-notification-container">
                    <div className="notification-print">
                        <div className="notification-header">
                            {isError && <div className="error-icon-con"><FaXmark className="error-icon"/></div>}
                            {/* {isSuccess && <div className="success-icon-con"><FaCheck className="success-icon"/></div>} */}
                            {isConfirmSubmit && <div className="confirm-icon-con"><FaQuestion className="confirm-icon"/></div>}
                        </div>
                        <div className="notification-content">
                            <p>{notificationMSG}</p>
                             <p style={{color: '#CC3636'}}><i>{notificationMSG2}</i></p>
                        </div>
                       
                            <div className="notification-button">
                                {isError &&
                                    <button onClick={handleCloseNotification}  className="notification-button2">OK</button>
                                }       
                                {/* {isSuccess &&
                                    <button onClick={handleCloseNotification}  className="notification-button2">OK</button>
                                }       */}
                                {isConfirmSubmit &&
                                <>
                                    <button onClick={confirmSubmit}  className="notification-button2">Confirm</button>
                                    <button onClick={handleCloseNotification}  className="notification-button2">Cancel</button>
                                </>
                                   
                                }
                            </div>
                       
                          
                   </div>
                </div>
             )} 
           
            <div className="Voting-tab-container">
                <div className="Voting-tab-container-con">
                    
                    <div className="Voting-tab-container-con-name">
                        <span>Welcome! &nbsp;{usersName}</span>
                    </div>
                    <div className="Voting-tab-container-con-button">
                        <span onClick={handleLogout}>Logout</span>
                    </div>
                   
                </div>
               
                <div className="Voting-tab-body">
                    {/* <div className="Voting-tab-body-selected">
                        {Object.entries(selectedCandidate).map(([position, candidates]) => (
                            candidates.length > 0 && (
                                <div key={`${position}-selected`} className="Voting-position-container-selected" style={{ display: position === currentPosition ? 'block' : 'none' }}>
                                    <h2 className="nbsp">&nbsp;  &nbsp;    Selected</h2>
                                    <div className="Voting-position-list-selected">
                                        {candidates.map(candidate => (
                                            // <div key={`${position}-${candidate.id}`} className="Voting-candidate-list-selected"  onClick={isSubmitted ? null : () => handleRemoveCandidate(position, candidate)}>
                                                  <div key={`${position}-${candidate.id}`} className="Voting-candidate-list-selected"  onClick={() => handleRemoveCandidate(position, candidate)}>
                                                <img src={`${assignedURL}/images/${candidate.Image_File}`} alt={candidate.Candidate_Name} className="candidate-image" />
                                                <div className="candidate-name-container2"><span>{candidate.Candidate_Name}</span></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        ))}
                    </div> */}

                    <div className="Voting-tab-body-list">
                        {Object.entries(groupedCandidates).map(([position, candidates]) => {
                            // Find the maximum candidate count for this position
                            const maxCandidateCount = maxCandidatesPerPositionState.find(candidate => candidate.Candidate_Position === position)?.Candidate_Count || 0;

                            // Count the number of selected candidates for this position
                            const selectedCount = selectedCandidate[position]?.length || 0;

                            return (
                                <div key={`${position}-list`} className="Voting-position-container" style={{ display: position === currentPosition ? 'block' : 'none' }}>
                                    {/* <div className="position-title-con">
                    <div className="position-title-con1"><h2 className="position-title">{position} </h2></div>
                    <div className="position-title-con2"><h2 className="position-title">({selectedCount}/{maxCandidateCount})</h2></div>
                </div> */}
                                    <div className="position-title-con1"><h2 className="position-title">{position} ({selectedCount}/{maxCandidateCount})</h2>
                                        <div className="Voting-logo-container2">
                                            <span>{formatTime(timer)}</span>
                                            <img src={logo} alt="Example" className="home-logo" />
                                        </div></div>
                                    <div className="Voting-position-list">
                                        {candidates.map(candidate => (
                                            <div
                                                key={`${position}-${candidate.id}`}
                                                className={`${candidates.length > 9 ? "Voting-candidate-list2" : "Voting-candidate-list"} ${Array.isArray(selectedRecords) && selectedRecords.some(record => record.id === candidate.id) ? 'selected' : ''}`}

                                                onClick={() => {
                                                    if (Array.isArray(selectedRecords) && selectedRecords.some(record => record.id === candidate.id)) {
                                                        handleRemoveCandidate(position, candidate);
                                                    } else {
                                                        handleChooseCandidate(position, candidate);
                                                    }
                                                }}
                                            >

                                                <div className="candidate-image-container">
                                                    {Array.isArray(selectedRecords) && selectedRecords.some(record => record.id === candidate.id) && <div className="circle-check-con"><DoneRoundedIcon className="circle-check" /></div>}
                                                    <img
                                                        src={`${assignedURL}/images/${candidate.Image_File}`}
                                                        alt={candidate.Candidate_Name}
                                                        className={`candidate-image ${Array.isArray(selectedRecords) && selectedRecords.some(record => record.id === candidate.id) ? 'selectedImage' : ''}`}
                                                    />
                                                </div>
                                                <div className="candidate-name-container4"><p className={candidates.length > 9 ? "asdadasd2" : "asdadasd"}>{candidate.Candidate_Name}</p></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>

            </div>
            <div className="Voting-navigation-buttons">
                <div className="Voting-navigation-buttons1">
                    {currentPositionIndex !== 0 && <button onClick={handlePreviousPosition} className="Voting-navigation-buttons-prev"><KeyboardArrowLeftSharpIcon fontSize="medium" className="next-icon2"/> <span>Prev</span></button>}
                </div>
                <div className="Voting-navigation-buttons1">
                    {currentPositionIndex !== positions.length - 1 && <button onClick={handleNextPosition} className="Voting-navigation-buttons-next"><span>Next</span> <KeyboardArrowRightSharpIcon fontSize="medium" className="next-icon"/></button>}
                    {currentPositionIndex === positions.length - 1 && <button onClick={handleSubmitVote} className="Voting-navigation-buttons-next">View vote</button>}
                </div>
            </div>
        </div>
        
        
    );
};

export default Voting;