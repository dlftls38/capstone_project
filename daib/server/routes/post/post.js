var express = require('express');
var Post = require('../../schemas/models/post/post');
var mongoose = require('mongoose');

const router = express.Router();

/*
    WRITE POST: POST /api/post
    BODY SAMPLE: { contents: "sample ", title: "sample"}
    ERROR CODES
        1: NOT LOGGED IN
        2: EMPTY CONTENTS
        3: EMPTY TITLE
*/
router.post('/', (req, res) => {
    // CHECK LOGIN STATUS
    if(typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 1
        });
    }

    // CHECK CONTENTS VALID
    if(typeof req.body.contents !== 'string') {
        return res.status(400).json({
            error: "EMPTY CONTENTS",
            code: 2
        });
    }

    if(req.body.contents === "") {
        return res.status(400).json({
            error: "EMPTY CONTENTS",
            code: 2
        });
    }

    // CHECK TITLE VALID
    if(typeof req.body.title !== 'string') {
        return res.status(400).json({
            error: "EMPTY TITLE",
            code: 3
        });
    }

    if(req.body.title === "") {
        return res.status(400).json({
            error: "EMPTY TITLE",
            code: 3
        });
    }

    // CREATE NEW POST
    let post = new Post({
        writer: req.session.loginInfo.username,
        contents: req.body.contents,
        title: req.body.title
    });

    // SAVE IN DATABASE
    post.save( err => {
        if(err) throw err;
        return res.json({ success: true });
    });
});

/*
    MODIFY POST: PUT /api/post/:id
    BODY SAMPLE: { contents: "sample ", title: "title"}
    ERROR CODES
        1: INVALID ID,
        2: EMPTY CONTENTS
        3: EMPTY TITLE
        4: NOT LOGGED IN
        5: NO RESOURCE
        6: PERMISSION FAILURE
*/
router.put('/:id', (req, res) => {

    // CHECK POST ID VALIDITY
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            error: "INVALID ID",
            code: 1
        });
    }

    // CHECK CONTENTS VALID
    if(typeof req.body.contents !== 'string') {
        return res.status(400).json({
            error: "EMPTY CONTENTS",
            code: 2
        });
    }

    if(req.body.contents === "") {
        return res.status(400).json({
            error: "EMPTY CONTENTS",
            code: 2
        });
    }

    // CHECK TITLE VALID
    if(typeof req.body.title !== 'string') {
        return res.status(400).json({
            error: "EMPTY TITLE",
            code: 3
        });
    }

    if(req.body.title === "") {
        return res.status(400).json({
            error: "EMPTY TITLE",
            code: 3
        });
    }

    // CHECK LOGIN STATUS
    if(typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 4
        });
    }

    // FIND POST
    Post.findById(req.params.id, (err, post) => {
        if(err) throw err;

        // IF POST DOES NOT EXIST
        if(!post) {
            return res.status(404).json({
                error: "NO RESOURCE",
                code: 5
            });
        }

        // IF EXISTS, CHECK WRITER
        if(post.writer != req.session.loginInfo.username) {
            return res.status(403).json({
                error: "PERMISSION FAILURE",
                code: 6
            });
        }

        // MODIFY AND SAVE IN DATABASE
        post.contents = req.body.contents;
        post.title = req.body.title;
        post.date.edited = new Date();
        post.is_edited = true;

        post.save((err, post) => {
            if(err) throw err;
            return res.json({
                success: true,
                post
            });
        });

    });
});

/*
    DELETE POST: DELETE /api/post/:id
    ERROR CODES
        1: INVALID ID
        2: NOT LOGGED IN
        3: NO RESOURCE
        4: PERMISSION FAILURE
*/
router.delete('/:id', (req, res) => {

    // CHECK POST ID VALIDITY
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

    // FIND POST AND CHECK FOR WRITER
    Post.findById(req.params.id, (err, post) => {
        if(err) throw err;

        if(!post) {
            return res.status(404).json({
                error: "NO RESOURCE",
                code: 3
            });
        }
        if(post.writer != req.session.loginInfo.username) {
            return res.status(403).json({
                error: "PERMISSION FAILURE",
                code: 4
            });
        }

        // REMOVE THE POST
        Post.remove({ _id: req.params.id }, err => {
            if(err) throw err;
            res.json({ success: true });
        });
    });

});

/*
    DELETE POST: DELETE /api/post/remove/list
    ERROR CODES
        1: INVALID ID
        2: NOT LOGGED IN
        3: NO RESOURCE
        4: PERMISSION FAILURE
*/
router.delete('/remove/list', (req, res) => {

    let selectedPostList = req.query.selectedPostList;
    let length = selectedPostList.length
    
    // CHECK POST ID VALIDITY
    for(let i=0; i<length; i++){
        if(!mongoose.Types.ObjectId.isValid(selectedPostList[i])) {
            return res.status(400).json({
                error: "INVALID ID",
                code: 1
            });
        }
    }

    // CHECK LOGIN STATUS
    if(typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 2
        });
    }

    // FIND POST AND CHECK FOR WRITER
    for(let i=0; i<length; i++){
        Post.findById(selectedPostList[i], (err, post) => {
            if(err) throw err;
    
            if(!post) {
                return res.status(404).json({
                    error: "NO RESOURCE",
                    code: 3
                });
            }
            if(post.writer != req.session.loginInfo.username) {
                return res.status(403).json({
                    error: "PERMISSION FAILURE",
                    code: 4
                });
            }
            // Post.remove({ _id: selectedPostList[i] }, err => {
            //     if(err) throw err;
            //     res.json({ success: true });
            // });
        });
    }
    // REMOVE THE POST
    Post.deleteMany(
        { _id: {
            $in: selectedPostList
        } }, err => {
        if(err) throw err;
        res.json({ success: true });
    });
});

/*
    READ POST: GET /api/post
*/
router.get('/', (req, res) => {
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
    Post.find({[keywordType]: {$regex: keyword}, "date.created":{"$gte": dateStart, "$lt": dateEnd}})
    .sort({"_id": -1})
    .skip((page-1) * showLength)
    .limit(showLength)
    .exec((err, posts) => {
        if(err) throw err;
        return res.json(posts);
    });
});


module.exports = router;
