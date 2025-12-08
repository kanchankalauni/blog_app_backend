const Blog = require("../models/blogSchema")
const User = require("../models/userSchema")

async function createBlog(req, res) {
    try {
        const {title, description, draft, creator} = req.body
        // console.log(req.body)
        if(!title){
            return res.status(200).json({
                message : "Please fill title field"
            })
        }

        if(!description){
            return res.status(200).json({
                message : "Please fill description field"
            })
        }

        const findUser = await User.findById(creator)
        
        if (!findUser) {
            return res.status(500).json({
                message : "User not found"
            })
        }

        const blog = await Blog.create({description, title, draft, creator})

        await User.findByIdAndUpdate(creator, {$push : {blogs : blog._id}})

        return res.status(200).json({
            message : "Blog created successfully",
            blog
        })
    } catch (err) {
        return res.status(500).json({
            message : err.message
        })
    }
}

async function getAllBlog(req, res) {
    try {
        const blogs = await Blog.find({draft : false}).populate({
            path : "creator",
            select : "name",
            // select : "-password"
        })
        return res.status(200).json({
            message : "Blog fetched successfully",
            blogs
        })
    } catch (err) {
        return res.status(500).json({
            message : err.message
        })
    }
}

async function getBlogById(req, res) {
    try {
        const {id} = req.params
        const blogs = await Blog.findById(id)
        return res.status(200).json({
            message : "Blog fetched successfully",
            blogs
        })
    } catch (err) {
        return res.status(500).json({
            message : err.message
        })
    }
}

async function updateBlog(req, res) {
    try {
        const {id} = req.params

        const {title, description, draft, creator} = req.body

        const updatedBlog = await Blog.findByIdAndUpdate(
            id, 
            {title, description, draft, creator}, 
            { new : true }
        )

        if(!updatedBlog){
            return res.status(200).json({
                success : false,
                message : "Blog not found",
            })
        }

        return res.status(200).json({
            success : true,
            message : "Blog updated successfully",
            updatedBlog
        })
    } catch (err) {
        return res.status(500).json({
            message : err.message
        })
    }
}

async function deleteBlog(req, res) {
    try {
        const {id} = req.params

        const deletedBlog = await Blog.findByIdAndDelete(id)

        if(!deletedBlog){
            return res.status(200).json({
                success : false,
                message : "Blog not found",
            })
        }

        return res.status(200).json({
            success : true,
            message : "Blog deleted successfully",
            deletedBlog
        })
    } catch (err) {
        return res.status(500).json({
            message : err.message
        })
    }
}

module.exports = {
    createBlog,
    getAllBlog,
    getBlogById,
    updateBlog,
    deleteBlog
}