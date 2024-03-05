const Post = require('../model/Post');
const User = require('../model/User');
const Comment = require('../model/Comment');
const fs = require('fs').promises;


module.exports.createPost = async (req,res,next) => {
    try{
        if(!req.file){
            const error = new Error('No image provided');
            error.statusCode = 422;
            throw error;
        }
        const imageUrl = req.file.path;
        const content = req.body.content;
        const userId = req.body.userId;

        const newPost = new Post({
            user : userId,
            content : content,
            imageUrl : imageUrl
        });

        const savedPost = await newPost.save();
        res.status(201).json({
            message: 'Post created successfully!',
            post : savedPost
        })
    }catch(err){
        err.statusCode = 500;
        next(err);
    }
}


module.exports.toggleLike = async (req,res,next) => {
    try{

        const postId = req.params.postId;

        const post = await Post.findById(postId);

        if(!post){
            const error = new Error('Post not Found');
            error.statusCode = 404;
            throw error;
        }

        const userIndex = post.likes.indexOf(req.userId);
        let message;

        if(userIndex === -1){
            post.likes.push(req.userId);
            message = "Post Liked Successfully!";
        }else{
            post.likes.splice(userIndex,1);
            message = "Post Unliked Successfully!"
        }

        const updatedPost = await post.save();
        res.status(201).json({
            message,
            post: updatedPost
        })

    }catch(err){
        err.statusCode = 500;
        next(err);
    }
}

module.exports.createComment = async (req,res,next) => {
    try{   

        const postId = req.params.postId;
        const userId = req.userId;
        const text = req.body.text;

        const post = await Post.findById(postId);

        if(!post){
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error;
        }

        const newComment = new Comment({
            text:text,
            post: postId,
            user: userId,
            isParent :true,
        })

        const savedComment = await newComment.save();

        res.status(201).json({
            message: "You have added a new comment",
            comment: savedComment
        })

    }catch(err){
        err.statusCode = 500;
        next(err);
    }
}

module.exports.createNestedComment = async (req,res,next) => {
    try{

        const commentId = req.params.commentId;
        const userId = req.userId;
        const text = req.body.text;

        const parentComment = await Comment.findById(commentId);

        if(!parentComment){
            const error = new Error('Comment Not Found!');
            error.statusCode = 404;
            throw error;
        }

        const newComment = new Comment({
            text: text,
            parentComment: parentComment,
            post: parentComment.post,
            user: userId,
            isParent:false
        })

        const savedComment = await newComment.save();

        parentComment.comments.push(savedComment);
        await parentComment.save();

        res.status(201).json({
            message: 'Comment added successfully',
            comment:savedComment 
        })

    }catch(err){
        err.statusCode = 500;
        next(err);
    }
}

module.exports.likeComment = async (req,res,next) => {
    try{

        const commentId = req.params.commentId;
        
        const comment = await Comment.findById(commentId);

        if(!comment){
            const error = new Error('Comment Not Found!');
            error.statusCode = 404;
            throw error;
        }

        const userIndex = comment.likes.indexOf(req.userId);
        let message;
        if(userIndex === -1){
            comment.likes.push(req.userId);
            message = "Comment liked successfully";
        }else{
            comment.liked.splice(userIndex,1);
            message = "Comment unliked successfully";
        }

        const updatedComment = await comment.save();

        res.status(201).json({
            message,
            comment: updatedComment
        })


    }catch(err){
        err.statusCode = 500;
        next(err);
    }
}

module.exports.deletePost = async (req,res,next) => {
    
    try{
        const postId = req.params.postId;
        const userId = req.userId;

        const post = await Post.findById(postId);

        if(!post){
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error;
        }

        if(post.user.toString() !== userId){
            const error = new Error('Not Authencticated');
            error.statusCode = 406;
            throw error;
        }

        if(post.imageUrl){
            await fs.unlink(post.imageUrl);
        }

        const deletedComment = await Comment.deleteMany({post: postId});
        const deletedPost = await Post.deleteOne({_id:postId});

        res.status(200).json({
            message: "Post deleted successfully"
        })
    }catch(err){
        err.statusCode = 500;
        next(err);
    }
}


//recursive function for delete all nested comments
const deleteCommentsFunction = async (commentId) => {
    const comment = await Comment.findById(commentId);
    if(!comment){
        return;
    }

    for (const nestedComment of comment.comments){
        await deleteCommentsFunction(nestedComment);
    }
    await Comment.findByIdAndDelete(commentId);
}

module.exports.deleteComment = async (req,res,next) => {
    try{
        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);
        if(comment.user.toString() !== req.userId ){
            const error = new Error('Not Authenticated to delete this comment');
            error.statusCode(406);
            throw error;
        }

        await deleteCommentsFunction(commentId);

        res.stauts(200).json({
            message: "Comments and its replys deleted successfully"
        })
        

    }catch(error){
        error.statusCode = 500;
        next(error);
    }
}