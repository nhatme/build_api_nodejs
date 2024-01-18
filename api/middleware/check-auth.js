import jwt from 'jsonwebtoken'

export default (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]

        const decoded = jwt.verify(token, "secret")
        req.userData = decoded
        next()
    } catch (e) {
        return res.status(401).json({
            status: false,
            message: 'Authentication failed - Token missing'
        })
    }
}