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


// POST DATA TOTAL SIZE REQUEST: GET /api/search/post/size
router.get('/post/size', (req, res) => {
    let keyword = req.query.keyword;
    let keywordType = req.query.keywordType;
    let page = req.query.page;
    let showLength = req.query.showLength;
    let dateStart = req.query.dateStart;
    let dateEnd = req.query.dateEnd;
    let searchAllPeriod = req.query.searchAllPeriod;
    page = Number(page);
    showLength = Number(showLength);
    searchAllPeriod = (searchAllPeriod==='true');
    dateStart = searchAllPeriod ? new Date(1900, 1, 1) : dateStart;
    dateEnd = searchAllPeriod ? new Date(2100, 1, 1) : dateEnd;
    keyword = keyword===undefined ? '' : keyword
    Post.find({[keywordType]: {$regex: keyword}, "date.created":{"$gte": dateStart, "$lt": dateEnd}})
    .exec((err, posts) => {
        if(err) throw err;
        return res.json(posts);
    });
});


module.exports = router;
