const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log("Connecting to", url);

mongoose
  .connect(url)
  .then((result) => console.log("connected to MongoDB"))
  .catch((error) =>
    console.log("error connecting to MongoDB, msg:", error.message)
  );

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  phone: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: (v) => {
        return /\d?-\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: (props) =>
        `${props.validate} is not a valid phone number. Format is XXX-XXX-XXXX or X-XXX-XXX-XXXX`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
