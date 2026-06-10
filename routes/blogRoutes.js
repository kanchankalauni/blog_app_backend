const express = require("express")
const { createBlog, getAllBlog, getBlogById, updateBlog, deleteBlog, likeBlog,   } = require("../controllers/blogController")
const verifyUser = require("../middlewares/auth")
const { addComment, deleteComment } = require("../controllers/commentController")
const route = express.Router()


// blogs
route.post("/blogs", verifyUser , createBlog)

route.get("/blogs", getAllBlog)

route.get("/blogs/:id", getBlogById)

route.put("/blogs/:id", verifyUser, updateBlog)

route.delete("/blogs/:id", verifyUser, deleteBlog)

// like
route.post("/blogs/like/:id", verifyUser, likeBlog)

// comment
route.post("/blogs/comment/:id", verifyUser, addComment)

route.delete("/blogs/comment/:id", verifyUser, deleteComment)

module.exports = route