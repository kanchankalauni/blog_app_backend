const Blog = require("../models/blogSchema")
const Comment = require("../models/commentSchema")

async function addComment(req, res) {
    try {
        const creator = req.user
        const { id } = req.params
        const { comment } = req.body

        console.log(comment)

        if (!comment) {
            return res.status(500).json({
                success: false,
                message: "Please enter the comment",
            })
        }

        const blog = await Blog.findById(id)

        if (!blog) {
            return res.status(500).json({
                success: false,
                message: "Blog not found",
            })
        }

        // create the comment

        const newComment = await Comment.create({
            comment,
            blog: id,
            user: creator
        })

        console.log(newComment)

        await Blog.findByIdAndUpdate(id, {
            $push: { comments: newComment._id }
        })

        return res.status(200).json({
            success: true,
            message: "Comment added successfully",
        })

    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

async function deleteComment(req, res) {
    try {
        const userId = req.user
        const { id } = req.params

        const comment = await Comment.findById(id).populate({
            path : "blog",
            select : "creator"
        })

        // console.log("comment.user:", comment.user);
        // console.log("userId:", userId);
        // console.log("comment.blog:", comment.blog);
        // console.log("comment.blog.creator:", comment.blog.creator);
        if (!comment) {
            return res.status(500).json({
                success: false,
                message: "Comment not found",
            })
        }

        if (comment.user != userId && comment.blog.creator != userId) {
            return res.status(500).json({
                success: false,
                message: "You are not authorized to delete this comment",
            })
        }

        await Blog.findByIdAndUpdate(comment.blog._id, {$pull : {comments : id}});
        await Comment.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        })

    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

async function editComment(req, res) {
    try {
        const userId = req.user
        const { id } = req.params
        const { updateComment } = req.body

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(500).json({
                success: false,
                message: "Comment not found",
            })
        }

        // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImthbmNoYW5AZ21haWwuY29tIiwiaWQiOiI2OTRiYTA5MzhiMzljMWE2NWNkMmUyMzMiLCJpYXQiOjE3ODEwNzM5NDZ9.psu0cLnZd7hBf0qvzvj-pDD-d6g_4hPvUyal9rbn_j8
        // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inh5ekBnbWFpbC5jb20iLCJpZCI6IjY5NGZkZmQ3MmJlOGY0ZDUyMTU4MzJlYSIsImlhdCI6MTc4MTA3NDM3NX0.Qy7SG7HFxiKT-wmFzWcASs4OKWF9g_cXpcmywrqEHqc

        if (comment.user != userId) {
            return res.status(400).json({
                success : false,
                message : "You are not valid user to edit this comment"
            })
        }

        await Comment.findByIdAndUpdate(id, { comment : updateComment })

        return res.status(200).json({
            success: true,
            message: "Comment updated successfully",
        })

    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

async function likeComment(req, res) {
    try {
        const userID = req.user
        const { id } = req.params

        const comment = await Comment.findById(id)

        if (!comment) {
            return res.status(500).json({
                success: false,
                message: "Comment not found",
            })
        }

        if (!comment.likes.includes(userID)) {
            await Comment.findByIdAndUpdate(id, { $push: { likes: userID } })
            return res.status(200).json({
                success: true,
                message: "Comment liked successfully"
            })
        } else {
            await Comment.findByIdAndUpdate(id, { $pull: { likes: userID } })
            return res.status(200).json({
                success: true,
                message: "Comment disliked successfully"
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports = {
    addComment,
    deleteComment,
    editComment,
    likeComment
}