const mongoose = require('mongoose')
const { Schema, model } = mongoose

const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean,
  category: [String],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Note = model('Note', noteSchema)

module.exports = Note

/*Note.find({}).then(result => {
  console.log(result)
  mongoose.connection.close()
})*/

/*const note = new Note({
  content: 'MongoDB es increible, sleepy',
  date: new Date(),
  important: true,
  category: ['sports', 'science'],
})

note
  .save()
  .then(result => {
    console.log(result)
    mongoose.connection.close()
  })
  .catch(err => {
    console.error(err)
  })*/
