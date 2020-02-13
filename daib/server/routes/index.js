var express = require('express');
var account = require('./account/account');
var memo = require('./memo/memo');
var post = require('./post/post');
var search = require('./search/search');

const router = express.Router();

router.use('/*', (req, res, next) => {
    res.setHeader("Expires", "-1");
    res.setHeader("Cache-Control", "must-revalidate, private");
    next();
});

router.use('/account', account);
router.use('/memo', memo);
router.use('/post', post);
router.use('/search', search);

module.exports =  router;
