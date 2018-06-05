const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

noteSchema.statics.format = (note) => {
  return {
    id: note._id,
    content: note.content,
    date: note.date,
    important: note.important,
    user: note.user
  }
}

const Note = mongoose.model('Note', noteSchema)

module.exports = Note