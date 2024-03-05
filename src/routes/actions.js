const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionsController');
const isAuth = require('../middlewares/isAuth');

router.post('/createPost',isAuth, actionController.createPost);
router.post('/likePost/:postId', isAuth, actionController.toggleLike);
router.post('/postComment/:postId',isAuth, actionController.createComment );
router.post('/nestedComment/:commentId',isAuth, actionController.createNestedComment );
router.post('/likeComment/:commentId', isAuth, actionController.likeComment )


router.delete('/deletePost/:postId', isAuth, actionController.deletePost);
router.delete('/deleteComment/:commentId', isAuth, actionController.deleteComment);

module.exports = router;

