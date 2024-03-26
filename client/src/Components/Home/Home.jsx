import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';
import io from 'socket.io-client';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable'; 
/**Context */
import { VotingContext } from '../../Context/Voting';
/**image */
import exampleImage from '../../assets/logo.png';
/**Icons */
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import { FaQuestion } from "react-icons/fa6";
import BackspaceRoundedIcon from '@mui/icons-material/BackspaceRounded';
const Home = () => {
    const { assignedURL, isLoggedIn, setisLoggedIn, usersName, setUsersName, setCandidates, candidates, groupedCandidates, membersInfo, setMembersInfo, VoteTransactions, setVoteTransactions,
			setGroupedCandidates, maxCandidatesPerPositionState, setMaxCandidatesPerPositionState, highestVoteCount, setHighestVoteCount,  } = useContext(VotingContext);
    const [activeTab, setActiveTab] = useState(0);
    const [uploadedCsvFile, setUploadedCsvFile] = useState([]);
	const [istoggleUploads, setIstoggleUpload] = useState(false);
	const [istoggleVoteDate, setIstoggleVoteDate] = useState(false);
	const [isVotingDateOpen, setIsVotingDateOpen] = useState(false);
	const [isVotingDateUpdate, setIsVotingDateUpdate] = useState(false);
	const [isGenerateReport, setIsGenerateReport] = useState(false);
	const [isForceClose, setIsForceClose] = useState(false);
	const [isMemberOpen, setIsMemberOpen] = useState(false);
	const [isUpdateMember, setIsUpdateMember] = useState(false);
	const [isUserSetupOpen, setIsUserSetupOpen] = useState(false);
	const [isPostWinnersOpen, setIstPostWinnersOpen] = useState(false);
	const [isPostVoteTransaction, setIsPostVoteTransaction]= useState(false);
	const [isForReserved, setIsForReserved] = useState(false);
	const [isUserSetUp, setIsUserSetUp] = useState(false);
	const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);
	const [isSignatoryOpen, setIsSignatoryOpen] = useState(false);

	const[isChangePass, setIsChangePass] = useState(false);

	const [signatoryName, setSignatoryName] = useState('');
	const [signatoryPosition, setSignatoryPosition] = useState('');

	const [filteredMembers, setFilteredMembers] = useState([]);
	const [findOTP, setFindOTP] = useState('');
	// const [groupedCandidates, setGroupedCandidates] = useState([]);
	// const [maxCandidatesPerPositionState, setMaxCandidatesPerPositionState] =  useState([]);
	// const [highestVoteCount, setHighestVoteCount]= useState([]);
	/**Vote date and time creation */
		/**create vote transaction */
	const [StartDate, setStartDate] = useState('');
	const [StartTime, setStartTime] = useState('');
	const [EndDate, setEndDate] = useState('');
	const [EndTime, setEndTime] = useState('');

	/**Set position list  */
	const [positionList, setPositionList] = useState([]);
	const [selectedOpenPosition, setSelectedOpenPosition] = useState('');
	const [positionMultiRun, setPositionMultiRun] = useState('');
	/**current url */
	const [currentUrl, setCurrentUrl] = useState('');

	/**Update vote transaction */
	const [EditVotingPos, setEditVotingPos] = useState('');
	const [EditStartDate, setEditStartDate] = useState('');
	const [EditStartTime, setEditStartTime] = useState('');
	const [EditEndDate, setEditEndDate] = useState('');
	const [EditEndTime, setEditEndTime] = useState('');
	const [notificationMSG, setNotificationMSG] = useState('');

	/**user set up */

	const [username, setUsername] = useState('');

	const [password, setPassword] = useState('');
	const [adminName, setAdminName] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	/**members */ 
	const [doneVoters, setDoneVoters] = useState([]);

	/**Change password */
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
	const [fileUploaded, setFileUploaded] = useState('');
    const nav = useNavigate();

	useEffect(()=>{
		fetchCandidatesMaxCount();
		fetchVotingTransactions();
		fetchCandidates();
		if (membersInfo.length > 0) {
            const doneMembers = membersInfo.filter(member => member.Voting_Status === 'Done');
            setDoneVoters(doneMembers)
            // Now 'doneMembers' contains only members with Voting_Status equal to 'Done'
        }
	
		if(VoteTransactions.length > 0){
			const voteTrans = VoteTransactions[0].Voting_Position;
			setEditVotingPos(voteTrans);

			const dateStart = new Date(VoteTransactions[0].Voting_Start_Date).toLocaleDateString();
			const sd = convertDateFormat(dateStart)
			setEditStartDate(sd);

			const dateEnd = new Date(VoteTransactions[0].Voting_End_Date).toLocaleDateString();
			const ed = convertDateFormat(dateEnd)
			setEditEndDate(ed);


			const timeStart = VoteTransactions[0].Voting_Start_Time;
			const st = convertTo12HourFormat(timeStart)
			setEditStartTime(timeStart);


			const timeEnd = VoteTransactions[0].Voting_End_Time;
			const et = convertTo12HourFormat(timeEnd)
			setEditEndTime(timeEnd);	
		}
		const url = window.location.href;
        const parsedUrl = new URL(url);
        const protocol = parsedUrl.protocol;
        const hostname = parsedUrl.host;
        const port = parsedUrl.port;
        // Construct the URL string with protocol, hostname, and port
        const baseUrl = `${protocol}//${hostname}`;
        setCurrentUrl(baseUrl);
	},[])

	useEffect(()=>{
		if(VoteTransactions.length > 0){
			const votePos = VoteTransactions[0].Voting_Position;
			setEditVotingPos(votePos);

			const dateStart = new Date(VoteTransactions[0].Voting_Start_Date).toLocaleDateString();
			const sd = convertDateFormat(dateStart)
			setEditStartDate(sd);

			const dateEnd = new Date(VoteTransactions[0].Voting_End_Date).toLocaleDateString();
			const ed = convertDateFormat(dateEnd)
			setEditEndDate(ed);


			const timeStart = VoteTransactions[0].Voting_Start_Time;
			const st = convertTo12HourFormat(timeStart)
			setEditStartTime(timeStart);


			const timeEnd = VoteTransactions[0].Voting_End_Time;
			const et = convertTo12HourFormat(timeEnd)
			setEditEndTime(timeEnd);	
		}
	},[VoteTransactions]);

    const handleTabClick = (tabIndex) => {
        setActiveTab(tabIndex);
    };

	useEffect(() => {
        // Filter members based on the entered OTP whenever findOTP changes
        const filtered = membersInfo.filter(member => {
            // Convert OTP to string for case-insensitive search
            const otpString = findOTP.toString().toLowerCase();
            return member.OTP_Code.toLowerCase().includes(otpString);
        });
        setFilteredMembers(filtered);
    }, [findOTP, membersInfo]); // Re

    useEffect(()=>{

        const socket = io(`${assignedURL}`);
        socket.on('OpenVotingTransactions',(newRecord) =>{
            if(newRecord.length >0){
                const voteStatus = newRecord.filter(rec => rec.Voting_Status === 'Open');
                setVoteTransactions(voteStatus)
            }
         
        });
        socket.on('CloseVotingTransactions',(newRecord) =>{
            setVoteTransactions([])
			setEditEndDate('');
			setEditEndTime('');
			setEditStartDate('');
			setEditStartTime('');
        });
		socket.on('UpdatedMemberRecord', (newRecord) => {
            setMembersInfo(prevData =>
                prevData.map(record =>
                    record.id === newRecord.id &&  record.Member_Id === newRecord.Member_Id ? { ...newRecord } : record
                )
            );
			setDoneVoters(prev => {
				// Check if newRecord's Voting_Status is 'Done'
				if (newRecord.Voting_Status === 'Done') {
					// Check if the id already exists in the previous state
					const existingRecordIndex = prev.findIndex(record => record.id === newRecord.id);
			
					// If the id exists, update its status
					if (existingRecordIndex !== -1) {
						const updatedDoneVoters = [...prev];
						updatedDoneVoters[existingRecordIndex] = newRecord;
						return updatedDoneVoters;
					} else {
						// If the id doesn't exist, add newRecord to the previous state
						return [...prev, newRecord];
					}
				} else {
					// If Voting_Status is not 'Done' and the record exists, remove it
					const filteredDoneVoters = prev.filter(record => record.id !== newRecord.id);
					return filteredDoneVoters;
				}
			});
        });
		
		socket.on('UpdatedVoteCount', (UpdatedVoteCount) => {
			const { newRecord } = UpdatedVoteCount;

			// Update the vote count for the candidate with the matching ID
			const updatedData = candidates.map(candidate => {
				const matchingRecord = newRecord.find(record => record.id === candidate.id);
				return matchingRecord ? { ...candidate, Vote_Count: matchingRecord.Vote_Count } : candidate;
			});
			// Update the candidates state
			setCandidates(updatedData);

		});

		socket.on('updateMembersInfo', (updatedMembers) => {
			setMembersInfo(updatedMembers);
		});

			
        return () => {
            socket.disconnect();
        };
    
    },[]);
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

	/**Fetch */
/**reusable function to get highest / winners  */

	const HighestVoteCount = (data, max,) => {
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
		// Group the updated candidates by position
		const list = CandidatesList(newRecordWithTotalVotes);
		setGroupedCandidates(list);

		let candidatesWithMaxVotePerPosition = {}; // Object to store candidates with the highest vote count per position

		const maxCandidatePerPositionState = max;

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
		return storage
	}


	const fetchCandidatesMaxCount = async () => {
        try {
            const response = await fetch(`${assignedURL}/get_candidates_max_count`);
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
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

	const fetchCandidates = async () => {
        try {
            const response = await fetch(`${assignedURL}/get_candidates_info`);
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                 
                    setCandidates(data)

					const uniquePositions = [...new Set(data.map(item => item.Candidate_Position))];
					setPositionList(uniquePositions)

				
            
                // const matchedCandidates = matchCandidatesWithVoteCounts(candidatesInTopRanking, topVoteCountsPerPosition);
                // setHighestVoteCount(storage);   
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
 
   
	const fetchVotingTransactions = async () => {
        try {
            const response = await fetch(`${assignedURL}/get_voting_transactions`);
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
              
                   setVoteTransactions(data);

					const dateStart = new Date(data[0].Voting_Start_Date).toLocaleDateString();
					const sd = convertDateFormat(dateStart)
					setEditStartDate(sd);
		
					const dateEnd = new Date(data[0].Voting_End_Date).toLocaleDateString();
					const ed = convertDateFormat(dateEnd)
					setEditEndDate(ed);
		
		
					const timeStart = data[0].Voting_Start_Time;
					const st = convertTo12HourFormat(timeStart)
					setEditStartTime(timeStart);
		
					const timeEnd = data[0].Voting_End_Time;
					const et = convertTo12HourFormat(timeEnd)
					setEditEndTime(timeEnd);	

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

    const handleLogout = () => {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('usersName');
        sessionStorage.removeItem('employeePosition');
        setUsersName('');
        nav('/log-in');
        setisLoggedIn(false);
	}

    const handleFileChange = (event) => {
		const file = event.target.files[0];
		const reader = new FileReader();
		const fn = file.name.split('.').pop().toLowerCase();

		reader.onload = (e) => {
			const contents = e.target.result;
			parseFile(file.name, contents);
		};
		if (file) {
			if (fn === 'csv') {
				reader.readAsText(file);
			} else if (fn === 'xlsx' || fn === 'xls') {
				reader.readAsArrayBuffer(file)
			}

		}
	};

	const parseFile = (filename, fileContents) => {

		const extension = filename.split('.').pop().toLowerCase();

		if (extension === 'csv') {
			parseCSV(fileContents);
		} else if (extension === 'xlsx' || extension === 'xls') {
			parseXLSX(fileContents);
		} else {
			console.error('Unsupported file format');
		}
	};

	const parseCSV = (csv) => {
		Papa.parse(csv, {
			header: true,
			complete: (results) => {
				setUploadedCsvFile(results.data);
			},
		});
	};

	const makeHeadersUnique = (headers) => {
		const uniqueHeaders = [];
		const headerCounts = {};
		headers.forEach((header) => {
			const count = headerCounts[header] || 0;
			headerCounts[header] = count + 1;
			const uniqueHeader = count === 0 ? header : `${header}${count + 1}`;
			uniqueHeaders.push(uniqueHeader);
		});

		return uniqueHeaders;
	};

	const parseXLSX = (arrayBuffer) => {
		try {
			const data = new Uint8Array(arrayBuffer);
			const workbook = XLSX.read(data, { type: 'array' });
	
			const sheetName = workbook.SheetNames[0]; // Get the first sheet name
			const sheet = workbook.Sheets[sheetName];
	
			if (!sheet) {
				console.error('Sheet not found in the workbook.');
				return;
			}
	
			const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
			const originalHeaders = jsonData[0]; // Assuming the headers are in the first row
	
			if (!originalHeaders) {
				console.error('No headers found in the Excel sheet.');
				return;
			}
			const uniqueHeaders = makeHeadersUnique(originalHeaders);
			const transformedData = jsonData.slice(1).map(row => {
				const obj = {};
				originalHeaders.forEach((header, index) => {
					// Convert spaces and special characters to underscores and make keys lowercase
					const key = header.replace(/\s+/g, '_');
					obj[key] = row[index];
				});
				return obj;
			});
			// Check if there are more than one sheets in the workbook
			if (workbook.SheetNames.length > 1) {
				console.warn('Multiple sheets found in the workbook. Parsing only the first sheet.');
			}
	
			if(fileUploaded === 'Candidates'){
				handleInsertCandidates(transformedData);
			}else if(fileUploaded === 'Members'){
				handleInsertMembers(transformedData);
			}else if(fileUploaded === 'Candidates Count'){
				handleInsertCandidatesMaxCount(transformedData);
			}else {
				console.log('invalid file')
			}
			
			const imageInput = document.getElementById('fileInput'); // Add an ID to your image input element
			if (imageInput) {
				imageInput.value = '';
			}
		} catch (error) {
			console.error('Error parsing Excel file:', error);
		}
	};
	
	const handleAddButtonClick = (fileType) => {
		setFileUploaded(fileType);
		document.getElementById('fileInput').click();
	};

	/**Function handling upload of Candidates */
	const handleInsertCandidates = async (parsedData) => {
			try {
				const response = await fetch(`${assignedURL}/upload_candidate_info`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(parsedData)
				});

				if (response.ok) {
					// Add an ID to your image input element
					const imageInput = document.getElementById('fileInput'); // Add an ID to your image input element
					if (imageInput) {
						imageInput.value = '';
					}
					alert('Candidates successfully uploaded...')
					setFileUploaded('');
					
				} else {
					throw new Error('Error saving data');
				}
			} catch (error) {
				console.error('An error occurred:', error.message);
			}
			setUploadedCsvFile([]);
			// setNotification_message('File successfully uploaded!!');
	};

	/**Function handling upload of Members */
	const handleInsertMembers = async (parsedData) => {
		const existingOTPCodes = new Set(); // Set to store existing OTP codes

			// Generate OTP codes for each member
			const updatedData = parsedData.map(member => {
			const otp = generateOTP(existingOTPCodes);
			existingOTPCodes.add(otp); // Add generated OTP code to the set
			return { ...member, OTP_Code: otp };
			});
			try {
				const response = await fetch(`${assignedURL}/upload_members_info`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(updatedData)
				});

				if (response.ok) {
					// Add an ID to your image input element
					const imageInput = document.getElementById('fileInput'); // Add an ID to your image input element
					if (imageInput) {
						imageInput.value = '';
					}
					alert('Members successfully uploaded...');
					setFileUploaded('');
					
				} else {
					throw new Error('Error saving data');
				}
			} catch (error) {
				console.error('An error occurred:', error.message);
			}
			setUploadedCsvFile([]);
			// setNotification_message('File successfully uploaded!!');
	};

	const generateOTP = (existingOTPCodes) => {
		const otp = Math.floor(10000 + Math.random() * 90000).toString(); // Generate OTP code
		if (existingOTPCodes.has(otp)) {
		  return generateOTP(existingOTPCodes); // If OTP is not unique, recursively call generateOTP again
		}
		return otp;
	  }

	/**Function handling upload of Candidates */
	const handleInsertCandidatesMaxCount = async (parsedData) => {
		try {
			const response = await fetch(`${assignedURL}/upload_candidate_count`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(parsedData)
			});

			if (response.ok) {
				// Add an ID to your image input element
				const imageInput = document.getElementById('fileInput'); // Add an ID to your image input element
				if (imageInput) {
					imageInput.value = '';
				}
				alert('Max count for per position successfully uploaded...')
				setFileUploaded('');

			} else {
				throw new Error('Error saving data');
			}
		} catch (error) {
			console.error('An error occurred:', error.message);
		}
		setUploadedCsvFile([]);
		// setNotification_message('File successfully uploaded!!');
	};

	/**Navigate to dashboard */
	const handleNavigateToDashboard = () =>{
		nav('/voting-dashboard')
	}

	/**Navigate to winning candidates */
	const handleNavigateToDashboardWinning = () =>{
		nav('/winning-dashboard')
	}	

	/** */
	/**creating Voting  date*/
	const handleSubmitVoteDate = async() =>{
		if(StartDate === '' || StartTime === '' || EndDate === '' || EndTime === '' || selectedOpenPosition ===''){
			alert('Please complete Start or End Date and Time...');
			return
		}
		const	newVoteTransaction = {
				StartDate: StartDate,
				StartTime: StartTime,
				EndDate: EndDate,
				EndTime: EndTime,
				VotingPosition: selectedOpenPosition
			}
			try {
				const response = await fetch(`${assignedURL}/create_new_voting_date`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(newVoteTransaction)
				});

				if (response.ok) {
					// Add an ID to your image input element
				
					setStartDate('');
					setStartTime('');
					setEndDate('');
					setEndTime('');
					setSelectedOpenPosition('');
					alert('Voting date and time successfully added...'); 
				}else {
					const errorMessage = await response.text();
						alert(errorMessage); 
					// throw new Error('Error saving data');
				}
			} catch (error) {
				// alert(error.message); 
				console.log('An error occurred:', error.message);
			}
	}

	/**Update vote date */
	const handleUpdateVoteDate = async() =>{
		const UpdatedVoteTransaction = {
			Voting_End_Date: EditEndDate,
			Voting_End_Time:  EditEndTime,
			Voting_Start_Date: EditStartDate,
			Voting_Start_Time: EditStartTime,
			Voting_Status: VoteTransactions[0].Voting_Status,
			id: VoteTransactions[0].id
		}	
		const updatedMemberStatus = {
            VoteTransactions: UpdatedVoteTransaction,
        }
        try {
			const response = await fetch(`${assignedURL}/edit_vote_transaction`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedMemberStatus),
            });

            if (response.ok) {
              alert('Voting transaction successsfully updated...')
                // setCandidates(prevCandidates => [...prevCandidates, ...updatedCandidatesWithVotersName]);
            } else {
                console.error('Error updating records:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating records:', error);
        }
	}

	/**Cancel */
	const handleCancelVoteDate = () =>{
		setStartDate('');
		setStartTime('');
		setEndDate('');
		setEndTime('');
	}

	/**Update vote date */
	const handleStopVoteDate = () =>{
		setIsForceClose(true);
		setNotificationMSG('Are you sure you want to force closed the transaction ?');
	}

	const handleCloseNotification = () =>{
		setIsForceClose(false);
		setNotificationMSG('')
	}

	const handleForceCloseYes = async() =>{
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
				setIsForceClose(false);
				setNotificationMSG('');
				setEditVotingPos('');
				localStorage.removeItem('VotingPosition');
				alert('Voting Transaction successfully closed...');
                // setCandidates(prevCandidates => [...prevCandidates, ...updatedCandidatesWithVotersName]);
            } else {
                console.error('Error updating records:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating records:', error);
        }
	}

	/**open the modal for start voting*/
	const handleVotingDate = () =>{
		setIsVotingDateUpdate(false);
		setIsVotingDateOpen(true);
		setIsUpdateMember(false);	
		setIstPostWinnersOpen(false);
		setIsForReserved(false);
		setIsUserSetupOpen(false);
		setIsChangePass(false);
		setIsUploadImageOpen(false);
		setIsSignatoryOpen(false);
	}

	/**update voting */
	const handleVotingUpdate = () =>{
		setIsVotingDateUpdate(true);
		setIsVotingDateOpen(false);
		setIsUserSetupOpen(false);
		setIsUpdateMember(false)
		setIstPostWinnersOpen(false);
		setIsForReserved(false);
		setIsChangePass(false);
		setIsUploadImageOpen(false);
		setIsSignatoryOpen(false);
	}

	/**Update Member  */
	const handleUpdateMember = () =>{
		setIsVotingDateUpdate(false);
		setIsVotingDateOpen(false);
		setIsUserSetupOpen(false);
		setIsUpdateMember(true);
		setIstPostWinnersOpen(false);
		setIsForReserved(false);
		setIsChangePass(false);
		setIsUploadImageOpen(false);
		setIsSignatoryOpen(false);
	}

	/** handle user setup */
	const handleUserSetup = () =>{
		setIsVotingDateUpdate(false);
		setIsVotingDateOpen(false);
		setIsUserSetupOpen(true);
		setIsUpdateMember(false);
		setIstPostWinnersOpen(false);
		setIsForReserved(false);
		setIsChangePass(false);
		setIsUploadImageOpen(false);
		setIsSignatoryOpen(false);
	}

	/** handle user setup */
	const handlePostWinners = () =>{
		setIsVotingDateUpdate(false);
		setIsVotingDateOpen(false);
		setIsUserSetupOpen(false);
		setIsUpdateMember(false);
		setIstPostWinnersOpen(true);
		setIsForReserved(false);
		setIsChangePass(false);
		setIsUploadImageOpen(false);
		setIsSignatoryOpen(false);
	}

	
	/** handle Signatory */
	const handleSignatory = () =>{
		setIsVotingDateUpdate(false);
		setIsVotingDateOpen(false);
		setIsUserSetupOpen(false);
		setIsUpdateMember(false);
		setIstPostWinnersOpen(false);
		setIsForReserved(false);
		setIsChangePass(false);
		setIsUploadImageOpen(false);
		setIsSignatoryOpen(true);
	}
	const handleReRun = () =>{
		setIsVotingDateUpdate(false);
		setIsVotingDateOpen(false);
		setIsUserSetupOpen(false);
		setIsUpdateMember(false);
		setIstPostWinnersOpen(false);
		setIsForReserved(true);
		setIsChangePass(false);
		setIsUploadImageOpen(false);
		setIsSignatoryOpen(false);
	}
	const handleUserChangePassword = () =>{
		setIsVotingDateUpdate(false);
		setIsVotingDateOpen(false);
		setIsUserSetupOpen(false);
		setIsUpdateMember(false);
		setIstPostWinnersOpen(false);
		setIsForReserved(false);
		setIsChangePass(true);
		setIsUploadImageOpen(false);
		setIsSignatoryOpen(false);
	}

	/**Handle Upload image module open */
	const handleUploadImage = () =>{
		setIsVotingDateUpdate(false);
		setIsVotingDateOpen(false);
		setIsUserSetupOpen(false);
		setIsUpdateMember(false);
		setIstPostWinnersOpen(false);
		setIsForReserved(false);
		setIsChangePass(false);
		setIsUploadImageOpen(true);
		setIsSignatoryOpen(false);

	}
	/**Function to generate invitation */
	const handleGeneratePDF = () =>{
		if(membersInfo.length > 0){
			const formattedStartDate = new Date(VoteTransactions[0].Voting_Start_Date).toLocaleDateString();
			const formattedEndDate = new Date(VoteTransactions[0].Voting_End_Date).toLocaleDateString();

			const formattedStartTime = convertTo12HourFormat(VoteTransactions[0].Voting_Start_Time);
			const formattedEndTime = convertTo12HourFormat(VoteTransactions[0].Voting_End_Time);
			generatePDF(membersInfo, formattedStartDate, formattedEndDate, formattedStartTime, formattedEndTime);
		}else{
			alert('No Members available or no voting transaction is opened...')
		}
		
    }

	const generatePDF = (membersInfo, formattedStartDate, formattedEndDate, formattedStartTime, formattedEndTime) => {
		const doc = new jsPDF();
	
		let recordsProcessed = 0;
		let pageNumber = 1;
	
		// Iterate through each member info
		membersInfo.forEach((member, index) => {
			const { Member_Name, Voting_Start_Date, Voting_End_Date, OTP_Code } = member;
	
			// Generate content for the invitation letter without leading spaces
			const content = `Hello, ${Member_Name}

You have been selected to vote in the election event of PROVIDER'S MPC, facilitated by 
Maria Carmela B. Francisco. 

This event will be open for voting from ${formattedStartDate}  ${formattedStartTime} to ${formattedEndDate} ${formattedEndTime}.
			
Please click the following link to input your code:
sample url ${currentUrl}.


Your Vote Code: ${OTP_Code}
Please do not share this code.



Cheers,
MC Election Committee
`;
	
			// Set font size
			doc.setFontSize(12); // Adjust the font size as needed
	
			// Add content to the document
			doc.text(content, 10, 10 + recordsProcessed * 100); // Adjust the Y-coordinate for spacing
	
			// Increment the count of records processed
			recordsProcessed++;
	
			// Check if three records have been processed or all records have been processed
			if (recordsProcessed % 3 === 0 || index === membersInfo.length - 1) {
				// Add a new page if there are more records or if it's the last record
				if (index !== membersInfo.length - 1) {
					doc.addPage();
				}
				pageNumber++;
				// Reset the recordsProcessed count
				recordsProcessed = 0;
			}
		});
		// Save or print the document
		doc.save('Voting_invitation_letters.pdf');
		// Save the PDF as a blob
		const pdfBlob = doc.output('blob');
	
		// Create a URL for the blob
		const pdfURL = URL.createObjectURL(pdfBlob);
	
		// Open the PDF in a new window
		window.open(pdfURL, '_blank');
	};
	
	/**Convert time into 12 hours format */

	const convertTo12HourFormat = (time) => {
		const [hour, minute, second] = time.split(':');
		let suffix = 'AM';
		let formattedHour = parseInt(hour, 10);
	
		if (formattedHour === 0) {
			formattedHour = 12;
		} else if (formattedHour === 12) {
			suffix = 'PM';
		} else if (formattedHour > 12) {
			formattedHour -= 12;
			suffix = 'PM';
		}
	
		return `${formattedHour}:${minute} ${suffix}`;
	};

	const convertDateFormat = (dateString) => {
		const parts = dateString.split('/');
		const month = parts[0].padStart(2, '0');
		const day = parts[1].padStart(2, '0');
		const year = parts[2];
	
		return `${year}-${month}-${day}`;
	}
	
	  /**create user */
	  const handleUserRegistration = async (e) => {
		e.preventDefault();
		if(username === '' || password === '' || confirmPassword === '' || adminName === ''){
			alert('Please complete the details needed...');
			return
		}
		if(password !== confirmPassword){
			alert('Please make sure your passwords match...');
			return
		}
		// Make a fetch request to your backend to register the user
		try {
			const response = await fetch(`${assignedURL}/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password, adminName }),
			});
			const data = await response.json();
			if (response.ok) {
				// User registered successfully
				alert('User registered successfully');
				// Clear input fields or reset state as needed
				setUsername('');
				setPassword('');
				setAdminName('');
				setConfirmPassword('');
				// Optionally, close the user setup container
				// setIsUserSetupOpen(false);
			} else {
				// Handle registration failure
				// console.error('Failed to register user');
				// Optionally, show an error message to the user
				if (data && data.error) {
					alert(data.error);
				} else {
					alert('Registration failed. Please try again later.');
				}
			}
		} catch (error) {
			console.error('Error:', error);
			// Handle fetch error
		}
	};

	/**function handling reset single record */
	const handleResetSingle = async(rec) =>{
			const updatedMemberStatus = {
				memberID: rec.Member_Id,
				memberStatus: ''
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
					alert(`Vote status for member with id ${rec.Member_Id} reset successfully...`)
					// setCandidates(prevCandidates => [...prevCandidates, ...updatedCandidatesWithVotersName]);
				} else {
					console.error('Error updating records:', response.statusText);
				}
			} catch (error) {
				console.error('Error updating records:', error);
			}
	}

	/**Function handling reset all members */
	const handleResetAllMembers = async() =>{
		try {
			const response = await fetch(`${assignedURL}/reset_all_member_status`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(membersInfo),
			});

			if (response.ok) {
				alert(`Vote status for all member reset successfully...`)
				// setCandidates(prevCandidates => [...prevCandidates, ...updatedCandidatesWithVotersName]);
			} else {
				console.error('Error updating records:', response.statusText);
			}
		} catch (error) {
			console.error('Error updating records:', error);
		}
	}


	/**Handle Post Transactions */
	const handlePostTransaction = () =>{
		const records = HighestVoteCount(candidates, maxCandidatesPerPositionState);
		let UpdatedCandidates = [];

		if(EditVotingPos === 'ALL' ){
			UpdatedCandidates = Object.values(records).flat();
		}else{
			const filteredRecord = records[EditVotingPos];
			UpdatedCandidates = Object.values(filteredRecord).flat();
		}
		
		if(UpdatedCandidates.length <= 0){
			alert('No transaction to be posted ...');
			return
		}
		if(VoteTransactions.length > 0){
			alert('Failed to post transaction, Voting is currently open...');
			return
		}
		if(EditEndDate === '' || EditStartDate === '' || EditVotingPos ===''){
			alert('Please selecte Position and date to close...');
			return
		}
		setNotificationMSG('Are you sure to post the vote transactions....')
		setIsPostVoteTransaction(true);
	}

	const handlePostTransYes = async() =>{
	
		const records = HighestVoteCount(candidates, maxCandidatesPerPositionState);
		let UpdatedCandidates = [];

		if(EditVotingPos === 'ALL' ){
			UpdatedCandidates = Object.values(records).flat();
			
		}else{
			const filteredRecord = records[EditVotingPos];
			UpdatedCandidates = Object.values(filteredRecord).flat();
		}
	
		const updatedCandidateStatus = {
			UpdatedCandidates: UpdatedCandidates,
			EditVotingPos: EditVotingPos,
			EditStartDate: EditStartDate,
			EditEndDate: EditEndDate
		}
		try {
			const response = await fetch(`${assignedURL}/post_vote_transaction`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedCandidateStatus),
			});

			if (response.ok) {
				alert('Voting transaction successsfully posted...');
				setEditVotingPos('');
				setEditStartDate('');
				setEditEndDate('');
				setIsPostVoteTransaction(false);
				sessionStorage.removeItem('updatedCandidates');
				// setCandidates(prevCandidates => [...prevCandidates, ...updatedCandidatesWithVotersName]);
			} else {
				if (response.status === 400) {
					response.json().then(data => {
						alert(data.message); // Display the error message from the server
					});
				} else {
					console.error('Error updating records:', response.statusText);
					// Handle other error cases here if needed
				}
			}
		} catch (error) {

			console.error('Error updating records:', error);
		}

	
		// const sortedCandidates = 
	}

	const handleClose = () =>{
		setNotificationMSG('')
		setIsPostVoteTransaction(false);
	}
	
	/**set up which position can run multiple positions when lose */
	const handleUpdateMultiRunPosition = async() =>{
		if(positionMultiRun === ''){
			alert('No position is selected...')
			return
		}
		const updatedMemberStatus = {
            positionMultiRun: positionMultiRun,
        }
		try {
			const response = await fetch(`${assignedURL}/update_candidate_multirun`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedMemberStatus),
			});

			if (response.ok) {
				setPositionMultiRun('');
				alert(`Successfully updated ${positionMultiRun} position to allow multi-run...`);
				// setCandidates(prevCandidates => [...prevCandidates, ...updatedCandidatesWithVotersName]);
			} else {
				console.error('Error updating records:', response.statusText);
			}
		} catch (error) {
			console.error('Error updating records:', error);
		}
	
	}
	
	/**set up which position can run multiple positions when lose */
	const handleUpdateMultiRunPositionFalse = async() =>{
		if(positionMultiRun === ''){
			alert('No position is selected...')
			return
		}
		const updatedMemberStatus = {
            positionMultiRun: positionMultiRun,
        }
		try {
			const response = await fetch(`${assignedURL}/update_candidate_multirun_false`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedMemberStatus),
			});

			if (response.ok) {
				setPositionMultiRun('');
				alert(`Successfully updated ${positionMultiRun} position to remove allow multi-run...`);
				// setCandidates(prevCandidates => [...prevCandidates, ...updatedCandidatesWithVotersName]);
			} else {
				// console.error('Error updating records:', response.statusText);
				alert(`No record found Multiple position is valid...`);
			}
		} catch (error) {
			console.error('Error updating records:', error);
		}
	
	}

	/**function to reset Candidate vote count and status, 
	 * remove the losers candidate, 
	 * Delete vote records*/

	const handleResetCandidates = async() =>{
	    // Display a confirmation dialog before resetting
		const confirmReset = window.confirm("Are you sure you want to reset vote records and candidate details?");

		// Proceed with reset if user confirms
		if (confirmReset) {
			handleGenerateExcelVoteRecords();
			handleGenerateExcelVoteResults();
			try {
				const response = await fetch(`${assignedURL}/reset_vote_transaction`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(),
				});
	
				if (response.ok) {
					alert(`Vote records and candidate details successfully reset...`);
					sessionStorage.removeItem('updatedCandidates');
					// setCandidates(prevCandidates => [...prevCandidates, ...updatedCandidatesWithVotersName]);
				} else {
					console.error('Error updating records:', response.statusText);
				}
			} catch (error) {
				console.error('Error updating records:', error);
			}
		} else {
			// Do nothing if user cancels the reset
			console.log('Reset canceled by user.');
		}
	}

	
/**GEnerate Reports */
	/**Function handling generate Excel for members information */
	const handleGenerateExcel = () => {

		if (membersInfo.length <= 0) {
			alert(`No member's info found...`);
		} else {
			const headerRow = {
				Member_Id: 'Member ID',
				Member_Name: 'Member Name',
				OTP_Code: 'OTP Code',
			
			};

			const cleanedData = [headerRow, ...membersInfo.map((record) => {
				// Create a new object with only text properties corresponding to the second set of headers
				const textOnlyRecord = {
					Member_Id: record.Member_Id,
					Member_Name: record.Member_Name,
					OTP_Code: record.OTP_Code,
					
				};
				return textOnlyRecord;
			})];

			downloadCSV(cleanedData, 'Members_Information.csv');
		}
		// setIsDownloading(true);

	};
	/**Function handling Download Excel */
	const downloadCSV = (data, filename) => {
		const csvContent = 'data:text/csv;charset=utf-8,' + '\uFEFF' + data.map(row => {
			// const employeeHeader = (row.Header.includes(',') || row.Employee_Name.includes(',')) ? `"${row.Header}"` : row.Header;

			const rowValuesH = Object.keys(row)
			  .map(key => (key === 'Member_Id' || key === 'Member_Name' ? `"${row[key]}"` : row[key]))
			  .join(',');

		  return rowValuesH;
		}).join('\n');
	  
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement('a');
		link.setAttribute('href', encodedUri);
		link.setAttribute('download', filename);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	  };
	const handleGenerateExcelVoteRecords = async() =>{
		try {
			const response = await fetch(`${assignedURL}/get_vote_records`);
			if (response.ok) {
				const data = await response.json();
				if (data.length > 0) {
			
					const headerRow = {
						Record_Id: 'Record Id',
						Member_Id: 'Member ID',
						Member_Name: 'Member Name',
						Candidate_Name: 'Candidate Name',
						Candidate_Position: 'Candidate Position',
						Voting_Duration: "Voting Duration",
						Vote_Count: "Vote Count"
					
					};


					const cleanedData = [headerRow, ...data.map((record) => {
						// Create a new object with only text properties corresponding to the second set of headers
						const textOnlyRecord = {
							Record_Id: record.id,
							Member_Id: record.Voters_Id,
							Member_Name:  record.Voters_Name, 
							Candidate_Name:  record.Candidate_Name,
							Candidate_Position: record.Candidate_Position,
							Voting_Duration: record.Voting_Duration, 
							Vote_Count: record.Vote_Count
							
						};
						return textOnlyRecord;
					})];
		
					downloadcsvVoteTransactios(cleanedData, 'Vote_Transaction_Records.csv');



				} else {
					alert('No Vote Transaction Record found...')
				}
			} else {
				console.error('Error:', response.status);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}
	/**Function handling Download Excel */
	const downloadcsvVoteTransactios = (data, filename) => {
		const csvContent = 'data:text/csv;charset=utf-8,' + '\uFEFF' + data.map(row => {
			// const employeeHeader = (row.Header.includes(',') || row.Employee_Name.includes(',')) ? `"${row.Header}"` : row.Header;

			const rowValuesH = Object.keys(row)
			  .map(key => (key === 'Member_Id' || key === 'Member_Name' || key === 'Candidate_Name' ? `"${row[key]}"` : row[key]))
			  .join(',');
		  return rowValuesH;
		}).join('\n');
	  
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement('a');
		link.setAttribute('href', encodedUri);
		link.setAttribute('download', filename);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	  };

	/**Funtion to generate Candidate Vote Result */
	const handleGenerateExcelVoteResults = async() =>{
		try {
            const response = await fetch(`${assignedURL}/get_posted_vote_per_candidate`);
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {

					// Step 1: Group records by Candidate_Position
					let groupedRecords = data.reduce((acc, record) => {
						const position = record.Candidate_Position;
						acc[position] = acc[position] || [];
						acc[position].push(record);
						return acc;
					}, {});

					// Step 2: Sort each group by Vote_Count
					for (let position in groupedRecords) {
						groupedRecords[position] = groupedRecords[position].sort((a, b) => b.Vote_Count - a.Vote_Count);
					}

					// Step 3: Update the original records
					let updatedRecords = Object.values(groupedRecords).flatMap(records => records);


					const totalVotes = {};

					// Iterate over the data to calculate the total votes for each position
					updatedRecords.forEach(record => {
						const position = record.Candidate_Position;
						const voteCount = parseInt(record.Vote_Count);
						
						// If the position doesn't exist in the totalVotes object, create it with the current voteCount
						if (!totalVotes[position]) {
							totalVotes[position] = voteCount;
						} else {
							// Otherwise, add the current voteCount to the existing total
							totalVotes[position] += voteCount;
						}
					});
					
					// Iterate over the data again to add the Total_Vote_Count property to each record
					updatedRecords.forEach(record => {
						const position = record.Candidate_Position;
						record.Total_Vote_Count = totalVotes[position];
					});
					
					/**Generate data for total votes */
					const headerRow = {
						Candidate_Name: 'Candidate Name',
						Candidate_Position: 'Candidate Position',
						Vote_Count: "Vote Count",
						Total_Vote_Count: "Total Vote Count Per Position",
						Vote_Percentage: "Vote Percentage",
						Voting_Status: "Status"
					
					
					};


					const cleanedData = [headerRow, ...updatedRecords.map((record) => {
						// Create a new object with only text properties corresponding to the second set of headers
						const votePercent = ((record.Vote_Count / record.Total_Vote_Count) * 100).toFixed(2);

						const textOnlyRecord = {
							Candidate_Name: record.Candidate_Name,
							Candidate_Position: record.Candidate_Position,
							Vote_Count: record.Vote_Count,
							Total_Vote_Count: record.Total_Vote_Count,
							Vote_Percentage: isNaN(votePercent) ? '00.00 %' : `${votePercent} %`,
							Voting_Status:  record.Voting_Status === 'Done' ? '' : record.Voting_Status
							
						};
						return textOnlyRecord;
					})];
		
					downloadcsvVoteFinalRecords(cleanedData, 'Final_Vote_Counts.csv');

                } else {
                    alert('No Records')
                }
            } else {
                console.error('Error:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
	}

	/**Function handling Download Excel */
	const downloadcsvVoteFinalRecords = (data, filename) => {
		const csvContent = 'data:text/csv;charset=utf-8,' + '\uFEFF' + data.map(row => {
			// const employeeHeader = (row.Header.includes(',') || row.Employee_Name.includes(',')) ? `"${row.Header}"` : row.Header;

			const rowValuesH = Object.keys(row)
				.map(key => (key === 'Member_Id' || key === 'Member_Name' || key === 'Candidate_Name' ? `"${row[key]}"` : row[key]))
				.join(',');
			return rowValuesH;
		}).join('\n');

		const encodedUri = encodeURI(csvContent);
		const link = document.createElement('a');
		link.setAttribute('href', encodedUri);
		link.setAttribute('download', filename);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	
	/**clear OTP search */
	const handleClearFindOTP = () =>{
		setFindOTP('');
	}

	const handlePasswordChange =async (e) => {
        e.preventDefault();
        // Check if new password and confirm new password match
		if(username === '' ||  oldPassword === '' || newPassword === '' || confirmNewPassword === ''){
			alert('Please complete the details before submitting...');
			return
		}
        if (newPassword !== confirmNewPassword) {
            alert('New password do not match');
            return;
        }
		const data = {
			username: username,
			oldPassword: oldPassword,
			newPassword: newPassword
		};
		try {
			const response = await fetch(`${assignedURL}/change_password`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
	
			if (!response.ok) {
				if (response.status === 400) {
					// Display alert for specific error message from backend for 400 status code
					const responseData = await response.json();
					if (responseData.error) {
						alert(responseData.error);
					} else {
						alert('User not found');
					}
				} else if (response.status === 401) {
					// Display alert for specific error message from backend for 400 status code
					const responseData = await response.json();
					if (responseData.error) {
						alert(responseData.error);
					} else {
						alert('User not found');
					}
				}else {
					throw new Error('Failed to change password');
				}
			} else {
				const responseData = await response.json();
				setUsername('');
				setOldPassword('');
				setNewPassword('');
				setConfirmNewPassword('');
				setError('');
				alert('Successfully changed password');

			}
		
		} catch (error) {
			console.error(error); // Handle error here
		}
       
    };

	


	/**Upload images */

	const [selectedFiles, setSelectedFiles] = useState([]);

	const handleFileChangeUpload = (event) => {
		setSelectedFiles([...selectedFiles, ...event.target.files]);
	};
	/**Upload images */
	const handleSubmit = async (event) => {
		event.preventDefault();

		if (selectedFiles.length === 0) {
			alert('Error: No image to be uploaded.');
			return;
		}
		const formData = new FormData();
		selectedFiles.forEach((file) => {
			formData.append('images', file);
		});


		try {
			const response = await fetch(`${assignedURL}/upload_images`, {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const message = await response.text(); // Extract the message from the response
				alert(message);

				// Clear the file input field
				const fileInput = document.querySelector('.file-input');
				if (fileInput) {
					fileInput.value = ''; // Reset the value to clear the selected files
				}
			} else {
				console.error('Failed to upload images');
			}
		} catch (error) {
			console.error('Error uploading images:', error);
		}
	};

	/**Delete Images */
	
	/**function to reset Candidate vote count and status, 
	 * remove the losers candidate, 
	 * Delete vote records*/

	const handleDeleteImages = async() =>{
	    // Display a confirmation dialog before resetting
		const confirmReset = window.confirm("Are you sure you want to reset vote records and candidate details?");

		// Proceed with reset if user confirms
		if (confirmReset) {
			try {
				const response = await fetch(`${assignedURL}/delete_images`, {
				  method: 'DELETE',
				  // Add any necessary headers or body data if required
				});
			
				if (response.ok) {
				  alert('All uploaded images deleted successfully');
				} else {
				  console.error('Failed to delete images:', response.status);
				  alert('Failed to delete images. Please try again.');
				}
			  } catch (error) {
				console.error('Error deleting images:', error);
				alert('Error deleting images. Please try again.');
			  }
		} else {
			// Do nothing if user cancels the reset
			console.log('Reset canceled by user.');
		}
	}

	/**Add Signatory */
	const handleSubmitSignatory = async (event) => {
		event.preventDefault();
		const data = {
			signatoryName: signatoryName,
			signatoryPosition: signatoryPosition
		};
		// console.log('Signatory submitted successfully!',data);
		try {
			const response = await fetch(`${assignedURL}/insert_signatory`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
			
			if (response.ok) {
				const data = await response.json();
				alert(data.message);
				setSignatoryName('');
            	setSignatoryPosition('');
			}
		
		} catch (error) {
			console.error(error); // Handle error here
		}
	  };
    return (
        // <div className="Home_Con">
        //     <div className="nav-container">
		// 		<button onClick={handleNavigateToDashboard}>Dashboard</button>
        //         <button onClick={handleLogout}>Logout</button>
        //     </div>
        //     <div className="tab-container">
        //         <div className="tab-container-span">    
        //             <span>Upload Candidates</span>
        //         </div>
               
        //         <div className="tab-header">
        //             <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
        //             <button className="DailyTimeRecord_Add_TimeSheet" onClick={()=>handleAddButtonClick('Candidates')}>Upload</button>
        //         </div>
		// 		<div className="tab-container-span">    
        //             <span>Upload members</span>
        //         </div>
		// 		<div className="tab-header">
        //             <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
        //             <button className="DailyTimeRecord_Add_TimeSheet" onClick={()=>handleAddButtonClick('Members')}>Upload</button>
        //         </div>
		// 		<div className="tab-container-span">    
        //             <span>Upload Candicates Maximum Count</span>
        //         </div>
		// 		<div className="tab-header">
        //             <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
        //             <button className="DailyTimeRecord_Add_TimeSheet" onClick={()=>handleAddButtonClick('Candidates Count')}>Upload</button>
        //         </div>
        //     </div>
          
        // </div>
		<div className="admin-Home_Con">
			 {isForceClose && (
                 <div className="Voting-notification-container">
                    <div className="notification-print">
                        <div className="notification-header">
                           <div className="confirm-icon-con"><FaQuestion className="confirm-icon"/>
						   </div>
                        </div>
                        <div className="notification-content">
                            <span>{notificationMSG}</span>
                           
                        </div>
                       
                            <div className="notification-button">
                             
                                    <button onClick={handleForceCloseYes}  className="notification-button2">Confirm</button>
                                    <button onClick={handleCloseNotification}  className="notification-button2">Cancel</button>
                               
                            </div>

                   </div>
                </div>
             )} 
			  {isPostVoteTransaction && (
                 <div className="Voting-notification-container">
                    <div className="notification-print">
                        <div className="notification-header">
                           <div className="confirm-icon-con"><FaQuestion className="confirm-icon"/>
						   </div>
                        </div>
                        <div className="notification-content">
                            <span>{notificationMSG}</span>
                           
                        </div>
                       
                            <div className="notification-button">
                             
                                    <button onClick={handlePostTransYes}  className="notification-button2">Confirm</button>
                                    <button onClick={handleClose}  className="notification-button2">Cancel</button>
                               
                            </div>

                   </div>
                </div>
             )} 
			{/* <div className="home-background-template"><div className="home-background-template-inner"></div></div> */}
			<div className="sidebar">
				{/* <button class="toggle-btn" onClick={toggleSidebar}>Toggle Sidebar</button> */}
				<div className="sidebar-logo">
					<img src={exampleImage} alt="Example" className="home-logo" />
				</div>
				<div className="sidebar-line">&nbsp;</div>
				<div className="sidebar-navigations">
					
					<button onClick={handleNavigateToDashboard}>Dashboard</button>
					<button onClick={handleNavigateToDashboardWinning}>Winning Candidates</button>

					<div className="toggle-icon-con" onClick={() => setIstoggleUpload(!istoggleUploads)}><button >Upload Masterfile</button><span>{!istoggleUploads &&<ExpandMoreRoundedIcon/>} {istoggleUploads && <ExpandLessRoundedIcon/>}</span></div>
					{istoggleUploads && 
					<>
						<div className="upload-sub-menus">
							<input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
							<button  onClick={() => handleAddButtonClick('Candidates')}>Upload Candidates</button>

							<input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
							<button onClick={() => handleAddButtonClick('Members')}>Upload Members</button>

							<input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
							<button  onClick={() => handleAddButtonClick('Candidates Count')}>Upload Maximum Candidate per Position</button>
						</div>
					</>}
					
					<div className="toggle-icon-con" onClick={() => setIstoggleVoteDate(!istoggleVoteDate)}><button >Vote Setup</button><span>{!istoggleVoteDate &&<ExpandMoreRoundedIcon/>} {istoggleVoteDate && <ExpandLessRoundedIcon/>}</span></div>
					{istoggleVoteDate && 
					<>
						<div className="upload-sub-menus">
							<button  onClick={handleVotingDate}>Start Voting</button>
							<button  onClick={handleVotingUpdate}>Update Voting</button>
							<button  onClick={handleReRun}>Set up Multi-run Position</button>
							<button  onClick={handlePostWinners}>Post Winners</button>
							<button  onClick={handleSignatory}>Set up Signatory</button>
						</div>
					</>}

					<div className="toggle-icon-con" onClick={() => setIsMemberOpen(!isMemberOpen)}><button >Member / Candidate Setup</button><span>{!isMemberOpen &&<ExpandMoreRoundedIcon/>} {isMemberOpen && <ExpandLessRoundedIcon/>}</span></div>
					{isMemberOpen && 
					<>
						<div className="upload-sub-menus">
							<button  onClick={handleUpdateMember}>Update Member</button>
							<button  onClick={handleUploadImage}>Upload Images</button>
							<button  onClick={handleDeleteImages}>Delete Images</button>
							<button  onClick={handleResetCandidates}>Reset Records</button>
						</div>
					</>}

					<div className="toggle-icon-con" onClick={() => setIsGenerateReport(!isGenerateReport)}><button >Generate Reports</button><span>{!isGenerateReport &&<ExpandMoreRoundedIcon/>} {isGenerateReport && <ExpandLessRoundedIcon/>}</span></div>	
					{isGenerateReport && 
					<>
						<div className="upload-sub-menus">
							<button  onClick={handleGeneratePDF}>Generate Invitation (PDF)</button>
							<button  onClick={handleGenerateExcel}>Generate OTP Records (CSV)</button>
							<button  onClick={handleGenerateExcelVoteRecords}>Generate Vote Records Per Member (CSV)</button>
							<button  onClick={handleGenerateExcelVoteResults}>Generate Final Vote Results (CSV)</button>
						</div>
					</>}

						<div className="toggle-icon-con" onClick={() => setIsUserSetUp(!isUserSetUp)}><button >User Setup</button><span>{!isUserSetUp &&<ExpandMoreRoundedIcon/>} {isUserSetUp && <ExpandLessRoundedIcon/>}</span></div>	
				{isUserSetUp && 
					<>
						<div className="upload-sub-menus">
								<button onClick={handleUserSetup}>Add User</button>
								<button onClick={handleUserChangePassword}>Change Password</button>
						</div>
					</>}

				</div>
				<div className="sidebar-logout">
					<button onClick={handleLogout}>Logout</button>
				</div>

			</div>
			<div className="content">
				<div className="tab-container">
						
					{isVotingDateOpen && 
					<>
						{/* <div className="side-button">
							<div className="side-button-start"><span>Start Vote</span></div>
							<div className="side-button-update"><span>Update Vote</span></div>
						</div> */}
						<div className="voting-time-con">
						<h2 style={{marginLeft: '15px'}}>Create Vote Transaction</h2>
							<div className="voting-time-con-select">
								<div><label>Voting Position:</label></div>
								<div>
									<select
										value={selectedOpenPosition}
										onChange={(event) => setSelectedOpenPosition(event.target.value)}>
										<option value="">Select position</option>
										<option value="ALL">ALL</option>
										{positionList.length > 0 && (
											positionList.map((pos, posIndex) => (
												<option key={posIndex} value={pos}>
													{pos}
												</option>
											))
										)}
									</select>
								</div>
							</div>	
							<div className="voting-time">
								
								<div className="add-voting">
								
									<div className="add-voting-start">
										<div className="add-voting-start-input">
											<div><label>Start date:</label></div>
											<div>&nbsp;<input type="date" value={StartDate} onChange={(e)=> setStartDate(e.target.value)}/></div>
									
											<div><label>Start time:</label></div>
											<div>&nbsp;<input type="time" value={StartTime} onChange={(e)=> setStartTime(e.target.value)}/></div>
										</div>
									</div>
									<div className="add-voting-end">
										<div className="add-voting-end-input">
												<div><label>End date:</label></div>
												<div>&nbsp;<input type="date" value={EndDate} onChange={(e)=> setEndDate(e.target.value)}/></div>
										
												<div><label>End time:</label></div>
												<div>&nbsp;<input type="time" value={EndTime} onChange={(e)=> setEndTime(e.target.value)}/></div>
											</div>
										</div>

								</div>
							</div>
							<div className="voting-time-button">
								<button className="voting-time-button-add" onClick={handleSubmitVoteDate}>Create</button>
								<button className="voting-time-button-stop" onClick={handleCancelVoteDate}>Cancel</button>
							</div>
						</div>
					</>
					}
					{isVotingDateUpdate && 
					<>
						{/* <div className="side-button">
							<div className="side-button-start"><span>Start Vote</span></div>
							<div className="side-button-update"><span>Update Vote</span></div>
						</div> */}
						<div className="voting-time-con">
						<h2 style={{marginLeft: '15px'}}>Update Vote Transaction</h2>
						<div style={{fontSize: '19px', textAlign:'center', fontWeight: '300'}}><label>Voting Position: {EditVotingPos}</label></div>
							<div className="voting-time">
							
								
								<div className="add-voting">
									<div className="add-voting-start">
										<div className="add-voting-start-input">
											<div><label>Start date:</label></div>
											<div>&nbsp;<input type="date" value={EditStartDate} onChange={(e)=> setEditStartDate(e.target.value)}/></div>
									
											<div><label>Start time:</label></div>
											<div>&nbsp;<input type="time" value={EditStartTime} onChange={(e)=> setEditStartTime(e.target.value)}/></div>
										</div>
									</div>
									<div className="add-voting-end">
										<div className="add-voting-end-input">
												<div><label>End date:</label></div>
												<div>&nbsp;<input type="date" value={EditEndDate} onChange={(e)=> setEditEndDate(e.target.value)}/></div>
										
												<div><label>End time:</label></div>
												<div>&nbsp;<input type="time" value={EditEndTime} onChange={(e)=> setEditEndTime(e.target.value)}/></div>
											</div>
										</div>

								</div>
							</div>
							<div className="voting-time-button">
								<button className="voting-time-button-add" onClick={handleUpdateVoteDate}>Update</button>
								<button className="voting-time-button-stop" onClick={handleStopVoteDate}>Force Close</button>
							</div>
						</div>
					</>
					}
				
					{isUpdateMember && 
					<>
						{/* <div className="side-button">
							<div className="side-button-start"><span>Start Vote</span></div>
							<div className="side-button-update"><span>Update Vote</span></div>
						</div> */}
						<div className="update-member-time-con">
							<div className="update-member-time-con2">
								<div className="update-member-time-con2-header">
									<div className="update-member-time-con2-header-div1"><span>Voters Percent : {doneVoters.length} / {membersInfo.length}</span></div>
										<div className="update-member-time-con2-header-div2">
											<input type="text" value={findOTP} onChange={(e)=>setFindOTP(e.target.value)} className="search-OTP" placeholder="OTP To Search"/>
											<BackspaceRoundedIcon className="clear-icon" onClick={handleClearFindOTP}/>
										</div>
								</div>
								<div className="update-member-time-con2-content" >
									<table>
										<thead>
											<tr>
												<th>Member ID</th>
												<th>Member Name</th>
												<th>OTP Code</th>
												<th>Voting Status</th>
												<th>Reset Status</th>
											</tr>
										</thead>
										<tbody>
											{filteredMembers.length > 0 ? (
												filteredMembers.map((record, index) => (
													<tr key={index}>
														<td>{record.Member_Id}</td>
														<td>{record.Member_Name}</td>
														<td>{record.OTP_Code}</td>
														<td>{record.Voting_Status}</td>
														<td><RestartAltRoundedIcon onClick={()=>handleResetSingle(record)} className="reset-icon"/></td>
													</tr>
													))
												) : (
				
													<tr>
														<td colSpan={10} className="NoRecordFound">No Record Found!</td>
													</tr>
											)}
										</tbody>
									</table>
								</div>
							</div>
							<div className="voting-time-button2">
								<button className="voting-time-button-add" onClick={handleResetAllMembers}>Reset All</button>
							</div>
						</div>
					</>
					}
					{isUserSetupOpen && (
					<div className="register-container">
						<div className="user-setup-container">
							<h3>User Setup</h3>
							{/* User registration form */}
							<form onSubmit={handleUserRegistration}>
								<div className="input-group">
									<div className="input-field">
										<label htmlFor="username">Username:</label>
										<input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="off" />
									</div>
									<div className="input-field">
										<label htmlFor="adminName">Admin Name:</label>
										<input type="text" id="adminName" value={adminName} onChange={(e) => setAdminName(e.target.value)} autoComplete="off" />
									</div>
								</div>
								<div className="input-group">
									<div className="input-field">
										<label htmlFor="password">Password:</label>
										<input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="off" />
									</div>
									<div className="input-field">
										<label htmlFor="confirmPassword">Confirm Password:</label>
										<input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="off" />
									</div>
								</div>
								<button type="submit">Register</button>
							</form>
						</div>
					</div>
					)}
					{isChangePass && (
					<div className="register-container">
						<div className="user-setup-container">
								<h3>Change Password</h3>
								{/* Change password form */}
								<form onSubmit={handlePasswordChange}>
									<div className="input-group">
										<div className="input-field">
											<label htmlFor="username">Username:</label>
											<input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="off" />
										</div>
										<div className="input-field">
											<label htmlFor="oldPassword">Old Password:</label>
											<input type="password" id="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} autoComplete="off" />
										</div>
									</div>
									<div className="input-group">
										<div className="input-field">
											<label htmlFor="newPassword">New Password:</label>
											<input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="off" />
										</div>
										<div className="input-field">
											<label htmlFor="confirmNewPassword">Confirm New Password:</label>
											<input type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} autoComplete="off" />
										</div>
									</div>

									<button type="submit">Change Password</button>
								</form>
							</div>
					</div>
					)}
					{isPostWinnersOpen && 
					<>
						{/* <div className="side-button">
							<div className="side-button-start"><span>Start Vote</span></div>
							<div className="side-button-update"><span>Update Vote</span></div>
						</div> */}
						<div className="voting-time-con">
						<h2 style={{marginLeft: '15px'}}>Post Vote Transaction</h2>
							<div className="voting-time-con-select">
								<div><label>Voting Position:</label></div>
								<div>
									<select
										
										value={EditVotingPos}
										onChange={(event) => setEditVotingPos(event.target.value)}>
										<option value="">Select position</option>
										<option value="ALL">ALL</option>
										{positionList.length > 0 && (
											positionList.map((pos, posIndex) => (
												<option key={posIndex} value={pos}>
													{pos}
												</option>
											))
										)}
									</select>
								</div>
							</div>	
							<div className="voting-time">
								
								<div className="add-voting">
								
									<div className="add-voting-start">
										<div className="add-voting-start-input">
											<div><label>Start date:</label></div>
											<div>&nbsp;<input type="date" value={EditStartDate} onChange={(e)=> setEditStartDate(e.target.value)}/></div>
									
											{/* <div><label>Start time:</label></div>
											<div>&nbsp;<input type="time" value={EditStartTime} onChange={(e)=> setEditStartTime(e.target.value)} disabled={true}/></div> */}
										</div>
									</div>
									<div className="add-voting-end">
										<div className="add-voting-end-input">
												<div><label>End date:</label></div>
												<div>&nbsp;<input type="date" value={EditEndDate} onChange={(e)=> setEditEndDate(e.target.value)} /></div>
												
												{/* <div><label>End time:</label></div>
												<div>&nbsp;<input type="time" value={EditEndTime} onChange={(e)=> setEditEndTime(e.target.value)} disabled={true}/></div> */}
											</div>
										</div>

								</div>
							</div>
							<div className="voting-time-button">
								<button className="voting-time-button-add" onClick={handlePostTransaction}>Post Transaction</button>
								{/* <button className="voting-time-button-stop" onClick={handleCancelVoteDate}>Cancel</button> */}
							</div>
						</div>
					</>
					}
					{isForReserved && 
					<>
						{/* <div className="side-button">
							<div className="side-button-start"><span>Start Vote</span></div>
							<div className="side-button-update"><span>Update Vote</span></div>
						</div> */}
						<div className="re-voting-time-con">
						<h2 style={{marginLeft: '15px'}}>Update Multi-run Position</h2>
							<div className="voting-time-con-select">
								<div><label>Voting Position:</label></div>
								<div>
									<select
										value={positionMultiRun}
										onChange={(event) => setPositionMultiRun(event.target.value)}>
										<option value="">Select position</option>
										{positionList.length > 0 && (
											positionList.map((pos, posIndex) => (
												<option key={posIndex} value={pos}>
													{pos}
												</option>
											))
										)}
									</select>
								</div>
							</div>	
							{/* <div className="voting-time">
								
								<div className="add-voting">
								
									<div className="add-voting-start">
										<div className="add-voting-start-input">
											<div><label>Start date:</label></div>
											<div>&nbsp;<input type="date" value={EditStartDate} onChange={(e)=> setEditStartDate(e.target.value)} disabled={true}/></div>
									
											<div><label>Start time:</label></div>
											<div>&nbsp;<input type="time" value={EditStartTime} onChange={(e)=> setEditStartTime(e.target.value)} disabled={true}/></div>
										</div>
									</div>
									<div className="add-voting-end">
										<div className="add-voting-end-input">
												<div><label>End date:</label></div>
												<div>&nbsp;<input type="date" value={EditEndDate} onChange={(e)=> setEditEndDate(e.target.value)} disabled={true}/></div>
										
												<div><label>End time:</label></div>
												<div>&nbsp;<input type="time" value={EditEndTime} onChange={(e)=> setEditEndTime(e.target.value)} disabled={true}/></div>
											</div>
										</div>

								</div>
							</div> */}
							<div className="voting-time-button">
								<button className="voting-time-button-add" onClick={handleUpdateMultiRunPosition}>Update</button>
								<button className="voting-time-button-stop" onClick={handleUpdateMultiRunPositionFalse}>Remove Multiple</button>
							</div>
						</div>
					</>
					}
					{isUploadImageOpen && 
					<>
						
						<div className="re-voting-time-con">
					
						<div className="upload-container">
						<h2 style={{marginLeft: '15px'}}>Upload images</h2>
							<form onSubmit={handleSubmit} className="upload-form">
								<input type="file" accept="image/*" multiple onChange={handleFileChangeUpload} className="file-input" />
								<button type="submit" className="upload-button">Upload</button>
							</form>
							</div>
							
						</div>
					</>
					}
					{isSignatoryOpen && 
					<>					
						<div className="signatory-voting-time-con">
							<div className="signatory-container-home">
								<h2 style={{ marginLeft: '15px' }}>Signatory</h2>
								<form onSubmit={handleSubmitSignatory} className="signatory-form">
									<div>
										<label htmlFor="name">Name:</label>
										<input
											type="text"
											id="name"
											value={signatoryName}
											onChange={(e)=>setSignatoryName(e.target.value)}
											required
											autoComplete="off"
										/>
									</div>
									<div>
										<label htmlFor="position">Position:</label>
										<select
											id="position"
											value={signatoryPosition}
											onChange={(e)=>setSignatoryPosition(e.target.value)}
											required
										>
											<option value="">Select Position</option>
											<option value="BOD CHAIRPERSON">BOD CHAIRPERSON</option>
											<option value="ELECTION COMMITTEE CHAIRPERSON">ELECTION COMMITTEE CHAIRPERSON</option>
										</select>
									</div>
							
									<button type="submit" className="signatory-button">
										Update
									</button>
        </form>
      </div>
							
						</div>
					</>
					}
				</div>
			</div>
		</div>

    );
};

export default Home;