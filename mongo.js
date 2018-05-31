const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Gothubiin!
const url = 'mongodb://fullstacknotes:@ds139890.mlab.com:39890/fs-notes'

mongoose.connect(url)

const Note = mongoose.model('Note', {
  content: String,
  date: Date,
  important: Boolean
})

const note = new Note({
  content: 'HTML on helppoa 3',
  date: new Date(),
  important: true
})

/* note
  .save()
  .then(response => {
    console.log('note saved!')
    mongoose.connection.close()
  }) */
  
  Note
  .find({})
  .then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })