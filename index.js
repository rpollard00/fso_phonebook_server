const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const Person = require("./models/person");
const cors = require("cors");
const app = express();

morgan.token("person", (req, res) => JSON.stringify(req.body));

app.use(
  morgan(":method :url :status :res[content-length] :response-time ms :person")
);
app.use(express.json());
app.use(cors());
app.use(express.static("build"));

app.get("/", (request, response) => {
  response.send("<h1>Helloo world!</h1>");
});

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// const generateRandomId = () => {
//   return Math.floor(Math.random() * 1000000)
// }

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  Person.find({ name: body.name })
    .then((result) => {
      if (result.length !== 0) {
        return response.status(409).json({ error: "duplicate person" });
      } else {
        // console.log("Should exit the loop yea?")
        const person = new Person({
          name: body.name,
          phone: body.phone,
        });

        person
          .save()
          .then((savedPerson) => {
            response.json(savedPerson);
          })
          .catch((error) => next(error));
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  // create object
  const person = {
    name: body.name,
    phone: body.phone,
  };

  // findByIdAndUpdate
  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    `);
    })
    .catch((error) => next(error));
});

// last middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformed id" });
  } else if (error.name === "ValidationError") {
    console.log("Why ya crashin here?");
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
