const User = require("../models/userSchema")
const bcrypt = require("bcrypt")
const { generateJWT } = require("../utils/generateToken")

async function createUser(req, res) {
    const { name, password, email } = req.body
    try {
        if (!name) {
            return res.status(404).json({
                success: false,
                message: "Please enter the name"
            })
        }
        if (!password) {
            return res.status(404).json({
                success: false,
                message: "Please enter the password"
            })
        }
        if (!email) {
            return res.status(404).json({
                success: false,
                message: "Please enter the email"
            })
        }

        const checkForExistingUser = await User.findOne({ email })

        if (checkForExistingUser) {
            return res.status(400).json({
                success: false,
                message: "User already registered with this email",
            })
        }

        const hashedPass = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            name,
            email,
            password: hashedPass
        })

        let token = await generateJWT({
            email: newUser.email,
            id: newUser._id
        })

        return res.status(200).json({
            success: true,
            message: "User created successfully",
            user: {
                name: newUser.name,
                email: newUser.email,
                blogs: newUser.blogs,
                token
            },
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Please try again",
            error: err.message
        })
    }
}

async function login(req, res) {
    const { password, email } = req.body
    try {
        if (!password) {
            return res.status(404).json({
                success: false,
                message: "Please enter the password"
            })
        }
        if (!email) {
            return res.status(404).json({
                success: false,
                message: "Please enter the email"
            })
        }

        const checkForExistingUser = await User.findOne({ email })

        if (!checkForExistingUser) {
            return res.status(400).json({
                success: false,
                message: "User not exist",
            })
        }

        let checkForPass = await bcrypt.compare(password, checkForExistingUser.password)

        if (!checkForPass) {
            return res.status(400).json({
                success: false,
                message: "Inncorrect password",
            })
        }

        let token = await generateJWT({
            email: checkForExistingUser.email,
            id: checkForExistingUser._id
        })

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: checkForExistingUser,
            token
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Please try again",
            error: err.message
        })
    }
}

async function getAllUser(req, res) {
    try {

        const users = await User.find({})

        // db call
        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user: users
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Please try again"
        })
    }
}

async function getUserById(req, res) {
    try {

        const id = req.params.id
        // console.log("id", id)

        // db call

        const user = await User.findById(id)

        // console.log(user._id)
        // console.log(user.id)

        if (!user) {
            return res.status(200).json({
                success: false,
                message: "User not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Please try again",
            error: err.message
        })
    }
}

async function updateUser(req, res) {
    try {
        const id = req.params.id

        const { name, password, email } = req.body

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, password, email },
            { new: true }
        )

        if (!updatedUser) {
            return res.status(200).json({
                success: false,
                message: "User not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Please try again"
        })
    }
}

async function deleteUser(req, res) {
    try {
        const id = req.params.id

        const deletedUser = await User.findByIdAndDelete(id)

        if (!deletedUser) {
            return res.status(200).json({
                success: false,
                message: "User not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            user: deletedUser
        })
        // let filteredUser = users.filter(user => user.id != req.params.id)
        // users = [...filteredUser]
        // return res.status(200).json({"message" : "user deleted successfully"})
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Please try again"
        })
    }
}

module.exports = {
    createUser,
    getAllUser,
    getUserById,
    updateUser,
    deleteUser,
    login
}