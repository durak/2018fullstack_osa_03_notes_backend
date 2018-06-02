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

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({})
  res.json(notes.map(formatNote))

/*   Note
    .find({})
    .then(notes => {
      res.json(notes.map(formatNote))
    }) */
})

notesRouter.get('/:id', async (request, response) => {
  try {
    const note = await Note.findById(request.params.id)
    if (note) {
      response.json(formatNote(note))
    } else {
      response.status(404).end()
    }

  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }

/*   Note
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
    }) */
})


notesRouter.delete('/:id', async (request, response) => {
  try {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }

/*   Note
    .findByIdAndRemove(request.params.id)
    .then( () => {
      response.status(204).end()
    })
    .catch( () => {
      response.status(400).send({ error: 'malformatted id' })
    }) */
})


notesRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    if (body.content === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }

    const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date()
    })

    const savedNote = await note.save()
    response.json(formatNote(savedNote))
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }

/*   note
    .save()
    .then(formatNote)
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
    })
    .catch(error => {
      console.log(error)
      response.status(500).json({ error: 'something went wrong...' })
    }) */
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