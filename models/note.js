const mongoose = require('mongoose')


const Note = mongoose.model('Note', {
  content: String,
  date: Date,
  important: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

module.exports = Note