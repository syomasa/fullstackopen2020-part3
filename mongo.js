const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()

const url = process.env.MONGODB_URI

console.log(`Connecting to ${url}`)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
	.then(result => {
		console.log("Connected to database")
	})
	.catch((error) => {
		console.log("Failed to connect database,", error.message)
	})


const numberSchema = new mongoose.Schema({
	name: String,
	number: String
})

numberSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Person = mongoose.model("Person", numberSchema)

const person = new Person({
	name: process.argv[3],
	number: process.argv[4]
})

function savePerson() {
	person.save().then(response => {
	console.log(`${person.name} ${person.number} saved`)
	mongoose.connection.close()
	})
}

function findPeople() {
	Person.find({}).then(response  => {
		response.forEach(person => {
			console.log(person.name, person.number)
		})
		mongoose.connection.close()
	})
}

if(!process.argv[3] || !process.argv[4]) {
	findPeople()
} else {
	savePerson()
}
