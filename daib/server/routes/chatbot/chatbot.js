var express = require('express');
var Chatbot = require('../../schemas/models/chatbot/chatbot');
var mongoose = require('mongoose');

const router = express.Router();

/*
    WRITE CHATBOT: POST /api/chatbot/register
    BODY SAMPLE: { number: 1, userid: "sample" chatbotid: "sample", entity: "sample", intent: "sample", sentence: "sample"}
    ERROR CODES
        1: NOT LOGGED IN
		2: EMPTY ChatbotID
		3: EMPTY Entity
		4: EMPTY Intent
		5: EMPTY Sentence
		6: Something Broke
*/
router.post('/register', (req, res) => {
    // CHECK LOGIN STATUS
    if(typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 1
        });
    }
    // CHECK NUMBER VALID
    if(typeof req.body.chatbotid !== 'string') {
        return res.status(400).json({
            error: "EMPTY CHATBOTID",
            code: 2
        });
    }
    if(req.body.chatbotid === "") {
        return res.status(400).json({
            error: "EMPTY CHATBOTID",
            code: 2
        });
    }
    // CHECK ENTITY VALID
    if(typeof req.body.entity !== 'string') {
        return res.status(400).json({
            error: "EMPTY ENTITY",
            code: 3
        });
    }
    if(req.body.entity === "") {
        return res.status(400).json({
            error: "EMPTY ENTITY",
            code: 3
        });
    }
	// CHECK INTENT VALID
    if(typeof req.body.intent !== 'string') {
        return res.status(400).json({
            error: "EMPTY INTENT",
            code: 4
        });
    }
    if(req.body.intent === "") {
        return res.status(400).json({
            error: "EMPTY INTENT",
            code: 4
        });
    }
	// CHECK SENTENCE VALID
    if(typeof req.body.sentence !== 'string') {
        return res.status(400).json({
            error: "EMPTY SENTENCE",
            code: 5
        });
    }
    if(req.body.sentence === "") {
        return res.status(400).json({
            error: "EMPTY SENTENCE",
            code: 5
        });
    }
    // CREATE NEW CHATBOT
    let chatbot = new Chatbot({
		number: req.body.number,
        userid: req.session.loginInfo.username,
        chatbotid: req.body.chatbotid,
		entity: req.body.entity,
		intent: req.body.intent,
        sentence: req.body.sentence
    });
    // SAVE IN DATABASE
    chatbot.save( err => {
        if(err) throw err;
        return res.json({ success: true });
    });
});

/*
    MODIFY CHATBOT: PUT /api/chatbot/:id
    BODY SAMPLE: { number: 1, userid: "sample" chatbotid: "sample", entity: "sample", intent: "sample", sentence: "sample"}
    ERROR CODES
        1: INVALID ID,
	    2: EMPTY ChatbotID
	    3: EMPTY Entity
	    4: EMPTY Intent
	    5: EMPTY Sentence
	    6: NOT LOGGED IN
	    7: NO RESOURCE
	    8: PERMISSION FAILURE
*/
router.put('/:id', (req, res) => {

    // CHECK POST ID VALIDITY
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            error: "INVALID ID",
            code: 1
        });
    }

    // CHECK NUMBER VALID
    if(typeof req.body.chatbotid !== 'string') {
        return res.status(400).json({
            error: "EMPTY CHATBOTID",
            code: 2
        });
    }

    if(req.body.chatbotid === "") {
        return res.status(400).json({
            error: "EMPTY CHATBOTID",
            code: 2
        });
    }

    // CHECK ENTITY VALID
    if(typeof req.body.entity !== 'string') {
        return res.status(400).json({
            error: "EMPTY ENTITY",
            code: 3
        });
    }

    if(req.body.entity === "") {
        return res.status(400).json({
            error: "EMPTY ENTITY",
            code: 3
        });
    }
	
	// CHECK INTENT VALID
    if(typeof req.body.intent !== 'string') {
        return res.status(400).json({
            error: "EMPTY INTENT",
            code: 4
        });
    }

    if(req.body.intent === "") {
        return res.status(400).json({
            error: "EMPTY INTENT",
            code: 4
        });
    }
	
	// CHECK SENTENCE VALID
    if(typeof req.body.sentence !== 'string') {
        return res.status(400).json({
            error: "EMPTY SENTENCE",
            code: 5
        });
    }

    if(req.body.sentence === "") {
        return res.status(400).json({
            error: "EMPTY SENTENCE",
            code: 5
        });
    }

    // FIND CHATBOT
    Chatbot.findById(req.params.id, (err, chatbot) => {
        if(err) throw err;

        // IF CHATBOT DOES NOT EXIST
        if(!chatbot) {
            return res.status(404).json({
                error: "NO RESOURCE",
                code: 6
            });
        }

        // IF EXISTS, CHECK WRITER
        if(chatbot.userid != req.session.loginInfo.username) {
            return res.status(403).json({
                error: "PERMISSION FAILURE",
                code: 7
            });
        }

        // MODIFY AND SAVE IN DATABASE
        chatbot.chatbotid = req.body.chatbotid;
        chatbot.entity = req.body.entity;
		chatbot.intent = req.body.intent;
		chatbot.sentence = req.body.sentence;
        chatbot.date.edited = new Date();

        chatbot.save((err, chatbot) => {
            if(err) throw err;
            return res.json({
                success: true,
                chatbot
            });
        });

    });
});

/*
    DELETE CHATBOT: DELETE /api/chatbot/:id
    ERROR CODES
        1: INVALID ID
        2: NOT LOGGED IN
        3: NO RESOURCE
        4: PERMISSION FAILURE
*/
router.delete('/:id', (req, res) => {

    // CHECK CHATBOT ID VALIDITY
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            error: "INVALID ID",
            code: 1
        });
    }

    // CHECK LOGIN STATUS
    if(typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 2
        });
    }

    // FIND CHATBOT AND CHECK FOR WRITER
    Chatbot.findById(req.params.id, (err, chatbot) => {
        if(err) throw err;

        if(!chatbot) {
            return res.status(404).json({
                error: "NO RESOURCE",
                code: 3
            });
        }
        if(chatbot.userid != req.session.loginInfo.username) {
            return res.status(403).json({
                error: "PERMISSION FAILURE",
                code: 4
            });
        }

        // REMOVE THE CHATBOT
        Chatbot.remove({ _id: req.params.id }, err => {
            if(err) throw err;
            res.json({ success: true });
        });
    });

});

/*
    READ CHATBOT: GET /api/chatbot/list
*/
router.get('/list', (req, res) => {
	let userid = req.query.userid;
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
    Chatbot.find({[keywordType]: {$regex: keyword}, "date.created": {"$gte": dateStart, "$lt": dateEnd}, "userid": userid})
    .sort({"_id": -1})
    .skip((page-1) * showLength)
    .limit(showLength)
    .exec((err, chatbots) => {
        if(err) throw err;
        return res.json(chatbots);
    });
});


// CHATBOT DATA TOTAL SIZE REQUEST: GET /api/chatbot/size
router.get('/size', (req, res) => {
	let userid = req.query.userid;
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
    Chatbot.find({[keywordType]: {$regex: keyword}, "date.created":{"$gte": dateStart, "$lt": dateEnd}})
    .exec((err, chatbots) => {
        if(err) throw err;
        return res.json(chatbots);
    });
});

module.exports = router;
