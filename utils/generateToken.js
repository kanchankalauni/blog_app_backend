const jwt = require("jsonwebtoken")

async function generateJWT(payload) {
    let token = await jwt.sign(payload, "jwtsecretToken")
    return token
}

async function verifyJWT(token) {
    try {
        let isValid = await jwt.verify(token, "jwtsecretToken")
        return true
    } catch (err) {
        return false
    }
}

async function decodeJWT(token) {
    let decoded = await jwt.decode(token)
    console.log("decoded", decoded)
    return decoded
}

module.exports = { generateJWT, verifyJWT, decodeJWT }