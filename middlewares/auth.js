const { verifyJWT } = require("../utils/generateToken")

const verifyUser = async (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1]
        // let token = req.headers.authorization.replace("Bearer ", "")

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Please sign in",
            })
        }

        try {
            let user = await verifyJWT(token)

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "Please sign in"
                })
            }
            // console.log(req.user)
            req.user = user.id
            next()
        } catch (err) {
            return res.status(400).json({
            message : err.message
        })
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Token Missing"
        })
    }
}

module.exports = verifyUser