const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('person', (req, res) => JSON.stringify(req.body) )

app.use(morgan(':method :url :status :res[content-length] :response-time ms :person'))
app.use(express.json())
app.use(cors())
app.use(express.static('build'))


let persons = [
    {
      "id": 1,
      "name": "Julio Rodriguez",
      "phone": "555-219-4200"
    },
    {
      "id": 2,
      "name": "Jesse Winker",
      "phone": "360-867-5309"
    },
    {
      "id": 3,
      "name": "Ty France",
      "phone": "1-800-TYF-RANC"
    },
    {
      "id": 4,
      "name": "Cal Raleigh",
      "phone": "1-800-BIG-Dump"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Helloo world!</h1>')
})

app.get ('/api/persons', (request, response) => {
  response.json(persons)
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
  // generate a random id
  // create a person object
  const person = {
    id: generateRandomId(),
    name: body.name,
    phone: body.phone
  }

  if (!body.name) {
    return response.status(400).json({
      'error': 'missing name'
    })
  } else if (!body.phone) {
    return response.status(400).json({
      'error': 'missing phone number'
    })
  }

  if (persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())) {
    return response.status(409).json({ 
      'error': `Name ${body.name} already exists`
    })
  } else if (persons.find(p => Number(p.id) === person.id)) {
    return response.status(409).json({
      'error': `duplicate id generated`
    })
  }

  persons = persons.concat(person)
  //res.send(`${person}`)
  response.status(200).json(person)
  // add the person to the array

  // fail if the name is duplicate or id is duplicate

})

app.delete ('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.get ('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);