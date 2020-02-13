var express = require('express');
var Account = require('../../schemas/models/account/account');

var router = express.Router();

/*
    ACCOUNT SIGNUP: POST /api/account/signup
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: BAD USERNAME
        2: BAD PASSWORD
        3: USERNAM EXISTS
*/
router.post('/signup', (req, res) => {
    let userIdRegex = /^[a-z0-9A-Z]+$/;
    // CHECK NAME FORMAT
    if(!userIdRegex.test(req.body.username)) {
        return res.status(400).json({
            error: "BAD NAME",
            code: 1
        });
    }
    // CHECK ID FORMAT
    if(!userIdRegex.test(req.body.id)) {
        return res.status(400).json({
            error: "BAD ID",
            code: 2
        });
    }
    // CHECK PASS LENGTH
    if(req.body.password.length < 4 || typeof req.body.password !== "string" || req.body.password !== req.body.password_check) {
        return res.status(400).json({
            error: "BAD PASSWORD",
            code: 3
        });
    }

    let userPhoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    // CHECK NAME FORMAT
    if(!userPhoneRegex.test(req.body.phone_number)) {
        return res.status(400).json({
            error: "BAD PHONE_NUMBER",
            code: 4
        });
    }
    // CHECK USER EXISTANCE
    Account.findOne({ id: req.body.id }, (err, exists) => {
        if (err) throw err;
        if(exists){
            return res.status(409).json({
                error: "ID EXISTS",
                code: 5
            });
        }
        // CREATE ACCOUNT
        let account = new Account({
            username: req.body.username,
            id: req.body.id,
            password: req.body.password,
            phone_number: req.body.phone_number
        });

        account.password = account.generateHash(account.password);

        // SAVE IN THE DATABASE
        account.save( err => {
            if(err) throw err;
            return res.json({ success: true });
        });

    });
});

/*
    ACCOUNT SIGNIN: POST /api/account/signin
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: LOGIN FAILED
*/
router.post('/signin', (req, res) => {
    if(typeof req.body.password !== "string") {
        return res.status(401).json({
            error: "LOGIN FAILED",
            code: 1
        });
    }

    // FIND THE USER BY USERNAME
    Account.findOne({ id: req.body.id}, (err, account) => {
        if(err) throw err;

        // CHECK ACCOUNT EXISTANCY
        if(!account) {
            return res.status(401).json({
                error: "LOGIN FAILED",
                code: 1
            });
        }

        // CHECK WHETHER THE PASSWORD IS VALID
        if(!account.validateHash(req.body.password)) {
            return res.status(401).json({
                error: "LOGIN FAILED",
                code: 1
            });
        }

        // ALTER SESSION
        let session = req.session;
        session.loginInfo = {
            _id: account._id,
            username: account.username
        };

        // RETURN SUCCESS
        return res.json({
            success: true,
            info: req.session.loginInfo
            //쿠키 정보 주기
        });
    });
});

/*
    GET CURRENT USER INFO GET /api/account/getInfo
*/
router.get('/getinfo', (req, res) => {
    if(typeof req.session.loginInfo === "undefined") {
        return res.status(401).json({
            error: 1
        });
    }

    res.json({ info: req.session.loginInfo });
});

/*
    LOGOUT: POST /api/account/logout
*/
router.post('/logout', (req, res) => {
    req.session.destroy(err => { if(err) throw err; });
    return res.json({ success: true });
});



module.exports = router;