const http = require('http')
const express = require('express')
const app = express()       // funktio palauttaa express-olion
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const notesRouter = require('./controllers/notes')



const url = config.mongoUrl

mongoose
  .connect(url)
  .then( () => {
    let uri = url.substring(url.indexOf('@') + 1, url.length)
    console.log('connected to database', uri)
  })
  .catch( err => {
    console.log(err)
  })


app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
app.use(middleware.logger)

// routemäärittelyt
app.use('/api/notes', notesRouter)

app.get('/', (req, res) => {
  res.send('<h1>Hello Worldd!</h1>')
})

app.use(middleware.error)

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}

/* const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) */

