import http from 'http'
import app from './app.js'

const port = process.env.PORT || 3002
const server = http.createServer(app)
server.listen(port, (req, res) => {
    console.log(`server is running on port localhost:${port}`);
})