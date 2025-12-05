const Blog = require("../models/blogSchema")

async function createBlog(req, res) {
    try {
        const {title, description, draft} = req.body

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

        const blog = await Blog.create({description, title, draft})

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
        const blogs = await Blog.find({draft : false})
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
    // const {id} = req.params
    // let searchBlog = blogs.filter(blog => blog.id == id)
    // return res.json({searchBlog})
}

async function updateBlog(req, res) {
    try {
        
    } catch (err) {
        return res.status(500).json({
            message : err.message
        })
    }
    // const {id} = req.params
    // // let index = blogs.findIndex(blog => blog.id == id)
    // // blogs[index] = {...blogs[index], ...req.body}

    // let updatedBlogs = blogs.map((blog, index) => 
    //     blog.id == id ? {...blogs[index], ...req.body} : blog
    //     )
    // blogs = [...updatedBlogs]
    // return res.json({"message" : "blog updated successfully"})
}

async function deleteBlog(req, res) {
    try {
        
    } catch (err) {
        return res.status(500).json({
            message : err.message
        })
    }
    // let filteredBlog = blogs.filter(blog => blog.id != req.params.id)
    // blogs = [...filteredBlog]
    // return res.status(200).json({"message" : "blog deleted successfully"})
}

module.exports = {
    createBlog,
    getAllBlog,
    getBlogById,
    updateBlog,
    deleteBlog
}