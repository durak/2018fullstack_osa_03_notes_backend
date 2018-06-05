const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }]
})

userSchema.statics.format = (user) => {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    notes: user.notes
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User