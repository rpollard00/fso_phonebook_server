const mongoose = require('mongoose')

// no args or a number that doesn't make sense
if (process.argv.length < 3 || process.argv.length === 4) {
  console.log('Please provide password as an argument: node mongo.js <password> [personName] [phoneNumber]')
  process.exit(1)
}
// 3 args
const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.bqu7xkd.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  // treat 3rd as pw
  // retrieve all entries
  mongoose.connect(url).then(result => {
      Person
        .find({}).then(result => { result.forEach(p => console.log(p)) })
        .then(() => { return mongoose.connection.close() })
        .catch(err => console.log(err))
  })
}
else {
  mongoose.connect(url).then(result => {
    const name = process.argv[3]
    const phone = process.argv[4]

    console.log('connected')
  const person = new Person({
    name: name,
    phone: phone,
    
    })
    return person.save()
  })
  .then(() => {
    console.log('person saved!')
    return mongoose.connection.close()
  })
  .catch((err) => console.log(err))
}


