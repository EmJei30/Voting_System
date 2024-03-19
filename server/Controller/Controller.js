const connection = require('../Database/connection');
const fs = require('fs');
const path = require('path');


// Function to save image file to server
const saveImage = (candidate) => {
    const imageName = path.basename(candidate.Image_file);
    const targetFolder = path.join(__dirname, '..', 'images');;

    // Check if the images folder exists, if not, create it
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
        console.log('Images folder created');
    }

    const imagePath = path.join(targetFolder, imageName);

    // Read the image file
    fs.readFile(candidate.Image_file, (err, data) => {
        if (err) {
            console.error(`Error reading image file for ${candidate.Candidate_Name}: ${err}`);
            return;
        }

        // Write the image file to the server
        fs.writeFile(imagePath, data, (err) => {
            if (err) {
                console.error(`Error saving image file for ${candidate.Candidate_Name}: ${err}`);
                return;
            }
            console.log(`Image file saved for ${candidate.Candidate_Name}: ${imagePath}`);
        });
    });
    const splitPath = splitImagePath(imagePath);
    candidate.Image_file = splitPath.filename;
}
/**Function to upload candidates with images */
const upload_candidate_info = async (req, res) => {
        const candidates = req.body;
        try {
            candidates.forEach(candidate => {
                saveImage(candidate);
                insertCandidate(candidate);
            });
            res.send('Images uploaded and saved successfully');
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
}

/**Function to upload members */
const upload_members_info = async (req, res) => {
    const database = 'members';
    const members = req.body;

    try {
        for (let member of members) {
            const checkExistenceQuery = `SELECT * FROM ${database} WHERE Member_Id = ?`;
            const existingRecords = await executeQuery(checkExistenceQuery, [member.Member_Id]);

            if (existingRecords.length > 0) {
                continue; // Member already exists, skip to the next one
            }

            const newRecord = {
                Member_Id: member.Member_Id,
                Member_Name: member.Member_Name,
                OTP_Code: member.OTP_Code,
                Created_At: new Date(),
                Updated_At: new Date()
            };
            const insertQuery = `INSERT INTO ${database} SET ?`;
            await executeQuery(insertQuery, newRecord);
        }

        res.status(200).send("Members information uploaded successfully.");
    } catch (error) {
        console.error("Error uploading members information:", error);
        res.status(500).send("Internal Server Error");
    }
};

/**Function to upload candidates max count*/
const upload_candidate_count = async (req, res) => {
    const database = 'maximum_candidates';
    const maxCandidates = req.body;

    try {
        for (let maxCandidate of maxCandidates) {
            const checkExistenceQuery = `SELECT * FROM ${database} WHERE Candidate_Position = ?`;
            const existingRecords = await executeQuery(checkExistenceQuery, [maxCandidate.Candidate_Position]);

            if (existingRecords.length > 0) {
                continue; // Member already exists, skip to the next one
            }

            const newRecord = {
                Candidate_Position: maxCandidate.Candidate_Position,
                Candidate_Count: maxCandidate.Candidate_Count,
                Created_At: new Date(),
                Updated_At: new Date()
            };
            const insertQuery = `INSERT INTO ${database} SET ?`;
            await executeQuery(insertQuery, newRecord);
        }

        res.status(200).send("Members information uploaded successfully.");
    } catch (error) {
        console.error("Error uploading members information:", error);
        res.status(500).send("Internal Server Error");
    }
};
const splitImagePath = (imagePath) => {
    const directory = path.dirname(imagePath); // Get the directory path
    const filename = path.basename(imagePath); // Get the filename with extension
    const extension = path.extname(imagePath); // Get the file extension

    return {
        directory: directory,
        filename: filename,
        extension: extension
    };
}

// Function to insert new candidate record
 const insertCandidate = async(candidate) => {
    const database = 'candidates';
    const cName = candidate.Candidate_Name;
    const cPosition = candidate.Candidate_Position;

    const checkExistenceQuery = `SELECT * FROM ${database} WHERE Candidate_Name = ? AND  Candidate_Position = ?`;
    const existingRecords = await executeQuery(checkExistenceQuery, [cName, cPosition]);

    if (existingRecords.length > 0) {
        return; // Candidate already exists, do nothing
    }

    const newRecord = {
        Candidate_Name: candidate.Candidate_Name,
        Candidate_Position: candidate.Candidate_Position,
        Image_File: candidate.Image_file,
        Vote_Count: 0,
        Created_At: new Date(),
        Updated_At: new Date()
    };
    const insertQuery = `INSERT INTO ${database} SET ?`;
    await executeQuery(insertQuery, newRecord);
}

// Function to execute SQL queries
function executeQuery(query, values) {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

/**Get Members Info */
const get_members_info = async(req, res) => {
    console.log('get members info')
      const database = 'members';
      try {
          const query = `SELECT * FROM ${database}`;
          const results = await executeQuery(query);
          res.json(results);
      } catch (error) {
          console.error('Error:', error);
          res.status(500).send('An error occurred while retrieving the products.');
      }
};

/**Get Candidates Info */
const get_candidates_info = async(req, res) => {
    console.log('get members info')
      const database = 'candidates';
      try {
          const query = `SELECT * FROM ${database}`;
          const results = await executeQuery(query);
          res.json(results);
      } catch (error) {
          console.error('Error:', error);
          res.status(500).send('An error occurred while retrieving the products.');
      }
};

/**Get Candidates max count */
const get_candidates_max_count = async(req, res) => {
      const database = 'maximum_candidates';
      try {
          const query = `SELECT * FROM ${database}`;
          const results = await executeQuery(query);
          res.json(results);
      } catch (error) {
          console.error('Error:', error);
          res.status(500).send('An error occurred while retrieving the products.');
      }
};

/**Get vote records */
const get_vote_records = async(req, res) => {
    const database = 'vote_records';
    try {
        const query = `SELECT * FROM ${database}`;
        const results = await executeQuery(query);
        res.json(results);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while retrieving the products.');
    }
};

/**Get vote transactions */
const get_voting_transactions = async(req, res) => {
    const database = 'voting_transaction';
    try {
        const query = `SELECT * FROM ${database} WHERE Voting_Status = 'Open'`;
        const results = await executeQuery(query);
        res.json(results);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while retrieving the products.');
    }
};


/**Get vote records */
const get_members_records = async(req, res) => {
    const database = 'vote_records';
    try {
        const query = `SELECT * FROM ${database}`;
        const results = await executeQuery(query);
        res.json(results);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while retrieving the products.');
    }
};
/**Update Vote */
// const update_vote = (req, res) => {
// 	// const io = require('../server').io;
// 	console.log('update time keeping')
// 	console.log(req.body)
// 	const updates = req.body;
// 	const database = 'candidates';
// 	if (!updates || !updates.length) {
// 		return res.status(400).json({ error: 'Invalid updates' });
// 	}
// 	const query = `UPDATE ${database} SET ? WHERE id = ?`;
// 	updates.forEach(update => {
// 		const { id, ...updateFields } = update;

// 		connection.query(query, [updateFields, id], (err, result) => {
// 			if (err) {
// 				console.error('Error updating record:', err);
// 			} else {
// 				console.log('Record updated successfully:', result);
// 				// Emit a Socket.io event to inform other users about the update
// 				// io.emit('recordUpdated', { id, updateFields });
// 			}
// 		});
// 	});

// 	return res.status(200).json({ message: 'Records updated successfully' });
// }
// const update_vote = async(req, res) => {
//     const io = require('../server').io;
//     console.log('update time keeping');
//     console.log(req.body);
//     const updates = req.body;
//     const database = 'candidates';
   
//     if (!updates || !updates.length) {
//         return res.status(400).json({ error: 'Invalid updates' });
//     }
//     const query = `UPDATE ${database} SET ? WHERE id = ?`;
//     updates.forEach(update => {
//         const { id, ...updateFields } = update;
//         // const results = await executeQuery(`SELECT * FROM ${database} where id = ${id}`);
//         // Format datetime strings
//         if (updateFields.Created_At) {
//             updateFields.Created_At = new Date(updateFields.Created_At).toISOString().slice(0, 19).replace('T', ' ');
//         }
//         if (updateFields.Updated_At) {
//             updateFields.Updated_At = new Date(updateFields.Updated_At).toISOString().slice(0, 19).replace('T', ' ');
//         }

//         connection.query(query, [updateFields, id], (err, result) => {
//             if (err) {
//                 console.error('Error updating record:', err);
//             } else {
//                 console.log('Record updated successfully:', result);
//                 // Fetch the updated record from the database
//                 const selectQuery = `SELECT * FROM ${database} WHERE id = ?`;
//                 connection.query(selectQuery, [id], (selectErr, selectResult) => {
//                     if (selectErr) {
//                         console.error('Error fetching updated record:', selectErr);
//                     } else {
//                         // Emit a Socket.io event to inform other users about the update
//                         io.emit('UpdatedVoteCount', selectResult[0]); // Assuming there's only one updated record
//                     }
//                 });
//             }
//         });
//     });

//     return res.status(200).json({ message: 'Records updated successfully' });
// };

const update_vote = async (req, res) => {
    const io = require('../server').io;
    
    console.log('asdasda',req.body);
    const updates = req.body;
    const uniqueID = [...new Set(updates.map(item => item.Voters_Id).filter(item => item !== null))];
    const database = 'candidates';
    const database2 = 'vote_records';
    const memberDatabase = 'members';
    const database3 = 'maximum_candidates';
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
 
    const VotersID = uniqueID[0];
    const VotersDuration = updates[0].Voting_Duration;
    console.log('VotersID',VotersID);
    console.log('duration', updates[0].Voting_Duration);
    if (!updates || !updates.length) {
        return res.status(400).json({ error: 'Invalid updates' });
    }

    try {
        const insertedRecords = [];

        for (const update of updates) {
            const { id } = update;
            const selectQuery = `SELECT * FROM ${database} WHERE id = ?`;

            // Fetch the current record from the database
            const [candidate] = await new Promise((resolve, reject) => {
                connection.query(selectQuery, [id], (selectErr, result) => {
                    if (selectErr) {
                        console.error(`Error fetching candidate with ID ${id}:`, selectErr);
                        reject(selectErr);
                    } else if (!result.length) {
                        console.error(`Candidate with ID ${id} not found`);
                        reject(new Error(`Candidate with ID ${id} not found`));
                    } else {
                        resolve(result);
                    }
                });
            });

            const currentVoteCount = candidate.Vote_Count || 0;
            const newVoteCount = currentVoteCount + 1;

            const query = `UPDATE ${database} SET Vote_Count = ? WHERE id = ?`;

            // Update vote count for the candidate
            await new Promise((resolve, reject) => {
                connection.query(query, [newVoteCount, id], async (updateErr, _result) => {
                    if (updateErr) {
                        console.error(`Error updating vote count for candidate ${id}:`, updateErr);
                        reject(updateErr);
                    } else {
                        // console.log(`Vote count for candidate ${id} updated successfully`);

                        const { Voters_Id, Voters_Name, Candidate_Name, Candidate_Position } = update;
                        console.log(update)
                        const Vcount = 1;
                        // Insert the updated record into database2
                        const insertQuery = `INSERT INTO ${database2} (Voters_Id, Voters_Name, Candidate_Name, Candidate_Position,  Vote_Count, Created_At, Updated_At) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`;

                        connection.query(insertQuery, [Voters_Id, Voters_Name, Candidate_Name, Candidate_Position, Vcount], (insertErr, _result) => {
                            if (insertErr) {
                                console.error(`Error inserting record into ${database2} for candidate ${id}:`, insertErr);
                                reject(insertErr);
                            } else {
                                console.log(`Record inserted into ${database2} for candidate ${id}`);
                                insertedRecords.push({ id, Vote_Count: newVoteCount });
                                resolve();
                            }
                        });
                    }
                });
            });
        }
        const queryUpdateMember = `UPDATE ${memberDatabase} SET Voting_Status = ?, Voting_Duration = ? WHERE Member_Id = ?`;

        // Update vote count for the candidate
        new Promise((resolve, reject) => {
            connection.query(queryUpdateMember, ['Done', VotersDuration, VotersID], async (updateErr, _result) => {
                if (updateErr) {
                    console.error(`Error updating voting status for member ${VotersID}:`, updateErr);
                    reject(updateErr);
                } else {
                    // Fetch the updated record from the member database
                    const selectUpdatedMemberQuery = `SELECT * FROM ${memberDatabase} WHERE Member_Id = ?`;
                    connection.query(selectUpdatedMemberQuery, [VotersID], (selectUpdatedMemberErr, updatedMemberResult) => {
                        if (selectUpdatedMemberErr) {
                            console.error(`Error fetching updated record for member ${VotersID}:`, selectUpdatedMemberErr);
                            reject(selectUpdatedMemberErr);
                        } else {
                            // Emit the updated record to the client
                            io.emit('UpdatedMemberRecord', updatedMemberResult[0]);
                            console.log('updatedMemberResult', updatedMemberResult)
                            // Emit the inserted records to the client
                            io.emit('InsertedVoteRecords', insertedRecords);
                            resolve();
                        }
                    });
                }
            });
        }).catch(error => {
            // Handle any errors
            console.error('Error occurred:', error);
        });

     
        // Fetch all records from the database after updates
const selectAllQuery = `SELECT * FROM ${database} WHERE updated_at >= ?`;

// Fetch all records from the database
const [newRecord] = await Promise.all([
    new Promise((resolve, reject) => {
        connection.query(selectAllQuery, [currentTime], (err, result) => {
            if (err) {
                console.error('Error fetching updated records:', err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
]);

// Emit a Socket.io event to inform other users about the updates with all records
io.emit('UpdatedVoteCount',  {newRecord}     );

        // Emit a Socket.io event to inform other users about the update with all records
        // io.emit('UpdatedVoteCount', records);
        return res.status(200).json({ message: 'Records updated successfully', data: newRecord });
    } catch (error) {
        console.error('Error updating vote count:', error);
        return res.status(500).json({ error: 'Error updating vote count' });
    }
};


const update_member_status = async (req, res) => {
    const io = require('../server').io;

    console.log(req.body);
    const updates = req.body;
    const memberDatabase = 'members';
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const {memberID, memberStatus} = updates;

    // if (!updates || !updates.length) {
    //     console.log('error')
    //     return res.status(400).json({ error: 'Invalid updates' });
    // }

    try {
        const query = `UPDATE ${memberDatabase} SET Voting_Status = ? WHERE Member_Id = ?`;

        // Update vote count for the candidate
        await new Promise((resolve, reject) => {
            connection.query(query, [memberStatus, memberID], async (updateErr, _result) => {
                if (updateErr) {
                    console.error(`Error updating vote count for candidate ${memberID}:`, updateErr);
                    reject(updateErr);
                } else {
                    // console.log(`Vote count for candidate ${id} updated successfully`)
                    // Fetch the updated record from the member database
                    const selectUpdatedMemberQuery = `SELECT * FROM ${memberDatabase} WHERE Member_Id = ?`;
                    connection.query(selectUpdatedMemberQuery, [memberID], (selectUpdatedMemberErr, updatedMemberResult) => {
                        if (selectUpdatedMemberErr) {
                            console.error(`Error fetching updated record for member ${memberID}:`, selectUpdatedMemberErr);
                            reject(selectUpdatedMemberErr);
                        } else {
                            // Emit the updated record to the client
                            io.emit('UpdatedMemberRecord', updatedMemberResult[0]);
                            resolve();
                        }
                    });
                }
            });
        });


        // Emit a Socket.io event to inform other users about the update with all records
        // io.emit('UpdatedVoteCount', records);
        return res.status(200).json({ message: 'Records updated successfully'});
    } catch (error) {
        console.error('Error updating vote count:', error);
        return res.status(500).json({ error: 'Error updating vote count' });
    }
};

/**Function to start vote */
const create_new_voting_date = async (req, res) => {
    const io = require('../server').io;

    const database = 'voting_transaction';
    console.log('asdasdas', req.body)
    const {
        StartDate,
        StartTime,
        EndDate,
        EndTime
      } = req.body;
    try {
        const checkExistenceQueryOpen = `SELECT * FROM ${database} WHERE Voting_Status = ?`;
        const checkExistenceQuery = `SELECT * FROM ${database} WHERE Voting_Start_Date = ? AND Voting_Status = ?`;
       
        const existingRecordsOpen = await executeQuery(checkExistenceQueryOpen, 'Open');
        const existingRecords = await executeQuery(checkExistenceQuery, [StartDate, 'Open']);

        if (existingRecordsOpen.length > 0) {
            console.log('Date already exists');
            return res.status(400).send("Error submitting, Please close the current Voting process before creating new transaction..."); // Sending error message to frontend
        }
        if (existingRecords.length > 0) {
            console.log('Date already exists');
            return res.status(400).send("Voting date already exists and open."); // Sending error message to frontend
        }

        const newRecord = {
            Voting_Start_Date: StartDate,
            Voting_Start_Time: StartTime,
            Voting_End_Date: EndDate,
            Voting_End_Time: EndTime,
            Voting_Status: 'Open',
            Created_At: new Date(),
            Updated_At: new Date()
        };

        const insertQuery = `INSERT INTO ${database} SET ?`;
        await executeQuery(insertQuery, newRecord);
        
           
           // Query the database again to retrieve the newly inserted record
           const insertedRecord = await executeQuery('SELECT * FROM voting_transaction WHERE id = LAST_INSERT_ID()');
           io.emit('OpenVotingTransactions', insertedRecord);
        res.status(200).send("Voting information uploaded successfully.");
    } catch (error) {
        console.error("Error uploading voting information:", error);
        res.status(500).send("Internal Server Error");
    }
};
/**funtion to update vote */
const close_vote_transaction = async (req, res) => {
    const io = require('../server').io;

    const votes = req.body.VoteTransactions[0];
    const voteDatabase = 'voting_transaction';
    const voteId = votes.id;
    console.log(votes)
    try {
        const query = `UPDATE ${voteDatabase} SET Voting_Status = ? WHERE id = ?`;

        // Update vote count for the candidate
        await new Promise((resolve, reject) => {
            connection.query(query, ['Closed', voteId], async (updateErr, _result) => {
                if (updateErr) {
                    console.error(`Error updating vote transation  ${voteId}:`, updateErr);
                    reject(updateErr);
                } else {
                    // // console.log(`Vote count for candidate ${id} updated successfully`)
                    // // Fetch the updated record from the member database
                    // const selectUpdatedMemberQuery = `SELECT * FROM ${voteDatabase} WHERE id = ?`;
                    // connection.query(selectUpdatedMemberQuery, [voteId], (selectUpdatedMemberErr, updatedMemberResult) => {
                    //     if (selectUpdatedMemberErr) {
                    //         console.error(`Error fetching updated voting transactions ${voteId}:`, selectUpdatedMemberErr);
                    //         reject(selectUpdatedMemberErr);
                    //     } else {
                    //         // Emit the updated record to the client
                            io.emit('CloseVotingTransactions',{message: 'no transaction'});
                            resolve();
                        // }
                    // });
                }
            });
        });


        // Emit a Socket.io event to inform other users about the update with all records
        // io.emit('UpdatedVoteCount', records);
        return res.status(200).json({ message: 'Records updated successfully'});
    } catch (error) {
        console.error('Error updating vote count:', error);
        return res.status(500).json({ error: 'Error updating vote count' });
    }
}
const edit_vote_transaction = async (req, res) => {
    const io = require('../server').io;

    const votes = req.body.VoteTransactions;
    const voteDatabase = 'voting_transaction';
    const voteId = votes.id;
    console.log(req.body)
    const  { Voting_End_Date,
    Voting_End_Time,
    Voting_Start_Date,
    Voting_Start_Time,
    Voting_Status,
    id} = votes
    newRecord = {
        Voting_End_Date: Voting_End_Date,
        Voting_End_Time: Voting_End_Time,
        Voting_Start_Date: Voting_Start_Date,
        Voting_Start_Time: Voting_Start_Time,
        Voting_Status: Voting_Status,
        Updated_At: new Date()
    }
    console.log(Voting_Status)
    try {
        const query = `UPDATE ${voteDatabase} SET ? WHERE id = ?`;

        // Update vote count for the candidate
        await new Promise((resolve, reject) => {
            connection.query(query, [newRecord, id], async (updateErr, _result) => {
                if (updateErr) {
                    console.error(`Error updating vote transation  ${id}:`, updateErr);
                    reject(updateErr);
                } else {
                    // console.log(`Vote count for candidate ${id} updated successfully`)
                    // Fetch the updated record from the member database
                    const selectUpdatedMemberQuery = `SELECT * FROM ${voteDatabase} WHERE id = ?`;
                    connection.query(selectUpdatedMemberQuery, [id], (selectUpdatedMemberErr, updatedMemberResult) => {
                        if (selectUpdatedMemberErr) {
                            console.error(`Error fetching updated voting transactions ${id}:`, selectUpdatedMemberErr);
                            reject(selectUpdatedMemberErr);
                        } else {
                            // Emit the updated record to the client
                            io.emit('OpenVotingTransactions',updatedMemberResult);
                            resolve();
                        }
                    });
                }
            });
        });


        // Emit a Socket.io event to inform other users about the update with all records
        // io.emit('UpdatedVoteCount', records);
        return res.status(200).json({ message: 'Records updated successfully'});
    } catch (error) {
        console.error('Error updating vote count:', error);
        return res.status(500).json({ error: 'Error updating vote count' });
    }
}
module.exports = {
    saveImage,
    insertCandidate,
    upload_candidate_info,
    upload_members_info,
    upload_candidate_count,

    get_members_info,
    get_candidates_info,
    get_candidates_max_count,

    update_vote,
    get_vote_records,
    update_member_status,

  /**Create new voting date */
    create_new_voting_date,
    get_voting_transactions,
    close_vote_transaction,
    edit_vote_transaction
};
