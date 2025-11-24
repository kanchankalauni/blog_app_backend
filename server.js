const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express();

app.use(express.json())
app.use(cors())

async function dbConnect() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/blogDatabase")
        console.log("Db Connected successfully")
    } catch (err) {
        console.log("error occured while connecting DB")
        console.log(err)
    }
}


const userSchema = new mongoose.Schema({
    name : String,
    email : {
        type : String,
        unique : true
    },
    password : String
})

const User = mongoose.model("User", userSchema)



// user routes

// let users = [];

app.post("/users", async (req, res) => {
    const {name, password, email} = req.body
    try {
        if (!name) {
            return res.status(404).json({
                success : false,
                message : "Please enter the name"
            })
        }
        if (!password) {
            return res.status(404).json({
                success : false,
                message : "Please enter the password"
            })
        }
        if (!email) {
            return res.status(404).json({
                success : false,
                message : "Please enter the email"
            })
        }

        const checkForExistingUser = await User.findOne({email})

        if(checkForExistingUser){
            return res.status(400).json({
                success : false,
                message : "User already registered with this email",
            })
        }

        // users.push({...req.body, id : users.length + 1})
        const newUser = await User.create({
            name,
            email,
            password
        })

        return res.status(200).json({
            success : true,
            message : "User created successfully",
            newUser
        })
    } catch (err) {
        return res.status(500).json({
            success : false,
            message : "Please try again",
            error : err.message
        })
    }
})

app.get("/users", (req, res) => {
    try {

        // db call
        return res.status(200).json({
            success : true,
            message : "User fetched successfully",
            users
        })
        
    } catch (err) {
        return res.status(500).json({
            success : false,
            message : "Please try again"
        })
    }
})

app.get("/users/:id", (req, res) => {
    try {

        // db call

        const user = users.filter(user => user.id == req.params.id)

        if(!user.length){
            return res.status(200).json({
                success : false,
                message : "User not found",
                user
            })
        }

        return res.status(200).json({
            success : true,
            message : "User fetched successfully",
            user
        })
        
    } catch (err) {
        return res.status(500).json({
            success : false,
            message : "Please try again"
        })
    }
})

app.patch("/users/:id", (req, res) => {
    try {
        let updatedUser = users.map((user, index) => user.id == req.params.id ? {...users[index], ...req.body} : user)
        users = [...updatedUser]
        return res.json({"message" : "user updated successfully"})
    } catch (err) {
        return res.status(500).json({
            success : false,
            message : "Please try again"
        })
    }
})

app.delete("/users/:id", (req, res) => {
    try {
        let filteredUser = users.filter(user => user.id != req.params.id)
        users = [...filteredUser]
        return res.status(200).json({"message" : "user deleted successfully"})
    } catch (err) {
        return res.status(500).json({
            success : false,
            message : "Please try again"
        })
    }
})



// blog routes

let blogs = []

app.post("/blogs", (req, res) => {
    blogs.push({...req.body, id : blogs.length + 1})
    return res.json({"message" : "blog created successfully"})
})

app.get("/blogs", (req, res) => {
    let publicBlogs = blogs.filter(blog => !blog.draft)
    return res.json({publicBlogs})
})

app.get("/blogs/:id", (req, res) => {
    const {id} = req.params
    let searchBlog = blogs.filter(blog => blog.id == id)
    return res.json({searchBlog})
})

app.put("/blogs/:id", (req, res) => {
    const {id} = req.params
    // let index = blogs.findIndex(blog => blog.id == id)
    // blogs[index] = {...blogs[index], ...req.body}

    let updatedBlogs = blogs.map((blog, index) => blog.id == id ? {...blogs[index], ...req.body} : blog)
    blogs = [...updatedBlogs]
    return res.json({"message" : "blog updated successfully"})
})

app.delete("/blogs/:id", (req, res) => {
    let filteredBlog = blogs.filter(blog => blog.id != req.params.id)
    blogs = [...filteredBlog]
    return res.status(200).json({"message" : "blog deleted successfully"})
})

app.listen(3000, () => {
    console.log("server started")
    dbConnect()
})