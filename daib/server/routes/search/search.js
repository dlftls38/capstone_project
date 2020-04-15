var express = require('express');
var Account = require('../../schemas/models/account/account');
var Memo = require('../../schemas/models/memo/memo');
var Post = require('../../schemas/models/post/post');

var router = express.Router();

/*
    SEARCH USER: GET /api/search/memo/account/:username
*/
router.get('/memo/account/:username', (req, res) => {
    // SEARCH USERNAMES THAT STARTS WITH GIVEN KEYWORD USING REGEX
    var re = new RegExp('^' + req.params.username);
    Account.find({username: {$regex: re}}, {_id: false, username: true})
    .limit(5)
    .sort({username: 1})
    .exec((err, accounts) => {
        if(err){
            throw err;
        }
        console.log(accounts);
        res.json(accounts);
    });
});

// EMPTY SEARCH REQUEST: GET /api/search/memo/account
router.get('/memo/account', (req, res) => {
    res.json([]);
});




module.exports = router;
