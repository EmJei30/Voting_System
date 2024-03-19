import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Dashboard.css';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import io from 'socket.io-client';
import Marquee from 'react-fast-marquee';
import moment from 'moment';
/**Context */
import { VotingContext } from '../../Context/Voting';
/**icon */
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import KeyboardArrowLeftSharpIcon from '@mui/icons-material/KeyboardArrowLeftSharp';
import KeyboardArrowRightSharpIcon from '@mui/icons-material/KeyboardArrowRightSharp';

const Dashboard = () => {
    const { assignedURL, isLoggedIn, setisLoggedIn, usersName, setUsersName, candidates, setCandidates, membersInfo, setMembersInfo, VoteTransactions, setVoteTransactions, countDown, setCountDown,
        groupedCandidates, setGroupedCandidates, maxCandidatesPerPositionState, setMaxCandidatesPerPositionState,highestVoteCount, setHighestVoteCount } = useContext(VotingContext);
    const [uploadedCsvFile, setUploadedCsvFile] = useState([]);
    const [votedMembers, setVotedMembers] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState([]);
    // const [maxCandidatesPerPositionState, setMaxCandidatesPerPositionState] =  useState([]);
    // const [highestVoteCount, setHighestVoteCount]= useState([]);
    const [showAlert, setShowAlert] = useState(false);

    const [isVotingOpen, setIsVotingOpen] = useState(false);
    const [dayTimer, setDayTimer]= useState('');
    const [hourTimer, setHourTimer]= useState('');
    const [minTimer, setMinTimer]= useState('');
    const [secTimer, setSecTimer]= useState('');

    const [currentTime1, setCurrentTime1] = useState('');
    const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
    const positions = Object.keys(groupedCandidates);
    const currentPosition = positions[currentPositionIndex]; 
    const nav = useNavigate();
    
    // useEffect(() => {
    //     fetchCandidatesMaxCount();
     
    // }, []);
    useEffect(() => {
        if (membersInfo.length > 0) {
            const doneMembers = membersInfo.filter(member => member.Voting_Status === 'Done');
            setVotedMembers(doneMembers)
            // Now 'doneMembers' contains only members with Voting_Status equal to 'Done'
        }
        fetchCandidates();
        fetchMembersInfo();
    }, []);

    useEffect(() => {
        // Update the current time every second
        const intervalId = setInterval(() => {
          const currentTimeFormatted = moment().format('HH:mm:ss');
          setCurrentTime1(currentTimeFormatted);
        }, 1000);
    
        // Clear the interval on component unmount
        return () => clearInterval(intervalId);
      }, []); 
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPositionIndex(prevIndex => (prevIndex + 1) % positions.length);
        }, 7000); // Change the interval time according to your preference (in milliseconds)
    
        return () => clearInterval(interval);
    }, [positions.length])
    
  
    useEffect(() => {
        const socket = io(`${assignedURL}`);

        socket.on('UpdatedVoteCount', (UpdatedVoteCount) => {

            const {newRecord} = UpdatedVoteCount;
                console.log('candidates12321', candidates);
                console.log('groupedCandidates', groupedCandidates);
                console.log('maximumCandidates', maxCandidatesPerPositionState);
                console.log('newRecord', newRecord);
              
                // Update the vote count for the candidate with the matching ID
                const updatedData = candidates.map(candidate => {
                    const matchingRecord = newRecord.find(record => record.id === candidate.id);
                    return matchingRecord ? { ...candidate, Vote_Count: matchingRecord.Vote_Count } : candidate;
                });
                console.log('updatedData', updatedData);
                // Update the candidates state
                setCandidates(updatedData);
                /**Get the total vote per position and add new property per position */
                let totalVotesPerPosition = {};

                updatedData.forEach(candidate => {
                    if (candidate.Vote_Count > 0) {
                        // Check if the position already exists in the totalVotesPerPosition object
                        if (!totalVotesPerPosition[candidate.Candidate_Position]) {
                            // If it doesn't exist, initialize the total votes for that position
                            totalVotesPerPosition[candidate.Candidate_Position] = candidate.Vote_Count;
                        } else {
                            // If it exists, add the candidate's vote count to the existing total votes for that position
                            totalVotesPerPosition[candidate.Candidate_Position] += candidate.Vote_Count;
                        }
                    }
                });
                
                // Iterate over the newRecord array to add the Total_Votes property
                const newRecordWithTotalVotes = updatedData.map(candidate => ({
                    ...candidate,
                    Total_Votes: totalVotesPerPosition[candidate.Candidate_Position] || 0 // Assign the total votes for the candidate's position or 0 if not found
                }));
                console.log('newRecordWithTotalVotes',newRecordWithTotalVotes)
                // Group the updated candidates by position
                const list = CandidatesList(newRecordWithTotalVotes);
                const sortedCandidates = {};

                        // Iterate over each position in groupedCandidates
                        Object.entries(list).forEach(([position, candidates]) => {
                            // Sort candidates array based on Vote_Count
                            const sortedCandidatesArray = [...candidates].sort((a, b) => b.Vote_Count - a.Vote_Count);
                            // Reverse the sorted array to arrange from highest to lowest Vote_Count
                            sortedCandidates[position] = sortedCandidatesArray;
                        });
                setGroupedCandidates(sortedCandidates);
            
             let candidatesWithMaxVotePerPosition = {}; // Object to store candidates with the highest vote count per position

            const maxCandidatePerPositionState = maxCandidatesPerPositionState;

            // Initialize the candidatesWithMaxVotePerPosition object with arrays for each position
            maxCandidatePerPositionState.forEach(position => {
                candidatesWithMaxVotePerPosition[position.Candidate_Position] = [];
            });

            const topVoteCountsPerPosition = {};
            Object.values(maxCandidatePerPositionState).forEach(positionData => {
                const position = positionData.Candidate_Position;
                const maxCandidates = positionData.Candidate_Count;

                // Find candidates for this position
                const candidatesForPosition = updatedData.filter(candidate => candidate.Candidate_Position === position);

                // Sort candidates by Vote_Count in descending order
                candidatesForPosition.sort((a, b) => b.Vote_Count - a.Vote_Count);

                // Get the top Vote_Count values for this position, ensuring uniqueness
                let topVoteCounts = [];
                let currentRank = 1;
                for (let i = 0; i < candidatesForPosition.length && topVoteCounts.length < maxCandidates; i++) {
                    const candidate = candidatesForPosition[i];
                    if (!topVoteCounts.includes(candidate.Vote_Count)) {
                        topVoteCounts.push(candidate.Vote_Count);
                        currentRank++;
                    }
                }
                topVoteCountsPerPosition[position] = topVoteCounts;
            });



            console.log('topVoteCountsPerPosition', topVoteCountsPerPosition);
            // Now, filter the candidates based on the top Vote_Count values
            const candidatesInTopRanking = [];
            updatedData.forEach(candidate => {
                const position = candidate.Candidate_Position;
                const topVoteCounts = topVoteCountsPerPosition[position];

                if (topVoteCounts && topVoteCounts.includes(candidate.Vote_Count)) {
                    // If the candidate's Vote_Count is within the top Vote_Count values for this position, add it
                    candidatesInTopRanking.push(candidate);
                }
            });

            // Now candidatesInTopRanking array contains all the candidates with Vote_Count in the top ranking for their positions
            console.log('candidatesInTopRanking', candidatesInTopRanking);
            const highestlist = CandidatesList(candidatesInTopRanking);
            setHighestVoteCount(highestlist);
            
        // fetchCandidates()
        });
        socket.on('UpdatedMemberRecord', (newRecord) => {
            console.log('UpdatedMemberRecord', newRecord)
            
            setMembersInfo(prevData =>
                prevData.map(record =>
                    record.id === newRecord.id &&  record.Member_Id === newRecord.Member_Id ? { ...newRecord } : record
                )
            );
            setVotedMembers(prev => {
                // Check if newRecord's Voting_Status is 'Done'
                if (newRecord.Voting_Status === 'Done') {
                    // Add newRecord to the previous state
                    return [...prev, newRecord];
                } else {
                    // If Voting_Status is not 'Done', return the previous state unchanged
                    return prev;
                }
            });

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

        });
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if(VoteTransactions.length > 0){
            const timer = setInterval(() => {
                calculateCountdown();
            }, 1000);
            return () => clearInterval(timer);
        }
      
    }, [VoteTransactions]);

  
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
            console.log('Current Time:', currentTime);
    
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
console.log('timeDifference', timeDifference)
                if (timeDifference <= 0) {
                    setIsVotingOpen(false);
                    countdownMessage = "Voting has ended";
                    if(VoteTransactions.length > 0){
                        updateVoteTransaction();
                    }
                 
                    // console.log("Voting has ended.");
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
        //    console.log('countDown',countDown)
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

    const handleNextPosition = () => {
        setCurrentPositionIndex(prevIndex => (prevIndex + 1) % positions.length);
    };

    const handlePreviousPosition = () => {
        setCurrentPositionIndex(prevIndex => (prevIndex - 1 + positions.length) % positions.length);
    };

  

    // console.log('membersInfo',membersInfo)
    const fetchMembersInfo = async () => {
		try {
			const response = await fetch(`${assignedURL}/get_members_info`);
			if (response.ok) {
				const data = await response.json();
				if (data.length > 0) {
				
                        const doneMembers = data.filter(member => member.Voting_Status === 'Done');
                        setVotedMembers(doneMembers)
                        // Now 'doneMembers' contains only members with Voting_Status equal to 'Done'
                  
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

    const fetchCandidates = async () => {
        try {
            const response = await fetch(`${assignedURL}/get_candidates_info`);
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    console.log(data);
                 
                    setCandidates(data)

                    let totalVotesPerPosition = {};

                    data.forEach(candidate => {
                        if (candidate.Vote_Count > 0) {
                            // Check if the position already exists in the totalVotesPerPosition object
                            if (!totalVotesPerPosition[candidate.Candidate_Position]) {
                                // If it doesn't exist, initialize the total votes for that position
                                totalVotesPerPosition[candidate.Candidate_Position] = candidate.Vote_Count;
                            } else {
                                // If it exists, add the candidate's vote count to the existing total votes for that position
                                totalVotesPerPosition[candidate.Candidate_Position] += candidate.Vote_Count;
                            }
                        }
                    });
                    
                    // Iterate over the newRecord array to add the Total_Votes property
                    const newRecordWithTotalVotes = data.map(candidate => ({
                        ...candidate,
                        Total_Votes: totalVotesPerPosition[candidate.Candidate_Position] || 0 // Assign the total votes for the candidate's position or 0 if not found
                    }));
                
                    console.log('data', newRecordWithTotalVotes);
                    const list = CandidatesList(newRecordWithTotalVotes);
                    console.log('grouped1111', list);
                    // Create a new object to store sorted candidates
                        const sortedCandidates = {};

                        // Iterate over each position in groupedCandidates
                        Object.entries(list).forEach(([position, candidates]) => {
                            // Sort candidates array based on Vote_Count
                            const sortedCandidatesArray = [...candidates].sort((a, b) => b.Vote_Count - a.Vote_Count);
                            // Reverse the sorted array to arrange from highest to lowest Vote_Count
                            sortedCandidates[position] = sortedCandidatesArray;
                        });
                        console.log('grouped', sortedCandidates);
                    setGroupedCandidates(sortedCandidates);
                    // Find the entry with the highest Vote_Count
                    // let maxVoteCount = 0;
                    // let candidatesWithMaxVoteCount = [];

                    // data.forEach(candidate => {
                    //     if (candidate.Vote_Count > maxVoteCount) {
                    //         maxVoteCount = candidate.Vote_Count;
                    //         candidatesWithMaxVoteCount = [candidate];
                    //     } else if (candidate.Vote_Count === maxVoteCount) {
                    //         candidatesWithMaxVoteCount.push(candidate);
                    //     }
                    // });
                    let candidatesWithMaxVotePerPosition = {}; // Object to store candidates with the highest vote count per position

                    const maxCandidatePerPositionState = maxCandidatesPerPositionState;
                    
                    // Initialize the candidatesWithMaxVotePerPosition object with arrays for each position
                    maxCandidatePerPositionState.forEach(position => {
                        candidatesWithMaxVotePerPosition[position.Candidate_Position] = [];
                    });
                    
                    // console.log('candidatesWithMaxVotePerPosition2',candidatesWithMaxVotePerPosition)
                    // Find the maximum vote count for each position
                    const topVoteCountsPerPosition = {};
                    Object.values(maxCandidatePerPositionState).forEach(positionData => {
                        const position = positionData.Candidate_Position;
                        const maxCandidates = positionData.Candidate_Count;
                    
                        // Find candidates for this position
                        const candidatesForPosition = data.filter(candidate => candidate.Candidate_Position === position);
                    
                        // Sort candidates by Vote_Count in descending order
                        candidatesForPosition.sort((a, b) => b.Vote_Count - a.Vote_Count);
                    
                        // Get the top Vote_Count values for this position, ensuring uniqueness
                        let topVoteCounts = [];
                        let currentRank = 1;
                        for (let i = 0; i < candidatesForPosition.length && topVoteCounts.length < maxCandidates; i++) {
                            const candidate = candidatesForPosition[i];
                            if (!topVoteCounts.includes(candidate.Vote_Count)) {
                                topVoteCounts.push(candidate.Vote_Count);
                                currentRank++;
                            }
                        }
                        topVoteCountsPerPosition[position] = topVoteCounts;
                    });
                    
                    
                    
                    console.log('topVoteCountsPerPosition', topVoteCountsPerPosition);
                    // Now, filter the candidates based on the top Vote_Count values
                    const candidatesInTopRanking = [];
                    data.forEach(candidate => {
                        const position = candidate.Candidate_Position;
                        const topVoteCounts = topVoteCountsPerPosition[position];

                        if (topVoteCounts && topVoteCounts.includes(candidate.Vote_Count)) {
                            // If the candidate's Vote_Count is within the top Vote_Count values for this position, add it
                            candidatesInTopRanking.push(candidate);
                        }
                    });

                    // Now candidatesInTopRanking array contains all the candidates with Vote_Count in the top ranking for their positions
                    console.log('1111',candidatesInTopRanking);
                    console.log('1111',maxCandidatePerPositionState)
                    console.log('1111', topVoteCountsPerPosition);
                    const highestlist = CandidatesList(candidatesInTopRanking);
                    setHighestVoteCount(highestlist);
                    

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
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('usersName');
        sessionStorage.removeItem('employeePosition');
        setGroupedCandidates([]);
        setSelectedCandidate([]);
      
        nav('/log-in');
        setisLoggedIn(false);
    }

    
    const handleBack = () =>{
        nav('/admin-maintenance')
    }
    // const handleScroll = () =>{
    //     const divToScroll = document.getElementById("dashboard-display");
	// 	if (divToScroll) {
	// 		divToScroll.scroll({top:500,behavior:'smooth'})		
	// 	}
    // }
    // console.log('currentPosition',currentPosition)
    // console.log('currentPositionIndex',currentPositionIndex)
    // console.log('groupedCandidates',groupedCandidates)
    return (
        <div className="Dashboard-Home_Con">
            {showAlert && (
                <div className="alert">
                    <p>Maximum number of candidates reached for this position</p>
                    <button onClick={() => setShowAlert(false)}>OK</button>
                </div>
            )}
            {/* <div className="Voting-nav-container">
                <button onClick={handleLogout}>Logout</button>
            </div> */}
            <div className="Dashboard-tab-container">
     
                <div className="Dashboard-tab-container-span">
                  
                    {/* <span> {countDown} {dayTimer} D {hourTimer} H {minTimer} M {secTimer} S</span> */}
                    <div className="Dashboard-countdown-timer-con">
                            <div className="Dashboard-countdown-back"><ExitToAppRoundedIcon onClick={handleBack} fontSize="large" className="return-icon"/></div>
                            <div className="Dashboard-countdown-present"><span>Voter's Percent : {votedMembers.length} / {membersInfo.length}</span></div>
                            <div className="Dashboard-countdown-msg" style={{color: !isVotingOpen && 'red'}}> {VoteTransactions.length > 0 ? countDown : 'Voting is Closed...'}</div>
                            <div className="Dashboard-countdown-count-con">
                                <div className="Dashboard-countdown-timer">
                                    {VoteTransactions.length > 0 && <>
                                        <span className="Dashboard-countdown-timer-number" style={{color: !isVotingOpen && 'red'}}>{dayTimer}</span>
                                        <span className="Dashboard-countdown-timer-text">Day</span>
                                    </>}
                                </div>
                                <div className="Dashboard-countdown-timer">
                                    {VoteTransactions.length > 0 && <>
                                        <span className="Dashboard-countdown-timer-number" style={{color: !isVotingOpen && 'red'}}>{hourTimer}</span>
                                        <span className="Dashboard-countdown-timer-text">Hours</span>
                                    </>}
                                </div>
                                <div className="Dashboard-countdown-timer">
                                    {VoteTransactions.length > 0 && <>
                                        <span className="Dashboard-countdown-timer-number" style={{color: !isVotingOpen && 'red'}}>{minTimer}</span>
                                        <span className="Dashboard-countdown-timer-text">Minutes</span>
                                    </>}
                                </div>
                                
                                <div className="Dashboard-countdown-timer">
                                {VoteTransactions.length > 0 && <>
                                    <span className="Dashboard-countdown-timer-number" style={{color: !isVotingOpen && 'red'}}>{secTimer}</span>
                                    <span className="Dashboard-countdown-timer-text">Seconds</span>
                                    </>}
                                </div>
                            
                            </div>
                        
                    </div>
                </div>
            

                <div className="Dashboard-tab-body">
                    {/* <div className="WinningCandidates-tab-body-selected">
                        {Object.entries(highestVoteCount).map(([position, candidates]) => (
                            candidates.length > 0 && (
                                <div key={`${position}-selected`} className="WinningCandidates-position-container-selected" style={{ display: position === currentPosition ? 'block' : 'none' }}>
                                    <h2> Winning {position}</h2>
                                    <div className="WinningCandidates-position-list-selected">
                                        {candidates.map(candidate => (
                                            <div key={`${position}-${candidate.id}`} className="WinningCandidates-candidate-list-selected">
                                                <img src={`${assignedURL}/images/${candidate.Image_File}`} alt={candidate.Candidate_Name} className="candidate-image" />
                                                <div className="candidate-name-container2"><span>{candidate.Candidate_Name}</span></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        ))}
                    </div> */}

                    <div className="Dashboard-tab-body-list" id="dashboard-display">
                        {Object.entries(groupedCandidates).map(([position, candidates]) => (
                            <div key={`${position}-list`} className="Dashboard-position-container" style={{ display: position === currentPosition ? 'block' : 'none' }}>
                                {/* <h3 className="position-title">&nbsp; &nbsp;{position} {currentTime1}</h3> */}
                                <div className="position-title-con"><h3 className="position-title">&nbsp; &nbsp;{position} </h3>
                                </div>
                                <div className="Dashboard-position-list">
                                    {candidates.map((candidate, index) => (
                                        <div key={`${position}-${candidate.id}`} className={candidates.length > 9 ? "Dashboard-candidate-list2" : "Dashboard-candidate-list"}>
                                            <div className="Dashboard-candidate-image-container">
                                                <div className={candidates.length > 9 ? "Dashboard-circle-check-con2" : "Dashboard-circle-check-con"}
                                                    style={{ backgroundColor: index + 1 === 1 ? '#f56c27' : index + 1 === 2 ? '#545150': index + 1 === 3 ? '#8db8f0' : '#d2d4d6' }}
                                                ><span>{index + 1}</span></div>
                                                <img src={`${assignedURL}/images/${candidate.Image_File}`} alt={candidate.Candidate_Name} className="Candidates-candidate-list" />
                                            </div>
                                            <div className="Dashboard-name-container">
                                                <div className={candidates.length > 9 ? "Dashboard-name2" : "Dashboard-name1"}><span>{candidate.Candidate_Name} </span> </div>
                                                <div className="Dashboard-name-container-total-votes"> <span>{candidate.Vote_Count}</span> </div>
                                                <div className="Dashboard-name-container-vote-percentage"> <span> {candidate.Total_Votes !== 0 && candidate.Total_Votes !== null ? `${((candidate.Vote_Count / candidate.Total_Votes) * 100).toFixed(2)}%` : '0.00%'}</span> </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

           
            <div className="Dashboard-navigation-buttons">
                <div className="Dashboard-navigation-buttons1">
                    {currentPositionIndex !== 0 && <button onClick={handlePreviousPosition} className="Dashboard-navigation-buttons-prev"><KeyboardArrowLeftSharpIcon fontSize="medium" className="next-icon2"/> <span>Prev</span></button>}
                </div>
                <div className="Dashboard-navigation-buttons1">
                    {currentPositionIndex !== positions.length - 1 && <button onClick={handleNextPosition} className="Dashboard-navigation-buttons-next"><span>Next</span> <KeyboardArrowRightSharpIcon fontSize="medium" className="next-icon"/></button>}
                    {/* {currentPositionIndex === positions.length - 1 && <button onClick={handleSubmitVote} className="WinningCandidates-navigation-buttons-next">Submit</button>} */}
                    {/* <button onClick={handleScroll} className="WinningCandidates-navigation-buttons-next">Scroll</button> */}
                </div>
            </div>
            </div>
            
        </div>
        
        
    );
};

export default Dashboard;