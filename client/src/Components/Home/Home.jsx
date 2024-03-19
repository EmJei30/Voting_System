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
import { FaQuestion } from "react-icons/fa6";

const Home = () => {
    const { assignedURL, isLoggedIn, setisLoggedIn, usersName, setUsersName, setCandidates, candidates, groupedCandidates, membersInfo, VoteTransactions, setVoteTransactions,
			setGroupedCandidates, maxCandidatesPerPositionState, setMaxCandidatesPerPositionState, highestVoteCount, setHighestVoteCount } = useContext(VotingContext);
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
	// const [groupedCandidates, setGroupedCandidates] = useState([]);
	// const [maxCandidatesPerPositionState, setMaxCandidatesPerPositionState] =  useState([]);
	// const [highestVoteCount, setHighestVoteCount]= useState([]);
	/**Vote date and time creation */
		/**create vote transaction */
	const [StartDate, setStartDate] = useState('');
	const [StartTime, setStartTime] = useState('');
	const [EndDate, setEndDate] = useState('');
	const [EndTime, setEndTime] = useState('');

	/**Update vote transaction */
	const [EditStartDate, setEditStartDate] = useState('');
	const [EditStartTime, setEditStartTime] = useState('');
	const [EditEndDate, setEditEndDate] = useState('');
	const [EditEndTime, setEditEndTime] = useState('');
	const [notificationMSG, setNotificationMSG] = useState('');

	const [fileUploaded, setFileUploaded] = useState('');
    const nav = useNavigate();

	useEffect(()=>{
		fetchVotingTransactions();
		fetchCandidates();
		fetchCandidatesMaxCount();
		if(VoteTransactions.length > 0){
			const dateStart = new Date(VoteTransactions[0].Voting_Start_Date).toLocaleDateString();
			const sd = convertDateFormat(dateStart)
			setEditStartDate(sd);

			const dateEnd = new Date(VoteTransactions[0].Voting_End_Date).toLocaleDateString();
			const ed = convertDateFormat(dateEnd)
			setEditEndDate(ed);


			const timeStart = VoteTransactions[0].Voting_Start_Time;
			const st = convertTo12HourFormat(timeStart)
			setEditStartTime(timeStart);

			console.log('timeStart',timeStart, st)
			const timeEnd = VoteTransactions[0].Voting_End_Time;
			const et = convertTo12HourFormat(timeEnd)
			setEditEndTime(timeEnd);	
		}
	},[])
	useEffect(()=>{
		if(VoteTransactions.length > 0){
			const dateStart = new Date(VoteTransactions[0].Voting_Start_Date).toLocaleDateString();
			const sd = convertDateFormat(dateStart)
			setEditStartDate(sd);

			const dateEnd = new Date(VoteTransactions[0].Voting_End_Date).toLocaleDateString();
			const ed = convertDateFormat(dateEnd)
			setEditEndDate(ed);


			const timeStart = VoteTransactions[0].Voting_Start_Time;
			const st = convertTo12HourFormat(timeStart)
			setEditStartTime(timeStart);

			console.log('timeStart',timeStart, st)
			const timeEnd = VoteTransactions[0].Voting_End_Time;
			const et = convertTo12HourFormat(timeEnd)
			setEditEndTime(timeEnd);	
		}
	},[VoteTransactions])
    const handleTabClick = (tabIndex) => {
        setActiveTab(tabIndex);
    };

    useEffect(()=>{

        const socket = io(`${assignedURL}`);
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
			console.log('CloseVotingTransactions', newRecord)
            setVoteTransactions([])
			setEditEndDate('');
			setEditEndTime('');
			setEditStartDate('');
			setEditStartTime('');
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
                
                    console.log('data', data);
                    const list = CandidatesList(newRecordWithTotalVotes);
                    console.log('grouped', list);
                    setGroupedCandidates(list);
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
                    console.log('candidatesWithMaxVotePerPosition2',maxCandidatePerPositionState)
                    console.log('candidatesWithMaxVotePerPosition2',candidatesWithMaxVotePerPosition)
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
                    console.log('candidatesInTopRanking',candidatesInTopRanking);
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

					const dateStart = new Date(data[0].Voting_Start_Date).toLocaleDateString();
					const sd = convertDateFormat(dateStart)
					setEditStartDate(sd);
		
					const dateEnd = new Date(data[0].Voting_End_Date).toLocaleDateString();
					const ed = convertDateFormat(dateEnd)
					setEditEndDate(ed);
		
		
					const timeStart = data[0].Voting_Start_Time;
					const st = convertTo12HourFormat(timeStart)
					setEditStartTime(timeStart);
		
					console.log('timeStart',timeStart, st)
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
		// console.log('extension', fn);
		if (file) {
			if (fn === 'csv') {
				reader.readAsText(file);
			} else if (fn === 'xlsx' || fn === 'xls') {
				reader.readAsArrayBuffer(file)
			}

		}
	};

	const parseFile = (filename, fileContents) => {
		// console.log('Parsing file:', filename);

		const extension = filename.split('.').pop().toLowerCase();

		if (extension === 'csv') {
			// console.log('Parsing CSV file');
			parseCSV(fileContents);
		} else if (extension === 'xlsx' || extension === 'xls') {
			// console.log('Parsing XLSX file');
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
				console.log('CSV parsing complete', results.data);
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
			// console.log('Parsed JSON data:', jsonData);
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
	
			// console.log('transformedData:', transformedData);
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
        // console.log('parsedData', parsedData)
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
                    console.log('success parsedData', parsedData)
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
        console.log('Members', parsedData)
		const existingOTPCodes = new Set(); // Set to store existing OTP codes

			// Generate OTP codes for each member
			const updatedData = parsedData.map(member => {
			const otp = generateOTP(existingOTPCodes);
			existingOTPCodes.add(otp); // Add generated OTP code to the set
			return { ...member, OTP_Code: otp };
			});
		  console.log('Members', updatedData)
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
                    console.log('success parsedData', updatedData)
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
		// console.log('parsedData', parsedData)
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
				console.log('success parsedData', parsedData)
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
	/**Set Voting  date*/
	const handleSubmitVoteDate = async() =>{
		if(StartDate === '' || StartTime === '' || EndDate === '' || EndTime === ''){
			alert('Please complete Start or End Date and Time...');
			return
		}
		const	newVoteTransaction = {
				StartDate: StartDate,
				StartTime: StartTime,
				EndDate: EndDate,
				EndTime: EndTime
			}
			console.log('newVote',newVoteTransaction)
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
		
	}
	/**update voting */
	const handleVotingUpdate = () =>{
		setIsVotingDateUpdate(true);
		setIsVotingDateOpen(false);
	}
	/**Update Member  */
	const handleUpdateMember = () =>{
		setIsUpdateMember(true);
	}

	/**Function to generate invitation */
	const handleGeneratePDF = () =>{
		if(membersInfo.length > 0 && VoteTransactions.length > 0){
			const formattedStartDate = new Date(VoteTransactions[0].Voting_Start_Date).toLocaleDateString();
			const formattedEndDate = new Date(VoteTransactions[0].Voting_End_Date).toLocaleDateString();

			const formattedStartTime = convertTo12HourFormat(VoteTransactions[0].Voting_Start_Time);
			const formattedEndTime = convertTo12HourFormat(VoteTransactions[0].Voting_End_Time);

			console.log('asdadasdas' , membersInfo, VoteTransactions, formattedStartTime, formattedEndTime, formattedStartDate, formattedEndDate)
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
sample url http://localhost:6060/


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
	/**Function handling generate Excel for members information */
	const handleGenerateExcel = () => {

		if (membersInfo.length <= 0 && VoteTransactions.length <= 0) {
			Alert(`No member's info found...`);
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
		console.log('data', data);
		const csvContent = 'data:text/csv;charset=utf-8,' + '\uFEFF' + data.map(row => {
			// const employeeHeader = (row.Header.includes(',') || row.Employee_Name.includes(',')) ? `"${row.Header}"` : row.Header;

			const rowValuesH = Object.keys(row)
			  .map(key => (key === 'Header' || key === 'Member_Id' ? `"${row[key]}"` : row[key]))
			  .join(',');
			  console.log('rowValuesH', rowValuesH)
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
			{/* <div className="home-background-template"><div className="home-background-template-inner"></div></div> */}
			<div className="sidebar">
				{/* <button class="toggle-btn" onClick={toggleSidebar}>Toggle Sidebar</button> */}
				<div className="sidebar-logo">
					<img src={exampleImage} alt="Example" className="home-logo" />
				</div>
				<div className="sidebar-navigations">
					<div className="sidebar-line">&nbsp;</div>
					<button onClick={handleNavigateToDashboard}>Dashboard</button>
					<button onClick={handleNavigateToDashboardWinning}>Winning Candidates</button>

					<div className="toggle-icon-con" onClick={() => setIstoggleUpload(!istoggleUploads)}><button >Upload Candidates</button><span>{!istoggleUploads &&<ExpandMoreRoundedIcon/>} {istoggleUploads && <ExpandLessRoundedIcon/>}</span></div>
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
						</div>
					</>}

					<div className="toggle-icon-con" onClick={() => setIsMemberOpen(!isMemberOpen)}><button >Member Setup</button><span>{!isMemberOpen &&<ExpandMoreRoundedIcon/>} {isMemberOpen && <ExpandLessRoundedIcon/>}</span></div>
					{isMemberOpen && 
					<>
						<div className="upload-sub-menus">
							<button  onClick={handleUpdateMember}>Update Member</button>
						</div>
					</>}

					<div className="toggle-icon-con" onClick={() => setIsGenerateReport(!isGenerateReport)}><button >Generate Reports</button><span>{!isGenerateReport &&<ExpandMoreRoundedIcon/>} {isGenerateReport && <ExpandLessRoundedIcon/>}</span></div>	
					{isGenerateReport && 
					<>
						<div className="upload-sub-menus">
							<button  onClick={handleGeneratePDF}>Generate Invitation</button>
							<button  onClick={handleGenerateExcel}>Generate OTP Records</button>
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
						{/* <span>Create Vote Transaction</span> */}
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
							{/* <div className="voting-time">
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
							</div> */}
							<div className="update-member-time-con">

							</div>
							<div className="voting-time-button">
								<button className="voting-time-button-add" onClick={handleUpdateVoteDate}>Update</button>
								<button className="voting-time-button-stop" onClick={handleStopVoteDate}>Force Close</button>
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