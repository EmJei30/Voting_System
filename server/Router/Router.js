const express = require('express');
const router = express.Router();
const controller = require('../Controller/Controller');
const {
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
} = require('../Controller/Controller');

router.post('/upload_candidate_info', upload_candidate_info);

router.post('/upload_members_info', upload_members_info);

router.post('/upload_candidate_count', upload_candidate_count);

router.post('/create_new_voting_date', create_new_voting_date);


router.get('/get_members_info', get_members_info);

router.get('/get_candidates_info', get_candidates_info);

router.get('/get_candidates_max_count', get_candidates_max_count);

router.get('/get_vote_records', get_vote_records);

router.get('/get_voting_transactions', get_voting_transactions);



router.put('/update_vote', update_vote);

router.put('/update_member_status', update_member_status);

router.put('/close_vote_transaction', close_vote_transaction);

router.put('/edit_vote_transaction', edit_vote_transaction);
module.exports = router;
