const Post = require('../model/Post');
const Comment = require('../model/Comment');
const User = require('../model/User');

module.exports.getPosts = async (req,res,next) => {
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 10;

    try{
        const posts = Post.find({}).skip((page-1)*perPage).limit(perPage).exec();
        const totalCount = await Post.countDocuments();
        const totalPages = Math.ceil(totalCount/perPage);
        res.status(200).json({posts, currentPage : page, totalPages});
    }catch(err){
        err.statusCode = 500;
        next(err);
    }

}

module.exports.getUserInfo = async (req,res,next) => {
    try{
        const profileId = req.params.profileId;

        const profile = await User.findById(profileId);

        if(!profile){
            const error = new Error('No profile found');
            error.status = 404;
            throw error;
        }

        res.status(200).json({
            message:'profile loaded successfully',
            profile: profile
        })

    }catch(err){
        err.statusCode = 500;
        next(err);
    }
}

module.exports.getPost = async (req,res,next) => {
    
    try{
        
        const postId = req.params.postId;
        const post = await Post.findById(postId);

        if(!post){
            const error = new Error('Post not found!');
            error.statusCode= 404;
            throw error;
        }

        const totalLikes = post.likes.length;
        
        const comments = await Comment.find({post:postId});

        const totalComments = comments.length;

        res.status(200).json({
            post: post,
            totalLikes,
            totalComments
        })
    }catch(err){
        err.statusCode = 500;
        next(err);
    }
}

module.exports.getPostComments = async (req,res,next) => {
    try{

        const postId = req.params.postId;
        const post = await Post.findById(postId);

        if(!post){
            const error = new Error('Post not found!');
            error.statusCode = 404;
            throw error;
        }

        const comments = await Comment.find({post: postId, isParent :true });
        let message;

        if(!comments){
            message = "No comments present for this post";
        }else{
            message = "Comments loaded successfully";
        }

        res.status(200).json({
            message,
            comments
        })

    }catch(err){
        err.statusCode = 500;
        next(err);
    }
}

module.exports.getReplyComments = async (req,res,next) => {
    try{

        const commentId = req.params.commentId;

        const parentComment = await Comment.findById(commentId);

        if(!parentComment){
            const error = new Error('No comment found');
            error.statusCode(404);
            throw error;
        }

        const comments = await Comment.find({parentComment: commentId});

        let message;
        if(!comments){
            message = "No reply comments";
        }else{
            message = "Reply comments loaded";
        }

        res.status(200).json({
            comments,
            message
        })

    }catch(error){
        error.statusCode = 500;
        next(error);
    }
}