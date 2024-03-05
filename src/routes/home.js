const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homecontroller');

router.get('/',homeController.getPosts);
router.get('/profile/:profileId', homeController.getUserInfo);
router.get('/post/:postId',homeController.getPost);
router.get('/getPostComments/:postId', homeController.getPostComments )
router.get('/getReplyComments/:commentId', homeController.getReplyComments);


module.exports = router;