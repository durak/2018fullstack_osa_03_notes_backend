const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const initialNotes = [
  {
    content: 'HTML on helppoa',
    important: false
  },
  {
    content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
    important: true
  }
]

const format = (note) => {
  return {
    content: note.content,
    important: note.important,
    id: note._id
  }
}

const nonExistingId = async () => {
  const note = new Note()
  await note.save()
  await note.remove()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})

  return notes.map(format)
}

const usersInDb = async () => {
  const users = await User.find({})
  return users
}

const getUser = async (username, name, password) => {
  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username: username,
    name: name,
    passwordHash
  })

  const savedUser = await user.save()

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  return { username: username, name: name, id: user.id, token: token }
}

module.exports = {
  initialNotes, format, nonExistingId, notesInDb, usersInDb, getUser
}