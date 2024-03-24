import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import './App.css'

/**Context */
import { VotingContext } from "./Context/Voting";

/**Component */
import Verification from "./Components/Verification/Verification";
import Administrator from "./Components/Administrator/Administrator";
import Authentication from "./Components/Authentication/Authentication";
import Home from "./Components/Home/Home";
import Voting from "./Components/Voting/Voting";
import Dashboard from "./Components/Dashboard/Dashboard";
import WinningCandidates from "./Components/WinningCandidates/WinningCandidates";

function App() {
  const assignedURL = "https://kabisig-voting.azurewebsites.net:8000";
  // const assignedURL = 'https://erpvoting.azurewebsites.net';
  // const assignedURL = 'http://10.0.0.8:6061';
  // const assignedURL = 'http://192.168.93.150:6061';
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [usersName, setUsersName] = useState("");
  const [usersID, setUsersID] = useState("");
  const [voteRecords, setVoteRecords] = useState([]);
  const [membersInfo, setMembersInfo] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [VoteTransactions, setVoteTransactions] = useState([]);
  const [groupedCandidates, setGroupedCandidates] = useState([]);
  const [maxCandidatesPerPositionState, setMaxCandidatesPerPositionState] =
    useState([]);
  const [highestVoteCount, setHighestVoteCount] = useState([]);
  const [countDown, setCountDown] = useState("");
  const [otpCode, setOtpCode] = useState("");

  useEffect(() => {
    const isLoggedin = sessionStorage.getItem("isLoggedIn");
    const usersname = sessionStorage.getItem("usersName");
    const usersid = sessionStorage.getItem("usersID");
    setisLoggedIn(isLoggedin);
    setUsersName(usersname);
    setUsersID(usersid);
    fetchMembersInfo();
    fetchCandidates();
    fetchVoteRecords();
    fetchVotingTransactions();
  }, []);

  const fetchVoteRecords = async () => {
    try {
      const response = await fetch(`${assignedURL}/get_vote_records`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setVoteRecords(data);
        } else {
          console.log("No Records");
        }
      } else {
        console.error("Error:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const fetchMembersInfo = async () => {
    try {
      const response = await fetch(`${assignedURL}/get_members_info`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setMembersInfo(data);
        } else {
          console.log("No Records");
        }
      } else {
        console.error("Error:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${assignedURL}/get_candidates_info`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          console.log(data);
          setCandidates(data);
        } else {
          console.log("No Records");
        }
      } else {
        console.error("Error:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const fetchVotingTransactions = async () => {
    try {
      const response = await fetch(`${assignedURL}/get_voting_transactions`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          console.log("vote transactions", data);
          const openTransactions = data.filter(
            (rec) => rec.Voting_Status === "Open",
          );
          console.log("vote transactions", openTransactions);
          setVoteTransactions(openTransactions);
        } else {
          console.log("No Records");
        }
      } else {
        console.error("Error:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="App">
      <BrowserRouter>
        <VotingContext.Provider
          value={{
            assignedURL,
            isLoggedIn,
            setisLoggedIn,
            usersName,
            setUsersName,
            voteRecords,
            setVoteRecords,
            VoteTransactions,
            setVoteTransactions,
            membersInfo,
            setMembersInfo,
            candidates,
            setCandidates,
            usersID,
            setUsersID,
            countDown,
            setCountDown,
            otpCode,
            setOtpCode,
            groupedCandidates,
            setGroupedCandidates,
            maxCandidatesPerPositionState,
            setMaxCandidatesPerPositionState,
            highestVoteCount,
            setHighestVoteCount,
          }}
        >
          <div className="pages">
            <Routes>
              {/* <Route path='/' element={ isLoggedIn ? (<Navigate to='/home' /> ) : (<Navigate to='/login'/>)}/> */}
              <Route
                path="/"
                element={
                  isLoggedIn ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <Navigate to="/log-in" />
                  )
                }
              />
              <Route
                path="/"
                element={
                  isLoggedIn ? (
                    <Navigate to="/voting-system" />
                  ) : (
                    <Navigate to="/log-in" />
                  )
                }
              />
              <Route
                path="/"
                element={
                  isLoggedIn ? (
                    <Navigate to="/verification" />
                  ) : (
                    <Navigate to="/log-in" />
                  )
                }
              />
              <Route
                path="/"
                element={
                  isLoggedIn ? (
                    <Navigate to="/administrator" />
                  ) : (
                    <Navigate to="/log-in" />
                  )
                }
              />
              <Route
                path="/"
                element={
                  isLoggedIn ? (
                    <Navigate to="/voting-dashboard" />
                  ) : (
                    <Navigate to="/log-in" />
                  )
                }
              />
              <Route
                path="/"
                element={
                  isLoggedIn ? (
                    <Navigate to="/winning-dashboard" />
                  ) : (
                    <Navigate to="/log-in" />
                  )
                }
              />
              <Route path="/log-in" element={<Authentication />} />
              <Route path="/verification" element={<Verification />} />
              <Route path="/administrator" element={<Administrator />} />

              {isLoggedIn && (
                <>
                  <Route path="/admin-maintenance" element={<Home />} />
                  <Route path="/voting-system" element={<Voting />} />
                  <Route path="/voting-dashboard" element={<Dashboard />} />
                  <Route
                    path="/winning-dashboard"
                    element={<WinningCandidates />}
                  />
                  {/* <Route path='/register' element={<Registration />} /> */}
                </>
              )}
            </Routes>
          </div>
        </VotingContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
