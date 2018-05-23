const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')


let notes = [
  {
    id: 1,
    content: 'HTML on helppoa',
    date: '2017-12-10T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Selain pystyy suorittamaan vain javascriptiä',
    date: '2017-12-10T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
    date: '2017-12-10T19:20:14.298Z',
    important: true
  }
]

const logger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const app = express()       // funktio palauttaa express-olion
app.use(bodyParser.json())
app.use(logger)
app.use(cors())


// routemäärittelyt
app.get('/', (req, res) => {
  res.send('<h1>Hello Worldd!</h1>')
})

app.get('/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => {    
    return note.id === id
  })
  
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.get('/notes', (req, res) => {
  res.json(notes)
})

app.delete('/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.post('/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({error: 'content missing'})
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId()
  }
  
  notes = notes.concat(note)
  response.json(note)

/*   console.log('body', body)
  console.log('req headers', request.headers) */
})

/* const app = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end(JSON.stringify(notes))
}) */

const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(error)


const generateId = () => {
  const maxId = notes.length > 0 ? notes.map(n => n.id).sort().reverse()[0] : 1
  return maxId + 1
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

 