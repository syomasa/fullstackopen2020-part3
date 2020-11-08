const mongoose =  require("mongoose")
const validator = require("mongoose-unique-validator")
const url = process.env.MONGODB_URI

console.log(`Connecting to ${url}`)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
	// eslint-disable-next-line no-unused-vars
	.then(result => {
		console.log("Connected to MongoDB")
	})
	.catch(error => {
		console.log("Error connecting to MongoDB:", error.message)
	})

const numberSchema = new mongoose.Schema({
	name: { type: String, required: true, minlength: 3, unique: true },
	number: { type: String, required: true, minlength: 8 }
})

numberSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		// returnedObject._id = returnedObject._id.toString()
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})
numberSchema.plugin(validator)
module.exports = mongoose.model("Person", numberSchema)
