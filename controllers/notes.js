const notesRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Note = require('../models/note')
const User = require('../models/user')


notesRouter.get('/', async (req, res) => {
  const notes = await Note
    .find({})
    .populate('user', { username: 1, name: 1 })

  res.json(notes.map(Note.format))

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
      response.json(Note.format(note))
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

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

notesRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }


    if (body.content === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }

    const user = await User.findById(decodedToken.id)

    const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date(),
      user: user._id
    })

    const savedNote = await note.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.json(Note.format(savedNote))
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
      response.json(Note.format(updatedNote))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

module.exports = notesRouter