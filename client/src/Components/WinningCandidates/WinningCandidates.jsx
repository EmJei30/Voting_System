import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './WinningCandidates.css';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import io from 'socket.io-client';
/**Context */
import { VotingContext } from '../../Context/Voting';
/**icon */
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import KeyboardArrowLeftSharpIcon from '@mui/icons-material/KeyboardArrowLeftSharp';
import KeyboardArrowRightSharpIcon from '@mui/icons-material/KeyboardArrowRightSharp';
/**image */
import logo from '../../assets/logo2.png';

const WinningCandidates = () => {
    const { assignedURL, isLoggedIn, setisLoggedIn, usersName, setUsersName, candidates, setCandidates, groupedCandidates, setGroupedCandidates, maxCandidatesPerPositionState, setMaxCandidatesPerPositionState,highestVoteCount, setHighestVoteCount} = useContext(VotingContext);
    const [uploadedCsvFile, setUploadedCsvFile] = useState([]);
    // const [groupedCandidates, setGroupedCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState([]);
    // const [maxCandidatesPerPositionState, setMaxCandidatesPerPositionState] =  useState([]);
    // const [highestVoteCount, setHighestVoteCount]= useState([]);
    const [showAlert, setShowAlert] = useState(false);

    const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
    const positions = Object.keys(groupedCandidates);
    const nav = useNavigate();
    
    useEffect(() => {
        fetchCandidatesMaxCount();
     
    }, []);
    useEffect(() => {
        fetchCandidates();
    }, [maxCandidatesPerPositionState]);
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setCurrentPositionIndex(prevIndex => (prevIndex + 1) % positions.length);
    //     }, 3000); // Change the interval time according to your preference (in milliseconds)
    
    //     return () => clearInterval(interval);
    // }, [positions.length])
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
                setGroupedCandidates(list);
            
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
            
                // Get the top Vote_Count values for this position, ensuring uniqueness and greater than 0
                let topVoteCounts = [];
                let currentRank = 1;
                for (let i = 0; i < candidatesForPosition.length && topVoteCounts.length < maxCandidates; i++) {
                    const candidate = candidatesForPosition[i];
                    if (candidate.Vote_Count > 0 && !topVoteCounts.includes(candidate.Vote_Count)) {
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
           

             /**Filter the Highest vote counts and return only exactly the maximum count per position based on Vote_Count */
             const storage = {};

                    // Iterate through each position
                    for (const position in topVoteCountsPerPosition) {
                        if (!topVoteCountsPerPosition.hasOwnProperty(position)) continue;

                        const positionVoteCounts = topVoteCountsPerPosition[position];
                        const maxCount = maxCandidatePerPositionState.find(entry => entry.Candidate_Position === position).Candidate_Count;

                        if (!maxCount) continue; // Skip if max count not found

                        // Initialize an array to store candidates for this position
                        storage[position] = [];

                        // Iterate through each vote count for the position
                        for (const voteCount of positionVoteCounts) {
                            // Collect candidates with the current vote count
                            const candidatesWithVoteCount = candidatesInTopRanking.filter(candidate =>
                                candidate.Candidate_Position === position && candidate.Vote_Count === voteCount
                            );

                            // Push all candidates with the same vote count
                            storage[position] = storage[position].concat(candidatesWithVoteCount);

                            // Check if the maximum count is reached for this position
                            if (storage[position].length >= maxCount) break;
                        }
                    }
                            
                 setHighestVoteCount(storage);
        // fetchCandidates()
        });


        return () => {
            socket.disconnect();
        };
    }, []);
    const handleNextPosition = () => {
        setCurrentPositionIndex(prevIndex => (prevIndex + 1) % positions.length);
    };

    const handlePreviousPosition = () => {
        setCurrentPositionIndex(prevIndex => (prevIndex - 1 + positions.length) % positions.length);
    };

    const currentPosition = positions[currentPositionIndex];

  

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
                    console.log('newRecordWithTotalVotes',newRecordWithTotalVotes)
                    // Group the updated candidates by position
                    const list = CandidatesList(newRecordWithTotalVotes);
                    setGroupedCandidates(list);
                
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
                    const candidatesForPosition = data.filter(candidate => candidate.Candidate_Position === position);
                
                    // Sort candidates by Vote_Count in descending order
                    candidatesForPosition.sort((a, b) => b.Vote_Count - a.Vote_Count);
                
                    // Get the top Vote_Count values for this position, ensuring uniqueness and greater than 0
                    let topVoteCounts = [];
                    let currentRank = 1;
                    for (let i = 0; i < candidatesForPosition.length && topVoteCounts.length < maxCandidates; i++) {
                        const candidate = candidatesForPosition[i];
                        if (candidate.Vote_Count > 0 && !topVoteCounts.includes(candidate.Vote_Count)) {
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
                console.log('candidatesInTopRanking', candidatesInTopRanking);
                const highestlist = CandidatesList(candidatesInTopRanking);
              
                console.log('11111',candidatesInTopRanking);
                console.log('11112',maxCandidatePerPositionState)
                console.log('11113', topVoteCountsPerPosition);


                /**Filter the Highest vote counts and return only exactly the maximum count per position based on Vote_Count */
                const storage = {};

                    // Iterate through each position
                    for (const position in topVoteCountsPerPosition) {
                        if (!topVoteCountsPerPosition.hasOwnProperty(position)) continue;

                        const positionVoteCounts = topVoteCountsPerPosition[position];
                        const maxCount = maxCandidatePerPositionState.find(entry => entry.Candidate_Position === position).Candidate_Count;

                        if (!maxCount) continue; // Skip if max count not found

                        // Initialize an array to store candidates for this position
                        storage[position] = [];

                        // Iterate through each vote count for the position
                        for (const voteCount of positionVoteCounts) {
                            // Collect candidates with the current vote count
                            const candidatesWithVoteCount = candidatesInTopRanking.filter(candidate =>
                                candidate.Candidate_Position === position && candidate.Vote_Count === voteCount
                            );

                            // Push all candidates with the same vote count
                            storage[position] = storage[position].concat(candidatesWithVoteCount);

                            // Check if the maximum count is reached for this position
                            if (storage[position].length >= maxCount) break;
                        }
                    }
                            
            
                // const matchedCandidates = matchCandidatesWithVoteCounts(candidatesInTopRanking, topVoteCountsPerPosition);
                console.log('11114',storage);
                setHighestVoteCount(storage);
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

    // Function to iterate through candidates and match their Vote_Count with the corresponding position
// function matchCandidatesWithVoteCounts(candidates, voteCounts) {
//     const storage = {};

//     candidates.forEach(candidate => {
//         const { Candidate_Position, Vote_Count } = candidate;
//         const positionVoteCounts = voteCounts[Candidate_Position];

//         if (!positionVoteCounts) return; // If no vote counts for this position, skip

//         const matchedCount = positionVoteCounts.find(count => count === Vote_Count);

//         if (matchedCount) {
//             if (!storage[Candidate_Position]) {
//                 storage[Candidate_Position] = [];
//             }
//             storage[Candidate_Position].push(candidate);
//         }
//     });

//     return storage;
// }
    console.log('highestVoteCount',highestVoteCount)
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
    const [positionsReachedMax, setPositionsReachedMax] = useState({});
    /**Function to choose candidate */
    const handleChooseCandidate = (pos, can) => {
        // Check if the candidate is already selected
        if (selectedCandidate[pos]?.find(candidate => candidate.id === can.id)) {
            // If the candidate is already selected, do nothing
            alert(`Candidate already chosen.`);
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
            setSelectedCandidate(prevState => {
                const updatedCandidates = { ...prevState };
    
                // If the maximum limit is not reached and the candidate doesn't exist, add the candidate
                if (!updatedCandidates[pos]) {
                    updatedCandidates[pos] = [];
                }
                updatedCandidates[pos] = [...updatedCandidates[pos], can]; // Add candidate to array
    
                return updatedCandidates;
            });
        } else {
            // If the maximum limit is reached, display an alert
            alert(`Maximum number of candidates (${maxCandidatesPerPosition[pos]}) reached for position ${pos}.`);
        }
    };
    
    
    /**Function to remove candidate */
    const handleRemoveCandidate = (pos, can) => {
        setSelectedCandidate(prevState => {
            const updatedCandidates = { ...prevState };
    
            // If the position exists in the selected candidates
            if (updatedCandidates[pos]) {
                // Remove the candidate from the selected candidates for the position
                updatedCandidates[pos] = updatedCandidates[pos].filter(candidate => candidate.id !== can.id);
            }
            return updatedCandidates;
        });
    };
    
    const handleBack = () =>{
        nav('/admin-maintenance')
    }
    console.log('selectedCandidate', selectedCandidate)
    console.log('highestVoteCount', highestVoteCount)
    console.log('maxCandidatesPerPositionState', maxCandidatesPerPositionState)
    return (
        <div className="WinningCandidates-Home_Con">
            {showAlert && (
                <div className="alert">
                    <p>Maximum number of candidates reached for this position</p>
                    <button onClick={() => setShowAlert(false)}>OK</button>
                </div>
            )}
            {/* <div className="Voting-nav-container">
                <button onClick={handleLogout}>Logout</button>
            </div> */}
            <div className="WinningCandidates-tab-container">
     
                <div className="WinningCandidates-tab-container-span">
                <ExitToAppRoundedIcon onClick={handleBack} fontSize="large" className="return-icon"/>
            
                </div>
            

                <div className="WinningCandidates-tab-body">
        
                    <div className="WinningCandidates-Home_Con-confirmation">
                        <div className="WinningCandidates-confirmation">
                            <div className="WinningCandidates-confirmation-details-box"></div>
                                <div className="WinningCandidates-confirmation-voter">
                                
                                    <div className="WinningCandidates-confirmation-voter-span"> 
                                        <span >CONGRATS!</span> 
                                        <p >ELECTED OFFICIALS</p> 
                                    </div>
                                    <div className="WinningCandidates-logo-container">
                                        <img src={logo} alt="Example" className="home-logo" />
                                    </div>
                                
                                    {/* <span className="Voters-name">Name : &nbsp;{usersName}</span> */}
                                </div>
                                <div className="WinningCandidates-confirmation-details">
                                
                                    {Object.entries(highestVoteCount).map(([position, candidates]) => (
                                        <div key={`${position}-group`} className="WinningCandidates-confirmation-details-container">
                                        <span  className="Voting-confirmation-details-h2">{position}</span>
                                            <div className="WinningCandidates-confirmation-details-content">
                                                <div className="WinningCandidates-confirmation-position-list">
                                                    {/* <ul>
                                                    {candidates.map(candidate => (
                                                        <li key={`${candidate.Candidate_Position}-${candidate.id}`}>{candidate.Candidate_Name}</li>

                                                    ))}
                                                </ul> */}

                                            {candidates.map((candidate, index) => (
                                                <div key={`${position}-${candidate.id}`} className="WinningCandidates-confirmation-candidate-list-selected">
                                                        <div className="WinningCandidates-image-container2">
                                                            <div className="WinningCandidates-circle-check-con"><span>{candidate.Vote_Count}</span></div>
                                                            <img src={`${assignedURL}/images/${candidate.Image_File}`} alt={candidate.Candidate_Name} className='candidate-image'  />
                                                        </div>
                                                    
                                                        <div className="WinningCandidates-name-container3"><p>{candidate.Candidate_Name}</p></div>
                                                
                                                </div>
                                            ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                        </div>
                   
                </div>
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

                    {/* <div className="WinningCandidates-tab-body-list">
                        {Object.entries(groupedCandidates).map(([position, candidates]) => (
                            <div key={`${position}-list`} className="WinningCandidates-position-container" style={{ display: position === currentPosition ? 'block' : 'none' }}>
                                <h2>{position} List</h2>
                                <div className="WinningCandidates-position-list">
                                    {candidates.map(candidate => (
                                        <div key={`${position}-${candidate.id}`} className="WinningCandidates-candidate-list">
                                            <div className="WinningCandidates-candidate-image-container">
                                                <img src={`${assignedURL}/images/${candidate.Image_File}`} alt={candidate.Candidate_Name} className="Candidates-candidate-list"  />
                                            </div>
                                           
                                            <div className="WinningCandidates-name-container">
                                                <div><span>{candidate.Candidate_Name}</span> </div>
                                                <div className="WinningCandidates-name-container-total-votes"> <span>{candidate.Vote_Count}</span> </div>
                                                <div className="WinningCandidates-name-container-vote-percentage"> <span> {candidate.Total_Votes !== 0 ? `${((candidate.Vote_Count / candidate.Total_Votes) * 100).toFixed(2)}%` : '0.00%'}</span> </div>
                                            </div>
                                           
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div> */}
                </div>

           
            <div className="WinningCandidates-navigation-buttons">
                <div className="WinningCandidates-navigation-buttons1">
                    {currentPositionIndex !== 0 && <button onClick={handlePreviousPosition} className="WinningCandidates-navigation-buttons-prev"><KeyboardArrowLeftSharpIcon fontSize="medium" className="next-icon2"/> <span>Prev</span></button>}
                </div>
                <div className="WinningCandidates-navigation-buttons1">
                    {currentPositionIndex !== positions.length - 1 && <button onClick={handleNextPosition} className="WinningCandidates-navigation-buttons-next"><span>Next</span> <KeyboardArrowRightSharpIcon fontSize="medium" className="next-icon"/></button>}
                    {/* {currentPositionIndex === positions.length - 1 && <button onClick={handleSubmitVote} className="WinningCandidates-navigation-buttons-next">Submit</button>} */}
                </div>
            </div>
            </div>
            
        </div>
        
        
    );
};

export default WinningCandidates;