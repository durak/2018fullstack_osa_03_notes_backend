const mongoose = require('mongoose')

const User = mongoose.model('User', {
  username: String,
  name: String,
  passwordHash: String,
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }]
})

module.exports = User
