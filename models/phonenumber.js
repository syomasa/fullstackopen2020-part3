const mongoose =  require("mongoose")
const url = process.env.MONGODB_URI

console.log(`Connecting to ${url}`)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
	.then(result => {
		console.log("Connected to MongoDB")
	})
	.catch(error => {
		console.log("Error connecting to MongoDB:", error.message)
	})

const numberSchema = new mongoose.Schema({
	name: String,
	number: String
})

numberSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		// returnedObject._id = returnedObject._id.toString()
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model("Person", numberSchema)
