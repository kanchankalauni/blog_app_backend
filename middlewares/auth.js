const { verifyJWT } = require("../utils/generateToken")

const verifyUser = async (req, res, next) => {
    let token = req.headers.authorization.split(" ")[1]
    // let token = req.headers.authorization.replace("Bearer ", "")

    if(!token){
        return res.status(400).json({
            success : false,
            message : "Please sign in",
        })
    }

    try {
        let user = await verifyJWT(token)

        if(!user){
            return res.status(400).json({
                success: false,
                message: "Please sign in"
            })
        }
        // console.log(req.user)
        req.user = user.id
        next()
    } catch (err) {
        
    }
    // next()
}

module.exports = verifyUser