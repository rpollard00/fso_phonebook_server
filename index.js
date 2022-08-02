const express = require('express')
require('dotenv').config()
const morgan = require('morgan')
const Person = require('./models/person')
const cors = require('cors')
const app = express()

morgan.token('person', (req, res) => JSON.stringify(req.body) )

app.use(morgan(':method :url :status :res[content-length] :response-time ms :person'))
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.get('/', (request, response) => {
  response.send('<h1>Helloo world!</h1>')
})

app.get ('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
  .catch(error => next(error))
})

app.get ('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => id === person.id)

  person ? response.json(person) : response.status(404).end()
})

const generateRandomId = () => {
  return Math.floor(Math.random() * 1000000)
}

app.post ('/api/persons', (request, response) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    phone: body.phone,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

// app.post ('/api/persons', (request, response) => {
//   const body = request.body
//   // generate a random id
//   // create a person object
//   const person = {
//     id: generateRandomId(),
//     name: body.name,
//     phone: body.phone
//   }

//   if (!body.name) {
//     return response.status(400).json({
//       'error': 'missing name'
//     })
//   } else if (!body.phone) {
//     return response.status(400).json({
//       'error': 'missing phone number'
//     })
//   }

//   if (persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())) {
//     return response.status(409).json({ 
//       'error': `Name ${body.name} already exists`
//     })
//   } else if (persons.find(p => Number(p.id) === person.id)) {
//     return response.status(409).json({
//       'error': `duplicate id generated`
//     })
//   }

//   persons = persons.concat(person)
//   //res.send(`${person}`)
//   response.status(200).json(person)
//   // add the person to the array

//   // fail if the name is duplicate or id is duplicate

// })

app.delete ('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get ('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `)
})

// last middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })

}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    response.status(400).send({ error: 'malformed id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);