//create web server
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');

//get all comments
router.get('/comments', function(req, res, next) {
  Comment.find(function(err, comments){
    if(err){ return next(err); }
    res.json(comments);
  });
});

//post a comment
router.post('/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.save(function(err, comment){
    if(err){ return next(err); }
    res.json(comment);
  });
});

//preloading comment objects
router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);
  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error("can't find comment")); }
    req.comment = comment;
    return next();
  });
});

//return a comment
router.get('/comments/:comment', function(req, res) {
  res.json(req.comment);
});

//update a comment
router.put('/comments/:comment/upvote', function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }
    res.json(comment);
  });
});

//update a comment
router.put('/comments/:comment/downvote', function(req, res, next) {
  req.comment.downvote(function(err, comment){
    if (err) { return next(err); }
    res.json(comment);
  });
});

//delete a comment
router.delete('/comments/:comment', function(req, res) {
  console.log("in delete");
  req.comment.remove();
  res.sendStatus(200);
});

module.exports = router;
