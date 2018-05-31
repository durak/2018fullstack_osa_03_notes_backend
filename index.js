const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Note = require('./models/note')


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
app.use(express.static('build'))


// routemäärittelyt
app.get('/', (req, res) => {
  res.send('<h1>Hello Worldd!</h1>')
})

app.get('/api/notes/:id', (request, response) => {
  Note
    .findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(formatNote(note))
      } else {
        response.status(404).end()
      }

    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })

/*   const id = Number(request.params.id)
  const note = notes.find(note => {    
    return note.id === id
  })
  
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  } */
})

app.get('/api/notes', (req, res) => {
  // res.json(notes)
  Note
  .find({})
  .then(notes => {
    res.json(notes.map(formatNote))
  })
})

app.delete('/api/notes/:id', (request, response) => {
/*   const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end() */
  Note
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })

})

app.put('/api/notes/:id', (request, response) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important
  }

  Note
    .findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(formatNote(updatedNote))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({error: 'content missing'})
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()    
  })
  
  note
    .save()
    .then(formatNote)
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
    })

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

const formatNote = (note) => {
  return {
    content: note.content,
    date: note.date,
    important: note.important,
    id: note._id
  }
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

 