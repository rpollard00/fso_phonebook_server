const express = require('express')
const app = express()

app.use(express.json())

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

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);