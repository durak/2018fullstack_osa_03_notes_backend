const notesRouter = require('express').Router()
const Note = require('../models/note')

const formatNote = (note) => {
  return {
    content: note.content,
    date: note.date,
    important: note.important,
    id: note._id
  }
}

notesRouter.get('/', (req, res) => {
  Note
    .find({})
    .then(notes => {
      res.json(notes.map(formatNote))
    })
})

notesRouter.get('/:id', (request, response) => {
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
})


notesRouter.delete('/:id', (request, response) => {
  Note
    .findByIdAndRemove(request.params.id)
    .then( () => {
      response.status(204).end()
    })
    .catch( () => {
      response.status(400).send({ error: 'malformatted id' })
    })
})


notesRouter.post('/', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
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
})


notesRouter.put('/:id', (request, response) => {
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

module.exports = notesRouter